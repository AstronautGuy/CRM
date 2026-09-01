"use client";

import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Plus, Edit, Trash2, Repeat, CalendarIcon, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
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

export default function ClientSubscriptionsPage() {
  const { data: subscriptions, isLoading, refetch } = api.clientSubscriptions.getSubscriptions.useQuery();
  const { data: clients } = api.crm.getCompanies.useQuery();
  const { data: products } = api.inventory.getProducts.useQuery();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [companyId, setCompanyId] = useState("");
  const [productId, setProductId] = useState("");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]!);
  const [status, setStatus] = useState<"ACTIVE" | "CANCELLED" | "EXPIRED">("ACTIVE");

  const createMutation = api.clientSubscriptions.createSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription created successfully.");
      setDialogOpen(false);
      refetch();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const updateMutation = api.clientSubscriptions.updateSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription updated successfully.");
      setDialogOpen(false);
      refetch();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const deleteMutation = api.clientSubscriptions.deleteSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription deleted successfully.");
      refetch();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setCompanyId(item.companyId);
      setProductId(item.productId);
      setBillingCycle(item.billingCycle);
      setPrice((item.price / 100).toString());
      setStartDate(new Date(item.startDate).toISOString().split("T")[0]!);
      setStatus(item.status);
    } else {
      setEditingItem(null);
      setCompanyId("");
      setProductId("");
      setBillingCycle("MONTHLY");
      setPrice("");
      setStartDate(new Date().toISOString().split("T")[0]!);
      setStatus("ACTIVE");
    }
    setDialogOpen(true);
  };

  const handleProductChange = (val: string) => {
    setProductId(val);
    if (!editingItem) {
      const prod = products?.find(p => p.id === val);
      if (prod) {
        setPrice((prod.unitPrice / 100).toString());
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceCents = Math.round(parseFloat(price) * 100);
    const start = new Date(startDate);

    if (editingItem) {
      // For updates, we usually only update status, price, or nextRenewalDate (but we'll keep it simple here and just update status/price for now)
      updateMutation.mutate({
        id: editingItem.id,
        status,
        price: priceCents,
        nextRenewalDate: new Date(editingItem.nextRenewalDate), // preserving existing logic for simplicity in this demo
      });
    } else {
      if (!companyId || !productId) return toast.error("Client and Product are required.");
      createMutation.mutate({
        companyId,
        productId,
        billingCycle,
        price: priceCents,
        startDate: start,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      deleteMutation.mutate({ id });
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-emerald-500">Active</Badge>;
      case "CANCELLED": return <Badge variant="secondary">Cancelled</Badge>;
      case "EXPIRED": return <Badge variant="destructive">Expired</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRenewalWarning = (date: Date, isActive: boolean) => {
    if (!isActive) return null;
    const days = differenceInDays(date, new Date());
    if (days < 0) {
      return (
        <div className="flex items-center text-destructive text-xs mt-1 font-medium">
          <AlertTriangle className="h-3 w-3 mr-1" /> Overdue by {Math.abs(days)} days
        </div>
      );
    }
    if (days <= 7) {
      return (
        <div className="flex items-center text-amber-500 text-xs mt-1 font-medium">
          <CalendarIcon className="h-3 w-3 mr-1" /> Renews in {days} days
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Subscriptions</h1>
          <p className="text-muted-foreground mt-1">
            Track recurring services and upcoming renewals for your clients.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> New Subscription
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active & Upcoming Renewals</CardTitle>
          <CardDescription>
            A list of all client subscriptions linked to your catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service / Product</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Renewal</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">Loading...</TableCell>
                </TableRow>
              ) : subscriptions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No client subscriptions tracked yet.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions?.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.company?.name}</TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-800">{sub.product?.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs text-slate-500">
                        {sub.billingCycle}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(sub.price / 100)}
                    </TableCell>
                    <TableCell>{renderStatusBadge(sub.status)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{format(new Date(sub.nextRenewalDate), "MMM d, yyyy")}</div>
                      {getRenewalWarning(new Date(sub.nextRenewalDate), sub.status === "ACTIVE")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(sub)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(sub.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <DialogTitle>{editingItem ? "Edit Subscription" : "New Subscription"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the status or price of this subscription." : "Track a new recurring service for a client."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {!editingItem && (
              <>
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={companyId} onValueChange={setCompanyId}>
                    <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                    <SelectContent>
                      {clients?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Service / Product (from Catalog)</Label>
                  <Select value={productId} onValueChange={handleProductChange}>
                    <SelectTrigger><SelectValue placeholder="Select a catalog item" /></SelectTrigger>
                    <SelectContent>
                      {products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Billing Cycle</Label>
                    <Select value={billingCycle} onValueChange={(val: any) => setBillingCycle(val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {editingItem && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Agreed Price ($)</Label>
              <Input type="number" step="0.01" min="0" required value={price} onChange={e => setPrice(e.target.value)} />
              <p className="text-xs text-muted-foreground">This can be different from the catalog default.</p>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? "Save Changes" : "Create Subscription"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
