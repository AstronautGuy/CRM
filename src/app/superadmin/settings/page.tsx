"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

export default function GlobalSettingsPage() {
  const utils = api.useUtils();
  const { data: settings, isLoading } = api.superadmin.getGlobalSettings.useQuery();

  const updateSettings = api.superadmin.updateGlobalSettings.useMutation({
    onSuccess: () => {
      toast.success("Global settings updated");
      utils.superadmin.getGlobalSettings.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="p-8">Loading global settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Global Settings</h1>
        <p className="text-muted-foreground mt-1">Platform-wide configuration and feature flags.</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>Changes here affect all organizations on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Prevents non-superadmins from accessing the platform.
              </p>
            </div>
            <Switch 
              checked={settings?.maintenanceMode ?? false}
              onCheckedChange={(checked) => updateSettings.mutate({ maintenanceMode: checked })}
              disabled={updateSettings.isPending}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Beta Features</Label>
              <p className="text-sm text-muted-foreground">
                Roll out experimental features to all active tenants.
              </p>
            </div>
            <Switch 
              checked={settings?.enableBetaFeatures ?? false}
              onCheckedChange={(checked) => updateSettings.mutate({ enableBetaFeatures: checked })}
              disabled={updateSettings.isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
