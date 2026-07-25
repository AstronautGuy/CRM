"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import type { TaxType, GstType } from "~/types/quote";

interface TaxConfig {
  type: TaxType;
  placeOfSupply?: string;
  gstType?: GstType;
}

interface TaxConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxConfig: TaxConfig;
  onSave: (config: TaxConfig) => void;
}

const DEFAULT_TAX_OPTIONS = ["none", "GST (India)", "VAT", "PPN", "SST", "HST", "TAX"];

export function TaxConfigurationModal({
  isOpen,
  onClose,
  taxConfig,
  onSave,
}: TaxConfigurationModalProps) {
  const [config, setConfig] = React.useState<TaxConfig>(taxConfig);
  const [customTax, setCustomTax] = React.useState("");
  const [isAddingCustom, setIsAddingCustom] = React.useState(false);

  // Sync state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setConfig(taxConfig);
      setIsAddingCustom(false);
      setCustomTax("");
    }
  }, [isOpen, taxConfig]);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const isGst = config.type === "GST (India)";

  const handleTaxTypeChange = (value: string) => {
    if (value === "add_new") {
      setIsAddingCustom(true);
      setConfig({ ...config, type: "" });
    } else {
      setIsAddingCustom(false);
      setConfig({ 
        ...config, 
        type: value,
        placeOfSupply: value === "GST (India)" ? config.placeOfSupply || "" : undefined,
        gstType: value === "GST (India)" ? config.gstType || "IGST" : undefined
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Tax</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tax-type">Select Tax Type</Label>
            {!isAddingCustom ? (
              <Select value={config.type} onValueChange={handleTaxTypeChange}>
                <SelectTrigger id="tax-type">
                  <SelectValue placeholder="Select tax type" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_TAX_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === "none" ? "None" : opt}
                    </SelectItem>
                  ))}
                  {/* If current type is not in defaults, show it */}
                  {config.type && !DEFAULT_TAX_OPTIONS.includes(config.type) && config.type !== "none" && (
                     <SelectItem value={config.type}>{config.type}</SelectItem>
                  )}
                  <SelectItem value="add_new" className="text-blue-600 font-medium">
                    + Create New Tax
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  autoFocus
                  placeholder="Enter custom tax name"
                  value={customTax}
                  onChange={(e) => {
                    setCustomTax(e.target.value);
                    setConfig({ ...config, type: e.target.value });
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingCustom(false)}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {isGst && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="place-of-supply">Place of Supply *</Label>
                <Input
                  id="place-of-supply"
                  placeholder="e.g. Maharashtra"
                  value={config.placeOfSupply || ""}
                  onChange={(e) =>
                    setConfig({ ...config, placeOfSupply: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-3 pt-2">
                <Label>GST Type *</Label>
                <RadioGroup
                  value={config.gstType || "IGST"}
                  onValueChange={(val) =>
                    setConfig({ ...config, gstType: val as GstType })
                  }
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="IGST" id="igst" />
                    <Label htmlFor="igst" className="font-normal cursor-pointer">
                      IGST (Inter-state)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CGST & SGST" id="cgst" />
                    <Label htmlFor="cgst" className="font-normal cursor-pointer">
                      CGST & SGST (Intra-state)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isGst && (!config.placeOfSupply || !config.gstType)}
          >
            Save Tax Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
