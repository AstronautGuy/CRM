import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { invoices, products, quotes, organizationMembers, userSettings } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const billingRouter = createTRPCRouter({
  // --- USER SETTINGS ---
  getUserSettings: protectedProcedure.query(async ({ ctx }) => {
    const member = await ctx.db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, ctx.session.user.id),
    });
    if (!member?.organizationId) throw new Error("Unauthorized");

    let settings = await ctx.db.query.userSettings.findFirst({
      where: and(
        eq(userSettings.organizationId, member.organizationId),
        eq(userSettings.userId, ctx.session.user.id)
      ),
    });

    if (!settings) {
      const [newSettings] = await ctx.db.insert(userSettings).values({
        organizationId: member.organizationId,
        userId: ctx.session.user.id,
      }).returning();
      settings = newSettings;
    }

    return settings;
  }),

  updateUserSettings: protectedProcedure
    .input(z.object({
      defaultCurrency: z.string().optional(),
      customCurrencySymbol: z.string().nullable().optional(),
      numberFormat: z.string().optional(),
      decimalDigits: z.number().optional(),
      roundQuantity: z.boolean().optional(),
      roundRate: z.boolean().optional(),
      customLabels: z.any().optional(),
      signatureImage: z.string().nullable().optional(),
      tncList: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const [updated] = await ctx.db.update(userSettings)
        .set(input)
        .where(and(
          eq(userSettings.organizationId, member.organizationId),
          eq(userSettings.userId, ctx.session.user.id)
        )).returning();
        
      return updated;
    }),

  // --- PRODUCTS ---
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
        sku: z.string().optional(),
        type: z.enum(["PRODUCT", "SERVICE"]).default("PRODUCT"),
        description: z.string().optional(),
        unitPrice: z.number().min(0),
        unit: z.string().optional(),
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

  // --- QUOTES ---
  getQuotes: protectedProcedure
    .query(async ({ ctx }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      return ctx.db.select().from(quotes).where(eq(quotes.organizationId, member.organizationId)).orderBy(desc(quotes.createdAt));
    }),

  getQuoteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      return ctx.db.query.quotes.findFirst({
        where: and(eq(quotes.id, input.id), eq(quotes.organizationId, member.organizationId)),
      });
    }),

  createQuote: protectedProcedure
    .input(
      z.object({
        companyId: z.string().optional(),
        quoteNumber: z.string().min(1),
        title: z.string().optional(),
        date: z.date(),
        dueDate: z.date().optional(),
        labels: z.any().optional(),
        customFields: z.any().optional(),
        showTotalInPdf: z.boolean(),
        showTotalInWords: z.boolean(),
        lineItems: z.any().optional(),
        taxPercent: z.number().default(0),
        discountType: z.string().default("AMOUNT"),
        discountValue: z.number().default(0),
        additionalCharges: z.any().optional(),
        totalAmount: z.number().default(0),
        signatureType: z.string().default("IMAGE"),
        signatureName: z.string().optional(),
        signatureData: z.string().optional(),
        notes: z.string().optional(),
        attachments: z.any().optional(),
        terms: z.any().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
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
});
