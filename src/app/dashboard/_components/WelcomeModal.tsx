"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: status, refetch } = api.onboarding.getStatus.useQuery();
  const markSeen = api.onboarding.markWelcomeSeen.useMutation({
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    if (status && !status.hasSeenWelcome) {
      setIsOpen(true);
    }
  }, [status]);

  const handleClose = () => {
    setIsOpen(false);
    markSeen.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to DevCRM! 🎉</DialogTitle>
          <DialogDescription>
            We are thrilled to have you here. DevCRM is your all-in-one platform to manage your business operations, clients, and sales.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Get started by checking out your personalized setup checklist on the dashboard. It will guide you through creating your first products, leads, and configuring your profile.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Let's go!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
