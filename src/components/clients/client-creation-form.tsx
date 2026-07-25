"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import { Loader2, Plus, Trash2, Link as LinkIcon, Download, Info } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import { PhoneInput } from "~/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";

const contactSchema = z.object({
  // Section 1: Basic Info
  logo: z.string().optional(),
  name: z.string().min(1, "Business Name is required"),
  industry: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),

  // Section 2: Tax Info
  hasGst: z.boolean().default(false),
  gstin: z.union([
    z.literal(""),
    z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)")
  ]).optional(),
  businessPan: z.union([
    z.literal(""),
    z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g. AAAAA0000A)")
  ]).optional(),
  extraIds: z.array(z.object({
    idType: z.string(),
    idValue: z.string()
  })).default([]),
  clientType: z.enum(["individual", "org"]).default("org").optional(),
  taxTreatment: z.enum(["consumer", "b2b"]).default("b2b").optional(),

  // Section 3: Address Section
  addressCountry: z.string().optional(),
  addressState: z.string().optional(),
  addressCity: z.string().optional(),
  addressStreet: z.string().optional(),
  addressPincode: z.union([
    z.literal(""),
    z.string().min(4, "Pincode is too short").max(10, "Pincode is too long").regex(/^\d+$/, "Pincode must contain only numbers")
  ]).optional(),

  // Section 4: Shipping Details
  shippingAddresses: z.array(z.object({
    country: z.string(),
    state: z.string(),
    city: z.string(),
    pincode: z.string().regex(/^\d*$/, "Pincode must be numeric").optional()
  })).default([]),

  // Section 5: Linked Contact
  // blank for now

  // Section 6: Additional Details
  alias: z.string().optional(),
  uid: z.string().optional(),
  email: z.string().email("Valid email required").or(z.literal("")).optional(),
  showEmailInInvoice: z.boolean().default(false),
  phone: z.union([
    z.literal(""),
    z.string().min(10, "Phone number must be at least 10 digits").refine((val) => {
      if (!val) return true;
      return isValidPhoneNumber(val);
    }, "Invalid phone number")
  ]).optional(),
  showPhoneInInvoice: z.boolean().default(false),
  paymentDueDays: z.coerce.number().optional(),
  paymentAccount: z.string().optional(),
  upiId: z.string().optional(),
  customFields: z.array(z.object({
    fieldName: z.string(),
    fieldValue: z.string()
  })).default([]),

  // Section 7: Attachments
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string()
  })).default([]),

  // Linked Contacts / POCs
  existingPocIds: z.array(z.string()).default([]),
  newPocs: z.array(z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional()
  })).default([]),
});
type ContactFormValues = z.infer<typeof contactSchema>;

