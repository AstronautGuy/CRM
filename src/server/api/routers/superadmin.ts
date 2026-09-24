import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { organizations, users, organizationMembers } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const superadminRouter = createTRPCRouter({
  getOrganizations: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.systemRole !== "SUPER_ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return ctx.db.query.organizations.findMany({
      orderBy: (orgs, { desc }) => [desc(orgs.name)],
    });
  }),

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.systemRole !== "SUPER_ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return ctx.db.query.users.findMany({
      orderBy: (u, { desc }) => [desc(u.createdAt)],
    });
  }),

  impersonateOrganization: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.systemRole !== "SUPER_ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Check if org exists
      const org = await ctx.db.query.organizations.findFirst({
        where: eq(organizations.id, input.orgId),
      });

      if (!org) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
      }

      const cookieStore = await cookies();
      cookieStore.set("devcrm_impersonate_org", input.orgId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return { success: true, orgName: org.name };
    }),

  stopImpersonation: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.systemRole !== "SUPER_ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    const cookieStore = await cookies();
    cookieStore.delete("devcrm_impersonate_org");

    return { success: true };
  }),
});
