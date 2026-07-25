import Link from "next/link";
import { auth } from "~/server/auth";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default async function TasksPage() {
  const session = await auth();

  const mockTasks = [
    { id: "1", title: "Schedule demo call with Acme CTO", contact: "Alex Developer", dueDate: "Today, 4:00 PM", priority: "URGENT", status: "PENDING" },
    { id: "2", title: "Send revised proposal & invoice", contact: "Sarah TechStart", dueDate: "Tomorrow, 11:00 AM", priority: "HIGH", status: "PENDING" },
    { id: "3", title: "Follow up on untouched lead inquiry", contact: "CloudScale Lead", dueDate: "July 28, 2026", priority: "MEDIUM", status: "COMPLETED" },
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Tasks & Follow-up Reminders</h2>
            <p className="text-slate-400 text-sm">Schedule client call/email reminders, track deadlines, and view automated follow-up alerts.</p>
          </div>
          <Button>+ Schedule Task</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks & Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700">
                      <div>
                        <p className="font-medium text-white text-sm">{t.title}</p>
                        <p className="text-xs text-slate-400">Contact: {t.contact} • Due: {t.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {t.priority === "URGENT" && <Badge variant="destructive">URGENT</Badge>}
                        {t.priority === "HIGH" && <Badge variant="default">HIGH</Badge>}
                        {t.priority === "MEDIUM" && <Badge variant="secondary">MEDIUM</Badge>}
                        <Button size="sm" variant="ghost">Complete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Calendar Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-400 text-sm">
                  Interactive Activity Calendar
                  <div className="text-xs text-slate-500 mt-1">July 2026 Overview</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
