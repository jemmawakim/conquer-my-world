import { z } from "zod";

const supabaseEnvSchema = z.object({
  url: z.url({ message: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL" }),
  publishableKey: z
    .string()
    .min(1, { message: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required" }),
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
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(`Invalid Supabase environment: ${details}. See .env.example.`);
  }

  cached = parsed.data;
  return cached;
}
