"use client";

import { useEffect } from "react";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Replaces the root layout when the layout itself throws. */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">The application failed to load</h1>
        {error.digest ? (
          <p className="text-muted-foreground text-xs">Reference: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
