"use client";

import React, { useState } from "react";
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

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const preferencesSchema = z.object({
  theme: z.string(),
  locale: z.string(),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export default function SettingsProfilePage() {
  const { data: profileData, isLoading, refetch } = api.settings.getProfile.useQuery();
  
  const updateProfileMutation = api.settings.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(`Error updating profile: ${err.message}`);
    },
  });

  const updatePreferencesMutation = api.settings.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferences updated successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(`Error updating preferences: ${err.message}`);
    },
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      image: "",
    },
    values: profileData ? {
      name: profileData.user.name ?? "",
      phone: profileData.user.phone ?? "",
      image: profileData.user.image ?? "",
    } : undefined,
  });

  const prefForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: "light",
      locale: "en-US",
    },
    values: profileData?.settings ? {
      theme: profileData.settings.theme ?? "light",
      locale: profileData.settings.locale ?? "en-US",
    } : undefined,
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const onPrefSubmit = (data: PreferencesFormValues) => {
    updatePreferencesMutation.mutate(data);
  };

  const handleAvatarUpload = (url: string) => {
    profileForm.setValue("image", url, { shouldDirty: true });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8 text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and public avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" value={profileData?.user.email ?? ""} disabled />
                    </FormControl>
                    <FormDescription>
                      Your email address cannot be changed here.
                    </FormDescription>
                  </FormItem>

                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="sm:w-1/3">
                  <FormLabel className="mb-2 block">Avatar Image</FormLabel>
                  <FileUploadDropzone 
                    bucketPath="avatars"
                    onUploadComplete={handleAvatarUpload}
                  />
                  {profileForm.watch("image") && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Current Avatar:</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={profileForm.watch("image")} 
                        alt="Avatar preview" 
                        className="w-24 h-24 rounded-full object-cover border" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending || !profileForm.formState.isDirty}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your app preferences and defaults.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...prefForm}>
            <form onSubmit={prefForm.handleSubmit(onPrefSubmit)} className="space-y-6">
              
              <FormField
                control={prefForm.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the theme for the dashboard.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={prefForm.control}
                name="locale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locale</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a locale" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en-US">English (United States)</SelectItem>
                        <SelectItem value="en-IN">English (India)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This dictates number and date formatting across the app.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updatePreferencesMutation.isPending || !prefForm.formState.isDirty}
                >
                  {updatePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
