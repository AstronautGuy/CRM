"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface GenerateStatementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function GenerateStatementDialog({
  open,
  onOpenChange,
  onSuccess,
}: GenerateStatementDialogProps) {
  const [companyId, setCompanyId] = useState("");
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]! // First day of current month
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]! // Today
  );

  const { data: clients } = api.crm.getCompanies.useQuery();

  const generateMutation = api.billing.generateStatement.useMutation({
    onSuccess: () => {
      toast.success("Statement generated successfully.");
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setCompanyId("");
    },
    onError: (err) => {
      toast.error(`Failed to generate statement: ${err.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return toast.error("Please select a client.");
    if (!startDate || !endDate) return toast.error("Please select a valid date range.");
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set end date to end of day to include all transactions on that day
    end.setHours(23, 59, 59, 999);

    if (start > end) return toast.error("Start date must be before end date.");

    generateMutation.mutate({
      companyId,
      startDate: start,
      endDate: end,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Account Statement</DialogTitle>
          <DialogDescription>
            Create an immutable ledger statement for a client over a specific date range.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                type="date"
                required
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input 
                type="date"
                required
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={generateMutation.isPending || !companyId}>
              {generateMutation.isPending ? "Generating..." : "Generate Statement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
