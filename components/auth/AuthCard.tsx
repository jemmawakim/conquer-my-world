"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="border-border bg-card text-card-foreground w-full max-w-sm rounded-xl border p-8 shadow-sm will-change-transform"
    >
      <header className="mb-6 grid gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </header>
      {children}
    </motion.section>
  );
}
