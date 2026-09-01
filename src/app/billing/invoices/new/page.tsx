"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DatePicker } from "~/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ClientDropdown } from "~/components/billing/shared/client-dropdown";
import { FileUploadDropzone } from "~/components/ui/file-upload-dropzone";
import { PricingSummarySection } from "~/components/billing/shared/pricing-summary-section";
import { TermsAndConditionsSection } from "~/components/billing/shared/terms-and-conditions-section";
import { SignaturePadModal } from "~/components/billing/shared/signature-pad-modal";
import { LineItemsTable } from "~/components/clients/line-items-table";
import type { LineItem } from "~/components/clients/line-items-table";
import type { DocumentData } from "~/types/document";
import { Upload, FileText, Save, Send } from "lucide-react";
import { api } from "~/trpc/react";

const defaultDocumentData: DocumentData = {
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
  poNumber: "",
  paymentTerms: "Net 15",
};

export default function NewInvoicePage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [title, setTitle] = useState("Invoice");
  
  const [items, setItems] = useState<LineItem[]>([]);
  const [invoiceData, setInvoiceData] = useState<DocumentData>(defaultDocumentData);
  
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  const { data: userSettings } = api.billing.getUserSettings.useQuery();
  const { data: nextNumberData } = api.billing.getNextDocumentNumber.useQuery(
    { type: "invoice", companyId: invoiceData.companyId },
    { enabled: !!userSettings } // Wait for settings to load first
  );

  // Initialize from settings
  useEffect(() => {
    const labels = userSettings?.customLabels as any;
    if (labels?.invoiceTitle) {
      setTitle(labels.invoiceTitle);
    }
  }, [userSettings]);

  useEffect(() => {
    if (nextNumberData?.nextNumber) {
      setInvoiceNumber(nextNumberData.nextNumber);
    }
  }, [nextNumberData?.nextNumber]);

  if (!isClient) return null;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-24 pt-8">
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Invoice</h2>
            <p className="text-muted-foreground text-sm mt-1">Build a professional invoice and get paid.</p>
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
                  <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Invoice To</Label>
                  <ClientDropdown 
                    value={invoiceData.companyId || ""} 
                    onChange={(val) => setInvoiceData({ ...invoiceData, companyId: val })} 
                  />
                  <div className="flex gap-4 mt-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Contact Email</Label>
                      <Input 
                        placeholder="Email address"
                        value={invoiceData.contactEmail || ""}
                        onChange={(e) => setInvoiceData({ ...invoiceData, contactEmail: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Contact Phone</Label>
                      <Input 
                        placeholder="Phone number"
                        value={invoiceData.contactPhone || ""}
                        onChange={(e) => setInvoiceData({ ...invoiceData, contactPhone: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 w-48">
                    <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">PO Number</Label>
                    <Input 
                      placeholder="e.g. PO-10293"
                      value={invoiceData.poNumber || ""}
                      onChange={(e) => setInvoiceData({ ...invoiceData, poNumber: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-48">
                    <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Payment Terms</Label>
                    <Select 
                      value={invoiceData.paymentTerms || "Net 15"} 
                      onValueChange={(val) => setInvoiceData({ ...invoiceData, paymentTerms: val })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Right Side: Meta Data & Logo */}
              <div className="flex-1 max-w-xs space-y-4">
                 {/* Logo Upload Dropzone */}
                 <FileUploadDropzone
                   currentImageUrl={invoiceData.logoUrl}
                   onUploadSuccess={(url) => setInvoiceData({ ...invoiceData, logoUrl: url })}
                   onRemove={() => setInvoiceData({ ...invoiceData, logoUrl: undefined })}
                   folder="logos"
                   className="h-24 w-full"
                 />

                <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                  <Label className="text-sm font-medium text-muted-foreground mt-2">Invoice #</Label>
                  <div className="space-y-1">
                    <Input 
                      value={invoiceNumber} 
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="h-8 text-sm"
                    />
                    {nextNumberData?.lastDocument && (
                      <p className="text-[10px] text-muted-foreground">
                        Last Invoice: {nextNumberData.lastDocument.number} ({new Date(nextNumberData.lastDocument.date).toLocaleDateString()})
                      </p>
                    )}
                  </div>
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
               data={invoiceData} 
               onChange={setInvoiceData} 
               subtotal={subtotal} 
             />
          </div>

          {/* T&C and Rich Text Blocks */}
          <div className="px-8 pb-8">
             <TermsAndConditionsSection 
               data={invoiceData}
               onChange={setInvoiceData}
             />
          </div>
          
          {/* Signatures */}
          <div className="px-8 pb-8 flex flex-col items-end border-t border-border pt-8 mt-8">
              {invoiceData.signatureUrl ? (
                 <div className="flex flex-col items-center gap-2">
                    <img src={invoiceData.signatureUrl} alt="Signature" className="h-24 object-contain border p-2 rounded" />
                    <Button variant="ghost" size="sm" onClick={() => setInvoiceData({ ...invoiceData, signatureUrl: undefined })}>Remove Signature</Button>
                 </div>
              ) : (
                 <Button variant="outline" onClick={() => setSignatureModalOpen(true)}>
                    Add Signature
                 </Button>
              )}
          </div>
        </div>

        {/* Action Buttons at Bottom */}
        <div className="flex justify-end gap-3 mt-8">
           <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
           <Button variant="secondary"><FileText className="w-4 h-4 mr-2" /> Save as Proforma</Button>
           <Button><Send className="w-4 h-4 mr-2" /> Save & Send</Button>
        </div>
      </div>
      
      <SignaturePadModal 
        isOpen={signatureModalOpen} 
        onClose={() => setSignatureModalOpen(false)}
        onSave={(url) => setInvoiceData({ ...invoiceData, signatureUrl: url })}
      />
    </DashboardLayout>
  );
}
