import { Skeleton } from "@/components/ui/Skeleton";

export default function UserDashboardLoading() {
  return (
    <main className="mx-auto grid w-full max-w-2xl gap-8 px-4 py-12" aria-busy="true">
      <span className="sr-only" role="status">
        Loading your dashboard…
      </span>
      <div className="flex items-center justify-between gap-4">
        <div className="grid gap-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="border-border grid gap-5 rounded-xl border p-6">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="ml-auto h-9 w-32" />
      </div>
    </main>
  );
}
