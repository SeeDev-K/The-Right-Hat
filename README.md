# The Right Hat

Premium cybersecurity, academy, media and community platform built with Next.js.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vercel Analytics
- Supabase Auth
- Supabase contact CRM
- Supabase-ready content and community schemas

## Assets

TRH production assets are expected under:

```txt
public/assets/trh/
  logos/
  hero/
  sections/
  articles/
  icons/
  social/
  admin/
```

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill the Supabase values.

```bash
cp .env.example .env.local
```

## Supabase

Run migrations in order:

```txt
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_content_foundation.sql
```

Then create the first admin profile using:

```txt
docs/CREATE-FIRST-ADMIN.md
```

## Admin

- `/signup`: creates a Supabase Auth user
- `/login`: signs into Supabase Auth
- `/admin`: loads the protected contact CRM
- `/api/admin/contact-requests`: verifies the user token and checks `admin_profiles`

## Deployment

Import this repository into Vercel and add the environment variables listed in `.env.example`.

Detailed setup guide: `docs/SETUP-GITHUB-SUPABASE-VERCEL.md`

## Roadmap

- Admin CRUD for Academy CMS
- Admin CRUD for Media CMS
- Community member management
- Email notifications
- SEO sitemap and production metadata
- Audit logs and stronger RBAC
