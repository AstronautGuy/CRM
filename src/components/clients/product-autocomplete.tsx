"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  unitPrice: number;
  description: string | null;
  unit: string | null;
}

interface ProductAutocompleteProps {
  onSelect: (product: Product | { isNew: true, name: string }) => void;
  placeholder?: string;
}

export function ProductAutocomplete({ onSelect, placeholder = "Search or create item..." }: ProductAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  // Use trpc to fetch products
  const { data: products = [], isLoading } = api.billing.getProducts.useQuery();

  const handleSelect = (product: Product) => {
    setOpen(false);
    onSelect(product);
    setSearchValue("");
  };

  const handleCreateNew = () => {
    setOpen(false);
    onSelect({ isNew: true, name: searchValue });
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Type item name or SKU..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty className="p-2">
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <p className="text-sm text-muted-foreground">No item found.</p>
                <Button 
                  size="sm" 
                  onClick={handleCreateNew} 
                  disabled={!searchValue.trim()}
                  className="w-full mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{searchValue}"
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {products
                .filter(p => 
                  p.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                  (p.sku && p.sku.toLowerCase().includes(searchValue.toLowerCase()))
                )
                .map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product)}
                  className="flex flex-col items-start cursor-pointer"
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
                    <span>{product.sku || "No SKU"}</span>
                    <span>Rs {(product.unitPrice / 100).toFixed(2)}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            
            {searchValue.trim() && products.filter(p => p.name.toLowerCase() === searchValue.toLowerCase()).length === 0 && (
              <div className="p-1 border-t">
                <CommandItem
                  value={searchValue}
                  onSelect={handleCreateNew}
                  className="flex items-center text-primary cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{searchValue}" as new item
                </CommandItem>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
