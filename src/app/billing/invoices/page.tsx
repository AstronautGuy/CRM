"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, MoreHorizontal, Copy, Trash2, Edit, Link as LinkIcon, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { RecordPaymentDialog } from "~/components/billing/record-payment-dialog";
import { ViewPaymentsDialog } from "~/components/billing/view-payments-dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

import { EmptyState } from "~/components/ui/empty-state";
import { InfoTooltip } from "~/components/ui/tooltip-info";

export default function InvoicesListPage() {
  const { data: invoices, isLoading, refetch } = api.billing.getInvoices.useQuery();
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [viewPaymentsDialogOpen, setViewPaymentsDialogOpen] = React.useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = React.useState<any>(null);

  const deleteMutation = api.billing.deleteInvoice.useMutation({
    onSuccess: () => {
      toast.success("Invoice deleted.");
      refetch();
    },
    onError: (err) => {
      toast.error(`Error deleting invoice: ${err.message}`);
    },
  });

  const reviseMutation = api.billing.reviseInvoice.useMutation({
    onSuccess: (data) => {
      toast.success("Invoice revised successfully.");
      refetch();
    },
    onError: (err) => {
      toast.error(`Error revising invoice: ${err.message}`);
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading invoices...</div>;
  }

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "DRAFT": return "outline";
      case "PROFORMA": return "secondary";
      case "SENT": return "default";
      case "PAID": return "default"; // ideally green
      case "OVERDUE": return "destructive";
      default: return "secondary";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">
            Manage your billing invoices and proformas.
          </p>
        </div>
        <Button asChild>
          <Link href="/billing/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>A list of all invoices across your tenant.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {invoices?.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices found"
              description="You haven't created any invoices yet. Click below to create your first invoice."
              action={
                <Button asChild>
                  <Link href="/billing/invoices/new">
                    <Plus className="mr-2 h-4 w-4" /> New Invoice
                  </Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>
                    Balance Due
                    <InfoTooltip content="The remaining amount unpaid on this invoice." />
                  </TableHead>
                  <TableHead>
                    Status
                    <InfoTooltip content="DRAFT: not sent. PROFORMA: estimated. SENT: awaiting payment. PAID: settled." />
                  </TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {invoices?.map((invoice) => {
                const formattedNumber = invoice.version > 1 
                  ? `${invoice.invoiceNumber}-v${invoice.version}` 
                  : invoice.invoiceNumber;

                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{formattedNumber}</TableCell>
                    <TableCell>{invoice.company?.name || "No Client"}</TableCell>
                    <TableCell>{format(new Date(invoice.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format((invoice.totalAmount || 0) / 100)}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format((invoice.balanceDue || 0) / 100)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {invoice.status === "DRAFT" && (
                            <DropdownMenuItem onClick={() => toast.info("Edit not fully implemented yet in UI")}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          )}
                          {invoice.status !== "DRAFT" && (
                            <DropdownMenuItem 
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/public/invoice/${invoice.id}`);
                                toast.success("Public link copied to clipboard");
                              }}
                            >
                              <LinkIcon className="mr-2 h-4 w-4" /> Copy Public Link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => reviseMutation.mutate({ id: invoice.id })}
                            disabled={reviseMutation.isPending}
                          >
                            <Copy className="mr-2 h-4 w-4" /> Revise (Clone)
                          </DropdownMenuItem>
                          {invoice.status !== "DRAFT" && invoice.status !== "PAID" && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedInvoiceForPayment(invoice);
                                setPaymentDialogOpen(true);
                              }}
                            >
                              <DollarSign className="mr-2 h-4 w-4" /> Record Payment
                            </DropdownMenuItem>
                          )}
                          {invoice.status !== "DRAFT" && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedInvoiceForPayment(invoice);
                                setViewPaymentsDialogOpen(true);
                              }}
                            >
                              <DollarSign className="mr-2 h-4 w-4" /> View Payments
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteMutation.mutate({ id: invoice.id })}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
      
      {selectedInvoiceForPayment && (
        <>
          <RecordPaymentDialog
            invoiceId={selectedInvoiceForPayment.id}
            invoiceNumber={selectedInvoiceForPayment.version > 1 ? `${selectedInvoiceForPayment.invoiceNumber}-v${selectedInvoiceForPayment.version}` : selectedInvoiceForPayment.invoiceNumber}
            balanceDue={selectedInvoiceForPayment.balanceDue}
            currency="USD"
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            onSuccess={() => refetch()}
          />
          <ViewPaymentsDialog
            invoiceId={selectedInvoiceForPayment.id}
            invoiceNumber={selectedInvoiceForPayment.version > 1 ? `${selectedInvoiceForPayment.invoiceNumber}-v${selectedInvoiceForPayment.version}` : selectedInvoiceForPayment.invoiceNumber}
            open={viewPaymentsDialogOpen}
            onOpenChange={setViewPaymentsDialogOpen}
            onSuccess={() => refetch()}
          />
        </>
      )}
    </div>
  );
}
