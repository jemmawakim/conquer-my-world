"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type WarrantyErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WarrantyError({ error, reset }: WarrantyErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto grid w-full max-w-2xl gap-4 px-4 py-12" role="alert">
      <h1 className="text-2xl font-semibold tracking-tight">
        We couldn&apos;t load your warranties
      </h1>
      <p className="text-muted-foreground">
        Something went wrong while fetching your registrations. Your existing warranties are safe.
        {error.digest ? (
          <span className="mt-2 block text-xs">Reference: {error.digest}</span>
        ) : null}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/user-dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
