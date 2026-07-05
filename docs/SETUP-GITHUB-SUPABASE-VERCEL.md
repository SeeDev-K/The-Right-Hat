# The Right Hat — Deployment Setup

## 1. GitHub

Repository: `SeeDev-K/The-Right-Hat`

The project is a Next.js app with App Router, TypeScript, Tailwind CSS v4, a contact API route and an initial Supabase schema.

## 2. Supabase

Create a Supabase project named `the-right-hat` or `trh-production`.

Run this migration in the Supabase SQL editor:

```sql
supabase/migrations/0001_initial_schema.sql
```

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. Never expose it in client components.

## 3. Vercel

Import the GitHub repo into Vercel.

Recommended settings:

- Framework: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Production branch: `main`

Add all variables from `.env.example` to Vercel Project Settings.

## 4. Next phase

- Connect Supabase Auth
- Protect `/admin`
- Add admin CRUD for academy/media/community
- Add Resend email notifications
- Add rate limiting for `/api/contact`
- Add production SEO metadata and sitemap
