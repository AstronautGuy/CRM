"use client";

import React, { useState } from "react";
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
  const { data: contacts, isLoading, refetch } = api.crm.getContacts.useQuery();
  const createContact = api.crm.createContact.useMutation({
    onSuccess: () => {
      refetch();
      setModalOpen(false);
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContact.mutate({
      ...formData,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Contacts & Leads</h2>
            <p className="text-slate-400 text-sm">Manage organization leads, customer contacts, and qualification status.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Import CSV</Button>
            
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button>+ Add Contact</Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Contact</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        required
                        className="bg-slate-950 border-slate-800"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        required
                        className="bg-slate-950 border-slate-800"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="bg-slate-950 border-slate-800"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      className="bg-slate-950 border-slate-800"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData(prev => ({...prev, jobTitle: e.target.value}))}
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={createContact.isPending}>
                    {createContact.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Contact
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        <div className="flex gap-4 items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
          <Input placeholder="Search contacts by name, email or job title..." className="max-w-md bg-slate-950 border-slate-800" />
          <Button variant="secondary" size="sm">Filter by Status</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
              </div>
            ) : contacts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-slate-900 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No contacts found</h3>
                <p className="text-slate-400 max-w-sm mb-6">
                  Your customer database is currently empty. Add your first contact to start building your CRM.
                </p>
                <Button onClick={() => setModalOpen(true)}>Add Your First Contact</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase bg-slate-950/50">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Job Title</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts?.map((contact) => (
                      <tr key={contact.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="p-3 font-medium text-white">{contact.firstName} {contact.lastName}</td>
                        <td className="p-3">{contact.email}</td>
                        <td className="p-3">
                          <Badge variant={contact.status === "QUALIFIED" ? "success" : "secondary"}>
                            {contact.status}
                          </Badge>
                        </td>
                        <td className="p-3">{contact.jobTitle || "-"}</td>
                        <td className="p-3 text-right">
                          <Button size="sm" variant="ghost">View Profile</Button>
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
