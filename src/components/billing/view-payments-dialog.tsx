"use client";

import React from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";

interface ViewPaymentsDialogProps {
  invoiceId: string;
  invoiceNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ViewPaymentsDialog({
  invoiceId,
  invoiceNumber,
  open,
  onOpenChange,
  onSuccess,
}: ViewPaymentsDialogProps) {
  const { data: payments, isLoading, refetch } = api.billing.getPaymentsByInvoice.useQuery(
    { invoiceId },
    { enabled: open }
  );

  const voidMutation = api.billing.voidPayment.useMutation({
    onSuccess: () => {
      toast.success("Payment voided successfully.");
      refetch();
      onSuccess(); // To refresh the invoice table balance
    },
    onError: (err) => {
      toast.error(`Failed to void payment: ${err.message}`);
    },
  });

  const handleVoid = (paymentId: string) => {
    if (confirm("Are you sure you want to void this payment? This will restore the invoice balance.")) {
      voidMutation.mutate({ paymentId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment History: {invoiceNumber}</DialogTitle>
          <DialogDescription>View all payments recorded against this invoice.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading payments...</div>
        ) : payments && payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{format(new Date(p.paymentDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.paymentMethod.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>{p.referenceNumber || "-"}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.amount / 100)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive h-8 px-2"
                      onClick={() => handleVoid(p.id)}
                      disabled={voidMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Void
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-muted-foreground border rounded-md">
            No payments have been recorded for this invoice.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
