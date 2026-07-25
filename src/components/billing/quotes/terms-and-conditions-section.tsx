"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { QuoteData } from "~/types/quote";
import { RichTextEditor } from "~/components/ui/rich-text-editor";

interface TermsAndConditionsSectionProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export function TermsAndConditionsSection({
  data,
  onChange,
}: TermsAndConditionsSectionProps) {
  const [activeEditor, setActiveEditor] = React.useState<"notes" | "attachments" | "info" | null>(null);

  const handleAddTerm = () => {
    onChange({ ...data, termsList: [...data.termsList, ""] });
  };

  const handleTermChange = (index: number, val: string) => {
    const newTerms = [...data.termsList];
    newTerms[index] = val;
    onChange({ ...data, termsList: newTerms });
  };

  const handleRemoveTerm = (index: number) => {
    const newTerms = data.termsList.filter((_, i) => i !== index);
    onChange({ ...data, termsList: newTerms });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="space-y-8 mt-8">
      {/* Action Buttons for Rich Text Fields */}
      <div className="flex gap-2">
        <Button 
          variant={activeEditor === "notes" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveEditor(activeEditor === "notes" ? null : "notes")}
        >
          {data.notes ? "Edit Notes" : "Add Notes"}
        </Button>
        <Button 
          variant={activeEditor === "attachments" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveEditor(activeEditor === "attachments" ? null : "attachments")}
        >
          {data.attachments ? "Edit Attachments" : "Add Attachments"}
        </Button>
        <Button 
          variant={activeEditor === "info" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveEditor(activeEditor === "info" ? null : "info")}
        >
          {data.info ? "Edit Info" : "Add Info"}
        </Button>
      </div>

      {/* Active Editor */}
      {activeEditor && (
        <div className="p-4 border rounded-lg bg-card mt-4">
          <h3 className="text-sm font-semibold mb-2 capitalize">{activeEditor}</h3>
          <RichTextEditor
            value={data[activeEditor] || ""}
            onChange={(val) => onChange({ ...data, [activeEditor]: val })}
          />
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="mt-8">
        <Input
          className="text-xl font-bold border-dashed bg-transparent hover:bg-slate-50 w-full max-w-[300px] mb-4 h-10 px-1"
          value={data.termsTitle}
          onChange={(e) => onChange({ ...data, termsTitle: e.target.value })}
        />

        <div className="space-y-2">
          {data.termsList.map((term, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-sm text-muted-foreground mt-2 w-6">{i + 1}.</span>
              <Input
                value={term}
                onChange={(e) => handleTermChange(i, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type term..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveTerm(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleAddTerm}>
            <Plus className="w-4 h-4 mr-2" /> Add T&C
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddTerm}>
            <Plus className="w-4 h-4 mr-2" /> Add Group
          </Button>
        </div>
      </div>
    </div>
  );
}
