"use server";

import { z } from "zod";
import { secretFruitSchema, type SecretFruitValues } from "@/lib/validations/lab";
import type { ActionResult } from "@/types/actions";

const VERDICTS: Record<string, string> = {
  tomato: "Correct. The tomato has been lying to salads for centuries.",
  cucumber: "Correct. A cucumber is a berry in a trench coat.",
  eggplant: "Correct. Technically a berry. Emotionally, a mystery.",
  pepper: "Correct. Seeds inside = fruit. The pepper knows.",
  pumpkin: "Correct. A pumpkin is a very committed berry.",
  zucchini: "Correct. Zucchini: fruit by birth, vegetable by career.",
  avocado: "Correct. A single-seeded berry with a toast habit.",
  okra: "Correct. Okra is a seed pod, and seed pods are fruit.",
};

export async function judgeSecretFruit(
  values: SecretFruitValues,
): Promise<ActionResult<keyof SecretFruitValues>> {
  const parsed = secretFruitSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "The server oracle disagrees.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  return { ok: true, message: VERDICTS[parsed.data.guess] ?? "Correct." };
}
