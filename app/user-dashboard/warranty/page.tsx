import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { WarrantyForm } from "@/components/warranty/WarrantyForm";
import { WarrantyList } from "@/components/warranty/WarrantyList";
import { fromDbRows } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";

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
    <main className="mx-auto grid w-full max-w-2xl gap-8 px-4 py-12">
      <header className="grid gap-3">
        <Button asChild variant="ghost" size="sm" className="justify-self-start">
          <Link href="/user-dashboard">
            <ArrowLeft aria-hidden="true" />
            Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight">Activate a warranty</h1>
        <p className="text-muted-foreground">
          Just bought something? Register its serial number to start your 12-month warranty.
        </p>
      </header>

      <section className="border-border bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
        <WarrantyForm />
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Your warranties</h2>
        <WarrantyList registrations={registrations} />
      </section>
    </main>
  );
}
