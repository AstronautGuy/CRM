"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { FileUploadDropzone } from "~/components/ui/file-upload-dropzone";
import { Separator } from "~/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

const orgSchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  industry: z.string().optional(),
  currency: z.string().optional(),
  logoUrl: z.string().optional(),
});

type OrgFormValues = z.infer<typeof orgSchema>;

export default function SettingsOrganizationPage() {
  const { data: orgData, isLoading, error, refetch } = api.settings.getOrganizationSettings.useQuery(undefined, {
    retry: false, // Don't retry if forbidden
  });
  
  const updateOrgMutation = api.settings.updateOrganization.useMutation({
    onSuccess: () => {
      toast.success("Organization updated successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(`Error updating organization: ${err.message}`);
    },
  });

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      industry: "",
      currency: "USD",
      logoUrl: "",
    },
    values: orgData?.organization ? {
      name: orgData.organization.name ?? "",
      industry: orgData.organization.industry ?? "",
      currency: orgData.organization.currency ?? "USD",
      logoUrl: orgData.organization.logoUrl ?? "",
    } : undefined,
  });

  if (isLoading) {
    return <div className="flex justify-center p-8 text-muted-foreground">Loading organization...</div>;
  }

  // Handle unauthorized view
  if (error?.data?.code === "FORBIDDEN") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Organization Settings</h3>
          <p className="text-sm text-muted-foreground">Manage company profile</p>
        </div>
        <Separator />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You must be an OWNER or ADMIN to view and modify organization settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const onSubmit = (data: OrgFormValues) => {
    updateOrgMutation.mutate(data);
  };

  const handleLogoUpload = (url: string) => {
    form.setValue("logoUrl", url, { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Organization</h3>
        <p className="text-sm text-muted-foreground">
          Manage your company profile and primary operational details.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Update your tenant&apos;s primary information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="Software, Retail, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="sm:w-1/3">
                  <FormLabel className="mb-2 block">Company Logo</FormLabel>
                  <FileUploadDropzone 
                    folder="logos"
                    onUploadSuccess={handleLogoUpload}
                  />
                  {form.watch("logoUrl") && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Current Logo:</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={form.watch("logoUrl")} 
                        alt="Company Logo" 
                        className="max-w-[150px] max-h-[150px] object-contain border rounded-md bg-white p-2" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateOrgMutation.isPending || !form.formState.isDirty}
                >
                  {updateOrgMutation.isPending ? "Saving..." : "Save Organization"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
