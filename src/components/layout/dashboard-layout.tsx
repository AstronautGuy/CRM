"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, CreditCard, Users, Settings, LogOut, ShieldAlert, Package, Repeat, Zap } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { NotificationsBell } from "~/components/layout/notifications-bell";
import { api } from "~/trpc/react";
import { signOut } from "next-auth/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "SUPER_ADMIN" | "USER";
  userName?: string;
  userEmail?: string;
}

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardLayout({ children, userRole, userName, userEmail }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: layoutData, isLoading } = api.dashboard.getLayoutData.useQuery();
  const isSuperAdmin = layoutData?.user?.systemRole === "SUPER_ADMIN" || userRole === "SUPER_ADMIN";
  const canAdminTenant = layoutData?.tenantRole === "OWNER" || layoutData?.tenantRole === "ADMIN";
  const isOnboardingIncomplete = !isLoading && layoutData && !layoutData.onboardingComplete && !isSuperAdmin;

  const displayUserName = layoutData?.user?.name || userName || "User Account";
  const displayUserEmail = layoutData?.user?.email || userEmail || "user@devcrm.io";

  const tenantNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Clients", href: "/clients", icon: Users },
    { label: "Deal Pipeline", href: "/pipeline", icon: Building2 },
    { label: "Inventory", href: "/inventory/products", icon: Package },
    { label: "Client Subscriptions", href: "/billing/subscriptions", icon: Repeat },
    { label: "Billing & Quotes", href: "/billing/invoices", icon: CreditCard },
    { label: "Automations", href: "/automations", icon: Zap },
    ...(canAdminTenant ? [{ label: "Tenant Admin", href: "/dashboard/admin", icon: ShieldAlert }] : []),
    { label: "My Profile", href: "/settings/profile", icon: Settings },
  ];

  const navItems = tenantNav;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col justify-between p-4">
        <div>
          <div className="flex flex-col gap-1 px-2 py-3 mb-6 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg tracking-tight text-foreground truncate">{layoutData?.organizationName || "Loading..."}</span>
              {isSuperAdmin && (
                <Link href="/admin">
                  <Badge variant="destructive" className="text-[10px] px-1 py-0 cursor-pointer flex-shrink-0">
                    SUPER ADMIN
                  </Badge>
                </Link>
              )}
            </div>
            <div className="text-xs text-muted-foreground truncate">{displayUserName} ({displayUserEmail})</div>
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
              <Link href="/billing/quotes/new" className="w-full">
                <Button variant="secondary" className="w-full justify-start border shadow-sm" size="sm">
                  + Create Quote
                </Button>
              </Link>
              <Link href="/billing/invoices/new" className="w-full">
                <Button variant="secondary" className="w-full justify-start border shadow-sm" size="sm">
                  + Create Invoice
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* User Footer */}
        <div className="border-t border-border pt-4 px-2 mt-auto pb-4">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-medium text-foreground truncate">{displayUserName}</p>
              <p className="text-xs text-muted-foreground truncate">{displayUserEmail}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
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
            <span className="text-xs px-2.5 py-1 rounded-full bg-accent border border-border text-muted-foreground hidden sm:inline-block">
              {isSuperAdmin ? "System Owner Mode" : "Organization Tenant"}
            </span>
            {!isSuperAdmin && <NotificationsBell />}
          </div>
        </header>

        <div className="p-6 flex-1 overflow-auto relative">
          {isOnboardingIncomplete ? (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm p-6">
              <div className="max-w-md w-full p-8 border border-border bg-card rounded-xl shadow-xl text-center flex flex-col items-center">
                <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
                <h2 className="text-xl font-bold mb-2 text-foreground">Feature Blocked</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  You need to complete the onboarding process to access your CRM workspace and features.
                </p>
                <Link href="/onboarding">
                  <Button size="lg" className="w-full">
                    Complete Onboarding
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
          <div className={isOnboardingIncomplete ? "opacity-20 pointer-events-none select-none" : ""}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
