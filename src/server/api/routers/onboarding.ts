import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { organizations, organizationMembers, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const onboardingRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
    return {
      onboardingComplete: user?.onboardingComplete ?? false,
    };
  }),

  completeOnboarding: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        displayName: z.string().optional(),
        teamSize: z.string().min(1),
        website: z.string().optional(),
        phone: z.string().min(1),
        countryCode: z.string().min(1),
        country: z.string().min(1),
        currency: z.string().min(1),
        hasGst: z.boolean(),
        gstin: z.string().optional(),
        businessPan: z.string().optional(),
        useCases: z.array(z.string()),
        businessType: z.string().min(1),
        addressStreet: z.string().min(1),
        addressCity: z.string().min(1),
        addressState: z.string().min(1),
        addressPincode: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create organization
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
      
      const [org] = await ctx.db
        .insert(organizations)
        .values({
          name: input.name,
          slug,
          displayName: input.displayName,
          teamSize: input.teamSize,
          website: input.website,
          phone: input.phone,
          countryCode: input.countryCode,
          phoneVerified: true, // Mocked for now
          country: input.country,
          currency: input.currency,
          hasGst: input.hasGst,
          gstin: input.gstin,
          businessPan: input.businessPan,
          useCases: JSON.stringify(input.useCases),
          businessType: input.businessType,
          addressStreet: input.addressStreet,
          addressCity: input.addressCity,
          addressState: input.addressState,
          addressPincode: input.addressPincode,
        })
        .returning();

      if (!org) {
        throw new Error("Failed to create organization");
      }

      // Link user to organization
      await ctx.db.insert(organizationMembers).values({
        organizationId: org.id,
        userId: ctx.session.user.id,
        role: "OWNER",
      });

      // Mark user as onboarded
      await ctx.db
        .update(users)
        .set({ onboardingComplete: true })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true, organizationId: org.id };
    }),
});
