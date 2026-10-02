import { Skeleton } from "@/components/ui/Skeleton";

export default function WarrantyLoading() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-10 sm:py-14" aria-busy="true">
      <span className="sr-only" role="status">
        Loading your warranties…
      </span>
      <div className="grid gap-4">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-6 w-44 rounded-full" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        <Skeleton className="aspect-[1.586] w-full rounded-2xl" />
        <div className="border-border grid gap-6 rounded-2xl border p-6 sm:p-8">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <div className="grid gap-6 sm:grid-cols-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
      <div className="grid gap-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-20 w-full" />
      </div>
    </main>
  );
}
