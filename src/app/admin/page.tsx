import Link from "next/link";
import { auth } from "~/server/auth";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default async function AdminPage() {
  const session = await auth();

  return (
    <DashboardLayout
      userRole={session?.user?.systemRole || "SUPER_ADMIN"}
      userName={session?.user?.name || "Super Admin"}
      userEmail={session?.user?.email || "admin@devcrm.io"}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Super Admin Dashboard</h2>
          <p className="text-slate-400 text-sm">Manage global CRM subscription plans, client organizations, and billing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Companies</CardTitle>
              <CardDescription>Manage organization tenants & subscription status</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/organizations">
                <Button className="w-full">View Organizations</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Configure pricing tiers, user limits & features</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/plans">
                <Button className="w-full" variant="secondary">Manage Plans</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Revenue</CardTitle>
              <CardDescription>View global billing metrics & payment logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">$0.00 / mo</div>
              <p className="text-xs text-slate-500 mt-1">Active SaaS Subscriptions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
