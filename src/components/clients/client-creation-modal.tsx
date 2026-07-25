"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ClientCreationForm } from "./client-creation-form";
import { Plus } from "lucide-react";

interface ClientCreationModalProps {
  onSuccess?: (client: any) => void;
  trigger?: React.ReactNode;
}

export function ClientCreationModal({ onSuccess, trigger }: ClientCreationModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = (client: any) => {
    setOpen(false);
    if (onSuccess) {
      onSuccess(client);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8 flex gap-1">
            <Plus className="w-4 h-4" /> Add New Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 text-white border-slate-800">
        <DialogHeader className="mb-0">
          <DialogTitle className="sr-only">Add New Client</DialogTitle>
        </DialogHeader>
        <div className="mt-[-24px]">
          {/* We hide the title above since the form has its own header, or we can let the form render it */}
          <ClientCreationForm isModal onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
