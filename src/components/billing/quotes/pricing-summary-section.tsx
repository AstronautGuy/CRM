"use client";

import * as React from "react";
import { Eye, EyeOff, Percent, Plus, IndianRupee } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { QuoteData, DiscountType } from "~/types/quote";
import { TaxConfigurationModal } from "./tax-configuration-modal";
import { CessConfigurationModal } from "./cess-configuration-modal";
import { cn } from "~/lib/utils";

interface PricingSummarySectionProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
  subtotal: number;
}

export function PricingSummarySection({
  data,
  onChange,
  subtotal,
}: PricingSummarySectionProps) {
  const [taxModalOpen, setTaxModalOpen] = React.useState(false);
  const [cessModalOpen, setCessModalOpen] = React.useState(false);

  // Handlers for Eye toggles
  const toggleTotalSection = () =>
    onChange({ ...data, showTotalSection: !data.showTotalSection });
  const toggleTotalInWords = () =>
    onChange({ ...data, showTotalInWords: !data.showTotalInWords });

  // Capitalize first letter of each word
  const handleWordsChange = (val: string) => {
    const capitalized = val.replace(/\b\w/g, (char) => char.toUpperCase());
    onChange({ ...data, totalInWordsValue: capitalized });
  };

  return (
    <div className="space-y-8 mt-8">
      {/* TOTAL SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTotalSection}
            className="text-muted-foreground hover:text-foreground p-0 h-auto"
          >
            {data.showTotalSection ? (
              <Eye className="w-4 h-4 mr-2" />
            ) : (
              <EyeOff className="w-4 h-4 mr-2" />
            )}
            Show Total in PDF
          </Button>
        </div>

        <div
          className={cn(
            "p-6 border rounded-lg bg-card transition-all duration-300",
            !data.showTotalSection && "opacity-50 grayscale pointer-events-none"
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Action Buttons & Configurations */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTaxModalOpen(true)}
                >
                  <Percent className="w-4 h-4 mr-2" />
                  {data.taxConfig.type && data.taxConfig.type !== "none" 
                    ? `Tax: ${data.taxConfig.type}` 
                    : "Add GST/Tax"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCessModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {data.cessConfig?.enabled ? `Cess: ${data.cessConfig.name}` : "Add Cess"}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Add Discount
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem 
                      onClick={() => onChange({ ...data, discount: { ...data.discount, type: "total" }})}
                    >
                      Discount on Total
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onChange({ ...data, discount: { ...data.discount, type: "item" }})}
                    >
                      Item-wise Discount
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {!data.additionalCharges.amount && data.additionalCharges.amount !== 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange({
                      ...data,
                      additionalCharges: { ...data.additionalCharges, amount: 0 }
                    })}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Additional Charges
                  </Button>
                )}
              </div>

              {/* Configurations Summary Text */}
              {data.taxConfig.type === "GST (India)" && (
                <div className="text-sm text-muted-foreground mt-2 bg-slate-50 p-2 rounded">
                  <p><strong>GST Type:</strong> {data.taxConfig.gstType}</p>
                  <p><strong>Place of Supply:</strong> {data.taxConfig.placeOfSupply}</p>
                </div>
              )}
            </div>

            {/* Right Column: Calculations & Totals */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹ {subtotal.toFixed(2)}</span>
              </div>

              {/* Discount Row */}
              {data.discount.type !== "none" && (
                <div className="flex flex-col gap-2 py-2 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Discount ({data.discount.type})
                    </span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        className="w-24 text-right h-8"
                        value={data.discount.amount || ""}
                        onChange={(e) =>
                          onChange({
                            ...data,
                            discount: { ...data.discount, amount: parseFloat(e.target.value) || 0 },
                          })
                        }
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-10 px-0">
                            {data.discount.isPercentage ? <Percent className="h-3 w-3" /> : <IndianRupee className="h-3 w-3" />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              onChange({
                                ...data,
                                discount: { ...data.discount, isPercentage: false },
                              })
                            }
                          >
                            Amount (₹)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onChange({
                                ...data,
                                discount: { ...data.discount, isPercentage: true },
                              })
                            }
                          >
                            Percentage (%)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Charges Row */}
              {data.additionalCharges.amount !== undefined && (
                <div className="flex flex-col gap-2 py-2 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <Input 
                       className="h-8 w-32 border-dashed bg-transparent hover:bg-slate-50 font-medium"
                       value={data.additionalCharges.title}
                       onChange={(e) => onChange({...data, additionalCharges: {...data.additionalCharges, title: e.target.value}})}
                    />
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        className="w-24 text-right h-8"
                        value={data.additionalCharges.amount || ""}
                        onChange={(e) =>
                          onChange({
                            ...data,
                            additionalCharges: { ...data.additionalCharges, amount: parseFloat(e.target.value) || 0 },
                          })
                        }
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-10 px-0">
                            {data.additionalCharges.isPercentage ? <Percent className="h-3 w-3" /> : <IndianRupee className="h-3 w-3" />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              onChange({
                                ...data,
                                additionalCharges: { ...data.additionalCharges, isPercentage: false },
                              })
                            }
                          >
                            Amount (₹)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onChange({
                                ...data,
                                additionalCharges: { ...data.additionalCharges, isPercentage: true },
                              })
                            }
                          >
                            Percentage (%)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )}

              {/* TOTAL ROW */}
              <div className="flex justify-between items-center py-4 border-t-2 border-slate-200 mt-2">
                <Input
                  className="h-8 w-32 text-lg font-bold border-dashed bg-transparent hover:bg-slate-50 px-1"
                  value={data.totalLabel}
                  onChange={(e) =>
                    onChange({ ...data, totalLabel: e.target.value })
                  }
                />
                <span className="text-xl font-bold">
                  {/* Calculation would go here, currently just subtotal for visual */}
                  ₹ {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="summarise-qty"
                  checked={data.summariseQuantity}
                  onCheckedChange={(checked) =>
                    onChange({ ...data, summariseQuantity: checked === true })
                  }
                />
                <Label htmlFor="summarise-qty" className="text-sm font-normal">
                  Summarise Total Quantity
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOTAL IN WORDS SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTotalInWords}
            className="text-muted-foreground hover:text-foreground p-0 h-auto"
          >
            {data.showTotalInWords ? (
              <Eye className="w-4 h-4 mr-2" />
            ) : (
              <EyeOff className="w-4 h-4 mr-2" />
            )}
            Show Total in Words
          </Button>
        </div>

        <div
          className={cn(
            "p-6 border rounded-lg bg-card transition-all duration-300",
            !data.showTotalInWords && "opacity-50 grayscale pointer-events-none"
          )}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Input
                className="font-medium max-w-[200px] border-dashed bg-transparent hover:bg-slate-50"
                value={data.totalInWordsLabel}
                onChange={(e) =>
                  onChange({ ...data, totalInWordsLabel: e.target.value })
                }
              />
              <Input
                className="flex-1"
                placeholder="e.g. One Thousand Five Hundred Only"
                value={data.totalInWordsValue}
                onChange={(e) => handleWordsChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <TaxConfigurationModal
        isOpen={taxModalOpen}
        onClose={() => setTaxModalOpen(false)}
        taxConfig={data.taxConfig}
        onSave={(cfg) => onChange({ ...data, taxConfig: cfg })}
      />
      
      <CessConfigurationModal
        isOpen={cessModalOpen}
        onClose={() => setCessModalOpen(false)}
        cessConfig={data.cessConfig || { enabled: false, type: "central", name: "", isReverseCharge: false }}
        onSave={(cfg) => onChange({ ...data, cessConfig: cfg })}
      />
    </div>
  );
}
