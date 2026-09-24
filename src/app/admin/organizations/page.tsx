"use client";

import { api } from "~/trpc/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function OrganizationsPage() {
  const router = useRouter();
  const { data: orgs, isLoading } = api.superadmin.getOrganizations.useQuery();

  if (isLoading) return <div className="text-zinc-400">Loading organizations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Organizations</h2>
          <p className="text-zinc-400 text-sm">Manage all tenant workspaces in the system.</p>
        </div>
      </div>

      <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Slug</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgs?.map((org) => (
              <TableRow key={org.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-medium text-zinc-100">{org.name}</TableCell>
                <TableCell className="text-zinc-400">{org.slug}</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-0">Active</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    disabled
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {orgs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-zinc-500 py-6">
                  No organizations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
