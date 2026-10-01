"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

// three.js touches `window`, so the scene is client-only and split into its own chunk.
const WobbleBlob = dynamic(() => import("@/components/lab/WobbleBlob"), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-full" />,
});

export function WobbleScene() {
  return (
    <div className="relative aspect-square w-full max-w-md">
      <WobbleBlob />
      <p className="text-muted-foreground pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-xs">
        hover to poke it
      </p>
    </div>
  );
}
