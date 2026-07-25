import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function InvoicePrintPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-4xl mx-auto space-y-8 print:bg-white print:text-black">
      {/* Print Controls Header (Hidden during actual print) */}
      <div className="flex items-center justify-between print:hidden border-b border-slate-800 pb-4">
        <Link href="/billing">
          <Button variant="outline">← Back to Invoices</Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={undefined}>Print HTML</Button>
          <Button>Download PDF</Button>
        </div>
      </div>

      {/* Invoice Document Layout */}
      <div className="bg-slate-900 print:bg-white p-8 rounded-xl border border-slate-800 print:border-none space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-500 print:text-blue-600">DevCRM</h1>
            <p className="text-sm text-slate-400 print:text-slate-600">Customer Relationship & Billing Platform</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white print:text-black">INVOICE</h2>
            <p className="text-sm text-slate-400 print:text-slate-600 font-mono">INV-2026-001</p>
            <p className="text-xs text-slate-500 mt-1">Date: July 25, 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-b border-slate-800 print:border-slate-300 py-6 text-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Billed To:</span>
            <p className="font-bold text-white print:text-black mt-1">Acme Corporation</p>
            <p className="text-slate-400 print:text-slate-600">100 Enterprise Way, Suite 400</p>
            <p className="text-slate-400 print:text-slate-600">billing@acmecorp.com</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 uppercase">Payment Terms:</span>
            <p className="font-bold text-emerald-400 print:text-emerald-700 mt-1">Due Date: Aug 15, 2026</p>
            <p className="text-slate-400 print:text-slate-600">Status: Sent / Pending</p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 print:border-slate-300 text-xs text-slate-400 uppercase">
            <tr>
              <th className="py-2">Item Description</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
            <tr>
              <td className="py-3 font-medium text-white print:text-black">Developer API Pro Tier (Annual Plan)</td>
              <td className="py-3 text-center">1</td>
              <td className="py-3 text-right">$5,988.00</td>
              <td className="py-3 text-right font-semibold">$5,988.00</td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-white print:text-black">Custom SDK Integration Setup</td>
              <td className="py-3 text-center">1</td>
              <td className="py-3 text-right">$2,500.00</td>
              <td className="py-3 text-right font-semibold">$2,500.00</td>
            </tr>
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-800 print:border-slate-300">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>$8,488.00</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax (10%):</span>
              <span>$848.80</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-white print:text-black pt-2 border-t border-slate-800 print:border-slate-300">
              <span>Total Due:</span>
              <span className="text-emerald-400 print:text-emerald-700">$9,336.80</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
