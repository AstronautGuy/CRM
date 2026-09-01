"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Copy, Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { GenerateStatementDialog } from "~/components/billing/generate-statement-dialog";
import { Button } from "~/components/ui/button";
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

export default function StatementsListPage() {
  const { data: statements, isLoading, refetch } = api.billing.getStatements.useQuery();
  const [dialogOpen, setDialogOpen] = useState(false);

  const copyPublicLink = (id: string) => {
    const url = `${window.location.origin}/public/statement/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Statements</h1>
          <p className="text-muted-foreground mt-1">
            Generate and manage ledger statements for your clients.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Generate Statement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Statements</CardTitle>
          <CardDescription>
            A list of all historically generated client statements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statement #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Closing Balance</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                </TableRow>
              ) : statements?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No statements generated yet.
                  </TableCell>
                </TableRow>
              ) : (
                statements?.map((stmt) => (
                  <TableRow key={stmt.id}>
                    <TableCell className="font-medium">{stmt.statementNumber}</TableCell>
                    <TableCell>{stmt.company?.name || "Unknown"}</TableCell>
                    <TableCell>
                      {format(new Date(stmt.startDate), "MMM d")} - {format(new Date(stmt.endDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format((stmt.closingBalance || 0) / 100)}
                    </TableCell>
                    <TableCell>{format(new Date(stmt.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => copyPublicLink(stmt.id)}>
                        <Copy className="h-4 w-4 mr-2" /> Link
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <GenerateStatementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
