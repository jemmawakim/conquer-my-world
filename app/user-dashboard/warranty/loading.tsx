import { Skeleton } from "@/components/ui/Skeleton";

export default function WarrantyLoading() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-14 px-4 py-8 sm:py-12" aria-busy="true">
      <span className="sr-only" role="status">
        Loading your warranties…
      </span>
      <div className="grid gap-6">
        <Skeleton className="size-9 rounded-full" />
        <div className="grid gap-3">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-6 w-80" />
        </div>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[1.586] w-full rounded-3xl" />
        <div className="grid gap-5">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
          <Skeleton className="mt-2 h-14 w-full rounded-full" />
        </div>
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    </main>
  );
}
