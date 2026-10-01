import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Button } from "@/components/ui/Button";
import { fromDbRow } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function UserDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this route; this is defence in depth.
  if (!user) redirect("/login?next=/user-dashboard");

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load your profile.", { cause: error });
  }

  const profile = data ? fromDbRow("user_profiles", data) : null;

  return (
    <main className="mx-auto grid w-full max-w-2xl gap-8 px-4 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {profile?.displayName ? `Hi, ${profile.displayName}` : "Your dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm">Signed in as {user.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </header>

      <section className="border-border bg-card text-card-foreground rounded-xl border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <ProfileForm profile={profile} />
      </section>
    </main>
  );
}
