import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { companies, deals, invoices, crmTasks, pipelineStages, organizationMembers } from "~/server/db/schema";
import { eq, inArray, and, not, sql } from "drizzle-orm";

export const dashboardRouter = createTRPCRouter({
  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    const member = await ctx.db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, ctx.session.user.id),
    });
    const organizationId = member?.organizationId;

    if (!organizationId) {
      throw new Error("No organization ID found for user.");
    }

    const [contactsCount] = await ctx.db
      .select({ count: sql<number>`cast(count(${companies.id}) as integer)` })
      .from(companies)
      .where(eq(companies.organizationId, organizationId));

    const [invoicesCount] = await ctx.db
      .select({ count: sql<number>`cast(count(${invoices.id}) as integer)` })
      .from(invoices)
      .where(
        and(
          eq(invoices.organizationId, organizationId),
          inArray(invoices.status, ["SENT", "OVERDUE"])
        )
      );

    const [tasksCount] = await ctx.db
      .select({ count: sql<number>`cast(count(${crmTasks.id}) as integer)` })
      .from(crmTasks)
      .where(
        and(
          eq(crmTasks.organizationId, organizationId),
          inArray(crmTasks.status, ["PENDING", "IN_PROGRESS"])
        )
      );

    const [dealsSum] = await ctx.db
      .select({ total: sql<number>`cast(sum(${deals.value}) as integer)` })
      .from(deals)
      .where(eq(deals.organizationId, organizationId));

    // For a real app, we'd join with pipelineStages to exclude 0 or 100 prob deals.
    // Simplifying to sum of all deal values for MVP.

    return {
      totalContacts: contactsCount?.count || 0,
      unpaidInvoices: invoicesCount?.count || 0,
      tasksDue: tasksCount?.count || 0,
      activePipelineValue: dealsSum?.total || 0,
    };
  }),

  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const member = await ctx.db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, ctx.session.user.id),
    });
    const organizationId = member?.organizationId;

    if (!organizationId) {
      return [];
    }

    const recentTasks = await ctx.db.query.crmTasks.findMany({
      where: eq(crmTasks.organizationId, organizationId),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
      limit: 5,
    });

    return recentTasks;
  }),
});
