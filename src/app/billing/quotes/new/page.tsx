"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DatePicker } from "~/components/ui/date-picker";
import { ClientDropdown } from "~/components/billing/quotes/client-dropdown";
import { PricingSummarySection } from "~/components/billing/quotes/pricing-summary-section";
import { TermsAndConditionsSection } from "~/components/billing/quotes/terms-and-conditions-section";
import { SignaturePadModal } from "~/components/billing/quotes/signature-pad-modal";
import { LineItemsTable } from "~/components/clients/line-items-table";
import type { LineItem } from "~/components/clients/line-items-table";
import type { QuoteData } from "~/types/quote";
import { Upload, FileText, Download, Save, Send } from "lucide-react";
import { api } from "~/trpc/react";

const defaultQuoteData: QuoteData = {
  logoUrl: "",
  companyId: "",
  showTotalSection: true,
  showTotalInWords: false,
  summariseQuantity: false,
  taxConfig: { type: "none" },
  discount: { type: "total", amount: 0, isPercentage: true },
  additionalCharges: { title: "Extra Charges", amount: 0, isPercentage: false },
  totalLabel: "TOTAL",
  totalInWordsLabel: "Total (in words)",
  totalInWordsValue: "",
  termsTitle: "Terms and conditions",
  termsList: [],
};

export default function NewQuotePage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [quoteNumber, setQuoteNumber] = useState("EST-001");
  const [title, setTitle] = useState("Quotation");
  
  const [items, setItems] = useState<LineItem[]>([]);
  const [quoteData, setQuoteData] = useState<QuoteData>(defaultQuoteData);
  
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  const { data: userSettings } = api.billing.getUserSettings.useQuery();
  
  // Initialize from settings
  useEffect(() => {
    if (userSettings?.customLabels?.quoteTitle) {
      setTitle(userSettings.customLabels.quoteTitle);
    }
  }, [userSettings]);

  if (!isClient) return null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-24 pt-8">
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Quotation</h2>
            <p className="text-muted-foreground text-sm mt-1">Build a professional quotation or estimate.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save to Draft</Button>
             <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Save & Create New</Button>
             <Button><Send className="w-4 h-4 mr-2" /> Save & Continue</Button>
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-8 pb-4 border-b border-border">
            <div className="flex justify-between items-start gap-8">
              {/* Left Side: Title and Client */}
              <div className="flex-1 space-y-6">
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-3xl font-bold border-dashed bg-transparent hover:bg-slate-50 px-2 -ml-2 h-12 uppercase w-full max-w-sm" 
                />
                
                <div className="flex flex-col gap-1 max-w-sm">
                  <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Quote For</Label>
                  <ClientDropdown 
                    value={quoteData.companyId || ""} 
                    onChange={(val) => setQuoteData({ ...quoteData, companyId: val })} 
                  />
                </div>
              </div>

              {/* Right Side: Meta Data & Logo */}
              <div className="flex-1 max-w-xs space-y-4">
                 {/* Logo Upload Placeholder */}
                 <div className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-slate-50 cursor-pointer transition-colors">
                    {quoteData.logoUrl ? (
                      <img src={quoteData.logoUrl} alt="Logo" className="max-h-full object-contain p-2" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-2 opacity-50" />
                        <span className="text-xs font-medium">Upload Company Logo</span>
                      </>
                    )}
                 </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">Quote #</Label>
                  <Input 
                    value={quoteNumber} 
                    onChange={(e) => setQuoteNumber(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <DatePicker date={date} setDate={setDate} />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
                  <DatePicker date={dueDate} setDate={setDueDate} />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="p-8 pb-4">
             <LineItemsTable items={items} onChange={setItems} currencySymbol="₹" />
          </div>

          {/* Pricing Summary */}
          <div className="px-8 pb-4">
             <PricingSummarySection 
               data={quoteData} 
               onChange={setQuoteData} 
               subtotal={subtotal} 
             />
          </div>

          {/* T&C and Rich Text Blocks */}
          <div className="px-8 pb-8">
             <TermsAndConditionsSection 
               data={quoteData}
               onChange={setQuoteData}
             />
          </div>
          
          {/* Signatures */}
          <div className="px-8 pb-8 flex flex-col items-end border-t border-border pt-8 mt-8">
              {quoteData.signatureUrl ? (
                 <div className="flex flex-col items-center gap-2">
                    <img src={quoteData.signatureUrl} alt="Signature" className="h-24 object-contain border p-2 rounded" />
                    <Button variant="ghost" size="sm" onClick={() => setQuoteData({ ...quoteData, signatureUrl: undefined })}>Remove Signature</Button>
                 </div>
              ) : (
                 <Button variant="outline" onClick={() => setSignatureModalOpen(true)}>
                    Add Signature
                 </Button>
              )}
          </div>
        </div>
      </div>
      
      <SignaturePadModal 
        isOpen={signatureModalOpen} 
        onClose={() => setSignatureModalOpen(false)}
        onSave={(url) => setQuoteData({ ...quoteData, signatureUrl: url })}
      />
    </DashboardLayout>
  );
}
