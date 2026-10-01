"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toDbInsert } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";
import { formatIsoDate } from "@/lib/warranty/warrantyStatus";
import { warrantySchema, type WarrantyFormValues } from "@/lib/validations/warranty";
import type { ActionResult } from "@/types/actions";

const PG_UNIQUE_VIOLATION = "23505";
const PG_CHECK_VIOLATION = "23514";

export async function activateWarranty(
  values: WarrantyFormValues,
): Promise<ActionResult<keyof WarrantyFormValues>> {
  const parsed = warrantySchema.safeParse(values);
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

  // user_id and warranty_months are set by the database (default + column grants).
  const { data, error } = await supabase
    .from("warranty_registrations")
    .insert(
      toDbInsert("warranty_registrations", {
        productName: parsed.data.productName,
        serialNumber: parsed.data.serialNumber,
        purchaseDate: parsed.data.purchaseDate,
        retailer: parsed.data.retailer,
      }),
    )
    .select("expires_on")
    .single();

  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) {
      return {
        ok: false,
        error: "This serial number already has an active registration.",
        fieldErrors: {
          serialNumber: ["Already registered. Contact support if this is your product."],
        },
      };
    }
    if (error.code === PG_CHECK_VIOLATION) {
      return { ok: false, error: "Some details were rejected. Check the serial number and date." };
    }
    console.error("activateWarranty failed", error);
    return { ok: false, error: "We couldn't activate your warranty. Please try again." };
  }

  revalidatePath("/user-dashboard/warranty");
  return {
    ok: true,
    message: `Warranty activated. You're covered until ${formatIsoDate(data.expires_on)}.`,
  };
}
