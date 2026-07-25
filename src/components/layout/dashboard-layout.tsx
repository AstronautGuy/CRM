"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, CreditCard, Users, Settings, LogOut, ShieldAlert } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "SUPER_ADMIN" | "USER";
  userName?: string;
  userEmail?: string;
}

export function DashboardLayout({ children, userRole = "USER", userName, userEmail }: DashboardLayoutProps) {
  const pathname = usePathname();

  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const adminNav = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Client Companies", href: "/admin/organizations", icon: Building2 },
    { label: "Subscription Plans", href: "/admin/plans", icon: CreditCard },
  ];

  const tenantNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Contacts & Leads", href: "/contacts", icon: Users },
    { label: "Deal Pipeline", href: "/pipeline", icon: Building2 },
    { label: "Subscription", href: "/billing", icon: CreditCard },
  ];

  const navItems = isSuperAdmin ? adminNav : tenantNav;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2 px-2 py-3 mb-6 border-b border-slate-800">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
              D
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">DevCRM</span>
              {isSuperAdmin && (
                <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0">
                  SUPER ADMIN
                </Badge>
              )}
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="border-t border-slate-800 pt-4 px-2">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{userName || "User Account"}</p>
              <p className="text-xs text-slate-400 truncate">{userEmail || "user@devcrm.io"}</p>
            </div>
            <Link href="/api/auth/signout" className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white capitalize">
            {isSuperAdmin ? "Super Admin Portal" : "CRM Workspace"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {isSuperAdmin ? "System Owner Mode" : "Organization Tenant"}
            </span>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
