"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function SetupChecklist() {
  const { data: progress, isLoading } = api.onboarding.getSetupProgress.useQuery();

  if (isLoading || !progress) {
    return null;
  }

  if (progress.isFullyComplete) {
    return null; // Hide when complete
  }

  const steps = [
    {
      key: "profile",
      label: "Complete your profile",
      description: "Add your name and phone number in settings.",
      isComplete: progress.steps.profile,
      actionLink: "/dashboard/settings",
      actionText: "Go to Settings",
    },
    {
      key: "products",
      label: "Add your first product",
      description: "Create a product or service in your catalog to start quoting.",
      isComplete: progress.steps.products,
      actionLink: "/dashboard/catalog",
      actionText: "Add Product",
    },
    {
      key: "leads",
      label: "Create a lead",
      description: "Add a prospective client to your CRM.",
      isComplete: progress.steps.leads,
      actionLink: "/dashboard/crm",
      actionText: "Create Lead",
    },
  ];

  const completedCount = steps.filter((s) => s.isComplete).length;

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Getting Started</CardTitle>
        <CardDescription>
          Complete these essential steps to get the most out of DevCRM. ({completedCount}/{steps.length} completed)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {steps.map((step) => (
            <div key={step.key} className="flex items-start justify-between rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                {step.isComplete ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <h4 className={`text-sm font-semibold ${step.isComplete ? "line-through text-muted-foreground" : ""}`}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {!step.isComplete && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={step.actionLink}>{step.actionText}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
