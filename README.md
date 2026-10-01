# Conquer My World

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Shadcn UI · Motion · GSAP · React Three Fiber · Supabase (RLS).

Project rules live in [`CLAUDE.md`](./CLAUDE.md).

## Getting started

```bash
cp .env.example .env.local      # fill in your Supabase URL + publishable key
npm install
npx supabase link --project-ref <your-project-ref>
npx supabase db push            # applies supabase/migrations
# …or paste supabase/setup.sql into Supabase → SQL Editor → Run
npm run dev
```

## Directory structure

```
.
├── app/                                  # Routes — lowercase kebab-case folders
│   ├── (auth)/                           # Route group (no URL segment)
│   │   ├── actions.ts                    # signIn / signUp / signOut server actions (Zod-validated)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx                # /login
│   │   └── sign-up/page.tsx              # /sign-up
│   ├── auth/callback/route.ts            # /auth/callback — email-confirmation code exchange
│   ├── user-dashboard/                   # /user-dashboard — protected by middleware
│   │   ├── actions.ts                    # updateProfile server action
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── warranty/                     # /user-dashboard/warranty — serial-number activation
│   ├── weird-lab/                        # /weird-lab — stack smoke-test page
│   ├── error.tsx · global-error.tsx · loading.tsx · not-found.tsx
│   ├── globals.css                       # Tailwind v4 + design tokens
│   ├── layout.tsx
│   └── page.tsx                          # /
├── components/                           # PascalCase files
│   ├── ui/                               # Shadcn primitives (Button, Input, Label, …)
│   ├── auth/                             # AuthCard, SignInForm, SignUpForm
│   ├── dashboard/                        # ProfileForm
│   ├── warranty/                         # WarrantyForm, WarrantyList
│   ├── lab/                              # Weird Lab experiments
│   └── marketing/                        # HeroSection (Motion)
├── lib/                                  # camelCase files
│   ├── supabase/
│   │   ├── client.ts                     # Browser client (Client Components)
│   │   ├── server.ts                     # Server client (RSC, actions, route handlers)
│   │   ├── middleware.ts                 # Session refresh + route protection
│   │   ├── mappers.ts                    # fromDbRow / toDbInsert — snake_case ↔ camelCase boundary
│   │   └── env.ts                        # Zod-validated env vars
│   ├── utils/
│   │   ├── cn.ts                         # Tailwind class merge
│   │   └── caseMapping.ts                # Runtime key conversion
│   └── validations/                      # Zod schemas shared by forms and server actions
│       ├── auth.ts
│       └── profile.ts
├── types/
│   ├── database.ts                       # Supabase-generated schema (snake_case) — `npm run db:types`
│   ├── supabase.ts                       # DbRow / Entity / UserProfile helpers
│   ├── caseMapping.ts                    # Type-level SnakeToCamel / CamelToSnake
│   └── actions.ts                        # ActionResult
├── supabase/
│   ├── migrations/                       # SQL migrations — every table enables RLS
│   └── setup.sql                         # All migrations in one file (`npm run db:bundle`)
├── scripts/bundleMigrations.mjs
├── middleware.ts                         # Edge middleware entry
└── CLAUDE.md                             # Project rules
```

Folders are added when their first real file exists (no placeholders). Planned homes:

- `components/three/` — React Three Fiber scenes (load with `next/dynamic` and `ssr: false`).
- `components/motion/` — reusable Motion/GSAP animation components (GSAP via `useGSAP` from `@gsap/react`).
- `hooks/` — custom hooks (`useSomething.ts`).
- `lib/cms/` — headless CMS client and typed queries.

## camelCase ↔ snake_case

Postgres stays snake_case; the app stays camelCase. Convert at the boundary:

```ts
const { data, error } = await supabase.from("user_profiles").select("*").eq("id", id).single();
if (error) throw error;
const profile = fromDbRow("user_profiles", data);
// profile.displayName, profile.avatarUrl — fully typed, derived from types/database.ts

await supabase.from("user_profiles").upsert(
  toDbInsert("user_profiles", { id, displayName: "Jemma" }), // → { id, display_name }
);
```
