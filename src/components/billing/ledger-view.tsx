"use client";

import React, { useState } from "react";
import { format, subMonths, startOfYear, startOfMonth } from "date-fns";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { toast } from "sonner";
import { Copy, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";

export function LedgerView({ companyId }: { companyId: string }) {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: ledger, isLoading, refetch } = api.billing.getLedger.useQuery({
    companyId,
    startDate,
    endDate,
  });

  const { data: statements, refetch: refetchStatements } = api.billing.getStatementsByCompany.useQuery({
    companyId,
  });

  const generateMutation = api.billing.generateStatement.useMutation({
    onSuccess: (data) => {
      toast.success("Statement generated successfully.");
      refetchStatements();
    },
    onError: (err) => {
      toast.error(`Error generating statement: ${err.message}`);
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({ companyId, startDate, endDate });
  };

  return (
    <div className="space-y-8">
      {/* Date Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Ledger</CardTitle>
          <CardDescription>View transactions and running balance for a specific period.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">From:</span>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={format(startDate, "yyyy-MM-dd")}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">To:</span>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={format(endDate, "yyyy-MM-dd")}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => setStartDate(startOfMonth(new Date()))}>This Month</Button>
              <Button variant="outline" size="sm" onClick={() => setStartDate(startOfYear(new Date()))}>YTD</Button>
              <Button 
                onClick={handleGenerate} 
                disabled={generateMutation.isPending || isLoading}
              >
                {generateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Statement Snapshot
              </Button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit (+)</TableHead>
                  <TableHead className="text-right">Credit (-)</TableHead>
                  <TableHead className="text-right font-bold">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading ledger...</TableCell>
                  </TableRow>
                ) : ledger ? (
                  <>
                    <TableRow className="bg-slate-50/50">
                      <TableCell colSpan={4} className="font-medium text-slate-500">Opening Balance</TableCell>
                      <TableCell className="text-right font-bold text-slate-700">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(ledger.openingBalance / 100)}
                      </TableCell>
                    </TableRow>
                    {ledger.transactions.map((t: any) => (
                      <TableRow key={t.id}>
                        <TableCell>{format(new Date(t.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={t.isDebit ? "outline" : "secondary"} className="mr-2">
                            {t.type}
                          </Badge>
                          {t.description}
                        </TableCell>
                        <TableCell className="text-right">{t.isDebit ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(t.amount / 100) : "-"}</TableCell>
                        <TableCell className="text-right">{!t.isDebit ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(t.amount / 100) : "-"}</TableCell>
                        <TableCell className="text-right font-medium">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(t.balance / 100)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {ledger.transactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No transactions in this period.</TableCell>
                      </TableRow>
                    )}
                    <TableRow className="bg-slate-100">
                      <TableCell colSpan={4} className="font-bold">Closing Balance</TableCell>
                      <TableCell className="text-right font-bold">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(ledger.closingBalance / 100)}
                      </TableCell>
                    </TableRow>
                  </>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Generated Statements */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Statements</CardTitle>
          <CardDescription>Frozen statement snapshots ready to be sent to the client.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statement #</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead className="text-right">Closing Balance</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statements && statements.length > 0 ? (
                statements.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.statementNumber}</TableCell>
                    <TableCell>
                      {format(new Date(s.startDate), "MMM d, yy")} - {format(new Date(s.endDate), "MMM d, yy")}
                    </TableCell>
                    <TableCell>{format(new Date(s.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right font-bold">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(s.closingBalance / 100)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/public/statement/${s.id}`);
                          toast.success("Public statement link copied!");
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Link
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => window.open(`/public/statement/${s.id}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No statements generated yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
