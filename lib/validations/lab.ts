import { z } from "zod";

/** Botanically fruits, culinarily vegetables. */
export const SECRET_FRUITS = [
  "tomato",
  "cucumber",
  "eggplant",
  "pepper",
  "pumpkin",
  "zucchini",
  "avocado",
  "okra",
] as const;

export const secretFruitSchema = z.object({
  guess: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "The oracle demands an answer" })
    .refine(
      (value): value is (typeof SECRET_FRUITS)[number] =>
        (SECRET_FRUITS as readonly string[]).includes(value),
      {
        message: "Nope. That one is honest about what it is.",
      },
    ),
});

export type SecretFruitValues = z.input<typeof secretFruitSchema>;
