# Phase 28: Production Environment & Database Prep - Plan

## Step 1: `.env.example` Audit
- Read `src/env.js` and `.env` to identify all necessary environment variables.
- Update `.env.example` so it includes things like `DATABASE_URL`, `AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## Step 2: `.env.production` creation
- Create `.env.production` with placeholder strings representing production connection strings.
- Add `.env.production` to `.gitignore` to prevent secret leakage (if it's not already there).

## Step 3: Git `prod` branch
- Create a new git branch `prod`.
- Make sure `main` is clean, commit all changes, then branch off `prod`.
