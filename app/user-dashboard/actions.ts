"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toDbInsert } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";
import type { ActionResult } from "@/types/actions";

export async function updateProfile(
  values: ProfileValues,
): Promise<ActionResult<keyof ProfileValues>> {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }

  // RLS guarantees a user can only write their own row; id is set server-side regardless.
  const { error } = await supabase.from("user_profiles").upsert(
    toDbInsert("user_profiles", {
      id: user.id,
      displayName: parsed.data.displayName,
      bio: parsed.data.bio.length > 0 ? parsed.data.bio : null,
    }),
  );

  if (error) {
    return { ok: false, error: "We couldn't save your profile. Please try again." };
  }

  revalidatePath("/user-dashboard");
  return { ok: true, message: "Profile saved." };
}
