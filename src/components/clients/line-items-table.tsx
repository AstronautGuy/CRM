"use client";

import React from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ProductAutocomplete } from "./product-autocomplete";
import { RichTextEditor } from "~/components/ui/rich-text-editor";

export interface LineItem {
  id: string;
  productId?: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  unit: string;
  imageUrl?: string;
}

interface LineItemsTableProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  currencySymbol: string;
}

export function LineItemsTable({ items, onChange, currencySymbol }: LineItemsTableProps) {
  const addItem = () => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
        unit: "pcs",
      },
    ]);
  };

  const updateItem = (id: string, updates: Partial<LineItem>) => {
    onChange(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          updated.amount = updated.quantity * updated.rate;
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="grid grid-cols-[auto_1fr_100px_150px_150px_auto] gap-4 bg-slate-900 text-white font-medium text-sm py-3 px-4 rounded-t-md">
        <div className="w-6"></div>
        <div>Item Name / Description</div>
        <div className="text-right">Qty</div>
        <div className="text-right">Rate</div>
        <div className="text-right">Amount</div>
        <div className="w-8"></div>
      </div>

      {/* Items */}
      <div className="border border-t-0 rounded-b-md divide-y">
        {items.map((item, index) => (
          <div key={item.id} className="p-4 grid grid-cols-[auto_1fr_100px_150px_150px_auto] gap-4 items-start group">
            {/* Drag Handle */}
            <div className="w-6 pt-2 text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Main Item Area */}
            <div className="flex flex-col gap-3">
              <ProductAutocomplete 
                placeholder="Select or type item name..."
                onSelect={(selected) => {
                  if ("isNew" in selected) {
                    updateItem(item.id, { name: selected.name });
                  } else {
                    updateItem(item.id, {
                      productId: selected.id,
                      name: selected.name,
                      rate: selected.unitPrice / 100,
                      unit: selected.unit || "pcs",
                      description: selected.description || "",
                    });
                  }
                }}
              />
              
              {/* Fallback to Input if they don't want to use autocomplete, or let the autocomplete input double as name */}
              {item.name && (
                <div className="text-sm font-medium pl-1 text-slate-800">{item.name}</div>
              )}

              <RichTextEditor 
                value={item.description} 
                onChange={(html) => updateItem(item.id, { description: html })} 
                placeholder="Item description (optional)"
                className="bg-white"
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <Input
                type="number"
                min={0}
                step={0.01}
                value={item.quantity || ""}
                onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                className="text-right h-9"
              />
              <Input 
                value={item.unit}
                onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                className="text-xs text-center text-slate-500 h-7 border-transparent hover:border-input px-1"
                placeholder="Unit (pcs)"
              />
            </div>

            {/* Rate */}
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-400">{currencySymbol}</span>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={item.rate || ""}
                onChange={(e) => updateItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                className="text-right h-9"
              />
            </div>

            {/* Amount */}
            <div className="text-right pt-2 font-medium text-slate-800 tabular-nums">
              {currencySymbol} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            {/* Actions */}
            <div className="w-8 pt-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No items added yet. Click the button below to add your first item.
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={addItem} size="sm" className="bg-slate-50">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>
    </div>
  );
}
