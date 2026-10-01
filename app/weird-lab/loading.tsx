import { Skeleton } from "@/components/ui/Skeleton";

export default function WeirdLabLoading() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12" aria-busy="true">
      <span className="sr-only" role="status">
        Warming up the lab…
      </span>
      <div className="grid justify-items-center gap-4">
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-16 w-full max-w-lg" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {["blob", "vitals", "fling", "oracle"].map((key) => (
          <div key={key} className="border-border grid gap-4 rounded-2xl border p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-56 w-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
