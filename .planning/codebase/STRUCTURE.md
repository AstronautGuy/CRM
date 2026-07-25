# Project Structure

## Directory Layout
```
devcrm/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router routes & layouts
│   │   ├── _components/    # Private UI components specific to app router
│   │   ├── api/            # API handlers (tRPC handler route)
│   │   ├── layout.tsx      # Root layout component
│   │   └── page.tsx        # Homepage entry
│   ├── env.js              # Enforced environment variable validation (Zod + T3 Env)
│   ├── server/             # Server-side backend logic
│   │   ├── api/            # tRPC routers & context setup
│   │   └── db/             # Drizzle ORM schema & client initialization
│   ├── styles/             # Global CSS and Tailwind imports
│   └── trpc/               # Client-side tRPC React Query bindings
├── biome.jsonc             # Code style & linting configuration
├── drizzle.config.ts       # Drizzle Kit migration & generator config
├── next.config.js          # Next.js build configuration
├── package.json            # Project dependencies & scripts
├── start-database.sh       # Docker shell script for local Postgres container
└── tsconfig.json           # TypeScript configuration
```
