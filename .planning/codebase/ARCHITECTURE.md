# Architecture

This project is built as a monolithic full-stack web application using the **T3 Stack** pattern (Next.js, tRPC, Tailwind, Drizzle).

## Core Layers
1. **Frontend**: Next.js 15 App Router. Pages and layouts are defined in `src/app`. UI components are built using shadcn/ui and Tailwind.
2. **State & Data Fetching**: tRPC provides end-to-end typesafe APIs. React Query is used on the client via tRPC hooks. Zustand for global client-side state.
3. **Backend/API**: Next.js Route Handlers host the tRPC server (`src/app/api/trpc/[trpc]/route.ts`).
4. **Data Layer**: Drizzle ORM defines schemas and handles database interactions with PostgreSQL. Schemas are in `src/server/db`.
5. **Auth**: Handled natively via NextAuth (Auth.js) acting as a middleware and provider.
