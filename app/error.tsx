"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center"
      role="alert"
    >
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">
        An unexpected error occurred. Try again, or head back home.
      </p>
      {error.digest ? (
        <p className="text-muted-foreground text-xs">Reference: {error.digest}</p>
      ) : null}
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
