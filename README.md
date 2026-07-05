# The Right Hat

Premium cybersecurity, academy, media and community platform built with Next.js.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vercel Analytics
- Supabase-ready contact storage

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

## Deployment

Import this repository into Vercel and add the environment variables listed in `.env.example`.

Detailed setup guide: `docs/SETUP-GITHUB-SUPABASE-VERCEL.md`

## Roadmap

- Supabase Auth for `/admin`
- Contact CRM
- Academy CMS
- Media CMS
- Community member management
- Email notifications
- SEO sitemap and production metadata