export function ClientCreationForm({ onSuccess, isModal = false }: { onSuccess?: (client: any) => void, isModal?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as any,
    mode: "onTouched",
    defaultValues: {
      name: "",
      industry: "",
      country: "",
      city: "",
      hasGst: false,
      gstin: "",
      businessPan: "",
      extraIds: [],
      clientType: "org",
      taxTreatment: "b2b",
      addressCountry: "",
      addressState: "",
      addressCity: "",
      addressStreet: "",
      addressPincode: "",
      shippingAddresses: [],
      existingPocIds: [],
      newPocs: [],
      alias: "",
      uid: "",
      email: "",
      showEmailInInvoice: false,
      phone: "",
      showPhoneInInvoice: false,
      paymentDueDays: undefined,
      paymentAccount: "",
      upiId: "",
      customFields: [],
      attachments: [],
    },
  });

  const { watch, setValue, control } = form;
  
  const extraIdsArray = useFieldArray({ control, name: "extraIds" });
  const shippingArray = useFieldArray({ control, name: "shippingAddresses" });
  const customFieldsArray = useFieldArray({ control, name: "customFields" });
  const attachmentsArray = useFieldArray({ control, name: "attachments" });
  const pocsArray = useFieldArray({ control, name: "newPocs" });

  const currentCountry = watch("country");
  const addressCountry = watch("addressCountry");
  const addressState = watch("addressState");
  const hasGst = watch("hasGst");

  const countries = Country.getAllCountries();
  const addressStatesList = addressCountry ? State.getStatesOfCountry(addressCountry) : [];
  const addressCitiesList = addressState && addressCountry ? City.getCitiesOfState(addressCountry, addressState) : [];

  const createCompany = api.crm.createCompany.useMutation();
  const createContact = api.crm.createContact.useMutation();
  const nameWatch = form.watch("name");
  const { data: duplicateCompany } = api.crm.getCompanyByName.useQuery(
    { name: nameWatch },
    { enabled: !!nameWatch && nameWatch.trim().length > 2 }
  );

  const copyBillingToShipping = () => {
    shippingArray.append({
      country: watch("addressCountry") || "",
      state: watch("addressState") || "",
      city: watch("addressCity") || "",
      pincode: watch("addressPincode") || "",
    });
    toast.success("Billing address copied to shipping");
  };

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      const company = await createCompany.mutateAsync({
        name: data.name,
        industry: data.industry,
        country: data.country,
        // Tax Info Mapping
        hasGst: data.hasGst,
        gstin: data.gstin || undefined,
        businessPan: data.businessPan || undefined,
        clientType: data.clientType,
        taxTreatment: data.taxTreatment,
        extraIds: data.extraIds,
        // Billing Address Mapping
        addressCountry: data.addressCountry,
        addressState: data.addressState,
        addressCity: data.addressCity,
        addressStreet: data.addressStreet,
        addressPincode: data.addressPincode,
        shippingDetails: data.shippingAddresses,
        alias: data.alias,
        uid: data.uid,
        email: data.email,
        phone: data.phone,
        showEmailInInvoice: data.showEmailInInvoice,
        showPhoneInInvoice: data.showPhoneInInvoice,
        paymentDueDays: data.paymentDueDays,
        customFields: data.customFields,
        attachments: data.attachments,
        logoUrl: data.logo,
      });

      if (!company) throw new Error("Failed to create company");

      if (data.newPocs && data.newPocs.length > 0) {
        for (const poc of data.newPocs) {
          await createContact.mutateAsync({
            ...poc,
            companyId: company.id
          });
        }
      }

      if (onSuccess) {
        onSuccess(company);
      } else {
        toast.success("Client profile created successfully!");
        router.push("/clients");
      }
    } catch (error) {
      toast.error("Failed to save contact profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isModal ? "" : "max-w-5xl mx-auto pb-12"}>
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Add New Client</h2>
            <p className="text-slate-400 text-sm mt-1">Fill out the detailed profile for your new client or organization.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/clients">Cancel</Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-6 mb-6 bg-slate-900 border border-slate-800 p-1 h-auto rounded-lg">
                <TabsTrigger value="basic" className="py-2.5">Basic Info</TabsTrigger>
                <TabsTrigger value="tax" className="py-2.5">Tax Info</TabsTrigger>
                <TabsTrigger value="address" className="py-2.5">Addresses</TabsTrigger>
                <TabsTrigger value="details" className="py-2.5">Details</TabsTrigger>
                <TabsTrigger value="contacts" className="py-2.5">Contacts</TabsTrigger>
                <TabsTrigger value="attachments" className="py-2.5">Attachments</TabsTrigger>
                <TabsTrigger value="account" className="py-2.5">Account</TabsTrigger>
              </TabsList>

              {/* TAB 1: BASIC INFO */}
              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 space-y-6">
                    <FormField control={form.control} name="logo" render={() => (
                      <FormItem>
                        <FormLabel>Client Logo</FormLabel>
                        <div className="h-32 w-full max-w-sm rounded-lg border-2 border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 hover:bg-slate-800 transition text-slate-400">
                          <Plus className="h-8 w-8 mb-2 text-slate-500" />
                          <span className="text-sm">Drag & drop logo here</span>
                          <span className="text-xs text-slate-500 mt-1">or click to browse</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-950 border-slate-800">
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[300px]">
                              {countries.map(c => (
                                <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>City / Town</FormLabel>
                          <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl><Input className="bg-slate-950 border-slate-800" placeholder="Acme Corp" {...field} /></FormControl>
                          {duplicateCompany && (
                            <div className="flex items-center gap-2 text-amber-500 text-sm mt-1 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                              <Info className="h-4 w-4 shrink-0" />
                              <span>
                                The company with name <span className="font-semibold">{duplicateCompany.name}</span> already exists.{" "}
                                <a href={`/clients/${duplicateCompany.id}`} target="_blank" rel="noreferrer" className="underline hover:text-amber-400">
                                  View profile
                                </a>
                              </span>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="industry" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-950 border-slate-800">
                                <SelectValue placeholder="Select Industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                              <SelectItem value="software">Software / IT</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="retail">Retail / E-Commerce</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end"><Button type="button" onClick={() => setActiveTab("tax")}>Next Step</Button></div>
              </TabsContent>

              {/* TAB 2: TAX INFO */}
              <TabsContent value="tax" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 space-y-6">
                    <FormField control={form.control} name="hasGst" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">Registered for Tax (GST/VAT)?</FormLabel>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />

                    {hasGst && (
                      <div className="grid grid-cols-2 gap-6 p-4 bg-slate-950 border border-slate-800 rounded-lg">
                        <FormField control={form.control} name="gstin" render={({ field }) => (
                          <FormItem>
                            <FormLabel>GST / Tax Number</FormLabel>
                            <FormControl><Input className="bg-slate-900 border-slate-800 uppercase" placeholder="22AAAAA0000A1Z5" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="businessPan" render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN / Legal ID</FormLabel>
                            <FormControl><Input className="bg-slate-900 border-slate-800 uppercase" placeholder="AAAAA0000A" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-800">
                      <FormLabel className="mb-2 block">Additional Tax IDs</FormLabel>
                      {extraIdsArray.fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 mb-4">
                          <FormField control={form.control} name={`extraIds.${index}.idType`} render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl><Input placeholder="ID Type (e.g. CIN)" className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`extraIds.${index}.idValue`} render={({ field }) => (
                            <FormItem className="flex-[2]">
                              <FormControl><Input placeholder="Value" className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                            </FormItem>
                          )} />
                          <Button type="button" variant="destructive" size="icon" onClick={() => extraIdsArray.remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => extraIdsArray.append({ idType: "", idValue: "" })} className="mt-2">
                        <Plus className="h-4 w-4 mr-2"/> Add Tax ID
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                      <FormField control={form.control} name="clientType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Type</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                              <div className="flex items-center space-x-2"><RadioGroupItem value="individual" id="r1" /><Label htmlFor="r1">Individual</Label></div>
                              <div className="flex items-center space-x-2"><RadioGroupItem value="org" id="r2" /><Label htmlFor="r2">Organization</Label></div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="taxTreatment" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Treatment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Select..." /></SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                              <SelectItem value="consumer">Consumer (B2C)</SelectItem>
                              <SelectItem value="b2b">Business (B2B)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>Previous</Button>
                  <Button type="button" onClick={() => setActiveTab("address")}>Next Step</Button>
                </div>
              </TabsContent>

              {/* TAB 3: ADDRESS & SHIPPING */}
              <TabsContent value="address" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white">Billing Address</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <FormField control={form.control} name="addressCountry" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={(v) => { field.onChange(v); setValue("addressState", ""); setValue("addressCity", ""); }} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Select Country" /></SelectTrigger></FormControl>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[300px]">
                              {countries.map(c => <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="addressState" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <Select onValueChange={(v) => { field.onChange(v); setValue("addressCity", ""); }} defaultValue={field.value} disabled={!addressCountry}>
                            <FormControl><SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Select State" /></SelectTrigger></FormControl>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[200px]">
                              {addressStatesList.map(s => <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="addressCity" render={({ field }) => (
                        <FormItem>
                          <FormLabel>City / Town</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!addressState}>
                            <FormControl><SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Select City" /></SelectTrigger></FormControl>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[200px]">
                              {addressCitiesList.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="addressPincode" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input className="bg-slate-950 border-slate-800" {...field} onChange={e => {
                               e.target.value = e.target.value.replace(/\D/g, "");
                               field.onChange(e);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="addressStreet" render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-950 border-slate-800" placeholder="123 Business Rd, Floor 4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="pt-8 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Shipping Details</h3>
                        <Button type="button" variant="secondary" size="sm" onClick={copyBillingToShipping}>
                          <Download className="h-4 w-4 mr-2" /> Copy Billing Address
                        </Button>
                      </div>

                      {shippingArray.fields.map((field, index) => (
                        <div key={field.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg mb-4 relative group">
                          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-900/20" onClick={() => shippingArray.remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name={`shippingAddresses.${index}.country`} render={({ field }) => (
                              <FormItem><FormLabel>Country</FormLabel><FormControl><Input className="bg-slate-900 border-slate-800" {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name={`shippingAddresses.${index}.state`} render={({ field }) => (
                              <FormItem><FormLabel>State</FormLabel><FormControl><Input className="bg-slate-900 border-slate-800" {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name={`shippingAddresses.${index}.city`} render={({ field }) => (
                              <FormItem><FormLabel>City</FormLabel><FormControl><Input className="bg-slate-900 border-slate-800" {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name={`shippingAddresses.${index}.pincode`} render={({ field }) => (
                              <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input className="bg-slate-900 border-slate-800" {...field} /></FormControl></FormItem>
                            )} />
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => shippingArray.append({ country: "", state: "", city: "", pincode: "" })}>
                        <Plus className="h-4 w-4 mr-2"/> Have Multiple Shipping Addresses? Add Here
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("tax")}>Previous</Button>
                  <Button type="button" onClick={() => setActiveTab("details")}>Next Step</Button>
                </div>
              </TabsContent>

              {/* TAB 4: ADDITIONAL DETAILS */}
              <TabsContent value="details" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField control={form.control} name="alias" render={({ field }) => (
                        <FormItem><FormLabel>Alias / Nickname</FormLabel><FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="uid" render={({ field }) => (
                        <FormItem><FormLabel>UID (Auto-generated)</FormLabel><FormControl><Input className="bg-slate-950 border-slate-800 text-slate-500" disabled placeholder="Will be assigned upon save" {...field} /></FormControl></FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-6 items-end">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="showEmailInInvoice" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 mb-1 bg-slate-950 border border-slate-800 rounded-lg">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="font-normal cursor-pointer text-slate-300">Show Email in Invoice</FormLabel>
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-6 items-end">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Phone Number</FormLabel>
                          <div className="PhoneInputWrapper">
                            <PhoneInput defaultCountry="US" value={field.value} onChange={(v) => field.onChange(v || "")} className="w-full bg-slate-950 border-slate-800" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="showPhoneInInvoice" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 mb-1 bg-slate-950 border border-slate-800 rounded-lg">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="font-normal cursor-pointer text-slate-300">Show Phone in Invoice</FormLabel>
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                      <FormField control={form.control} name="paymentDueDays" render={({ field }) => (
                        <FormItem><FormLabel>Default Payment Due (Days)</FormLabel><FormControl><Input type="number" className="bg-slate-950 border-slate-800" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="paymentAccount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Account</FormLabel>
                          <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-slate-950 border-slate-800 opacity-50"><SelectValue placeholder="Coming Soon" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="none">None</SelectItem></SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="upiId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI ID</FormLabel>
                          <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-slate-950 border-slate-800 opacity-50"><SelectValue placeholder="Coming Soon" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="none">None</SelectItem></SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <FormLabel className="mb-2 block">Custom Fields</FormLabel>
                      {customFieldsArray.fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 mb-4">
                          <FormField control={form.control} name={`customFields.${index}.fieldName`} render={({ field }) => (
                            <FormItem className="flex-1"><FormControl><Input placeholder="Field Name (e.g. Birthday)" className="bg-slate-950 border-slate-800" {...field} /></FormControl></FormItem>
                          )} />
                          <FormField control={form.control} name={`customFields.${index}.fieldValue`} render={({ field }) => (
                            <FormItem className="flex-[2]"><FormControl><Input placeholder="Value" className="bg-slate-950 border-slate-800" {...field} /></FormControl></FormItem>
                          )} />
                          <Button type="button" variant="destructive" size="icon" onClick={() => customFieldsArray.remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => customFieldsArray.append({ fieldName: "", fieldValue: "" })} className="mt-2">
                        <Plus className="h-4 w-4 mr-2"/> Add Custom Field
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("address")}>Previous</Button>
                  <Button type="button" onClick={() => setActiveTab("contacts")}>Next Step</Button>
                </div>
              </TabsContent>

              {/* TAB 4.5: CONTACTS */}
              <TabsContent value="contacts" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">Linked Contacts (POCs)</h4>
                        <p className="text-sm text-slate-400">Add individuals associated with this client.</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => pocsArray.append({ firstName: "", lastName: "", email: "", phone: "" })}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {pocsArray.fields.map((field, index) => (
                        <div key={field.id} className="p-4 border border-slate-800 rounded-md bg-slate-950/50 space-y-4">
                          <div className="flex items-center justify-between">
                              <h5 className="text-sm font-medium text-white">Contact #{index + 1}</h5>
                              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => pocsArray.remove(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField control={form.control} name={`newPocs.${index}.firstName`} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                                  <FormControl><Input className="bg-slate-900 border-slate-800" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name={`newPocs.${index}.lastName`} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl><Input className="bg-slate-900 border-slate-800" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name={`newPocs.${index}.email`} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl><Input className="bg-slate-900 border-slate-800" type="email" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name={`newPocs.${index}.phone`} render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl><Input className="bg-slate-900 border-slate-800" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            </div>
                          </div>
                        ))}
                        {pocsArray.fields.length === 0 && (
                          <div className="text-center p-8 border border-dashed border-slate-800 rounded-md text-slate-500 text-sm">
                            No contacts added yet. Click "Add Contact" to link someone to this company.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>Previous</Button>
                    <Button type="button" onClick={() => setActiveTab("attachments")}>Next Step</Button>
                  </div>
                </TabsContent>

              {/* TAB 5: ATTACHMENTS */}
              <TabsContent value="attachments" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 space-y-6">
                    <FormLabel className="mb-2 block">Client Attachments & Documents</FormLabel>
                    <p className="text-sm text-slate-400 mb-4">Attach relevant documentation like NDAs, contracts, or tax exemption forms.</p>
                    {attachmentsArray.fields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 mb-4 items-center bg-slate-950 p-4 border border-slate-800 rounded-lg">
                        <LinkIcon className="h-5 w-5 text-slate-500" />
                        <FormField control={form.control} name={`attachments.${index}.name`} render={({ field }) => (
                          <FormItem className="flex-1"><FormControl><Input placeholder="Document Name" className="bg-slate-900 border-slate-800" {...field} /></FormControl></FormItem>
                        )} />
                        <div className="flex-[2] border-2 border-dashed border-slate-700 bg-slate-900 rounded-lg flex items-center justify-center p-2 cursor-pointer hover:border-slate-500 hover:bg-slate-800 transition">
                          <span className="text-xs text-slate-400 flex items-center"><Plus className="h-3 w-3 mr-1" /> Drop file here</span>
                        </div>
                        <Button type="button" variant="destructive" size="icon" onClick={() => attachmentsArray.remove(index)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => attachmentsArray.append({ name: "", url: "" })}>
                      <Plus className="h-4 w-4 mr-2"/> Add Attachment Field
                    </Button>
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>Previous</Button>
                  <Button type="button" onClick={() => setActiveTab("account")}>Next Step</Button>
                </div>
              </TabsContent>

              {/* TAB 6: ACCOUNT DETAILS */}
              <TabsContent value="account" className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 text-center py-12">
                    <p className="text-slate-400">Linked Account Details will appear here after creation.</p>
                  </CardContent>
                </Card>
                <div className="flex justify-between items-center">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("attachments")}>Previous</Button>
                  <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 min-w-[200px]" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Full Profile
                  </Button>
                </div>
              </TabsContent>

            </Tabs>
          </form>
        </Form>
      </div>
  );
}
