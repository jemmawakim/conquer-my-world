"use client";

import { useEffect, useState } from "react";
import { StatusRow, type StatusRowStatus } from "@/components/lab/StatusRow";

type ClientCheck = { id: string; label: string; status: StatusRowStatus; detail: string };

const PENDING: ClientCheck[] = [
  {
    id: "hydration",
    label: "React hydration",
    status: "pending",
    detail: "Waiting for the browser…",
  },
  { id: "webgl", label: "WebGL for React Three Fiber", status: "pending", detail: "Probing GPU…" },
  { id: "motion-pref", label: "Motion preference", status: "pending", detail: "Asking the OS…" },
];

function detectWebGl(): ClientCheck {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) {
    return {
      id: "webgl",
      label: "WebGL for React Three Fiber",
      status: "fail",
      detail: "Not available",
    };
  }
  const version = gl instanceof WebGL2RenderingContext ? "WebGL 2" : "WebGL 1";
  return { id: "webgl", label: "WebGL for React Three Fiber", status: "pass", detail: version };
}

export function ClientChecks() {
  const [checks, setChecks] = useState<ClientCheck[]>(PENDING);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setChecks([
      {
        id: "hydration",
        label: "React hydration",
        status: "pass",
        detail: `Hydrated in ${Math.round(performance.now())} ms after navigation start`,
      },
      detectWebGl(),
      {
        id: "motion-pref",
        label: "Motion preference",
        status: reduced ? "warn" : "pass",
        detail: reduced ? "Reduced motion on: animations toned down" : "Full motion enabled",
      },
    ]);
  }, []);

  return (
    <>
      {checks.map((check) => (
        <StatusRow key={check.id} label={check.label} status={check.status} detail={check.detail} />
      ))}
    </>
  );
}
