"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";
import { Loader2, Building2, Globe, Phone, FileText, CheckCircle2 } from "lucide-react";
import { Country, State, City } from 'country-state-city';

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  
  const completeOnboarding = api.onboarding.completeOnboarding.useMutation({
    onSuccess: () => {
      window.location.reload();
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    teamSize: "",
    website: "",
    phone: "",
    countryCode: "+1",
    country: "",
    currency: "USD",
    hasGst: false,
    gstin: "",
    businessPan: "",
    useCases: [] as string[],
    businessType: "service",
    addressStreet: "",
    addressState: "",
    addressCity: "",
    addressPincode: "",
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    completeOnboarding.mutate(formData, {
      onError: () => setIsLoading(false)
    });
  };

  const handleMockOtp = () => {
    if (!formData.phone) return;
    setOtpSent(true);
    setTimeout(() => {
      setOtpVerified(true);
    }, 1500);
  };

  const handleMockGst = () => {
    if (!formData.gstin) return;
    setIsLoading(true);
    setTimeout(() => {
      setGstVerified(true);
      setIsLoading(false);
    }, 1500);
  };

  const toggleUseCase = (useCase: string) => {
    setFormData(prev => ({
      ...prev,
      useCases: prev.useCases.includes(useCase)
        ? prev.useCases.filter(u => u !== useCase)
        : [...prev.useCases, useCase]
    }));
  };

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
  const cities = formData.addressState ? City.getCitiesOfState(formData.country, formData.addressState) : [];

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      {/* closeable={false} essentially, by overriding onOpenChange */}
      <DialogContent className="sm:max-w-[700px] bg-slate-900 border-slate-800 text-white max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">Welcome to DevCRM</DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            Let's set up your workspace. This will only take a minute.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mb-8 mt-4">
          <div className="flex items-center space-x-4">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-800'}`} />
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-800'}`} />
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</div>
          </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-semibold border-b border-slate-800 pb-2 flex items-center gap-2"><Building2 className="h-5 w-5"/> Basic Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Legal Company Name *</Label>
                  <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-slate-950 border-slate-800" placeholder="Acme Corp LLC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Brand / Display Name</Label>
                  <Input id="displayName" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="bg-slate-950 border-slate-800" placeholder="Acme" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Team Size *</Label>
                  <Select required value={formData.teamSize} onValueChange={(v) => setFormData({...formData, teamSize: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="1-10">1 - 10 employees</SelectItem>
                      <SelectItem value="11-50">11 - 50 employees</SelectItem>
                      <SelectItem value="51-200">51 - 200 employees</SelectItem>
                      <SelectItem value="201+">201+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input id="website" className="pl-9 bg-slate-950 border-slate-800" placeholder="https://acme.com" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <div className="flex gap-2">
                  <Select value={formData.countryCode} onValueChange={(v) => setFormData({...formData, countryCode: v})}>
                    <SelectTrigger className="w-[120px] bg-slate-950 border-slate-800">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white h-[200px]">
                      {countries.slice(0,20).map(c => (
                        <SelectItem key={c.isoCode} value={`+${c.phonecode}`}>{c.isoCode} (+{c.phonecode})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input required className="pl-9 bg-slate-950 border-slate-800" placeholder="Enter phone number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={otpVerified} />
                  </div>
                  {!otpVerified ? (
                    <Button type="button" variant="secondary" onClick={handleMockOtp} disabled={!formData.phone || otpSent}>
                      {otpSent ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                    </Button>
                  ) : (
                    <Button type="button" variant="default" className="bg-emerald-600 hover:bg-emerald-700" disabled>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Verified
                    </Button>
                  )}
                </div>
                {otpSent && !otpVerified && <p className="text-xs text-blue-400">Mock: Sending OTP... Auto-verifying in 1.5s.</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-semibold border-b border-slate-800 pb-2 flex items-center gap-2"><FileText className="h-5 w-5"/> Region & Tax</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select required value={formData.country} onValueChange={(v) => setFormData({...formData, country: v, addressState: "", addressCity: ""})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[300px]">
                      {countries.map(c => (
                        <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency *</Label>
                  <Select required value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <Switch id="has-gst" checked={formData.hasGst} onCheckedChange={(c) => setFormData({...formData, hasGst: c})} />
                <Label htmlFor="has-gst" className="font-semibold cursor-pointer">Do you have a GST Number?</Label>
              </div>

              {formData.hasGst && (
                <div className="space-y-4 p-4 bg-blue-950/20 border border-blue-900/30 rounded-lg animate-in fade-in zoom-in-95">
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN Number *</Label>
                    <div className="flex gap-2">
                      <Input id="gstin" required={formData.hasGst} className="bg-slate-950 border-slate-800 uppercase" placeholder="22AAAAA0000A1Z5" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value.toUpperCase()})} />
                      <Button type="button" variant="secondary" onClick={handleMockGst} disabled={!formData.gstin || gstVerified || isLoading}>
                        {isLoading && !gstVerified ? <Loader2 className="h-4 w-4 animate-spin" /> : gstVerified ? "Verified" : "Check GST"}
                      </Button>
                    </div>
                    {gstVerified && <p className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> GST Details Verified</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">Business PAN</Label>
                    <Input id="pan" className="bg-slate-950 border-slate-800 uppercase" placeholder="AAAAA0000A" value={formData.businessPan} onChange={e => setFormData({...formData, businessPan: e.target.value.toUpperCase()})} />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-semibold border-b border-slate-800 pb-2">Address & Business Profile</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>State / Province *</Label>
                  <Select required disabled={!formData.country} value={formData.addressState} onValueChange={(v) => setFormData({...formData, addressState: v, addressCity: ""})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[200px]">
                      {states.map(s => (
                        <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City / Town *</Label>
                  <Select required disabled={!formData.addressState} value={formData.addressCity} onValueChange={(v) => setFormData({...formData, addressCity: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[200px]">
                      {cities.map(c => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode / Zip *</Label>
                  <Input id="pincode" required className="bg-slate-950 border-slate-800" value={formData.addressPincode} onChange={e => setFormData({...formData, addressPincode: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input id="street" required className="bg-slate-950 border-slate-800" value={formData.addressStreet} onChange={e => setFormData({...formData, addressStreet: e.target.value})} />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label>What will you use this for? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["CRM / Contacts", "Invoicing", "Proposals / Quotes", "Project Management"].map(usecase => (
                    <div key={usecase} className="flex items-center space-x-2 bg-slate-950 border border-slate-800 p-2 rounded-md">
                      <Checkbox id={`uc-${usecase}`} checked={formData.useCases.includes(usecase)} onCheckedChange={() => toggleUseCase(usecase)} />
                      <Label htmlFor={`uc-${usecase}`} className="text-sm cursor-pointer">{usecase}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label>What best describes your business?</Label>
                <RadioGroup value={formData.businessType} onValueChange={v => setFormData({...formData, businessType: v})}>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="t-service" className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-900 transition">
                      <RadioGroupItem value="service" id="t-service" />
                      <div>
                        <p className="font-medium text-white">Service Provider</p>
                        <p className="text-xs text-slate-400">Agencies, Consultants, Freelancers</p>
                      </div>
                    </Label>
                    <Label htmlFor="t-product" className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-900 transition">
                      <RadioGroupItem value="product" id="t-product" />
                      <div>
                        <p className="font-medium text-white">Product / SaaS</p>
                        <p className="text-xs text-slate-400">Software, physical products, e-commerce</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={handlePrev} disabled={step === 1 || isLoading}>
              Back
            </Button>
            {step < 3 ? (
              <Button type="submit">
                Continue
              </Button>
            ) : (
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading || completeOnboarding.isPending}>
                {(isLoading || completeOnboarding.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Onboarding
              </Button>
            )}
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}
