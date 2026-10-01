"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { judgeSecretFruit } from "@/app/weird-lab/actions";
import { Button } from "@/components/ui/Button";
import { describedBy, FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { secretFruitSchema, type SecretFruitValues } from "@/lib/validations/lab";

type Feedback = { tone: "success" | "error"; message: string } | null;

export function SecretFruitForm() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SecretFruitValues>({
    resolver: zodResolver(secretFruitSchema),
    defaultValues: { guess: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await judgeSecretFruit(values);
      if (result.ok) {
        setFeedback({ tone: "success", message: result.message });
        return;
      }
      setFeedback({ tone: "error", message: result.error });
      const message = result.fieldErrors?.guess?.[0];
      if (message) setError("guess", { message });
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormField
        id="guess"
        label="Name a vegetable that is secretly a fruit"
        error={errors.guess?.message}
        description="Checked by Zod in your browser, then again by a server action."
      >
        <Input
          id="guess"
          autoComplete="off"
          placeholder="e.g. something red and suspicious"
          aria-invalid={Boolean(errors.guess)}
          aria-describedby={describedBy("guess", Boolean(errors.guess))}
          disabled={isPending}
          {...register("guess")}
        />
      </FormField>
      <Button type="submit" disabled={isPending} className="justify-self-start">
        {isPending ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles aria-hidden="true" />
        )}
        {isPending ? "Consulting the oracle…" : "Ask the oracle"}
      </Button>
      {feedback ? <FormMessage tone={feedback.tone} message={feedback.message} /> : null}
    </form>
  );
}
