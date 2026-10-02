"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Loader2, Package, ScanBarcode, ShieldCheck, Store } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { activateWarranty } from "@/app/user-dashboard/warranty/actions";
import { Button } from "@/components/ui/Button";
import { describedBy, FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { IconInput } from "@/components/ui/IconInput";
import { WarrantyCard, type WarrantyCardDetails } from "@/components/warranty/WarrantyCard";
import {
  warrantySchema,
  type WarrantyFormValues,
  type WarrantyValues,
} from "@/lib/validations/warranty";

type Feedback = { tone: "success" | "error"; message: string } | null;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(): WarrantyFormValues {
  return { productName: "", serialNumber: "", purchaseDate: todayIso(), retailer: "" };
}

export function WarrantyForm() {
  const [feedback, setFeedback] = useState<Feedback>(null);
  // Snapshot of the last activated warranty, shown on the card until the user types again.
  const [activatedCard, setActivatedCard] = useState<WarrantyCardDetails | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<WarrantyFormValues, unknown, WarrantyValues>({
    resolver: zodResolver(warrantySchema),
    defaultValues: emptyForm(),
  });

  const [productName = "", serialNumber = "", purchaseDate = ""] = useWatch({
    control,
    name: ["productName", "serialNumber", "purchaseDate"],
  });

  const isDirtySinceActivation =
    activatedCard !== null && (productName !== "" || serialNumber !== "");
  const showActivated = activatedCard !== null && !isDirtySinceActivation;
  const cardDetails = showActivated ? activatedCard : { productName, serialNumber, purchaseDate };

  const onSubmit = handleSubmit((values) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await activateWarranty({ ...values, retailer: values.retailer ?? "" });
      if (result.ok) {
        setActivatedCard({
          productName: values.productName,
          serialNumber: values.serialNumber,
          purchaseDate: values.purchaseDate,
        });
        reset(emptyForm());
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
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
      <div className="grid gap-4 lg:sticky lg:top-10">
        <WarrantyCard details={cardDetails} activated={showActivated} />
        <p className="text-muted-foreground text-center text-xs">
          Live preview: your card fills in as you type.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="border-border bg-card/80 text-card-foreground grid gap-6 rounded-2xl border p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8"
      >
        {feedback ? <FormMessage tone={feedback.tone} message={feedback.message} /> : null}

        <FormField id="productName" label="Product name" error={errors.productName?.message}>
          <IconInput
            id="productName"
            icon={Package}
            placeholder="Aurora Wireless Headphones"
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
          description="On the box, the receipt or the back of the device. Spaces are ignored."
        >
          <IconInput
            id="serialNumber"
            icon={ScanBarcode}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="AWH-2026-7F3K9Q"
            className="font-mono tracking-widest uppercase placeholder:tracking-widest"
            aria-invalid={Boolean(errors.serialNumber)}
            aria-describedby={describedBy("serialNumber", Boolean(errors.serialNumber))}
            disabled={isPending}
            {...register("serialNumber")}
          />
        </FormField>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField id="purchaseDate" label="Purchase date" error={errors.purchaseDate?.message}>
            <IconInput
              id="purchaseDate"
              icon={CalendarDays}
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
            <IconInput
              id="retailer"
              icon={Store}
              placeholder="Amazon"
              aria-invalid={Boolean(errors.retailer)}
              aria-describedby={describedBy("retailer", Boolean(errors.retailer))}
              disabled={isPending}
              {...register("retailer")}
            />
          </FormField>
        </div>

        <Button type="submit" variant="brand" size="xl" disabled={isPending} className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <ShieldCheck aria-hidden="true" />
          )}
          {isPending ? "Activating…" : "Activate my warranty"}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          Each serial number can be registered once. Coverage starts on the purchase date.
        </p>
      </form>
    </div>
  );
}
