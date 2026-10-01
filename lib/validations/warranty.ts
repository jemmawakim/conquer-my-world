import { z } from "zod";

export const SERIAL_NUMBER_PATTERN = /^[A-Z0-9-]{6,40}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PURCHASE_AGE_YEARS = 5;

function isoDateOffset({ days = 0, years = 0 }: { days?: number; years?: number }): string {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() + years);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export const warrantySchema = z.object({
  productName: z
    .string()
    .trim()
    .min(2, { error: "Use at least 2 characters" })
    .max(100, { error: "Use at most 100 characters" }),
  serialNumber: z
    .string()
    .transform((value) => value.replace(/\s+/g, "").toUpperCase())
    .pipe(
      z
        .string()
        .min(1, { error: "Enter the serial number from the box or receipt" })
        .regex(SERIAL_NUMBER_PATTERN, {
          error: "Use 6–40 letters, numbers or dashes",
        }),
    ),
  purchaseDate: z
    .string()
    .regex(ISO_DATE_PATTERN, { error: "Pick the date you bought it" })
    // ISO dates compare correctly as strings. +1 day tolerates time zones ahead of UTC.
    .refine((value) => value <= isoDateOffset({ days: 1 }), {
      error: "The purchase date can't be in the future",
    })
    .refine((value) => value >= isoDateOffset({ years: -MAX_PURCHASE_AGE_YEARS }), {
      error: `Purchases older than ${MAX_PURCHASE_AGE_YEARS} years can't be registered`,
    }),
  retailer: z
    .string()
    .trim()
    .max(100, { error: "Use at most 100 characters" })
    .transform((value) => (value.length > 0 ? value : null)),
});

/** Raw form values (what the inputs hold). */
export type WarrantyFormValues = z.input<typeof warrantySchema>;
/** Normalised values (uppercase serial, null retailer). */
export type WarrantyValues = z.output<typeof warrantySchema>;
