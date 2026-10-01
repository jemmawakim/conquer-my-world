"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { describedBy, FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { signInSchema, type SignInValues } from "@/lib/validations/auth";

type SignInFormProps = {
  next: string | null;
  initialError: string | null;
};

export function SignInForm({ next, initialError }: SignInFormProps) {
  const [serverError, setServerError] = useState<string | null>(initialError);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signIn(values, next);
      // A successful sign-in redirects, so only failures return here.
      if (!result.ok) {
        setServerError(result.error);
        for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
          const message = messages?.[0];
          if (message) setError(field as keyof SignInValues, { message });
        }
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {serverError ? <FormMessage tone="error" message={serverError} /> : null}

      <FormField id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email", Boolean(errors.email))}
          disabled={isPending}
          {...register("email")}
        />
      </FormField>

      <FormField id="password" label="Password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={describedBy("password", Boolean(errors.password))}
          disabled={isPending}
          {...register("password")}
        />
      </FormField>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        No account?{" "}
        <Link
          href="/sign-up"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
