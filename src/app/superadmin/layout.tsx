import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.systemRole !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-xl text-primary mr-4">DevCRM SuperAdmin</span>
          <a href="/superadmin" className="text-sm text-muted-foreground hover:text-foreground">Overview</a>
          <a href="/superadmin/tenants" className="text-sm text-muted-foreground hover:text-foreground">Tenants</a>
          <a href="/superadmin/settings" className="text-sm text-muted-foreground hover:text-foreground">Global Settings</a>
        </div>
        <div className="text-sm text-muted-foreground">Logged in as {session.user.email}</div>
      </nav>
      <main className="p-6 md:p-10 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
