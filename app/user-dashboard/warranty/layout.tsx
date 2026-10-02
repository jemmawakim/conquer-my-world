import type { ReactNode } from "react";

/** Dark-first section (fintech style). Wraps page, loading and error states alike. */
export default function WarrantyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark bg-background text-foreground min-h-dvh [color-scheme:dark]">
      {children}
    </div>
  );
}
