import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { SuperAdminLayout } from "~/components/layout/superadmin-layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Strict guard for Super Admin
  if (session.user.systemRole !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <SuperAdminLayout
      userName={session.user.name ?? undefined}
      userEmail={session.user.email ?? undefined}
    >
      {children}
    </SuperAdminLayout>
  );
}
