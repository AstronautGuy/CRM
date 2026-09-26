"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Building, Users, DollarSign, Activity } from "lucide-react";

function MetricCard({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: any, description?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function SuperAdminPage() {
  const { data: health, isLoading } = api.superadmin.getPlatformHealth.useQuery();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">High-level metrics across all DevCRM tenants.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Organizations" 
          value={isLoading ? "..." : health?.totalOrganizations ?? 0} 
          icon={Building} 
          description="Active tenants on the platform"
        />
        <MetricCard 
          title="Total Users" 
          value={isLoading ? "..." : health?.totalUsers ?? 0} 
          icon={Users} 
          description="Global registered users"
        />
        <MetricCard 
          title="Global Processed Volume" 
          value={isLoading ? "..." : `$${((health?.globalRevenue ?? 0) / 100).toFixed(2)}`} 
          icon={DollarSign} 
          description="Total invoice volume processed"
        />
        <MetricCard 
          title="System Error Rate" 
          value={isLoading ? "..." : health?.errorRate ?? "0%"} 
          icon={Activity} 
          description={`${health?.activeSessions ?? 0} Active Sessions`}
        />
      </div>
    </div>
  );
}
