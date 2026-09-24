"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, CreditCard, Users, Settings, LogOut, ShieldAlert } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function SuperAdminLayout({ children, userName, userEmail }: SuperAdminLayoutProps) {
  const pathname = usePathname();

  const adminNav = [
    { label: "Platform Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Organizations", href: "/admin/organizations", icon: Building2 },
    { label: "Global Users", href: "/admin/users", icon: Users },
    { label: "Subscription Tiers", href: "/admin/plans", icon: CreditCard },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2 px-2 py-3 mb-6 border-b border-zinc-800">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              SA
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">DevCRM</span>
              <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0 bg-red-600 hover:bg-red-700">
                ADMIN
              </Badge>
            </div>
          </div>

          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "text-zinc-500")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-300">
              {userName?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">{userName || "Super Admin"}</p>
              <p className="text-xs text-zinc-500 truncate">{userEmail || "admin@system.io"}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
          
          <Link href="/dashboard" className="block mt-2">
            <Button variant="outline" className="w-full justify-start border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <LogOut className="mr-2 h-4 w-4 rotate-180" />
              Return to App
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Top Header */}
        <header className="h-14 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between px-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <span>Global Administration Area</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
