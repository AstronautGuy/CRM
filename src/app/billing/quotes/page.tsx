"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus, MoreHorizontal, Copy, FileText, Trash2, Edit, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
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

export default function QuotesListPage() {
  const router = useRouter();
  const { data: quotes, isLoading, refetch } = api.billing.getQuotes.useQuery();

  const deleteMutation = api.billing.deleteQuote.useMutation({
    onSuccess: () => {
      toast.success("Quote deleted.");
      refetch();
    },
    onError: (err) => {
      toast.error(`Error deleting quote: ${err.message}`);
    },
  });

  const reviseMutation = api.billing.reviseQuote.useMutation({
    onSuccess: (data) => {
      toast.success("Quote revised successfully.");
      refetch();
      // Optionally route to edit it immediately
      // router.push(`/billing/quotes/${data.id}`);
    },
    onError: (err) => {
      toast.error(`Error revising quote: ${err.message}`);
    },
  });

  const convertMutation = api.billing.convertToInvoice.useMutation({
    onSuccess: (data) => {
      toast.success("Converted to Invoice successfully.");
      router.push(`/billing/invoices`);
    },
    onError: (err) => {
      toast.error(`Error converting quote: ${err.message}`);
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading quotes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quotes</h2>
          <p className="text-muted-foreground">
            Manage your sales quotes and proposals.
          </p>
        </div>
        <Button asChild>
          <Link href="/billing/quotes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Quote
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>All Quotes</CardTitle>
          <CardDescription>A list of all quotes across your tenant.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No quotes found.
                  </TableCell>
                </TableRow>
              )}
              {quotes?.map((quote) => {
                const formattedNumber = quote.version > 1 
                  ? `${quote.quoteNumber}-v${quote.version}` 
                  : quote.quoteNumber;

                return (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{formattedNumber}</TableCell>
                    <TableCell>{quote.company?.name || "No Client"}</TableCell>
                    <TableCell>{quote.title || "-"}</TableCell>
                    <TableCell>{format(new Date(quote.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format((quote.totalAmount || 0) / 100)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={quote.status === "DRAFT" ? "outline" : "default"}>
                        {quote.status}
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
                          {quote.status === "DRAFT" && (
                            <DropdownMenuItem onClick={() => toast.info("Edit not fully implemented yet in UI")}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          )}
                          {quote.status !== "DRAFT" && (
                            <DropdownMenuItem 
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/public/quote/${quote.id}`);
                                toast.success("Public link copied to clipboard");
                              }}
                            >
                              <LinkIcon className="mr-2 h-4 w-4" /> Copy Public Link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => reviseMutation.mutate({ id: quote.id })}
                            disabled={reviseMutation.isPending}
                          >
                            <Copy className="mr-2 h-4 w-4" /> Revise (Clone)
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => convertMutation.mutate({ quoteId: quote.id })}
                            disabled={convertMutation.isPending}
                          >
                            <FileText className="mr-2 h-4 w-4" /> Convert to Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteMutation.mutate({ id: quote.id })}
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
        </CardContent>
      </Card>
    </div>
  );
}
