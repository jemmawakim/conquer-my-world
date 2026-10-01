import { z } from "zod";

const supabaseEnvSchema = z.object({
  url: z.url({
    error: (issue) =>
      issue.input === undefined
        ? "NEXT_PUBLIC_SUPABASE_URL is not set"
        : "NEXT_PUBLIC_SUPABASE_URL is not a valid URL",
  }),
  publishableKey: z
    .string({
      error: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) is not set",
    })
    .min(1, {
      error: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) is empty",
    }),
});

export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

let cached: SupabaseEnv | null = null;

/**
 * Validated lazily so `next build` can prerender static pages without credentials.
 * `process.env.NEXT_PUBLIC_*` must be referenced literally for Next.js to inline them
 * into the browser bundle.
 */
export function getSupabaseEnv(): SupabaseEnv {
  if (cached) return cached;

  const parsed = supabaseEnvSchema.safeParse({
    // Fallbacks cover the Vercel ↔ Supabase integration, which may add a custom
    // prefix (this project uses HUH_) and may only provide the legacy anon key.
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_HUH_SUPABASE_URL,
    publishableKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_HUH_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_HUH_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(
      `Invalid Supabase environment: ${details}. Add them in Vercel → Settings → Environment Variables (see .env.example).`,
    );
  }

  cached = parsed.data;
  return cached;
}
