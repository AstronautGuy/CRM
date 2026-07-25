"use client";

import React, { useState } from "react";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { FileText, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const { data: invoices, isLoading: isLoadingInvoices, refetch: refetchInvoices } = api.billing.getInvoices.useQuery();
  const { data: quotes, isLoading: isLoadingQuotes, refetch: refetchQuotes } = api.billing.getQuotes.useQuery();
  
  const createInvoice = api.billing.createInvoice.useMutation({
    onSuccess: () => {
      refetchInvoices();
      setInvoiceModalOpen(false);
    }
  });

  const createQuote = api.billing.createQuote.useMutation({
    onSuccess: () => {
      refetchQuotes();
      setQuoteModalOpen(false);
    }
  });

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    subtotal: "",
    taxAmount: "",
    totalAmount: "",
    dueDate: "",
  });

  const [quoteForm, setQuoteForm] = useState({
    title: "",
    totalAmount: "",
  });

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInvoice.mutate({
      invoiceNumber: invoiceForm.invoiceNumber,
      subtotal: parseFloat(invoiceForm.subtotal),
      taxAmount: parseFloat(invoiceForm.taxAmount),
      totalAmount: parseFloat(invoiceForm.totalAmount),
      dueDate: new Date(invoiceForm.dueDate),
    });
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createQuote.mutate({
      title: quoteForm.title,
      totalAmount: parseFloat(quoteForm.totalAmount),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Quotes & Invoices</h2>
            <p className="text-slate-400 text-sm">Create client quotes, send invoices, and track billing payment statuses.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/products">
              <Button variant="outline">Product Catalog</Button>
            </Link>

            <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">Create Quote</Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Quote</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quote Title</Label>
                    <Input id="title" required value={quoteForm.title} onChange={e => setQuoteForm({...quoteForm, title: e.target.value})} className="bg-slate-950 border-slate-800" placeholder="e.g. Website Redesign" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="q_total">Estimated Total Amount ($)</Label>
                    <Input id="q_total" type="number" step="0.01" required value={quoteForm.totalAmount} onChange={e => setQuoteForm({...quoteForm, totalAmount: e.target.value})} className="bg-slate-950 border-slate-800" />
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={createQuote.isPending}>
                    {createQuote.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Quote
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
              <DialogTrigger asChild>
                <Button>Create Invoice</Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleInvoiceSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="invNum">Invoice Number</Label>
                    <Input id="invNum" required value={invoiceForm.invoiceNumber} onChange={e => setInvoiceForm({...invoiceForm, invoiceNumber: e.target.value})} className="bg-slate-950 border-slate-800" placeholder="INV-2026-001" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subtotal">Subtotal ($)</Label>
                      <Input id="subtotal" type="number" step="0.01" required value={invoiceForm.subtotal} onChange={e => setInvoiceForm({...invoiceForm, subtotal: e.target.value})} className="bg-slate-950 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax">Tax Amount ($)</Label>
                      <Input id="tax" type="number" step="0.01" required value={invoiceForm.taxAmount} onChange={e => setInvoiceForm({...invoiceForm, taxAmount: e.target.value})} className="bg-slate-950 border-slate-800" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total">Total Amount ($)</Label>
                      <Input id="total" type="number" step="0.01" required value={invoiceForm.totalAmount} onChange={e => setInvoiceForm({...invoiceForm, totalAmount: e.target.value})} className="bg-slate-950 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="due">Due Date</Label>
                      <Input id="due" type="date" required value={invoiceForm.dueDate} onChange={e => setInvoiceForm({...invoiceForm, dueDate: e.target.value})} className="bg-slate-950 border-slate-800" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={createInvoice.isPending}>
                    {createInvoice.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Invoice
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInvoices ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                </div>
              ) : invoices?.length === 0 ? (
                <div className="text-center p-6 bg-slate-950 rounded-lg border border-slate-800 border-dashed">
                  <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No invoices found. Create one above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices?.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <div className="font-mono text-sm text-white font-medium">{inv.invoiceNumber}</div>
                        <div className="text-xs text-slate-400">Due: {new Date(inv.dueDate).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">${inv.totalAmount}</div>
                        <Badge variant={inv.status === "PAID" ? "success" : inv.status === "OVERDUE" ? "destructive" : "secondary"} className="mt-1">
                          {inv.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingQuotes ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                </div>
              ) : quotes?.length === 0 ? (
                <div className="text-center p-6 bg-slate-950 rounded-lg border border-slate-800 border-dashed">
                  <CheckCircle2 className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No quotes found. Create one above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quotes?.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <div className="font-medium text-white">{quote.title}</div>
                        <div className="text-xs text-slate-400">Created: {new Date(quote.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">${quote.totalAmount}</div>
                        <Badge variant="outline" className="mt-1 bg-slate-800 text-slate-300 border-slate-700">
                          {quote.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
