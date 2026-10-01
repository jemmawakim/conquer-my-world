import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center" aria-busy="true">
      <Loader2 className="text-muted-foreground size-6 animate-spin" aria-hidden="true" />
      <span className="sr-only" role="status">
        Loading…
      </span>
    </main>
  );
}
