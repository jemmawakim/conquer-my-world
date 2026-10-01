"use client";

import { FlaskConical, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type WeirdLabErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WeirdLabError({ error, reset }: WeirdLabErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="mx-auto grid w-full max-w-xl justify-items-center gap-4 px-4 py-24 text-center"
      role="alert"
    >
      <FlaskConical className="text-destructive size-10" aria-hidden="true" />
      <h1 className="text-2xl font-semibold tracking-tight">The experiment exploded</h1>
      <p className="text-muted-foreground">
        Something broke while preparing the lab. Sweep up the glass and try again.
      </p>
      {error.digest ? (
        <p className="text-muted-foreground font-mono text-xs">Reference: {error.digest}</p>
      ) : null}
      <Button onClick={reset}>
        <RotateCcw aria-hidden="true" />
        Run it again
      </Button>
    </main>
  );
}
