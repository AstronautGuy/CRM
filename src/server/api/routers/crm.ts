import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { activityNotes, assignmentHistory, companies, contacts, tags, organizationMembers } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const crmRouter = createTRPCRouter({
  // Contacts Procedures
  getContacts: protectedProcedure
    .input(
      z.object({
        status: z.enum(["NEW", "QUALIFIED", "CONTACTED", "NURTURING", "UNQUALIFIED"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const conditions = [eq(contacts.organizationId, member.organizationId)];
      if (input?.status) {
        conditions.push(eq(contacts.status, input.status));
      }
      return ctx.db.select().from(contacts).where(and(...conditions)).orderBy(desc(contacts.createdAt));
    }),

  createContact: protectedProcedure
    .input(
      z.object({
        companyId: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        jobTitle: z.string().optional(),
        status: z.enum(["NEW", "QUALIFIED", "CONTACTED", "NURTURING", "UNQUALIFIED"]).default("NEW"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const [contact] = await ctx.db.insert(contacts).values({ ...input, organizationId: member.organizationId }).returning();
      return contact;
    }),

  // Companies Procedures
  getCompanies: protectedProcedure
    .query(async ({ ctx }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      return ctx.db.select().from(companies).where(eq(companies.organizationId, member.organizationId)).orderBy(desc(companies.createdAt));
    }),

  createCompany: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        domain: z.string().optional(),
        industry: z.string().optional(),
        employeeCount: z.number().optional(),
        address: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const [company] = await ctx.db.insert(companies).values({ ...input, organizationId: member.organizationId }).returning();
      return company;
    }),

  // Activity Notes Procedures
  getActivityNotes: protectedProcedure
    .input(z.object({ contactId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const conditions = [eq(activityNotes.organizationId, member.organizationId)];
      if (input?.contactId) {
        conditions.push(eq(activityNotes.contactId, input.contactId));
      }
      return ctx.db.select().from(activityNotes).where(and(...conditions)).orderBy(desc(activityNotes.createdAt));
    }),

  addActivityNote: protectedProcedure
    .input(
      z.object({
        contactId: z.string().optional(),
        companyId: z.string().optional(),
        type: z.string().default("NOTE"),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.db.query.organizationMembers.findFirst({
        where: eq(organizationMembers.userId, ctx.session.user.id),
      });
      if (!member?.organizationId) throw new Error("Unauthorized");

      const [note] = await ctx.db
        .insert(activityNotes)
        .values({
          ...input,
          organizationId: member.organizationId,
          authorId: ctx.session.user.id,
        })
        .returning();
      return note;
    }),
});
