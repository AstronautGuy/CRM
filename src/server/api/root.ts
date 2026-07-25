import { adminRouter } from "~/server/api/routers/admin";
import { billingRouter } from "~/server/api/routers/billing";
import { crmRouter } from "~/server/api/routers/crm";
import { dealsRouter } from "~/server/api/routers/deals";
import { marketingRouter } from "~/server/api/routers/marketing";
import { postRouter } from "~/server/api/routers/post";
import { authRouter } from "~/server/api/routers/auth";
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { onboardingRouter } from "~/server/api/routers/onboarding";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  admin: adminRouter,
  crm: crmRouter,
  deals: dealsRouter,
  billing: billingRouter,
  marketing: marketingRouter,
  auth: authRouter,
  dashboard: dashboardRouter,
  onboarding: onboardingRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
