"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// transform + opacity only → composited on the GPU.
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 24 } },
};

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={container}
      initial={reduceMotion ? "visible" : "hidden"}
      animate="visible"
      className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center"
    >
      <motion.p
        variants={item}
        className="border-border text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium"
      >
        Your goals, mapped.
      </motion.p>
      <motion.h1
        variants={item}
        className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
      >
        Conquer my world
      </motion.h1>
      <motion.p variants={item} className="text-muted-foreground max-w-xl text-lg text-pretty">
        Plan ambitious goals, track every step, and watch your progress come alive.
      </motion.p>
      <motion.div variants={item} className="flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/sign-up">
            Get started
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </motion.div>
    </motion.section>
  );
}
