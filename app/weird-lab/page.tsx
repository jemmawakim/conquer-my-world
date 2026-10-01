import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ClientChecks } from "@/components/lab/ClientChecks";
import { DragPlayground } from "@/components/lab/DragPlayground";
import { ScrambleTitle } from "@/components/lab/ScrambleTitle";
import { SecretFruitForm } from "@/components/lab/SecretFruitForm";
import { StatusRow } from "@/components/lab/StatusRow";
import { WobbleScene } from "@/components/lab/WobbleScene";
import { Button } from "@/components/ui/Button";
import { runDiagnostics } from "@/lib/lab/runDiagnostics";

export const metadata: Metadata = {
  title: "Weird Lab",
  description: "A strange page that proves every layer of the stack is alive.",
};

// Diagnostics must run on every request, not once at build time.
export const dynamic = "force-dynamic";

type ExperimentProps = {
  number: string;
  title: string;
  proves: string;
  children: ReactNode;
};

function Experiment({ number, title, proves, children }: ExperimentProps) {
  return (
    <section className="border-border bg-card text-card-foreground grid gap-4 rounded-2xl border p-6 shadow-sm">
      <header className="grid gap-1">
        <p className="text-muted-foreground font-mono text-xs">EXPERIMENT {number}</p>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">Proves: {proves}</p>
      </header>
      {children}
    </section>
  );
}

export default async function WeirdLabPage() {
  const report = await runDiagnostics();
  const failures = report.checks.filter((check) => check.status === "fail").length;

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12">
      <header className="grid gap-4 text-center">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          specimen log · {report.renderedAt}
        </p>
        <ScrambleTitle text="The Weird Lab" />
        <p className="text-muted-foreground mx-auto max-w-xl">
          If everything on this page moves, wobbles, validates and reports green, the build is
          working.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Experiment
          number="01"
          title="The Blob"
          proves="React Three Fiber + drei render WebGL in a lazy client chunk"
        >
          <div className="flex justify-center">
            <WobbleScene />
          </div>
        </Experiment>

        <Experiment
          number="02"
          title="Vital Signs"
          proves="Server Components, Supabase config and the case-mapping layer"
        >
          <ul className="divide-border divide-y">
            {report.checks.map((check) => (
              <StatusRow
                key={check.id}
                label={check.label}
                status={check.status}
                detail={check.detail}
              />
            ))}
            <ClientChecks />
          </ul>
          <p className="text-muted-foreground font-mono text-xs">
            Server checks took {report.durationMs} ms ·{" "}
            {failures === 0 ? "all server checks passed" : `${failures} server check(s) failed`}
          </p>
        </Experiment>

        <Experiment
          number="03"
          title="Fling the Impostors"
          proves="Motion drag physics on GPU-composited transforms"
        >
          <DragPlayground />
        </Experiment>

        <Experiment
          number="04"
          title="The Oracle"
          proves="React Hook Form + Zod on the client, re-validated in a server action"
        >
          <SecretFruitForm />
        </Experiment>
      </div>

      <footer className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/">Leave the lab</Link>
        </Button>
      </footer>
    </main>
  );
}
