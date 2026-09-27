# Phase 28: Production Environment & Database Prep - Context

## Objective
Finalize the environment variable setup and git branching strategy for deploying DevCRM to Vercel. Ensure the `.env.example` file is accurate and clean, and create a dedicated `prod` branch with a `.env.production` stub.

## Scope
1. **Environment Variables Check**:
   - Audit `.env.example` to ensure all necessary keys (Auth secret, OAuth IDs, DB URL) are present and well-documented.
2. **Production Setup**:
   - Create a `prod` branch in Git (this will be the branch Vercel points to).
   - Create a `.env.production` file containing dummy/placeholder values for production variables, so the user knows exactly what to populate in Vercel's UI.
