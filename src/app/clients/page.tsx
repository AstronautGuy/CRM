"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Users, Loader2, Plus, Info } from "lucide-react";
import { EmptyState } from "~/components/ui/empty-state";
import { InfoTooltip } from "~/components/ui/tooltip-info";
import { useTour } from "~/hooks/use-tour";

export default function ContactsPage() {
  const { data: companies, isLoading, refetch } = api.crm.getCompanies.useQuery();

  const crmTourSteps = [
    { element: "#tour-add-client", popover: { title: "Add Client", description: "Click here to add a new organization or contact to your CRM.", side: "bottom" } },
    { element: "#tour-search", popover: { title: "Search & Filter", description: "Use this search bar to quickly find clients by name or email.", side: "bottom" } },
  ];
  const { startTour, forceStartTour } = useTour(crmTourSteps, "crm");

  React.useEffect(() => {
    const t = setTimeout(() => startTour(), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Clients</h2>
            <p className="text-muted-foreground text-sm">Manage organization leads, customer accounts, and qualification status.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={forceStartTour}>
              <Info className="w-4 h-4 mr-2" /> Tour this page
            </Button>
            <Button variant="outline">Import CSV</Button>
            <Button asChild id="tour-add-client">
              <Link href="/clients/new">+ Add Client</Link>
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center bg-card p-4 rounded-xl border border-border shadow-sm" id="tour-search">
          <Input placeholder="Search contacts by name, email or job title..." className="max-w-md bg-background border-border" />
          <Button variant="secondary" size="sm">Filter by Status</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : companies?.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No clients found"
                description="Your customer database is currently empty. Add your first company to start building your CRM."
                action={
                  <Button asChild>
                    <Link href="/clients/new">
                      <Plus className="mr-2 h-4 w-4" /> Add Your First Client
                    </Link>
                  </Button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-foreground">
                  <thead className="border-b border-border text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="p-3">Company Name</th>
                      <th className="p-3">
                        Industry
                        <InfoTooltip content="The primary market or vertical this client operates in." />
                      </th>
                      <th className="p-3">Country</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies?.map((company) => (
                      <tr key={company.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-3 font-medium text-foreground">{company.name}</td>
                        <td className="p-3">{company.industry || "-"}</td>
                        <td className="p-3">{company.country || "-"}</td>
                        <td className="p-3 text-right">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/clients/${company.id}`}>View Profile</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
