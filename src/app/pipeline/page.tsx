import Link from "next/link";
import { auth } from "~/server/auth";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default async function PipelinePage() {
  const session = await auth();

  const stages = [
    { id: "1", name: "Lead Identified", winProb: 20, color: "border-blue-500" },
    { id: "2", name: "Meeting Scheduled", winProb: 40, color: "border-indigo-500" },
    { id: "3", name: "Proposal Sent", winProb: 60, color: "border-purple-500" },
    { id: "4", name: "Negotiation", winProb: 80, color: "border-amber-500" },
    { id: "5", name: "Closed Won", winProb: 100, color: "border-emerald-500" },
  ];

  const deals = [
    { id: "d1", title: "Enterprise Dev Tools Deal", value: "$45,000", stageId: "1", company: "Acme Corp" },
    { id: "d2", title: "API SDK Integration License", value: "$18,000", stageId: "3", company: "TechStart Inc" },
    { id: "d3", title: "Annual SaaS Tier Contract", value: "$60,000", stageId: "4", company: "CloudScale" },
  ];

  return (
    <DashboardLayout
      userRole={session?.user?.systemRole || "USER"}
      userName={session?.user?.name || "Sales Rep"}
      userEmail={session?.user?.email || "rep@devcrm.io"}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Deal Pipeline</h2>
            <p className="text-slate-400 text-sm">Manage opportunity stages, pipeline forecasting, and deal flows.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Pipeline Settings</Button>
            <Button>+ New Deal</Button>
          </div>
        </div>

        {/* Metrics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-slate-400 uppercase font-mono">Total Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$123,000</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-slate-400 uppercase font-mono">Weighted Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">$64,200</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-slate-400 uppercase font-mono">Open Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3 Deals</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-slate-400 uppercase font-mono">Est. Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">45%</div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stageId === stage.id);
            return (
              <div key={stage.id} className="bg-slate-900/40 rounded-xl border border-slate-800 p-3 flex flex-col min-h-[480px]">
                <div className={`border-l-4 ${stage.color} pl-2 py-1 mb-3 flex items-center justify-between`}>
                  <span className="font-semibold text-sm text-white">{stage.name}</span>
                  <Badge variant="secondary" className="text-[10px]">{stageDeals.length}</Badge>
                </div>

                <div className="space-y-3 flex-1">
                  {stageDeals.map((deal) => (
                    <Card key={deal.id} className="bg-slate-900 border-slate-700/60 hover:border-blue-500 cursor-grab transition shadow-sm">
                      <CardContent className="p-3 space-y-2">
                        <div className="font-medium text-sm text-white">{deal.title}</div>
                        <div className="text-xs text-slate-400">{deal.company}</div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                          <span className="font-bold text-emerald-400">{deal.value}</span>
                          <span className="text-[10px] text-slate-500">{stage.winProb}% Prob</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="h-24 rounded-lg border border-dashed border-slate-800/80 flex items-center justify-center text-xs text-slate-600">
                      Drag deal here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
