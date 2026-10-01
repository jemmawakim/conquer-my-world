"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { activateWarranty } from "@/app/user-dashboard/warranty/actions";
import { Button } from "@/components/ui/Button";
import { describedBy, FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import {
  warrantySchema,
  type WarrantyFormValues,
  type WarrantyValues,
} from "@/lib/validations/warranty";

type Feedback = { tone: "success" | "error"; message: string } | null;

const EMPTY_FORM: WarrantyFormValues = {
  productName: "",
  serialNumber: "",
  purchaseDate: "",
  retailer: "",
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function WarrantyForm() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<WarrantyFormValues, unknown, WarrantyValues>({
    resolver: zodResolver(warrantySchema),
    defaultValues: EMPTY_FORM,
  });

  const onSubmit = handleSubmit((values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await activateWarranty({ ...values, retailer: values.retailer ?? "" });
      if (result.ok) {
        reset(EMPTY_FORM);
        setFeedback({ tone: "success", message: result.message });
        return;
      }
      setFeedback({ tone: "error", message: result.error });
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        const message = messages?.[0];
        if (message) setError(field as keyof WarrantyFormValues, { message });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {feedback ? <FormMessage tone={feedback.tone} message={feedback.message} /> : null}

      <FormField id="productName" label="Product name" error={errors.productName?.message}>
        <Input
          id="productName"
          placeholder="e.g. Aurora Wireless Headphones"
          aria-invalid={Boolean(errors.productName)}
          aria-describedby={describedBy("productName", Boolean(errors.productName))}
          disabled={isPending}
          {...register("productName")}
        />
      </FormField>

      <FormField
        id="serialNumber"
        label="Serial number"
        error={errors.serialNumber?.message}
        description="Printed on the box, the receipt or the back of the device. Spaces are ignored."
      >
        <Input
          id="serialNumber"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="e.g. AWH-2026-7F3K9Q"
          className="font-mono uppercase"
          aria-invalid={Boolean(errors.serialNumber)}
          aria-describedby={describedBy("serialNumber", Boolean(errors.serialNumber))}
          disabled={isPending}
          {...register("serialNumber")}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="purchaseDate" label="Purchase date" error={errors.purchaseDate?.message}>
          <Input
            id="purchaseDate"
            type="date"
            max={todayIso()}
            aria-invalid={Boolean(errors.purchaseDate)}
            aria-describedby={describedBy("purchaseDate", Boolean(errors.purchaseDate))}
            disabled={isPending}
            {...register("purchaseDate")}
          />
        </FormField>

        <FormField
          id="retailer"
          label="Where did you buy it?"
          error={errors.retailer?.message}
          description="Optional"
        >
          <Input
            id="retailer"
            placeholder="e.g. Amazon"
            aria-invalid={Boolean(errors.retailer)}
            aria-describedby={describedBy("retailer", Boolean(errors.retailer))}
            disabled={isPending}
            {...register("retailer")}
          />
        </FormField>
      </div>

      <Button type="submit" disabled={isPending} className="justify-self-start">
        {isPending ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : (
          <ShieldCheck aria-hidden="true" />
        )}
        {isPending ? "Activating…" : "Activate warranty"}
      </Button>
    </form>
  );
}
