"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Printer, Download } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { useReactToPrint } from "react-to-print";

export default function PublicStatementPage() {
  const params = useParams();
  const statementId = params.id as string;
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: stmt, isLoading, error } = api.public.getPublicStatement.useQuery({ id: statementId }, {
    retry: false,
  });

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: stmt ? `Statement_${stmt.statementNumber}` : "Statement",
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500">Loading Statement...</div>;
  }

  if (error || !stmt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Statement Not Found</h2>
          <p className="text-slate-500">
            The statement you are looking for does not exist or you do not have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  const currency = stmt.organization?.currency || "USD";
  const formatCurrency = (cents: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

  return (
    <div className="min-h-screen pb-24 bg-slate-100 flex flex-col items-center">
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="sticky top-4 z-10 print:hidden mb-8 w-full max-w-4xl px-4 flex justify-end gap-2">
        <Button onClick={() => handlePrint()} className="shadow-lg">
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
      </div>

      {/* A4 Canvas */}
      <div 
        ref={contentRef}
        className="bg-white w-full max-w-[800px] min-h-[1056px] shadow-sm sm:rounded-md p-10 sm:p-16 relative text-slate-800 print:shadow-none print:p-0"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div>
            {/* Organization Info */}
            <h1 className="text-2xl font-bold text-slate-900">{stmt.organization?.name || "Company"}</h1>
            <p className="text-slate-500 mt-1 whitespace-pre-wrap">{stmt.organization?.address}</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-slate-200 uppercase tracking-widest mb-4">Statement</h2>
            <p className="text-sm font-semibold text-slate-900">{stmt.statementNumber}</p>
            <p className="text-sm text-slate-500 mt-1">
              {format(new Date(stmt.startDate), "MMM d, yyyy")} - {format(new Date(stmt.endDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-2">Statement For</h3>
          <p className="font-bold text-slate-900">{stmt.company?.name}</p>
        </div>

        {/* Account Summary */}
        <div className="bg-slate-50 rounded-lg p-6 mb-12 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500 mb-1">Opening Balance</p>
            <p className="font-semibold text-lg">{formatCurrency(stmt.openingBalance)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-1">Invoiced</p>
            <p className="font-semibold text-lg">
              {formatCurrency(
                (stmt.transactions as any[]).reduce((sum, t) => t.type === "INVOICE" ? sum + t.amount : sum, 0)
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-1">Paid</p>
            <p className="font-semibold text-lg">
              {formatCurrency(
                (stmt.transactions as any[]).reduce((sum, t) => t.type === "PAYMENT" ? sum + Math.abs(t.amount) : sum, 0)
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-700 mb-1">Closing Balance</p>
            <p className="font-bold text-2xl text-slate-900">{formatCurrency(stmt.closingBalance)}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left font-semibold text-slate-600 py-3">Date</th>
                <th className="text-left font-semibold text-slate-600 py-3">Description</th>
                <th className="text-right font-semibold text-slate-600 py-3">Amount</th>
                <th className="text-right font-semibold text-slate-600 py-3">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b border-slate-200 text-slate-700">
              <tr className="bg-slate-50/50">
                <td className="py-3 font-medium text-slate-500">{format(new Date(stmt.startDate), "MMM d, yyyy")}</td>
                <td className="py-3 font-medium text-slate-500">Opening Balance</td>
                <td className="py-3"></td>
                <td className="py-3 text-right font-semibold">{formatCurrency(stmt.openingBalance)}</td>
              </tr>
              
              {(stmt.transactions as any[]).map((tx, idx) => (
                <tr key={`${tx.id}-${idx}`}>
                  <td className="py-3">{format(new Date(tx.date), "MMM d, yyyy")}</td>
                  <td className="py-3">
                    <span className="font-medium">{tx.description}</span>
                    {tx.reference && <span className="text-slate-400 text-xs ml-2">({tx.reference})</span>}
                  </td>
                  <td className={`py-3 text-right ${tx.type === "PAYMENT" ? "text-green-600" : ""}`}>
                    {tx.type === "PAYMENT" ? "-" : ""}{formatCurrency(Math.abs(tx.amount))}
                  </td>
                  <td className="py-3 text-right font-medium">{formatCurrency(tx.balance)}</td>
                </tr>
              ))}
              
              <tr className="bg-slate-50/50 border-t-2 border-slate-200">
                <td className="py-3 font-medium text-slate-900">{format(new Date(stmt.endDate), "MMM d, yyyy")}</td>
                <td className="py-3 font-medium text-slate-900">Closing Balance</td>
                <td className="py-3"></td>
                <td className="py-3 text-right font-bold text-slate-900">{formatCurrency(stmt.closingBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
