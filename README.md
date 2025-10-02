# Two Cents

A Next.js app with Supabase authentication and onboarding flow.

## Getting Started

1. Ensure you're using Node 22.15.0 (`nvm use 22.15.0`)
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env.local` and add your Supabase credentials
4. Start the development server: `pnpm dev`
5. Visit [http://localhost:3000](http://localhost:3000)

## Authentication Flow

- **New users** → Email OTP authentication → Onboarding → Home
- **Returning users** → Email OTP authentication → Home (if onboarded)

User onboarding status is stored in `auth.users.user_metadata.onboarded`.

## Supabase Type Generation

Generate TypeScript types from your Supabase schema for full type safety:

```bash
# Generate types (run after schema changes)
npx supabase gen types typescript --project-id zohzyxmyacoqemmxfkgp > types/supabase.ts
```

Then import and use:

```typescript
import { Database } from '@/types/supabase'

type User = Database['public']['Tables']['users']['Row']
```

## Project Structure

- `app/page.tsx` – Landing page and authentication flow
- `app/onboarding/page.tsx` – Onboarding screen for new users
- `app/home/page.tsx` – Protected home page with server-side auth
- `utils/supabase/server.ts` – Server-side Supabase client
- `utils/supabase/client.ts` – Client-side Supabase client

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Auth/Database:** Supabase
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
