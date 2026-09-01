import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { invoices, quotes, payments, statements } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const publicRouter = createTRPCRouter({
  getPublicQuote: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const quote = await ctx.db.query.quotes.findFirst({
        where: eq(quotes.id, input.id),
        with: {
          organization: true,
          company: true,
        },
      });

      if (!quote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quote not found",
        });
      }

      if (quote.status === "DRAFT") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This quote is not ready for viewing yet.",
        });
      }

      return quote;
    }),

  getPublicInvoice: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.db.query.invoices.findFirst({
        where: eq(invoices.id, input.id),
        with: {
          organization: true,
          company: true,
        },
      });

      if (!invoice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invoice not found",
        });
      }

      const paymentsList = await ctx.db.query.payments.findMany({
        where: eq(payments.invoiceId, invoice.id),
      });

      if (invoice.status === "DRAFT") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invoice is not ready for viewing yet.",
        });
      }

      return {
        ...invoice,
        payments: paymentsList,
      };
    }),

  getPublicStatement: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const statement = await ctx.db.query.statements.findFirst({
        where: eq(statements.id, input.id),
        with: {
          organization: true,
          company: true,
        },
      });

      if (!statement) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Statement not found",
        });
      }

      return statement;
    }),
});
