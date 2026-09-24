"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const sidebarNavItems = [
  {
    title: "Workspace Settings",
    href: "/dashboard/admin/workspace",
  },
  {
    title: "Team Members",
    href: "/settings/team", // Keep existing or move later
  },
  {
    title: "Billing",
    href: "/billing",
  },
  {
    title: "Webhooks",
    href: "/settings/webhooks",
  },
  {
    title: "API Keys",
    href: "/settings/api-keys",
  }
];

export function TenantAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Tenant Administration</h2>
        <p className="text-muted-foreground">
          Manage your organization workspace, members, and advanced features.
        </p>
      </div>
      <div className="shrink-0 bg-border h-[1px] w-full" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 hover:bg-muted hover:text-foreground justify-start",
                  pathname === item.href
                    ? "bg-muted font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
