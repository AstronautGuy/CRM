import { adminRouter } from "~/server/api/routers/admin";
import { billingRouter } from "~/server/api/routers/billing";
import { crmRouter } from "~/server/api/routers/crm";
import { dealsRouter } from "~/server/api/routers/deals";
import { marketingRouter } from "~/server/api/routers/marketing";

import { authRouter } from "~/server/api/routers/auth";
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { onboardingRouter } from "~/server/api/routers/onboarding";
import { uploadsRouter } from "~/server/api/routers/uploads";
import { settingsRouter } from "~/server/api/routers/settings";
import { publicRouter } from "~/server/api/routers/public";
import { inventoryRouter } from "~/server/api/routers/inventory";
import { clientSubscriptionsRouter } from "~/server/api/routers/client-subscriptions";
import { automationsRouter } from "~/server/api/routers/automations";
import { notificationsRouter } from "~/server/api/routers/notifications";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({

  admin: adminRouter,
  crm: crmRouter,
  deals: dealsRouter,
  billing: billingRouter,
  marketing: marketingRouter,
  auth: authRouter,
  dashboard: dashboardRouter,
  onboarding: onboardingRouter,
  uploads: uploadsRouter,
  settings: settingsRouter,
  public: publicRouter,
  inventory: inventoryRouter,
  clientSubscriptions: clientSubscriptionsRouter,
  automations: automationsRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
