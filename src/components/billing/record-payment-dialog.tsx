"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface RecordPaymentDialogProps {
  invoiceId: string;
  invoiceNumber: string;
  balanceDue: number; // in cents
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RecordPaymentDialog({
  invoiceId,
  invoiceNumber,
  balanceDue,
  currency,
  open,
  onOpenChange,
  onSuccess,
}: RecordPaymentDialogProps) {
  const [amount, setAmount] = useState<string>((balanceDue / 100).toString());
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]!);
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");

  const recordMutation = api.billing.recordPayment.useMutation({
    onSuccess: () => {
      toast.success("Payment recorded successfully.");
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setAmount((balanceDue / 100).toString());
      setPaymentMethod("BANK_TRANSFER");
      setReferenceNumber("");
      setNotes("");
    },
    onError: (err) => {
      toast.error(`Failed to record payment: ${err.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      return toast.error("Please enter a valid amount.");
    }
    if (amountInCents > balanceDue) {
      return toast.error("Amount cannot exceed the balance due.");
    }

    recordMutation.mutate({
      invoiceId,
      amount: amountInCents,
      paymentDate: new Date(paymentDate),
      paymentMethod,
      referenceNumber: referenceNumber || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment for {invoiceNumber}</DialogTitle>
          <DialogDescription>
            Enter the details of the received payment. The remaining balance is{" "}
            <strong>
              {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(balanceDue / 100)}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount Received</Label>
              <Input 
                type="number" 
                step="0.01"
                min="0.01"
                max={balanceDue / 100}
                required
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Date</Label>
              <Input 
                type="date"
                required
                value={paymentDate} 
                onChange={(e) => setPaymentDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                  <SelectItem value="CHECK">Check</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reference Number (Optional)</Label>
              <Input 
                placeholder="e.g. TXN-123456"
                value={referenceNumber} 
                onChange={(e) => setReferenceNumber(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Internal Notes (Optional)</Label>
            <Textarea 
              placeholder="Any additional details about this payment..."
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={recordMutation.isPending}>
              {recordMutation.isPending ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
