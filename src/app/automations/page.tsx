"use client";

import React, { useState } from "react";
import { Plus, Play, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";

export default function AutomationsPage() {
  const { data: rules, isLoading, refetch } = api.automations.getRules.useQuery();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [triggerType, setTriggerType] = useState<"INVOICE_DUE" | "SUBSCRIPTION_RENEWAL" | "DEAL_STALLED">("INVOICE_DUE");
  const [daysOffset, setDaysOffset] = useState<number>(0);
  const [actionType, setActionType] = useState<"CREATE_NOTIFICATION" | "CREATE_TASK">("CREATE_NOTIFICATION");

  const createMutation = api.automations.createRule.useMutation({
    onSuccess: () => {
      toast.success("Rule created successfully.");
      setDialogOpen(false);
      refetch();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const deleteMutation = api.automations.deleteRule.useMutation({
    onSuccess: () => {
      toast.success("Rule deleted successfully.");
      refetch();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const runEngineMutation = api.automations.runAutomations.useMutation({
    onSuccess: (data) => {
      toast.success(`Engine ran successfully. Triggered ${data.triggeredCount} actions.`);
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const handleOpenDialog = () => {
    setName("");
    setTriggerType("INVOICE_DUE");
    setDaysOffset(0);
    setActionType("CREATE_NOTIFICATION");
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Rule name is required.");
    createMutation.mutate({
      name,
      triggerType,
      daysOffset: Number(daysOffset),
      actionType,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      deleteMutation.mutate({ id });
    }
  };

  const formatTrigger = (type: string) => {
    switch (type) {
      case "INVOICE_DUE": return "Invoice Due Date";
      case "SUBSCRIPTION_RENEWAL": return "Subscription Renewal";
      case "DEAL_STALLED": return "Deal Stalled";
      default: return type;
    }
  };

  const formatOffset = (offset: number) => {
    if (offset < 0) return `${Math.abs(offset)} days before`;
    if (offset > 0) return `${offset} days after`;
    return "On the exact day";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground mt-1">
            Build custom rules to automate reminders, task generation, and alerts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => runEngineMutation.mutate()} disabled={runEngineMutation.isPending}>
            <Zap className="mr-2 h-4 w-4 text-yellow-500" /> 
            {runEngineMutation.isPending ? "Running..." : "Run Engine Now"}
          </Button>
          <Button onClick={handleOpenDialog}>
            <Plus className="mr-2 h-4 w-4" /> New Rule
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Rules</CardTitle>
          <CardDescription>
            These rules are continuously evaluated to generate reminders and notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Timing</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                </TableRow>
              ) : rules?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No automation rules defined yet.
                  </TableCell>
                </TableRow>
              ) : (
                rules?.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatTrigger(rule.triggerType)}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {formatOffset(rule.daysOffset)}
                    </TableCell>
                    <TableCell>
                      {rule.actionType === "CREATE_NOTIFICATION" ? "Send Notification" : "Create Task"}
                    </TableCell>
                    <TableCell>
                      {rule.isActive ? <Badge className="bg-emerald-500">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(rule.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Automation Rule</DialogTitle>
            <DialogDescription>
              Define the logic for this rule. For example: "If Invoice Due Date is 3 days before, Send Notification".
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rule Name</Label>
              <Input placeholder="e.g. Overdue Invoice Alert" required value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>When (Trigger Event)</Label>
              <Select value={triggerType} onValueChange={(val: any) => setTriggerType(val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INVOICE_DUE">Invoice Due Date</SelectItem>
                  <SelectItem value="SUBSCRIPTION_RENEWAL">Subscription Renewal Date</SelectItem>
                  <SelectItem value="DEAL_STALLED">Deal Stalled (No Activity)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timing Offset (Days)</Label>
              <Input type="number" required value={daysOffset} onChange={e => setDaysOffset(Number(e.target.value))} />
              <p className="text-xs text-muted-foreground">
                Use a negative number for days BEFORE the event (e.g. -7). Use a positive number for days AFTER the event (e.g. 3).
              </p>
            </div>

            <div className="space-y-2">
              <Label>Then Do (Action)</Label>
              <Select value={actionType} onValueChange={(val: any) => setActionType(val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREATE_NOTIFICATION">Send In-App Notification</SelectItem>
                  <SelectItem value="CREATE_TASK" disabled>Create Task (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                Save Rule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
