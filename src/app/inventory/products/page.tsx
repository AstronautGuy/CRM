"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
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

export default function ProductsPage() {
  const { data: products, isLoading, refetch } = api.inventory.getProducts.useQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [type, setType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");

  const createMutation = api.inventory.createProduct.useMutation({
    onSuccess: () => {
      toast.success("Item created successfully.");
      setDialogOpen(false);
      refetch();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const updateMutation = api.inventory.updateProduct.useMutation({
    onSuccess: () => {
      toast.success("Item updated successfully.");
      setDialogOpen(false);
      refetch();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const deleteMutation = api.inventory.deleteProduct.useMutation({
    onSuccess: () => {
      toast.success("Item deleted successfully.");
      refetch();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setSku(item.sku || "");
      setType(item.type);
      setDescription(item.description || "");
      setUnitPrice((item.unitPrice / 100).toString());
      setUnit(item.unit || "");
      setStockQuantity(item.stockQuantity.toString());
    } else {
      setEditingItem(null);
      setName("");
      setSku("");
      setType("PRODUCT");
      setDescription("");
      setUnitPrice("");
      setUnit("pcs");
      setStockQuantity("0");
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceCents = Math.round(parseFloat(unitPrice) * 100);
    const stock = parseInt(stockQuantity, 10) || 0;

    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        name,
        sku: sku || undefined,
        type,
        description: description || undefined,
        unitPrice: priceCents,
        unit: unit || undefined,
        stockQuantity: type === "PRODUCT" ? stock : 0,
      });
    } else {
      createMutation.mutate({
        name,
        sku: sku || undefined,
        type,
        description: description || undefined,
        unitPrice: priceCents,
        unit: unit || undefined,
        stockQuantity: type === "PRODUCT" ? stock : 0,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage your catalog of billable items and track inventory.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> New Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
          <CardDescription>
            A list of all products and services available to be added to Quotes and Invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name / SKU</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                </TableRow>
              ) : products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No items in catalog yet. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant={item.type === "PRODUCT" ? "default" : "secondary"}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      {item.sku && <div className="text-xs text-slate-500 mt-1">SKU: {item.sku}</div>}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-slate-600">
                      {item.description || "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD", // TODO: use org currency
                      }).format(item.unitPrice / 100)}
                      {item.unit && <span className="text-xs text-slate-400 font-normal ml-1">/ {item.unit}</span>}
                    </TableCell>
                    <TableCell>
                      {item.type === "PRODUCT" ? (
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-slate-400" />
                          <span className={item.stockQuantity <= 0 ? "text-destructive font-medium" : "text-slate-700"}>
                            {item.stockQuantity} in stock
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
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
            <DialogTitle>{editingItem ? "Edit Item" : "New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the details for this item." : "Add a new product or service to your catalog."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(val: any) => setType(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT">Product</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Item Name <span className="text-destructive">*</span></Label>
                <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Website Design" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SKU (Optional)</Label>
                <Input value={sku} onChange={e => setSku(e.target.value)} placeholder="e.g. WD-001" />
              </div>
              <div className="space-y-2">
                <Label>Unit (Optional)</Label>
                <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. hr, pcs, setup" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Detailed description for the invoice..." 
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit Price ($) <span className="text-destructive">*</span></Label>
                <Input type="number" step="0.01" min="0" required value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
              </div>
              {type === "PRODUCT" && (
                <div className="space-y-2">
                  <Label>Stock Quantity <span className="text-destructive">*</span></Label>
                  <Input type="number" step="1" required value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} />
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? "Save Changes" : "Create Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
