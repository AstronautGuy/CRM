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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { api } from "~/trpc/react";
import { Loader2, Plus, Trash2, UploadCloud, User } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";

const newContactSchema = z.object({
  // Basic Info
  companyId: z.string().optional(),
  avatarUrl: z.string().optional(),
  salutation: z.string().optional(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  
  // Contact Info
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  additionalEmails: z.array(z.object({ email: z.string().email("Invalid email") })).default([]),
  additionalPhones: z.array(z.object({ phone: z.string() })).default([]),

  // Tax Info
  pan: z.union([
    z.literal(""),
    z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g. AAAAA0000A)")
  ]).optional(),
  aadhaar: z.union([
    z.literal(""),
    z.string().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits")
  ]).optional(),
  passport: z.union([
    z.literal(""),
    z.string().regex(/^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/, "Invalid Passport format")
  ]).optional(),

  // Social Profiles
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url("Must be a valid URL")
  })).default([]),

  // Address
  addressCountry: z.string().optional(),
  addressState: z.string().optional(),
  addressDistrict: z.string().optional(),
  addressCity: z.string().optional(),
  addressBuilding: z.string().optional(),
  addressStreet: z.string().optional(),
  addressZip: z.string().optional(),
});

type NewContactValues = z.infer<typeof newContactSchema>;

export default function NewContactFullPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: companies } = api.crm.getCompanies.useQuery();
  const createContact = api.crm.createContact.useMutation();

  const form = useForm<NewContactValues>({
    resolver: zodResolver(newContactSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      additionalEmails: [],
      additionalPhones: [],
      socialLinks: [],
      addressCountry: "IN",
      addressState: "",
      addressCity: "",
      addressStreet: "",
      addressZip: "",
      pan: "",
      aadhaar: "",
      passport: "",
    }
  });

  const { control, watch } = form;
  const additionalEmailsArray = useFieldArray({ control, name: "additionalEmails" });
  const additionalPhonesArray = useFieldArray({ control, name: "additionalPhones" });
  const socialsArray = useFieldArray({ control, name: "socialLinks" });

  const addressCountry = watch("addressCountry");
  const addressState = watch("addressState");
  const countries = Country.getAllCountries();
  const states = addressCountry ? State.getStatesOfCountry(addressCountry) : [];
  const cities = addressState && addressCountry ? City.getCitiesOfState(addressCountry, addressState) : [];

  const onSubmit = async (data: NewContactValues) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        ...data,
        companyId: data.companyId && data.companyId !== "none" ? data.companyId : undefined,
      };

      await createContact.mutateAsync(payload);
      toast.success("Contact created successfully!");
      // We don't have a /contacts page yet, so just go back or to clients
      router.push("/clients");
    } catch (e: any) {
      toast.error(e.message || "Failed to create contact");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nameInitial = watch("firstName") ? watch("firstName").charAt(0).toUpperCase() : "?";

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">New Contact</h2>
            <p className="text-slate-400 mt-1">Create a new independent contact or point of contact (POC).</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/clients">Cancel</Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
            
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row gap-6">
                  <div className="h-24 w-24 rounded-full border-2 border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition relative overflow-hidden group">
                    <span className="text-3xl font-bold text-slate-500 group-hover:opacity-0 transition">{nameInitial}</span>
                    <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-300">Upload DP</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <FormField control={form.control} name="companyId" render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Linked Client (Company) - Optional</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-950 border-slate-800">
                              <SelectValue placeholder="Select a company (or leave blank for individual)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[300px]">
                            <SelectItem value="none">None (Individual Contact)</SelectItem>
                            {companies?.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="salutation" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salutation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-950 border-slate-800">
                              <SelectValue placeholder="e.g. Mr, Mrs, Dr" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="Mr.">Mr.</SelectItem>
                            <SelectItem value="Mrs.">Mrs.</SelectItem>
                            <SelectItem value="Ms.">Ms.</SelectItem>
                            <SelectItem value="Dr.">Dr.</SelectItem>
                            <SelectItem value="Prof.">Prof.</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="hidden sm:block"></div>

                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Contact Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Email</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="space-y-3">
                  <Label>Additional Emails</Label>
                  {additionalEmailsArray.fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <FormField control={form.control} name={`additionalEmails.${index}.email`} render={({ field: f }) => (
                        <FormItem className="flex-1">
                          <FormControl><Input className="bg-slate-950 border-slate-800" type="email" placeholder="Another email" {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => additionalEmailsArray.remove(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => additionalEmailsArray.append({ email: "" })}><Plus className="h-3 w-3 mr-1"/> Add Email</Button>
                </div>

                <div className="space-y-3">
                  <Label>Additional Phones</Label>
                  {additionalPhonesArray.fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <FormField control={form.control} name={`additionalPhones.${index}.phone`} render={({ field: f }) => (
                        <FormItem className="flex-1">
                          <FormControl><Input className="bg-slate-950 border-slate-800" placeholder="Another phone" {...f} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => additionalPhonesArray.remove(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => additionalPhonesArray.append({ phone: "" })}><Plus className="h-3 w-3 mr-1"/> Add Phone</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Tax & Identification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="pan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800 uppercase" placeholder="ABCDE1234F" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="aadhaar" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Number</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" placeholder="123456789012" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="passport" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Number</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800 uppercase" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Social Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialsArray.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <FormField control={form.control} name={`socialLinks.${index}.platform`} render={({ field: f }) => (
                      <FormItem className="w-[150px]">
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Platform" /></SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="twitter">X (Twitter)</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="github">GitHub</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`socialLinks.${index}.url`} render={({ field: f }) => (
                      <FormItem className="flex-1">
                        <FormControl><Input className="bg-slate-950 border-slate-800" placeholder="https://..." {...f} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => socialsArray.remove(index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => socialsArray.append({ platform: "linkedin", url: "" })}><Plus className="h-3 w-3 mr-1"/> Add Profile</Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Address Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="addressCountry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Select Country" /></SelectTrigger>
                        </FormControl>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!addressCountry}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Select State" /></SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[200px]">
                          {states.map(s => <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="addressDistrict" render={({ field }) => (
                    <FormItem>
                      <FormLabel>District (Optional)</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="addressCity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!addressState}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800"><SelectValue placeholder="Select City" /></SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[200px]">
                          {cities.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="addressBuilding" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building / Suite</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="addressZip" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip / Pincode</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="mt-4">
                  <FormField control={form.control} name="addressStreet" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" placeholder="e.g. 123 Main St" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/clients">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-40" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Contact
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}
