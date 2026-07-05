# The Right Hat — Deployment Setup

## 1. GitHub

Repository: `SeeDev-K/The-Right-Hat`

The project is a Next.js App Router platform with TypeScript, Tailwind CSS v4, Supabase Auth, a protected admin CRM, contact storage and content/community schema foundations.

## 2. Supabase

Run the migrations in order inside the Supabase SQL editor:

```sql
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_content_foundation.sql
```

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. Never expose it in client components.

## 3. First admin

Create a user through `/signup` or inside Supabase Auth, then follow:

```txt
docs/CREATE-FIRST-ADMIN.md
```

Only users in `admin_profiles` with role `owner` or `admin` can access protected admin APIs.

## 4. Vercel

Import the GitHub repo into Vercel.

Recommended settings:

- Framework: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Production branch: `main`

Add all variables from `.env.example` to Vercel Project Settings.

## 5. Production checklist

- Redeploy Vercel after adding variables
- Create first admin profile
- Test `/signup`, `/login`, `/contact` and `/admin`
- Submit one contact request and confirm it appears in `/admin`
- Add domain `trh.ma` when DNS is ready

## 6. Next phase

- Admin CRUD for academy/media/community
- Email notifications with Resend
- Rate limiting for `/api/contact`
- Production SEO metadata and sitemap
- Audit logs and stronger RBAC
