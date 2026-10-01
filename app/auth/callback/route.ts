import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirectPathSchema } from "@/lib/validations/auth";

const callbackSchema = z.object({
  code: z.string().min(1),
  next: redirectPathSchema,
});

/** Exchanges the email-confirmation / OAuth code for a session cookie. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const parsed = callbackSchema.safeParse({
    code: searchParams.get("code"),
    next: searchParams.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/login?error=invalid_callback", origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(parsed.data.code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
  }

  return NextResponse.redirect(new URL(parsed.data.next, origin));
}
