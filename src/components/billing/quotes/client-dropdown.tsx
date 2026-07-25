"use client";

import * as React from "react";
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
import { ClientCreationModal } from "~/components/clients/client-creation-modal";
import { api } from "~/trpc/react";

interface ClientDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientDropdown({ value, onChange }: ClientDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  // Fetch companies
  const { data: companies, refetch } = api.crm.getCompanies.useQuery();

  const selectedCompany = companies?.find((company) => company.id === value);

  const handleClientCreated = async (newClientId: string) => {
    await refetch();
    onChange(newClientId);
    setModalOpen(false);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCompany ? selectedCompany.name : "Select client..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search client..." />
            <CommandList>
              <CommandEmpty>No client found.</CommandEmpty>
              <CommandGroup>
                {companies?.map((company) => (
                  <CommandItem
                    key={company.id}
                    value={company.name}
                    onSelect={() => {
                      onChange(company.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === company.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {company.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            
            {/* Create New Client Option */}
            <div className="border-t p-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  setModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Client
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {modalOpen && (
        <ClientCreationModal
          onClientCreated={handleClientCreated}
        />
      )}
    </>
  );
}
