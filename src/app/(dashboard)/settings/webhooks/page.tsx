"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

export default function WebhooksPage() {
  const { data, isLoading, error } = api.webhooks.getAppPortalUrl.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="space-y-6 h-[calc(100vh-200px)]">
      <div>
        <h3 className="text-lg font-medium">Outbound Webhooks</h3>
        <p className="text-sm text-muted-foreground">
          Configure webhook endpoints to receive real-time events from your CRM (powered by Svix).
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Provisioning Webhooks Portal...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-md border border-destructive/50 bg-destructive/10 text-destructive">
          <p className="font-medium">Failed to load webhooks portal.</p>
          <p className="text-sm opacity-80">{error.message}</p>
        </div>
      ) : data?.url ? (
        <div className="h-full w-full overflow-hidden rounded-md border">
          <iframe
            src={data.url}
            className="h-full w-full border-0"
            title="Svix Webhooks Portal"
            allow="clipboard-write"
          />
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">Could not generate portal URL.</p>
        </div>
      )}
    </div>
  );
}
