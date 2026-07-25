import Link from "next/link";
import { auth } from "~/server/auth";
import { DashboardLayout } from "~/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default async function ProductsPage() {
  const session = await auth();

  const mockProducts = [
    { id: "1", name: "Developer API Pro Tier", sku: "API-PRO-01", price: "$499/mo", stock: 999 },
    { id: "2", name: "Custom SDK Integration Package", sku: "SDK-INT-02", price: "$2,500", stock: 45 },
    { id: "3", name: "Enterprise Support SLA (1 Year)", sku: "SUP-ENT-03", price: "$12,000", stock: 10 },
  ];

  return (
    <DashboardLayout
      userRole={session?.user?.systemRole || "USER"}
      userName={session?.user?.name || "CRM Admin"}
      userEmail={session?.user?.email || "user@devcrm.io"}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Products & Services Catalog</h2>
            <p className="text-slate-400 text-sm">Manage inventory stock, pricing tiers, and SKUs.</p>
          </div>
          <Button>+ Add Product / Service</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Catalog Items</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase bg-slate-950/50">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Stock Quantity</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-white">{p.name}</td>
                    <td className="p-3 font-mono text-xs text-slate-400">{p.sku}</td>
                    <td className="p-3 text-emerald-400 font-bold">{p.price}</td>
                    <td className="p-3">{p.stock} units</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost">Edit Item</Button>
                    </td>
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
