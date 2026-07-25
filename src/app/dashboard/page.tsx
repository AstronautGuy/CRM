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
import { useEffect } from "react";
import { ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { defaultWidgets } from "~/store/dashboard-store";

function KPICard({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) {
  return (
    <Card className="h-full flex flex-col group relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2 cursor-move border-b border-transparent group-hover:border-slate-800 transition-colors">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = api.dashboard.getMetrics.useQuery();
  const { data: activity } = api.dashboard.getRecentActivity.useQuery();
  const { data: onboardingStatus, isLoading: onboardingLoading } = api.onboarding.getStatus.useQuery();
  
  const { widgets, toggleWidget, updateLayout, resetLayout } = useDashboardStore();

  useEffect(() => {
    if (!onboardingLoading && onboardingStatus?.onboardingComplete === false) {
      toast("Signup successful! Onboarding pending.", {
        description: "Click here to complete setup.",
        action: {
          label: "Complete Onboarding",
          onClick: () => window.location.href = "/onboarding",
        },
        duration: 8000,
      });
    }
  }, [onboardingLoading, onboardingStatus]);

  const [customizeOpen, setCustomizeOpen] = useState(false);

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
        // Mock data for MVP chart
        const chartData = [
          { name: "New", value: 400 },
          { name: "Qualified", value: 300 },
          { name: "Proposal", value: 200 },
          { name: "Negotiation", value: 100 },
        ];
        return (
          <Card className="h-full flex flex-col">
            <CardHeader className="cursor-move border-b border-slate-800 pb-2 mb-4">
              <CardTitle>Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case "table-activity":
        return (
          <Card className="h-full flex flex-col">
            <CardHeader className="cursor-move border-b border-slate-800 pb-2 mb-4">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-auto">
              {activity?.length === 0 ? (
                <p className="text-sm text-slate-500">No recent activity.</p>
              ) : (
                <div className="space-y-4">
                  {activity?.map((task) => (
                    <div key={task.id} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-white">{task.title}</p>
                        <p className="text-xs text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</p>
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

  const activeWidgets = widgets.filter((w) => w.visible);
  
  // Separate KPI cards from full-width cards for layout
  const kpiWidgets = activeWidgets.filter(w => w.id.startsWith('kpi-'));
  const fullWidgets = activeWidgets.filter(w => !w.id.startsWith('kpi-'));

  return (
    <DashboardLayout>
      {!onboardingLoading && onboardingStatus?.onboardingComplete === false && (
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10 text-amber-200">
          <AlertCircle className="h-4 w-4 stroke-amber-500" />
          <AlertTitle className="text-amber-500 font-semibold">Action Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Please complete your company onboarding to unlock all CRM features.</span>
            <Button variant="outline" size="sm" className="border-amber-500/50 hover:bg-amber-500/20 text-amber-200" asChild>
              <Link href="/onboarding">Complete Setup <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-400 text-sm">Welcome back to your CRM workspace.</p>
        </div>
        
        <Popover open={customizeOpen} onOpenChange={setCustomizeOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Customize Layout
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4 bg-slate-900 border-slate-800">
            <h4 className="font-semibold text-white mb-4">Dashboard Widgets</h4>
            <div className="space-y-2">
              {widgets.map((widget, index) => (
                <div key={widget.id} className="flex items-center justify-between p-2 rounded-md bg-slate-800 border border-slate-700">
                  <span className="text-sm text-slate-200 truncate pr-2">{widget.title}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => toggleWidget(widget.id)}>
                      {widget.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4 text-xs text-slate-400 hover:text-white" onClick={resetLayout}>
              Reset to Default
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="min-h-[600px]">
        {activeWidgets.length > 0 ? (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ 
              lg: activeWidgets
                .map(w => w.layout || defaultWidgets.find(dw => dw.id === w.id)?.layout)
                .filter(Boolean) 
            }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onLayoutChange={(layout: any) => updateLayout(layout)}
            margin={[16, 16]}
            {...( { draggableHandle: ".cursor-move" } as any )}
          >
            {activeWidgets.map((w) => (
              <div key={w.id}>
                {renderWidget(w.id)}
              </div>
            ))}
          </ResponsiveGridLayout>
        ) : (
          <div className="text-center text-slate-500 py-12">
            No widgets active. Customize your layout to add widgets.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
