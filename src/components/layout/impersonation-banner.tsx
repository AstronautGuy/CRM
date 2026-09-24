"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export function ImpersonationBanner({ impersonatedOrgId }: { impersonatedOrgId: string }) {
  const router = useRouter();
  const stopImpersonation = api.superadmin.stopImpersonation.useMutation({
    onSuccess: () => {
      router.push("/admin/organizations");
      router.refresh();
    }
  });

  return (
    <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-sm font-medium z-50 relative shadow-md">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4" />
        <span>You are currently impersonating an organization ({impersonatedOrgId}). All actions are being performed as this organization.</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-600 bg-white hover:bg-zinc-100 hover:text-red-700 border-0 shadow-sm"
        onClick={() => stopImpersonation.mutate()}
        disabled={stopImpersonation.isPending}
      >
        {stopImpersonation.isPending ? "Stopping..." : "Stop Impersonating"}
      </Button>
    </div>
  );
}
