"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

const SPECIMENS = [
  { id: "tomato", glyph: "🍅", label: "Tomato" },
  { id: "cucumber", glyph: "🥒", label: "Cucumber" },
  { id: "eggplant", glyph: "🍆", label: "Eggplant" },
  { id: "pepper", glyph: "🌶️", label: "Pepper" },
  { id: "avocado", glyph: "🥑", label: "Avocado" },
] as const;

export function DragPlayground() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [flings, setFlings] = useState(0);

  return (
    <div className="grid gap-3">
      <div
        ref={constraintsRef}
        className="border-border bg-muted/40 relative flex h-56 flex-wrap items-center justify-center gap-4 overflow-hidden rounded-xl border border-dashed p-4"
      >
        {SPECIMENS.map((specimen, index) => (
          <motion.button
            key={specimen.id}
            type="button"
            aria-label={`Drag the ${specimen.label}`}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.6}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 12 }}
            onDragEnd={() => setFlings((count) => count + 1)}
            initial={reduceMotion ? false : { opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.08 }}
            whileHover={reduceMotion ? undefined : { scale: 1.2, rotate: 12 }}
            whileTap={{ scale: 0.85 }}
            whileDrag={{ scale: 1.3, rotate: -15 }}
            className="bg-card cursor-grab touch-none rounded-full p-3 text-4xl shadow-sm will-change-transform select-none active:cursor-grabbing"
          >
            {specimen.glyph}
          </motion.button>
        ))}
      </div>
      <p className="text-muted-foreground font-mono text-xs" aria-live="polite">
        Specimens flung: {flings}
      </p>
    </div>
  );
}
