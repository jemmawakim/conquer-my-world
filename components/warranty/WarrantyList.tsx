"use client";

import { ShieldCheck, ShieldOff } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { formatIsoDate, getWarrantyStatus } from "@/lib/warranty/warrantyStatus";
import type { WarrantyRegistration } from "@/types/supabase";

type WarrantyListProps = {
  registrations: WarrantyRegistration[];
};

export function WarrantyList({ registrations }: WarrantyListProps) {
  const reduceMotion = useReducedMotion();

  if (registrations.length === 0) {
    return (
      <p className="border-border text-muted-foreground rounded-lg border border-dashed px-4 py-8 text-center text-sm">
        No warranties yet. Activate your first one above.
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {registrations.map((registration, index) => {
        const status = getWarrantyStatus(registration.expiresOn);
        const active = status.state === "active";
        const Icon = active ? ShieldCheck : ShieldOff;

        return (
          <motion.li
            key={registration.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: index * 0.04 }}
            className="border-border flex items-start gap-4 rounded-lg border p-4"
          >
            <Icon
              aria-hidden="true"
              className={cn(
                "mt-0.5 size-5 shrink-0",
                active ? "text-success" : "text-muted-foreground",
              )}
            />
            <div className="grid min-w-0 flex-1 gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="truncate font-medium">{registration.productName}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                  )}
                >
                  {active ? `Active · ${status.daysLeft} days left` : "Expired"}
                </span>
              </div>
              <p className="text-muted-foreground font-mono text-xs">
                S/N {registration.serialNumber}
              </p>
              <p className="text-muted-foreground text-xs">
                Bought {formatIsoDate(registration.purchaseDate)}
                {registration.retailer ? ` at ${registration.retailer}` : ""} · Covered until{" "}
                {formatIsoDate(registration.expiresOn)} ({registration.warrantyMonths} months)
              </p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
