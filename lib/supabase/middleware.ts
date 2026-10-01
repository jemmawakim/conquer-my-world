import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

/** Every route under these prefixes requires an authenticated user. */
export const PROTECTED_ROUTE_PREFIXES = ["/user-dashboard"] as const;

/** Signed-in users are bounced away from these routes. */
const AUTH_ROUTES = ["/login", "/sign-up"] as const;

const DEFAULT_AUTHED_REDIRECT = "/user-dashboard";

function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  let env: ReturnType<typeof getSupabaseEnv>;
  try {
    env = getSupabaseEnv();
  } catch (error) {
    // Fail closed: protected routes are unavailable without auth config,
    // public pages still render (and report the misconfiguration).
    if (matchesPrefix(request.nextUrl.pathname, PROTECTED_ROUTE_PREFIXES)) {
      console.error(error);
      return new NextResponse("Service unavailable: authentication is not configured.", {
        status: 503,
      });
    }
    return response;
  }
  const { url, publishableKey } = env;

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() re-validates the JWT with Supabase Auth; never trust getSession() here.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && matchesPrefix(pathname, PROTECTED_ROUTE_PREFIXES)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return copyCookies(response, NextResponse.redirect(loginUrl));
  }

  if (user && matchesPrefix(pathname, AUTH_ROUTES)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = DEFAULT_AUTHED_REDIRECT;
    dashboardUrl.search = "";
    return copyCookies(response, NextResponse.redirect(dashboardUrl));
  }

  return response;
}

/** Keep refreshed auth cookies when swapping the response for a redirect. */
function copyCookies(from: NextResponse, to: NextResponse): NextResponse {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
  return to;
}
