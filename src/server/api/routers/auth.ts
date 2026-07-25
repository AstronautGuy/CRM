import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { organizations, organizationMembers, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, or } from "drizzle-orm";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        password: z.string().min(6),
        organizationName: z.string().min(2),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
      const existingUser = await ctx.db.query.users.findFirst({
        where: or(
          eq(users.email, input.email),
          input.phone ? eq(users.phone, input.phone) : undefined
        ),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with this email or phone already exists",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 10);

      const userId = crypto.randomUUID();
      const orgId = crypto.randomUUID();
      const slug = input.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 10000);

      // We run these inside a transaction
      await ctx.db.transaction(async (tx) => {
        await tx.insert(users).values({
          id: userId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          passwordHash,
          systemRole: "USER",
        });

        await tx.insert(organizations).values({
          id: orgId,
          name: input.organizationName,
          slug,
        });

        await tx.insert(organizationMembers).values({
          organizationId: orgId,
          userId: userId,
          role: "OWNER",
        });
      });

      return { success: true };
    }),
});
