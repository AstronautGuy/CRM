import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default async function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Super Admin Dashboard</h2>
        <p className="text-zinc-400 text-sm">Manage global CRM subscription plans, client organizations, and billing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Client Companies</CardTitle>
            <CardDescription className="text-zinc-400">Manage organization tenants & subscription status</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/organizations">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0">View Organizations</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Global Users</CardTitle>
            <CardDescription className="text-zinc-400">Manage users across all tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription className="text-zinc-400">Configure pricing tiers, user limits & features</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/plans">
              <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-0" variant="secondary">Manage Plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
