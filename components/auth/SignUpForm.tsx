"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { describedBy, FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth";

type Feedback = { tone: "success" | "error"; message: string } | null;

export function SignUpForm() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await signUp(values);
      if (result.ok) {
        reset();
        setFeedback({ tone: "success", message: result.message });
        return;
      }
      setFeedback({ tone: "error", message: result.error });
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        const message = messages?.[0];
        if (message) setError(field as keyof SignUpValues, { message });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {feedback ? <FormMessage tone={feedback.tone} message={feedback.message} /> : null}

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

      <FormField
        id="password"
        label="Password"
        error={errors.password?.message}
        description="8+ characters with an uppercase letter, a lowercase letter and a number."
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={describedBy("password", Boolean(errors.password))}
          disabled={isPending}
          {...register("password")}
        />
      </FormField>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Already registered?{" "}
        <Link
          href="/login"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
