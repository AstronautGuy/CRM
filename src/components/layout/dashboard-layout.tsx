"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, CreditCard, Users, Settings, LogOut, ShieldAlert } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

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
    { label: "Clients", href: "/clients", icon: Users },
    { label: "Deal Pipeline", href: "/pipeline", icon: Building2 },
    { label: "Subscription", href: "/billing", icon: CreditCard },
  ];

  const navItems = isSuperAdmin ? adminNav : tenantNav;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2 px-2 py-3 mb-6 border-b border-border">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
              D
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-foreground">DevCRM</span>
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
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        {!isSuperAdmin && (
          <div className="px-4 mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start border shadow-sm" size="sm">
                + Create Quote
              </Button>
              <Button variant="secondary" className="w-full justify-start border shadow-sm" size="sm">
                + Create Invoice
              </Button>
            </div>
          </div>
        )}

        {/* User Footer */}
        <div className="border-t border-border pt-4 px-2">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-medium text-foreground truncate">{userName || "User Account"}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail || "user@devcrm.io"}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground capitalize">
            {isSuperAdmin ? "Super Admin Portal" : "CRM Workspace"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-accent border border-border text-muted-foreground">
              {isSuperAdmin ? "System Owner Mode" : "Organization Tenant"}
            </span>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
