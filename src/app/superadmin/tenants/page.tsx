"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { PlayCircle, ShieldBan, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TenantsPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: orgs, isLoading } = api.superadmin.getOrganizations.useQuery();

  const toggleStatus = api.superadmin.toggleOrganizationStatus.useMutation({
    onSuccess: () => {
      toast.success("Organization status updated");
      utils.superadmin.getOrganizations.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteOrg = api.superadmin.deleteOrganization.useMutation({
    onSuccess: () => {
      toast.success("Organization deleted forever");
      utils.superadmin.getOrganizations.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const impersonate = api.superadmin.impersonateOrganization.useMutation({
    onSuccess: (res) => {
      toast.success(`Impersonating ${res.orgName}`);
      router.push("/dashboard");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <p className="text-muted-foreground mt-1">Manage, impersonate, and suspend platform organizations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Loading organizations...</TableCell>
                </TableRow>
              ) : orgs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">No organizations found.</TableCell>
                </TableRow>
              ) : (
                orgs?.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.slug}</TableCell>
                    <TableCell>
                      <Badge variant={org.isActive ? "success" : "destructive"}>
                        {org.isActive ? "Active" : "Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => impersonate.mutate({ orgId: org.id })}
                        disabled={impersonate.isPending}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" /> Impersonate
                      </Button>
                      <Button 
                        variant={org.isActive ? "secondary" : "default"} 
                        size="sm"
                        onClick={() => toggleStatus.mutate({ orgId: org.id, isActive: !org.isActive })}
                        disabled={toggleStatus.isPending}
                      >
                        <ShieldBan className="h-4 w-4 mr-1" /> {org.isActive ? "Suspend" : "Activate"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you absolutely sure you want to delete ${org.name}? This cannot be undone.`)) {
                            deleteOrg.mutate({ orgId: org.id });
                          }
                        }}
                        disabled={deleteOrg.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
