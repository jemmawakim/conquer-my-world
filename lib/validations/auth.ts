import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Enter a valid email address" })),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Enter a valid email address" })),
  password: z
    .string()
    .min(8, { message: "Use at least 8 characters" })
    .max(72, { message: "Use at most 72 characters" })
    .regex(/[a-z]/, { message: "Include a lowercase letter" })
    .regex(/[A-Z]/, { message: "Include an uppercase letter" })
    .regex(/[0-9]/, { message: "Include a number" }),
});

/** Only same-origin relative paths are allowed, to prevent open redirects. */
export const redirectPathSchema = z
  .string()
  .regex(/^\/(?!\/)[^\s\\]*$/)
  .catch("/user-dashboard");

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
