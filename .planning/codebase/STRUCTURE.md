# Structure

```text
e:\work\devcrm\
├── .planning/       # Agent planning, context, and codebase maps
├── drizzle/         # Database migrations
├── public/          # Static assets
├── scripts/         # Utility and setup scripts
└── src/             # Main source code
    ├── app/         # Next.js App Router pages, layouts, and API routes
    ├── components/  # Reusable UI components (shadcn, etc.)
    ├── env.js       # Environment variable validation (T3 Env)
    ├── hooks/       # Custom React hooks
    ├── lib/         # Utility functions and shared logic
    ├── middleware.ts# Next.js edge middleware (auth routing, etc.)
    ├── server/      # Backend logic (tRPC routers, Drizzle DB schema)
    ├── store/       # Zustand state stores
    ├── styles/      # Global CSS and Tailwind directives
    ├── trpc/        # tRPC client setup and provider
    └── types/       # Shared TypeScript definitions
```
