"use client";

import React, { useRef } from "react";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { Printer, Download } from "lucide-react";
import { Button } from "~/components/ui/button";

interface DocumentViewerProps {
  type: "quote" | "invoice";
  data: any;
}

export function DocumentViewer({ type, data }: DocumentViewerProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${type === "quote" ? "Quote" : "Invoice"}_${data.quoteNumber || data.invoiceNumber}`,
  });

  const numberStr = data.quoteNumber || data.invoiceNumber;
  const formattedNumber = data.version > 1 ? `${numberStr}-v${data.version}` : numberStr;
  
  const issueDate = data.date || data.createdAt;
  const dueDate = data.dueDate;

  const items = Array.isArray(data.lineItems) ? data.lineItems : [];
  
  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="flex justify-end gap-4 mb-6">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      <div 
        ref={printRef} 
        className="bg-white text-black p-12 shadow-sm border rounded-lg min-h-[1056px] print:shadow-none print:border-none print:m-0 print:p-0"
        style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
      >
        <div className="flex justify-between items-start mb-12">
          <div>
            {data.organization?.logoUrl ? (
              <img src={data.organization.logoUrl} alt="Logo" className="h-16 object-contain" />
            ) : (
              <h2 className="text-2xl font-bold">{data.organization?.name || "Company Name"}</h2>
            )}
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-light text-slate-400 uppercase tracking-wider mb-2">
              {type === "quote" ? "Quote" : "Invoice"}
            </h1>
            <p className="font-semibold text-lg">{formattedNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Bill To</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold text-base">{data.company?.name || "No Client"}</p>
              {data.company?.addressLine1 && <p>{data.company.addressLine1}</p>}
              {data.company?.addressLine2 && <p>{data.company.addressLine2}</p>}
              {data.company?.addressCity && (
                <p>
                  {data.company.addressCity}, {data.company.addressState} {data.company.addressZip}
                </p>
              )}
              {data.contactEmail && <p className="mt-2 text-slate-600">{data.contactEmail}</p>}
              {data.contactPhone && <p className="text-slate-600">{data.contactPhone}</p>}
            </div>
          </div>
          <div className="text-right space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-slate-400 text-sm">Issue Date</div>
              <div className="text-sm font-medium">{issueDate ? format(new Date(issueDate), "MMM d, yyyy") : "-"}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-slate-400 text-sm">Due Date</div>
              <div className="text-sm font-medium">{dueDate ? format(new Date(dueDate), "MMM d, yyyy") : "-"}</div>
            </div>
            {type === "invoice" && data.status === "PAID" && (
              <div className="mt-4 inline-block px-4 py-1 bg-green-100 text-green-700 font-bold tracking-wider uppercase text-sm rounded border border-green-200">
                Paid
              </div>
            )}
          </div>
        </div>

        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-500">
              <th className="text-left py-3 font-semibold">Description</th>
              <th className="text-right py-3 font-semibold w-24">Qty</th>
              <th className="text-right py-3 font-semibold w-32">Unit Price</th>
              <th className="text-right py-3 font-semibold w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-4">
                  <p className="font-medium">{item.name}</p>
                  {item.description && <p className="text-slate-500 text-xs mt-1">{item.description}</p>}
                </td>
                <td className="text-right py-4">{item.quantity}</td>
                <td className="text-right py-4">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.unitPrice / 100)}
                </td>
                <td className="text-right py-4 font-medium">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.amount / 100)}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No line items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end mb-12">
          <div className="w-72 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((data.subtotal || data.totalAmount || 0) / 100)}</span>
            </div>
            {data.taxAmount > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax ({data.taxPercent}%)</span>
                <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.taxAmount / 100)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-3 border-t">
              <span>Total</span>
              <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((data.totalAmount || 0) / 100)}</span>
            </div>
            {type === "invoice" && data.amountPaid > 0 && (
              <>
                <div className="flex justify-between text-sm text-green-600 pt-2">
                  <span>Amount Paid</span>
                  <span>-{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.amountPaid / 100)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span>Balance Due</span>
                  <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.balanceDue / 100)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {data.notes && (
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</h4>
            <div className="text-sm text-slate-700 whitespace-pre-wrap">{data.notes}</div>
          </div>
        )}
        
        {Array.isArray(data.terms) && data.terms.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              {data.terms.map((term: any, idx: number) => (
                <li key={idx}>{term.text || term}</li>
              ))}
            </ul>
          </div>
        )}

        {type === "invoice" && data.payments && data.payments.length > 0 && (
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Payment History</h4>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Method</th>
                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.payments.map((p: any) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2">{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{p.paymentMethod.replace("_", " ")}</td>
                      <td className="px-4 py-2 text-right font-medium text-slate-700">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.amount / 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data.signatureData && (
          <div className="mt-16 border-t pt-8 inline-block pr-16">
            <img src={data.signatureData} alt="Signature" className="h-16 object-contain mb-2" />
            <div className="text-sm font-medium">{data.signatureName || "Authorized Signature"}</div>
          </div>
        )}
      </div>
    </div>
  );
}
