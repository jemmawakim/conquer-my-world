# CLAUDE.md — Project Rules

These rules apply to every change in this repository. Follow them without exception.

## Role & Stack

Act as an Elite Full-Stack Engineer. Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Motion.dev (formerly Framer Motion), GSAP, React Three Fiber, Supabase (with strict RLS), and a headless CMS.

## Naming Conventions

- React Components = PascalCase (e.g., `ShimmerButton.tsx`)
- Next.js Routes = lowercase kebab-case (e.g., `/user-dashboard`)
- Hooks/Utils = camelCase
- DB Tables/Columns = lowercase snake_case (e.g., `user_profiles`)

Applied to this repo:

- Shadcn primitives in `components/ui/` are renamed to PascalCase when added (`button.tsx` → `Button.tsx`).
- Next.js reserved files keep their required names (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`, `middleware.ts`).
- The database speaks snake_case; the app speaks camelCase. Convert at the boundary with `fromDbRow` / `toDbRow` from `lib/supabase/mappers.ts`. Never leak snake_case keys into components.

## UI & UI Registries

- Prioritize hardware-accelerated transitions via Motion.dev (`motion/react`). Animate `transform` and `opacity` only; never animate layout properties (`width`, `height`, `top`, `left`) directly. Respect `useReducedMotion()`.
- When I paste component code or prompts from 21st.dev, seamlessly adapt them to our Tailwind design tokens, TypeScript types, and naming rules.
  - Replace hard-coded colors with the tokens in `app/globals.css` (`bg-background`, `text-foreground`, `bg-primary`, etc.).
  - Replace `framer-motion` imports with `motion/react`.
  - Rename files/exports to PascalCase and add explicit prop types.

## Security Guardrails

- All dashboard routes require Next.js Edge Middleware validation (`middleware.ts` → `lib/supabase/middleware.ts`). New protected routes must be added to `PROTECTED_ROUTE_PREFIXES`.
- Forms/endpoints must use Zod schema validations. Validate on the client (React Hook Form + `zodResolver`) AND again on the server (server action / route handler). Schemas live in `lib/validations/`.
- Every Supabase table must have Row Level Security enabled. Every migration in `supabase/migrations/` that creates a table must also `enable row level security` and define explicit policies in the same file.
- Never expose the service-role key to the browser. Only `NEXT_PUBLIC_*` variables may be read in client code.

## Definition of Done

Complete code with absolute type safety, zero placeholder files, and fully written error/loading states.

- No `any`, no `@ts-ignore`, no non-null assertions to silence errors.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- Every route segment that fetches data has a `loading.tsx` and an `error.tsx`.
- No empty files, `TODO` stubs, or lorem-ipsum components.

## Commands

```bash
npm run dev         # start dev server
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
npm run db:types    # regenerate types/database.ts from the linked Supabase project
```
