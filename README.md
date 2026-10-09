# LilMed

Proudly South African supplier of medical, laboratory, dental and diagnostic
consumables. Browse 250+ products and submit a professional quotation
request that is emailed straight to **info@lilmed.co.za** with a PDF quote
attached.

Built with **React 18 + Vite + TypeScript + Tailwind + Framer Motion**.
Backend: **Supabase** (products, quotes, admin) + **Resend** (email delivery,
via a Vercel serverless function). Deploys to **Vercel** as a static SPA + API.

## Local development:

```bash
npm install
cp .env.example .env    # fill in values
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Vercel → **Add New Project** → import the repo (framework: Vite, auto-detected).
3. Add the environment variables from `.env.example` in
   **Project → Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `QUOTE_FROM_EMAIL`
   - `QUOTE_TO_EMAIL=info@lilmed.co.za`
4. Deploy. Vercel will build the SPA and expose `/api/send-quote` as a
   serverless function automatically.

## Supabase setup

Run [`SUPABASE_SETUP.sql`](./SUPABASE_SETUP.sql) in the Supabase SQL editor.
It creates `categories`, `products`, `quotes` and `audit_logs` tables with
RLS policies. The first admin is created via Supabase Auth (Users → Add User),
then inserted into the `admins` table.

## Admin portal

- `/admin-login` — sign in with a Supabase admin account.
- `/admin` — dashboard: quotes, products (upload images + rename), users, logs.
