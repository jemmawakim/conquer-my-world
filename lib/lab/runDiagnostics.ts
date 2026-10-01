import "server-only";
import nextPackage from "next/package.json";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { fromDbRow, toDbInsert } from "@/lib/supabase/mappers";
import { secretFruitSchema } from "@/lib/validations/lab";

export type CheckStatus = "pass" | "warn" | "fail";

export type DiagnosticCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
};

export type DiagnosticsReport = {
  checks: DiagnosticCheck[];
  renderedAt: string;
  durationMs: number;
};

const SUPABASE_TIMEOUT_MS = 3000;

function checkRuntime(): DiagnosticCheck {
  return {
    id: "runtime",
    label: "Server runtime",
    status: "pass",
    detail: `Next.js ${nextPackage.version} on Node ${process.version}`,
  };
}

function checkZod(): DiagnosticCheck {
  const accepted = secretFruitSchema.safeParse({ guess: "  Tomato " });
  const rejected = secretFruitSchema.safeParse({ guess: "broccoli" });
  const ok = accepted.success && !rejected.success;
  return {
    id: "zod",
    label: "Zod on the server",
    status: ok ? "pass" : "fail",
    detail: ok ? "Accepted “  Tomato ”, rejected “broccoli”" : "Schema did not behave as expected",
  };
}

function checkCaseMapping(): DiagnosticCheck {
  const row = {
    id: "00000000-0000-0000-0000-000000000000",
    display_name: "Wobbly Tester",
    avatar_url: null,
    bio: "I exist only in memory",
    created_at: "2026-10-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  };
  const entity = fromDbRow("user_profiles", row);
  const back = toDbInsert("user_profiles", entity);
  const ok =
    entity.displayName === row.display_name &&
    entity.avatarUrl === null &&
    JSON.stringify(back) === JSON.stringify(row);
  return {
    id: "case-mapping",
    label: "snake_case ↔ camelCase",
    status: ok ? "pass" : "fail",
    detail: ok ? "display_name → displayName → display_name round-trips" : "Round-trip mismatch",
  };
}

async function checkSupabase(): Promise<DiagnosticCheck[]> {
  let env: ReturnType<typeof getSupabaseEnv>;
  try {
    env = getSupabaseEnv();
  } catch (error) {
    return [
      {
        id: "supabase-env",
        label: "Supabase env vars",
        status: "fail",
        detail: error instanceof Error ? error.message : "Missing configuration",
      },
    ];
  }

  const envCheck: DiagnosticCheck = {
    id: "supabase-env",
    label: "Supabase env vars",
    status: "pass",
    detail: new URL(env.url).host,
  };

  const started = performance.now();
  try {
    const response = await fetch(`${env.url}/auth/v1/health`, {
      headers: { apikey: env.publishableKey },
      cache: "no-store",
      signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
    });
    const ms = Math.round(performance.now() - started);
    return [
      envCheck,
      {
        id: "supabase-ping",
        label: "Supabase reachable",
        status: response.ok ? "pass" : "warn",
        detail: response.ok
          ? `Auth service answered in ${ms} ms`
          : `Auth service answered HTTP ${response.status}`,
      },
    ];
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return [
      envCheck,
      {
        id: "supabase-ping",
        label: "Supabase reachable",
        status: "fail",
        detail: timedOut
          ? `No answer within ${SUPABASE_TIMEOUT_MS} ms`
          : "Could not connect to the project URL",
      },
    ];
  }
}

export async function runDiagnostics(): Promise<DiagnosticsReport> {
  const started = performance.now();
  const supabaseChecks = await checkSupabase();
  return {
    checks: [checkRuntime(), checkZod(), checkCaseMapping(), ...supabaseChecks],
    renderedAt: new Date().toISOString(),
    durationMs: Math.round(performance.now() - started),
  };
}
