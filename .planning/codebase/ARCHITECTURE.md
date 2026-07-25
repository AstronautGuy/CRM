# System Architecture

## Architecture Overview
The application follows a full-stack Next.js App Router architecture leveraging the T3 Stack pattern.

```
┌────────────────────────────────────────────────────────┐
│                   Next.js App Router                   │
│  (src/app/page.tsx, layout.tsx, _components/...)       │
└──────────────────────────┬─────────────────────────────┘
                           │ tRPC Client / React Query
                           ▼
┌────────────────────────────────────────────────────────┐
│                      tRPC Server                       │
│      (src/server/api/root.ts, routers/post.ts)         │
└──────────────────────────┬─────────────────────────────┘
                           │ Drizzle ORM
                           ▼
┌────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                   │
│               (src/server/db/schema.ts)                │
└────────────────────────────────────────────────────────┘
```

## Layers & Communication
1. **Presentation Layer (`src/app/`)**: Server and Client Components using React 19 and TailwindCSS v4.
2. **API Layer (`src/server/api/`)**: Type-safe end-to-end API endpoints defined using tRPC procedures and Zod schemas.
3. **Data Access Layer (`src/server/db/`)**: Schema definition and query builder using Drizzle ORM targeting PostgreSQL.
