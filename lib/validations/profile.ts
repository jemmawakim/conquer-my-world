import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, { message: "Use at least 2 characters" })
    .max(50, { message: "Use at most 50 characters" }),
  bio: z.string().trim().max(280, { message: "Use at most 280 characters" }),
});

/** Form input shape (before trim) and output shape are identical strings. */
export type ProfileValues = z.infer<typeof profileSchema>;
