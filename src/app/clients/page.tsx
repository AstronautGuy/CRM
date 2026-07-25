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
import { Users, Loader2 } from "lucide-react";

export default function ContactsPage() {
  const { data: companies, isLoading, refetch } = api.crm.getCompanies.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Clients</h2>
            <p className="text-slate-400 text-sm">Manage organization leads, customer accounts, and qualification status.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Import CSV</Button>
            <Button asChild>
              <Link href="/clients/new">+ Add Client</Link>
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
          <Input placeholder="Search contacts by name, email or job title..." className="max-w-md bg-slate-950 border-slate-800" />
          <Button variant="secondary" size="sm">Filter by Status</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
              </div>
            ) : companies?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-slate-900 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No companies found</h3>
                <p className="text-slate-400 max-w-sm mb-6">
                  Your customer database is currently empty. Add your first company to start building your CRM.
                </p>
                <Button asChild>
                  <Link href="/clients/new">Add Your First Client</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase bg-slate-950/50">
                    <tr>
                      <th className="p-3">Company Name</th>
                      <th className="p-3">Industry</th>
                      <th className="p-3">Country</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies?.map((company) => (
                      <tr key={company.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="p-3 font-medium text-white">{company.name}</td>
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
