"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  redirectPathSchema,
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from "@/lib/validations/auth";
import type { ActionResult } from "@/types/actions";

export async function signIn(
  values: SignInValues,
  next: string | null,
): Promise<ActionResult<keyof SignInValues>> {
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, error: "Invalid email or password." };
  }

  redirect(redirectPathSchema.parse(next ?? undefined));
}

export async function signUp(values: SignUpValues): Promise<ActionResult<keyof SignUpValues>> {
  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const origin = await resolveOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/user-dashboard` },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  // Email confirmation disabled → session exists immediately.
  if (data.session) {
    redirect("/user-dashboard");
  }

  return { ok: true, message: "Check your inbox to confirm your email address." };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

async function resolveOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  if (!host) {
    throw new Error("Cannot resolve site origin. Set NEXT_PUBLIC_SITE_URL.");
  }
  return `${protocol}://${host}`;
}
