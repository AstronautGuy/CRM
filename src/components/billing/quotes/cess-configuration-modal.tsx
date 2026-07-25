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
import { Checkbox } from "~/components/ui/checkbox";

interface CessConfig {
  enabled: boolean;
  type: "central" | "state";
  name: string;
  isReverseCharge: boolean;
}

interface CessConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cessConfig: CessConfig;
  onSave: (config: CessConfig) => void;
}

export function CessConfigurationModal({
  isOpen,
  onClose,
  cessConfig,
  onSave,
}: CessConfigurationModalProps) {
  const [config, setConfig] = React.useState<CessConfig>(cessConfig);

  React.useEffect(() => {
    if (isOpen) {
      // Default enabled to true when opening this modal
      setConfig({ ...cessConfig, enabled: true });
    }
  }, [isOpen, cessConfig]);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleRemove = () => {
    onSave({ ...config, enabled: false, name: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Cess</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cess-type">Cess Type</Label>
            <Select 
              value={config.type} 
              onValueChange={(val) => setConfig({ ...config, type: val as "central" | "state" })}
            >
              <SelectTrigger id="cess-type">
                <SelectValue placeholder="Select cess type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="central">Central Cess</SelectItem>
                <SelectItem value="state">State Cess</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cess-name">Cess Name</Label>
            <Input
              id="cess-name"
              placeholder="e.g. Kerala Flood Cess"
              value={config.name}
              onChange={(e) =>
                setConfig({ ...config, name: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="reverse-charge"
              checked={config.isReverseCharge}
              onCheckedChange={(checked) =>
                setConfig({ ...config, isReverseCharge: checked === true })
              }
            />
            <Label
              htmlFor="reverse-charge"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is reverse charge applicable?
            </Label>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between items-center w-full">
          <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleRemove}>
            Remove Cess
          </Button>
          <div className="flex gap-2">
             <Button variant="outline" onClick={onClose}>
               Cancel
             </Button>
             <Button onClick={handleSave}>
               Save
             </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
