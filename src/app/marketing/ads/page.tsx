"use client";

import React, { useState } from "react";
import { Plus, BarChart2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useSession } from "next-auth/react";

export default function AdsPage() {
  const { data: session } = useSession();
  const orgId = session?.user?.organizationId as string;
  
  const { data: campaigns, isLoading, refetch } = api.marketing.getCampaigns.useQuery({ organizationId: orgId }, {
    enabled: !!orgId
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("GOOGLE_ADS");
  const [spend, setSpend] = useState("0");

  const createMutation = api.marketing.createCampaign.useMutation({
    onSuccess: () => {
      toast.success("Campaign created.");
      setDialogOpen(false);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      organizationId: orgId,
      name,
      platform,
      spend: parseFloat(spend) * 100, // convert to cents
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ad Campaigns & ROAS</h2>
          <p className="text-muted-foreground mt-1">Track conversions and generated leads from your ads.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Connect Campaign</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Ad Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q3 Search Retargeting" />
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOOGLE_ADS">Google Ads</SelectItem>
                    <SelectItem value="FACEBOOK_ADS">Facebook Ads</SelectItem>
                    <SelectItem value="LINKEDIN_ADS">LinkedIn Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Initial Spend ($)</Label>
                <Input type="number" step="0.01" min="0" required value={spend} onChange={e => setSpend(e.target.value)} />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Connecting..." : "Connect"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Ad Campaigns</CardTitle>
          <CardDescription>
            All ad campaigns linked via Webhook integration. Webhook URL: <code>/api/webhooks/ads</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>Leads Generated</TableHead>
                <TableHead>Cost per Lead (CPL)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
              ) : campaigns?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No campaigns connected.</TableCell></TableRow>
              ) : (
                campaigns?.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="outline">{c.platform}</Badge></TableCell>
                    <TableCell>${(c.spend / 100).toFixed(2)}</TableCell>
                    <TableCell>{c.conversions}</TableCell>
                    <TableCell className="font-semibold text-emerald-600">${c.cpl}</TableCell>
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
