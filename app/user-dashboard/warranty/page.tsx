import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { WarrantyForm } from "@/components/warranty/WarrantyForm";
import { WarrantyList } from "@/components/warranty/WarrantyList";
import { fromDbRows } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";
import { WARRANTY_MONTHS } from "@/lib/warranty/warrantyStatus";

export const metadata: Metadata = { title: "Activate a warranty" };

export default async function WarrantyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this route; this is defence in depth.
  if (!user) redirect("/login?next=/user-dashboard/warranty");

  // RLS limits this to the signed-in user's rows.
  const { data, error } = await supabase
    .from("warranty_registrations")
    .select("*")
    .order("activated_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load your warranties.", { cause: error });
  }

  const registrations = fromDbRows("warranty_registrations", data);

  return (
    <main className="relative isolate mx-auto grid w-full max-w-5xl gap-14 px-4 py-8 sm:py-12">
      <div
        aria-hidden="true"
        className="bg-brand/20 pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-96 max-w-2xl rounded-full blur-3xl"
      />

      <header className="grid gap-6">
        <Button asChild variant="secondary" size="icon" className="rounded-full">
          <Link href="/user-dashboard" aria-label="Back to dashboard">
            <ArrowLeft aria-hidden="true" />
          </Link>
        </Button>
        <div className="grid gap-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Activate warranty</h1>
          <p className="text-muted-foreground max-w-md text-lg">
            {WARRANTY_MONTHS} months of cover, starting from your purchase date.
          </p>
        </div>
      </header>

      <WarrantyForm />

      <section className="grid gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight">Your warranties</h2>
          <span className="text-muted-foreground text-sm tabular-nums">{registrations.length}</span>
        </div>
        <WarrantyList registrations={registrations} />
      </section>
    </main>
  );
}
