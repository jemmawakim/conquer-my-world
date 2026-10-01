import { Skeleton } from "@/components/ui/Skeleton";

export default function WarrantyLoading() {
  return (
    <main className="mx-auto grid w-full max-w-2xl gap-8 px-4 py-12" aria-busy="true">
      <span className="sr-only" role="status">
        Loading your warranties…
      </span>
      <div className="grid gap-3">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="border-border grid gap-5 rounded-xl border p-6">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid gap-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </main>
  );
}
