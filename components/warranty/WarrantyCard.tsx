"use client";

import { ShieldCheck } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { addMonthsIso, formatIsoDate, WARRANTY_MONTHS } from "@/lib/warranty/warrantyStatus";

export type WarrantyCardDetails = {
  productName: string;
  serialNumber: string;
  purchaseDate: string;
};

type WarrantyCardProps = {
  details: WarrantyCardDetails;
  activated: boolean;
};

const TILT_DEGREES = 10;
const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function normaliseSerial(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

/** Live preview of the warranty being registered. Tilts toward the pointer (transform only). */
export function WarrantyCard({ details, activated }: WarrantyCardProps) {
  const reduceMotion = useReducedMotion();

  // Pointer position relative to the card centre, in the range -0.5…0.5.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [TILT_DEGREES, -TILT_DEGREES]),
    SPRING,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-TILT_DEGREES, TILT_DEGREES]),
    SPRING,
  );
  const sheenX = useSpring(useTransform(pointerX, [-0.5, 0.5], ["-30%", "30%"]), SPRING);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const productName = details.productName.trim();
  const serialNumber = normaliseSerial(details.serialNumber);
  const hasDate = ISO_DATE.test(details.purchaseDate);
  const coveredUntil = hasDate ? addMonthsIso(details.purchaseDate, WARRANTY_MONTHS) : null;

  return (
    <div
      className="[perspective:1200px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="from-brand/70 via-secondary to-background text-foreground relative aspect-[1.586] w-full overflow-hidden rounded-3xl bg-linear-150 p-6 shadow-2xl ring-1 shadow-black/60 ring-white/10 will-change-transform select-none ring-inset sm:p-7"
      >
        {/* Brushed-metal depth: a cool glow, a fine grain of light, and a pointer-following sheen. */}
        <div
          aria-hidden="true"
          className="bg-brand-2/25 absolute -top-24 -right-16 size-72 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_2px,rgb(255_255_255/0.025)_2px_3px)]"
        />
        <motion.div
          aria-hidden="true"
          style={{ x: sheenX }}
          className="absolute inset-y-0 -left-1/4 w-[150%] bg-linear-to-r from-transparent via-white/10 to-transparent"
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <span className="text-lg font-bold tracking-tight">conquer</span>
            <span className="text-muted-foreground text-xs font-medium tracking-wide">
              {WARRANTY_MONTHS} months
            </span>
          </div>

          {/* Card chip */}
          <div
            aria-hidden="true"
            className="grid h-8 w-11 grid-cols-3 gap-px overflow-hidden rounded-md bg-linear-to-br from-white/60 to-white/25 p-px opacity-80"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="rounded-[1px] bg-white/20" />
            ))}
          </div>

          <div className="grid gap-1">
            <p
              className={cn(
                "truncate font-mono text-base tracking-[0.2em] sm:text-lg",
                !serialNumber && "text-muted-foreground",
              )}
            >
              {serialNumber || "•••• •••• ••••"}
            </p>
            <div className="flex items-end justify-between gap-4">
              <p
                className={cn(
                  "min-w-0 truncate text-sm font-medium",
                  !productName && "text-muted-foreground",
                )}
              >
                {productName || "Your product"}
              </p>
              <dl className="flex shrink-0 gap-4 text-right text-[0.7rem]">
                <div>
                  <dt className="text-muted-foreground">From</dt>
                  <dd className="font-medium tabular-nums">
                    {hasDate ? formatIsoDate(details.purchaseDate) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Until</dt>
                  <dd className="font-medium tabular-nums">
                    {coveredUntil ? formatIsoDate(coveredUntil) : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {activated ? (
            <motion.div
              key="stamp"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="bg-success text-background shadow-success/30 absolute top-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-lg sm:top-7"
            >
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Activated
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <p className="sr-only" aria-live="polite">
        {activated ? "Warranty activated." : ""}
      </p>
    </div>
  );
}
