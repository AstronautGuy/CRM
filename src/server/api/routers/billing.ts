import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { invoices, products, quotes, organizationMembers } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const billingRouter = createTRPCRouter({
  // Get products catalog
  getProducts: protectedProcedure
    .query(async ({ ctx }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      return ctx.db.select().from(products).where(eq(products.organizationId, member.organizationId)).orderBy(desc(products.createdAt));
    }),

  createProduct: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        sku: z.string().min(1),
        description: z.string().optional(),
        unitPrice: z.number().min(0),
        stockQuantity: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const [product] = await ctx.db.insert(products).values({ ...input, organizationId: member.organizationId }).returning();
      return product;
    }),

  // Get all quotes
  getQuotes: protectedProcedure
    .query(async ({ ctx }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      return ctx.db.select().from(quotes).where(eq(quotes.organizationId, member.organizationId)).orderBy(desc(quotes.createdAt));
    }),

  createQuote: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        contactId: z.string().optional(),
        totalAmount: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const [quote] = await ctx.db.insert(quotes).values({
        ...input,
        organizationId: member.organizationId,
        status: "DRAFT",
      }).returning();
      return quote;
    }),

  // Get all invoices
  getInvoices: protectedProcedure
    .query(async ({ ctx }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      return ctx.db.select().from(invoices).where(eq(invoices.organizationId, member.organizationId)).orderBy(desc(invoices.createdAt));
    }),

  createInvoice: protectedProcedure
    .input(
      z.object({
        contactId: z.string().optional(),
        invoiceNumber: z.string().min(1),
        subtotal: z.number().min(0),
        taxAmount: z.number().min(0),
        totalAmount: z.number().min(0),
        dueDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const [invoice] = await ctx.db.insert(invoices).values({
        ...input,
        organizationId: member.organizationId,
        status: "DRAFT",
      }).returning();
      return invoice;
    }),

  // Update invoice status
  updateInvoiceStatus: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
        status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      // Ideally we should also verify the invoice belongs to the org
      const [updated] = await ctx.db
        .update(invoices)
        .set({
          status: input.status,
          paidAt: input.status === "PAID" ? new Date() : null,
        })
        .where(and(eq(invoices.id, input.invoiceId), eq(invoices.organizationId, member.organizationId)))
        .returning();

      return updated;
    }),
});
