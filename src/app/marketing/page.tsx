import Link from "next/link";
import { auth } from "~/server/auth";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default async function MarketingPage() {
  const session = await auth();

  const mockCampaigns = [
    { id: "1", name: "Q3 Developer Search Ads", platform: "Google Ads", spend: "$4,500", clicks: 3200, conversions: 140, cpl: "$32.14" },
    { id: "2", name: "SaaS Enterprise Retargeting", platform: "LinkedIn Ads", spend: "$8,200", clicks: 1100, conversions: 65, cpl: "$126.15" },
    { id: "3", name: "Dev Tools Community Promo", platform: "Twitter/X", spend: "$1,800", clicks: 4500, conversions: 210, cpl: "$8.57" },
  ];

  return (
    <DashboardLayout
      userRole={session?.user?.systemRole || "USER"}
      userName={session?.user?.name || "Marketing Manager"}
      userEmail={session?.user?.email || "marketing@devcrm.io"}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Ad Campaigns & ROI Analytics</h2>
            <p className="text-slate-400 text-sm">Track multi-channel ad spend, lead conversions, Cost Per Lead (CPL), and acquisition ROI.</p>
          </div>
          <Button>+ Connect New Campaign</Button>
        </div>

        {/* Marketing KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-slate-400 uppercase font-mono">Total Ad Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$14,500</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-slate-400 uppercase font-mono">Total Leads Captured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">415 Leads</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-slate-400 uppercase font-mono">Average CPL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">$34.93</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-slate-400 uppercase font-mono">Blended CAC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">$215.00</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Ad Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase bg-slate-950/50">
                <tr>
                  <th className="p-3">Campaign Name</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Spend</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Conversions</th>
                  <th className="p-3">Cost / Lead (CPL)</th>
                </tr>
              </thead>
              <tbody>
                {mockCampaigns.map((c) => (
                  <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-white">{c.name}</td>
                    <td className="p-3">
                      <Badge variant="outline">{c.platform}</Badge>
                    </td>
                    <td className="p-3 font-bold text-white">{c.spend}</td>
                    <td className="p-3">{c.clicks.toLocaleString()}</td>
                    <td className="p-3 font-bold text-blue-400">{c.conversions}</td>
                    <td className="p-3 font-bold text-emerald-400">{c.cpl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
