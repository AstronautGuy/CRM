"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { api } from "~/trpc/react";
import { Loader2, Building2, Globe, FileText, MapPin, UserPlus } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import { PhoneInput } from "~/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";

const contactSchema = z.object({
  // Contact Info
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  contactPhone: z.union([
    z.literal(""),
    z.string().min(10, "Phone number must be at least 10 characters").refine((val) => {
      if (!val) return true;
      return isValidPhoneNumber(val);
    }, "Invalid phone number")
  ]).optional(),
  jobTitle: z.string().optional(),

  // Company Info (matches onboarding)
  name: z.string().min(1, "Company name is required"),
  teamSize: z.string().optional(),
  website: z.string().refine((val) => {
    if (!val) return true;
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    return urlPattern.test(val);
  }, "Must be a valid URL").optional(),
  phone: z.union([
    z.literal(""),
    z.string().min(10, "Phone number must be at least 10 characters").refine((val) => {
      if (!val) return true;
      return isValidPhoneNumber(val);
    }, "Invalid phone number")
  ]).optional(),
  country: z.string().optional(),
  currency: z.string().default("USD"),
  hasGst: z.boolean().default(false),
  gstin: z.string().optional(),
  businessPan: z.string().optional(),
  useCases: z.array(z.string()).default([]),
  businessType: z.string().optional(),
  addressStreet: z.string().optional(),
  addressState: z.string().optional(),
  addressCity: z.string().optional(),
  addressPincode: z.union([
    z.literal(""),
    z.string().regex(/^\d+$/, "Pincode must contain only numbers")
  ]).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function NewContactPage() {
  const router = useRouter();
  
  const createCompany = api.crm.createCompany.useMutation();
  const createContact = api.crm.createContact.useMutation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactPhone: "",
      jobTitle: "",
      name: "",
      teamSize: "",
      website: "",
      phone: "",
      country: "",
      currency: "USD",
      hasGst: false,
      gstin: "",
      businessPan: "",
      useCases: [],
      businessType: "service",
      addressStreet: "",
      addressState: "",
      addressCity: "",
      addressPincode: "",
    },
  });

  const { watch, setValue } = form;
  const currentCountry = watch("country");
  const currentState = watch("addressState");
  const hasGst = watch("hasGst");

  const countries = Country.getAllCountries();
  const states = currentCountry ? State.getStatesOfCountry(currentCountry as string) : [];
  const cities = currentState && currentCountry ? City.getCitiesOfState(currentCountry as string, currentState as string) : [];

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      // 1. Create Company
      const company = await createCompany.mutateAsync({
        name: data.name,
        domain: data.website,
        teamSize: data.teamSize,
        phone: data.phone,
        country: data.country,
        currency: data.currency,
        hasGst: data.hasGst,
        gstin: data.gstin,
        businessPan: data.businessPan,
        useCases: data.useCases.join(", "),
        businessType: data.businessType,
        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        addressState: data.addressState,
        addressPincode: data.addressPincode,
      });

      if (!company) throw new Error("Failed to create company");

      // 2. Create Contact linked to Company
      await createContact.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.contactPhone,
        jobTitle: data.jobTitle,
        companyId: company.id,
      });

      toast.success("Contact and Company created successfully!");
      router.push("/contacts");
    } catch (error) {
      toast.error("Failed to create contact");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUseCase = (useCase: string) => {
    const current = watch("useCases");
    if (current.includes(useCase)) {
      setValue("useCases", current.filter(u => u !== useCase));
    } else {
      setValue("useCases", [...current, useCase]);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Add New Contact</h2>
            <p className="text-slate-400 text-sm mt-1">Create a new contact and link them to an organization profile.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/contacts">Cancel</Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* CONTACT DETAILS SECTION */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <UserPlus className="h-5 w-5 text-blue-500"/> Personal Information
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Email *</FormLabel>
                      <FormControl><Input type="email" className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="jobTitle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="contactPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direct Phone</FormLabel>
                      <div className="PhoneInputWrapper">
                        <PhoneInput
                          defaultCountry="US"
                          value={field.value}
                          onChange={(v) => field.onChange(v || "")}
                          className="w-full bg-slate-950 border-slate-800"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {/* COMPANY DETAILS SECTION */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Building2 className="h-5 w-5 text-purple-500"/> Company Details
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="website" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <FormControl><Input className="pl-9 bg-slate-950 border-slate-800" placeholder="https://acme.com" {...field} /></FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="teamSize" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800">
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                          <SelectItem value="1-10">1 - 10 employees</SelectItem>
                          <SelectItem value="11-50">11 - 50 employees</SelectItem>
                          <SelectItem value="51-200">51 - 200 employees</SelectItem>
                          <SelectItem value="201+">201+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Phone</FormLabel>
                      <div className="PhoneInputWrapper">
                        <PhoneInput
                          defaultCountry="US"
                          value={field.value}
                          onChange={(v) => field.onChange(v || "")}
                          className="w-full bg-slate-950 border-slate-800"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="businessType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base mb-3 block">Business Type</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-2">
                          <Label htmlFor="t-service" className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-800 transition">
                            <RadioGroupItem value="service" id="t-service" />
                            <div>
                              <p className="font-medium text-white">Service Provider</p>
                              <p className="text-xs text-slate-400">Agencies, Consultants, Freelancers</p>
                            </div>
                          </Label>
                          <Label htmlFor="t-product" className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-800 transition">
                            <RadioGroupItem value="product" id="t-product" />
                            <div>
                              <p className="font-medium text-white">Product / SaaS</p>
                              <p className="text-xs text-slate-400">Software, physical products, e-commerce</p>
                            </div>
                          </Label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control as any} name="useCases" render={() => (
                    <FormItem>
                      <FormLabel className="text-base mb-3 block">Use Cases / Interests</FormLabel>
                      <div className="grid grid-cols-1 gap-2">
                        {["CRM / Contacts", "Invoicing", "Proposals / Quotes", "Project Management"].map(usecase => (
                          <div key={usecase} className="flex items-center space-x-2 bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
                            <Checkbox id={`uc-${usecase}`} checked={watch("useCases").includes(usecase)} onCheckedChange={() => toggleUseCase(usecase)} />
                            <Label htmlFor={`uc-${usecase}`} className="text-sm cursor-pointer">{usecase}</Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {/* REGION & TAX SECTION */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <FileText className="h-5 w-5 text-amber-500"/> Region & Tax
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={(v) => {
                        field.onChange(v);
                        setValue("addressState", "");
                        setValue("addressCity", "");
                      }} defaultValue={field.value}>
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
                  <FormField control={form.control as any} name="currency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800">
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control as any} name="hasGst" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold">Registered for GST / VAT?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />

                {hasGst && (
                  <div className="grid grid-cols-2 gap-6 p-4 bg-blue-950/20 border border-blue-900/30 rounded-lg animate-in fade-in zoom-in-95">
                    <FormField control={form.control as any} name="gstin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>GSTIN / Tax ID</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-950 border-slate-800 uppercase" placeholder="22AAAAA0000A1Z5" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control as any} name="businessPan" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business PAN / Reg No</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-950 border-slate-800 uppercase" placeholder="AAAAA0000A" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ADDRESS SECTION */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <MapPin className="h-5 w-5 text-emerald-500"/> Location Details
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="addressState" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <Select onValueChange={(v) => {
                        field.onChange(v);
                        setValue("addressCity", "");
                      }} defaultValue={field.value} disabled={!currentCountry}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[200px]">
                          {states.map(s => (
                            <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="addressCity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City / Town</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!currentState}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950 border-slate-800">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[200px]">
                          {cities.map(c => (
                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control as any} name="addressPincode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode / Zip</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="addressStreet" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl><Input className="bg-slate-950 border-slate-800" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4 pb-12">
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 min-w-[200px]" disabled={isSubmitting}>
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
