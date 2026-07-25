# Phase 6 Context - Auth UI Forms & Middleware Redirect Protection

## Key Decisions

### 1. User Authentication UI Forms
- **Sign In Page (`/login` or `/auth/signin`)**:
  - Email + Password credentials login form.
  - Phone + Password login support.
  - Social OAuth buttons (GitHub, Google).
- **Sign Up / Register Page (`/register` or `/auth/signup`)**:
  - Registration form collecting Name, Email/Phone, Password, and Organization Name.
  - Automatic organization tenant creation and user link upon registration.

### 2. Next.js Middleware Route Protection (`middleware.ts`)
- **Route Guarding**:
  - Require valid NextAuth session for `/admin`, `/dashboard`, `/contacts`, `/pipeline`, `/billing`, `/products`, `/marketing`, `/tasks`.
  - Redirect unauthenticated users automatically to `/login`.
  - Redirect authenticated users away from `/login` / `/register` to `/dashboard`.
