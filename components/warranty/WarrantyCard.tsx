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
        className="from-brand via-brand to-brand-2 text-brand-foreground shadow-brand/30 relative aspect-[1.586] w-full overflow-hidden rounded-2xl bg-linear-135 p-6 shadow-2xl will-change-transform select-none sm:p-7"
      >
        {/* Decorative depth: soft orbs and a sheen that follows the pointer. */}
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-10 size-56 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-12 size-56 rounded-full bg-black/15 blur-2xl"
        />
        <motion.div
          aria-hidden="true"
          style={{ x: sheenX }}
          className="absolute inset-y-0 -left-1/4 w-[150%] bg-linear-to-r from-transparent via-white/20 to-transparent opacity-60 mix-blend-overlay"
        />

        <div className="relative flex h-full flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="size-5" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">Conquer Care</span>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide backdrop-blur-sm">
              {WARRANTY_MONTHS} MONTHS
            </span>
          </div>

          <div className="grid gap-1.5">
            <p
              className={cn(
                "truncate text-xl font-semibold tracking-tight sm:text-2xl",
                !productName && "opacity-60",
              )}
            >
              {productName || "Your product"}
            </p>
            <p
              className={cn(
                "truncate font-mono text-sm tracking-[0.18em] sm:text-base",
                !serialNumber && "opacity-60",
              )}
            >
              {serialNumber || "XXXX-XXXX-XXXX"}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-xs">
            <div className="grid gap-0.5">
              <dt className="tracking-[0.15em] uppercase opacity-70">Purchased</dt>
              <dd className="font-medium">{hasDate ? formatIsoDate(details.purchaseDate) : "—"}</dd>
            </div>
            <div className="grid gap-0.5 text-right">
              <dt className="tracking-[0.15em] uppercase opacity-70">Covered until</dt>
              <dd className="font-medium">{coveredUntil ? formatIsoDate(coveredUntil) : "—"}</dd>
            </div>
          </dl>
        </div>

        <AnimatePresence>
          {activated ? (
            <motion.div
              key="stamp"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 2.2, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
              className="text-brand absolute bottom-5 left-1/2 -ml-[4.5rem] flex h-10 w-36 items-center justify-center rounded-md border-2 border-white bg-white text-sm font-black tracking-[0.2em] uppercase shadow-lg shadow-black/20 sm:bottom-6"
            >
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
