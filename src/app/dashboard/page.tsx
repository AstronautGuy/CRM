"use client";

import React, { useState } from "react";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { useDashboardStore } from "~/store/dashboard-store";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Users, Briefcase, FileText, CheckSquare, Settings2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "~/components/ui/badge";
import { useTour } from "~/hooks/use-tour";
import { WelcomeModal } from "./_components/WelcomeModal";
import { SetupChecklist } from "./_components/SetupChecklist";
function KPICard({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = api.dashboard.getMetrics.useQuery();
  const { data: activity } = api.dashboard.getRecentActivity.useQuery();
  const { data: onboardingStatus } = api.onboarding.getStatus.useQuery();
  const { data: reportingData, isLoading: reportingLoading } = api.reporting.getDashboardMetrics.useQuery();
  
  const { widgets, toggleWidget, resetLayout } = useDashboardStore();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const dashboardTourSteps = [
    { element: "#tour-checklist", popover: { title: "Setup Checklist", description: "This is your getting started checklist. Complete these to set up your CRM.", side: "bottom" } },
    { element: "#tour-customize", popover: { title: "Customize Layout", description: "You can toggle widgets on and off to personalize your dashboard view.", side: "bottom" } },
  ];
  const { startTour, forceStartTour } = useTour(dashboardTourSteps, "dashboard");

  // Run on mount
  React.useEffect(() => {
    // Slight delay so DOM has time to render
    const t = setTimeout(() => startTour(), 500);
    return () => clearTimeout(t);
  }, []);

  const renderWidget = (id: string) => {
    switch (id) {
      case "kpi-contacts":
        return <KPICard title="Total Contacts" value={metricsLoading ? "..." : metrics?.totalContacts ?? 0} icon={Users} />;
      case "kpi-pipeline":
        return <KPICard title="Active Pipeline" value={metricsLoading ? "..." : `$${((metrics?.activePipelineValue ?? 0) / 100).toFixed(2)}`} icon={Briefcase} />;
      case "kpi-invoices":
        return <KPICard title="Unpaid Invoices" value={metricsLoading ? "..." : metrics?.unpaidInvoices ?? 0} icon={FileText} />;
      case "kpi-tasks":
        return <KPICard title="Tasks Due" value={metricsLoading ? "..." : metrics?.tasksDue ?? 0} icon={CheckSquare} />;
      case "chart-pipeline":
        const chartData = reportingData?.chartData || [];
        return (
          <Card className="col-span-full md:col-span-2 h-96">
            <CardHeader>
              <CardTitle>Revenue Forecast vs Actual</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--card-foreground))'}} />
                  <Bar dataKey="revenue" name="Actual Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expected" name="Forecast" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case "table-activity":
        return (
          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activity?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                <div className="space-y-4">
                  {activity?.map((task) => (
                    <div key={task.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={task.status === "COMPLETED" ? "success" : "secondary"}>
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <WelcomeModal />
        <div id="tour-checklist">
          <SetupChecklist />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Advanced Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights across your organization.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={forceStartTour}>
              Take a Tour
            </Button>
            <Popover open={customizeOpen} onOpenChange={setCustomizeOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="tour-customize">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Customize Layout
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Dashboard Widgets</h4>
                  <div className="flex flex-col gap-2">
                    {widgets.map((w) => (
                      <div key={w.id} className="flex items-center justify-between">
                        <span className="text-sm">{w.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleWidget(w.id)}
                          className={w.visible ? "text-emerald-500" : "text-slate-400"}
                        >
                          {w.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full text-xs" onClick={resetLayout}>
                    Reset Layout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Dynamic Legacy Widgets */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {widgets.filter((w) => w.id.startsWith("kpi-") && w.visible).map((w) => (
            <React.Fragment key={w.id}>
              {renderWidget(w.id)}
            </React.Fragment>
          ))}
          {/* New Advanced Reporting KPIs */}
          <KPICard title="Total Revenue" value={reportingLoading ? "..." : `$${((reportingData?.financials.totalRevenue ?? 0) / 100).toFixed(2)}`} icon={FileText} />
          <KPICard title="Outstanding Balance" value={reportingLoading ? "..." : `$${((reportingData?.financials.outstandingBalance ?? 0) / 100).toFixed(2)}`} icon={ArrowDown} />
          <KPICard title="Sales Win Rate" value={reportingLoading ? "..." : `${(reportingData?.sales.winRate ?? 0).toFixed(1)}%`} icon={CheckSquare} />
          <KPICard title="Marketing CPL" value={reportingLoading ? "..." : `$${((reportingData?.marketing.cpl ?? 0) / 100).toFixed(2)}`} icon={ArrowUp} />
        </div>

        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
          {widgets.filter((w) => !w.id.startsWith("kpi-") && w.visible).map((w) => (
            <React.Fragment key={w.id}>
              {renderWidget(w.id)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
