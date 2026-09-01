import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { automationRules, invoices, clientSubscriptions, deals, notifications, organizationMembers } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { differenceInDays, isSameDay } from "date-fns";

export const automationsRouter = createTRPCRouter({
  getRules: protectedProcedure.query(async ({ ctx }) => {
    const member = await ctx.db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, ctx.session.user.id),
    });
    if (!member?.organizationId) throw new Error("Unauthorized");

    return ctx.db.query.automationRules.findMany({
      where: eq(automationRules.organizationId, member.organizationId),
      orderBy: (rules, { desc }) => [desc(rules.createdAt)],
    });
  }),

  createRule: protectedProcedure
    .input(z.object({
      name: z.string(),
      triggerType: z.enum(["INVOICE_DUE", "SUBSCRIPTION_RENEWAL", "DEAL_STALLED"]),
      daysOffset: z.number(),
      actionType: z.enum(["CREATE_NOTIFICATION", "CREATE_TASK"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const [rule] = await ctx.db.insert(automationRules).values({
        organizationId: member.organizationId,
        name: input.name,
        triggerType: input.triggerType,
        daysOffset: input.daysOffset,
        actionType: input.actionType,
      }).returning();

      return rule;
    }),

  deleteRule: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      await ctx.db.delete(automationRules).where(
        and(
          eq(automationRules.id, input.id),
          eq(automationRules.organizationId, member.organizationId)
        )
      );

      return { success: true };
    }),

  runAutomations: protectedProcedure.mutation(async ({ ctx }) => {
    const member = await ctx.db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, ctx.session.user.id),
    });
    if (!member?.organizationId) throw new Error("Unauthorized");

    const rules = await ctx.db.query.automationRules.findMany({
      where: and(
        eq(automationRules.organizationId, member.organizationId),
        eq(automationRules.isActive, true)
      ),
    });

    let triggeredCount = 0;
    const now = new Date();

    for (const rule of rules) {
      if (rule.triggerType === "INVOICE_DUE") {
        const orgInvoices = await ctx.db.query.invoices.findMany({
          where: eq(invoices.organizationId, member.organizationId),
        });
        
        for (const inv of orgInvoices) {
          if (!inv.dueDate || inv.status === "PAID" || inv.status === "DRAFT") continue;
          
          const diff = differenceInDays(inv.dueDate, now);
          // If rule.daysOffset is -3, we want to trigger when diff === 3.
          // Let's standardise: daysOffset -3 means "3 days before".
          // If diff is exactly 3 and offset is -3... wait, if due tomorrow, diff is 1. If offset is -1, trigger.
          if (diff === Math.abs(rule.daysOffset) && Math.sign(rule.daysOffset) === -Math.sign(diff || 1)) {
             // In a real app, ensure we don't duplicate notifications.
             if (rule.actionType === "CREATE_NOTIFICATION") {
               await ctx.db.insert(notifications).values({
                 organizationId: member.organizationId,
                 userId: ctx.session.user.id,
                 title: `Automation: ${rule.name}`,
                 message: `Invoice #${inv.invoiceNumber} is due in ${Math.abs(diff)} days.`,
               });
               triggeredCount++;
             }
          }
        }
      }

      if (rule.triggerType === "SUBSCRIPTION_RENEWAL") {
        const subs = await ctx.db.query.clientSubscriptions.findMany({
          where: eq(clientSubscriptions.organizationId, member.organizationId),
        });

        for (const sub of subs) {
          if (sub.status !== "ACTIVE") continue;
          const diff = differenceInDays(sub.nextRenewalDate, now);
          // Simple naive check for this demo:
          if (diff === Math.abs(rule.daysOffset)) {
             if (rule.actionType === "CREATE_NOTIFICATION") {
               await ctx.db.insert(notifications).values({
                 organizationId: member.organizationId,
                 userId: ctx.session.user.id,
                 title: `Automation: ${rule.name}`,
                 message: `A subscription is renewing in ${Math.abs(diff)} days.`,
               });
               triggeredCount++;
             }
          }
        }
      }
    }

    return { success: true, triggeredCount };
  }),
});
