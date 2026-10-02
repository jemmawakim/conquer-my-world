import { ArrowLeft, Sparkles } from "lucide-react";
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
    <main className="relative isolate mx-auto grid w-full max-w-6xl gap-12 px-4 py-10 sm:py-14">
      {/* Ambient brand glow behind the page. */}
      <div
        aria-hidden="true"
        className="from-brand/25 to-brand-2/25 pointer-events-none absolute inset-x-0 -top-24 -z-10 mx-auto h-96 max-w-3xl rounded-full bg-linear-to-r blur-3xl"
      />

      <header className="grid gap-4">
        <Button asChild variant="ghost" size="sm" className="justify-self-start">
          <Link href="/user-dashboard">
            <ArrowLeft aria-hidden="true" />
            Dashboard
          </Link>
        </Button>
        <p className="border-brand/30 bg-brand/10 text-brand inline-flex items-center gap-2 justify-self-start rounded-full border px-3 py-1 text-xs font-semibold tracking-wide">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Takes about 30 seconds
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Protect what you just bought.
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg text-pretty">
          Enter the serial number to activate your {WARRANTY_MONTHS}-month warranty and keep every
          product in one place. No receipt hunting later.
        </p>
      </header>

      <WarrantyForm />

      <section className="grid gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Your warranties</h2>
          <span className="text-muted-foreground text-sm">{registrations.length} registered</span>
        </div>
        <WarrantyList registrations={registrations} />
      </section>
    </main>
  );
}
