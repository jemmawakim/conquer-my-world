"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

type ScrambleTitleProps = {
  text: string;
};

export function ScrambleTitle({ text }: ScrambleTitleProps) {
  const scopeRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");

        gsap
          .timeline()
          .from(letters, {
            y: () => gsap.utils.random(-120, 120),
            x: () => gsap.utils.random(-60, 60),
            rotation: () => gsap.utils.random(-180, 180),
            scale: 0,
            opacity: 0,
            duration: 1.1,
            ease: "elastic.out(1, 0.45)",
            stagger: { each: 0.04, from: "random" },
          })
          .to(letters, {
            y: -8,
            rotation: () => gsap.utils.random(-6, 6),
            duration: 0.9,
            ease: "sine.inOut",
            stagger: { each: 0.08, repeat: -1, yoyo: true },
          });
      });

      return () => mm.revert();
    },
    { scope: scopeRef },
  );

  return (
    <h1 ref={scopeRef} aria-label={text} className="text-5xl font-black tracking-tight sm:text-7xl">
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          data-letter
          aria-hidden="true"
          className="inline-block will-change-transform"
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </h1>
  );
}
