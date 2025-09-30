# Two Cents

This project uses [Next.js](https://nextjs.org) with the App Router.

## Getting Started

1. Ensure you're using Node 22.15.0 (`nvm use 22.15.0`).
2. Install dependencies with your preferred package manager (`pnpm install`).
3. Start the development server: `pnpm dev`
4. Visit [http://localhost:3000](http://localhost:3000) for the landing page and [http://localhost:3000/instruments](http://localhost:3000/instruments) for the Supabase example.

## Supabase Setup

1. Create or reuse a Supabase project.
2. Copy `.env.example` to `.env.local` and keep the values that were provisioned for this project:

   ```bash
   cp .env.example .env.local
   ```

   These values expose the public anonymous key which is safe to ship to the browser as long as Row Level Security policies are in place.

3. In the Supabase SQL editor, create the sample table and RLS policy:

   ```sql
   create table if not exists instruments (
     id bigint primary key generated always as identity,
     name text not null
   );

   insert into instruments (name) values
     ('violin'),
     ('viola'),
     ('cello')
   on conflict do nothing;

   alter table instruments enable row level security;

   create policy if not exists "public can read instruments"
   on public.instruments
   for select to anon
   using (true);
   ```

4. Install the Supabase client packages (network access required):

   ```bash
   pnpm add @supabase/supabase-js @supabase/ssr
   ```

5. Restart the development server if it was running so it picks up the new environment variables.

## Project Structure

- `app/` – Next.js App Router pages and layouts.
- `app/instruments/page.tsx` – Example page that queries Supabase and prints JSON.
- `utils/supabase/server.ts` – Server-side Supabase client wired to share cookies between requests.
- `.env.example` – Template for Supabase environment variables.

## Troubleshooting

- If package installation fails with a `URL.canParse` or `ERR_PNPM_UNEXPECTED_STORE` error, run `nvm use 22.15.0` before running any `pnpm` command and reinstall dependencies (`pnpm install`).
- Network access is required the first time you install Supabase packages; if running in a restricted environment, request access or install them manually when you have connectivity.

