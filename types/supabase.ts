import type { SupabaseClient } from "@supabase/supabase-js";
import type { CamelCasedKeys } from "@/types/caseMapping";
import type { Database } from "@/types/database";

export type TypedSupabaseClient = SupabaseClient<Database>;

type PublicSchema = Database["public"];

export type TableName = keyof PublicSchema["Tables"];

/** Raw snake_case shapes — only used inside `lib/supabase`. */
export type DbRow<T extends TableName> = PublicSchema["Tables"][T]["Row"];
export type DbInsert<T extends TableName> = PublicSchema["Tables"][T]["Insert"];
export type DbUpdate<T extends TableName> = PublicSchema["Tables"][T]["Update"];

/** camelCase shapes — what components, hooks and actions work with. */
export type Entity<T extends TableName> = CamelCasedKeys<DbRow<T>>;
export type EntityInsert<T extends TableName> = CamelCasedKeys<DbInsert<T>>;
export type EntityUpdate<T extends TableName> = CamelCasedKeys<DbUpdate<T>>;

export type UserProfile = Entity<"user_profiles">;
export type WarrantyRegistration = Entity<"warranty_registrations">;
