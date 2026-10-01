"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/app/user-dashboard/actions";
import { Button } from "@/components/ui/Button";
import { describedBy, FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";
import type { UserProfile } from "@/types/supabase";

type ProfileFormProps = {
  profile: UserProfile | null;
};

type Feedback = { tone: "success" | "error"; message: string } | null;

export function ProfileForm({ profile }: ProfileFormProps) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile?.displayName ?? "",
      bio: profile?.bio ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateProfile(values);
      if (result.ok) {
        reset(values);
        setFeedback({ tone: "success", message: result.message });
        return;
      }
      setFeedback({ tone: "error", message: result.error });
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        const message = messages?.[0];
        if (message) setError(field as keyof ProfileValues, { message });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {feedback ? <FormMessage tone={feedback.tone} message={feedback.message} /> : null}

      <FormField id="displayName" label="Display name" error={errors.displayName?.message}>
        <Input
          id="displayName"
          autoComplete="nickname"
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={describedBy("displayName", Boolean(errors.displayName))}
          disabled={isPending}
          {...register("displayName")}
        />
      </FormField>

      <FormField
        id="bio"
        label="Bio"
        error={errors.bio?.message}
        description="Up to 280 characters."
      >
        <Textarea
          id="bio"
          rows={4}
          aria-invalid={Boolean(errors.bio)}
          aria-describedby={describedBy("bio", Boolean(errors.bio))}
          disabled={isPending}
          {...register("bio")}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !isDirty}>
          {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
