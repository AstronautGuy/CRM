# Architecture

The application is built on the T3 Stack, combining Next.js, tRPC, Tailwind CSS, NextAuth, and Drizzle ORM.

- **Frontend**: Next.js App Router handling routing and SSR/CSR.
- **API Layer**: tRPC used for end-to-end typesafe APIs.
- **Database Layer**: Drizzle ORM connected to a PostgreSQL database.
- **State**: Server state managed via React Query (tRPC), local state via Zustand.
