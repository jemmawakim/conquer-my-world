"use client";

import { Package } from "lucide-react";
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
      <div className="bg-card grid justify-items-center gap-3 rounded-3xl px-6 py-12 text-center">
        <span className="bg-secondary grid size-12 place-items-center rounded-full">
          <Package aria-hidden="true" className="text-muted-foreground size-5" />
        </span>
        <p className="font-medium">No warranties yet</p>
        <p className="text-muted-foreground text-sm">Products you activate will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="divide-border bg-card divide-y overflow-hidden rounded-3xl">
      {registrations.map((registration, index) => {
        const status = getWarrantyStatus(registration.expiresOn);
        const active = status.state === "active";

        return (
          <motion.li
            key={registration.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: index * 0.04 }}
            className="hover:bg-secondary/60 flex items-center gap-4 px-5 py-4 transition-colors"
          >
            <span
              aria-hidden="true"
              className="bg-secondary grid size-11 shrink-0 place-items-center rounded-full text-base font-semibold"
            >
              {registration.productName.charAt(0).toUpperCase()}
            </span>
            <div className="grid min-w-0 flex-1 gap-0.5">
              <p className="truncate font-medium">{registration.productName}</p>
              <p className="text-muted-foreground truncate font-mono text-xs">
                {registration.serialNumber}
                {registration.retailer ? ` · ${registration.retailer}` : ""}
              </p>
            </div>
            <div className="grid shrink-0 justify-items-end gap-0.5 text-right">
              <p
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  active ? "text-success" : "text-muted-foreground",
                )}
              >
                {active ? `${status.daysLeft} days` : "Expired"}
              </p>
              <p className="text-muted-foreground text-xs tabular-nums">
                {active ? "until " : ""}
                {formatIsoDate(registration.expiresOn)}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
