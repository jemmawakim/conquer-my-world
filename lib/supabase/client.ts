import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";
import type { TypedSupabaseClient } from "@/types/supabase";

export { fromDbRow, fromDbRows, toDbInsert, toDbUpdate } from "@/lib/supabase/mappers";

let browserClient: TypedSupabaseClient | null = null;

/**
 * Type-safe Supabase client for Client Components.
 *
 * Queries use snake_case (DB contract); convert results with `fromDbRow` before
 * handing them to UI code, and payloads with `toDbInsert` / `toDbUpdate`:
 *
 *   const supabase = createClient();
 *   const { data, error } = await supabase.from("user_profiles").select("*").single();
 *   if (error) throw error;
 *   const profile = fromDbRow("user_profiles", data); // { displayName, avatarUrl, ... }
 */
export function createClient(): TypedSupabaseClient {
  if (browserClient) return browserClient;

  const { url, publishableKey } = getSupabaseEnv();
  browserClient = createBrowserClient<Database>(url, publishableKey);
  return browserClient;
}
