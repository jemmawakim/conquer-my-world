"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type UserDashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function UserDashboardError({ error, reset }: UserDashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto grid w-full max-w-2xl gap-4 px-4 py-12" role="alert">
      <h1 className="text-2xl font-semibold tracking-tight">
        We couldn&apos;t load your dashboard
      </h1>
      <p className="text-muted-foreground">
        Something went wrong while fetching your data. Please try again.
        {error.digest ? (
          <span className="mt-2 block text-xs">Reference: {error.digest}</span>
        ) : null}
      </p>
      <div>
        <Button onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
      </div>
    </main>
  );
}
