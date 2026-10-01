import { CircleAlert, CircleCheck, CircleX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type StatusRowStatus = "pass" | "warn" | "fail" | "pending";

type StatusRowProps = {
  label: string;
  status: StatusRowStatus;
  detail: string;
};

const ICONS = {
  pass: CircleCheck,
  warn: CircleAlert,
  fail: CircleX,
  pending: Loader2,
} as const;

const LABELS: Record<StatusRowStatus, string> = {
  pass: "Passed",
  warn: "Warning",
  fail: "Failed",
  pending: "Checking",
};

export function StatusRow({ label, status, detail }: StatusRowProps) {
  const Icon = ICONS[status];
  return (
    <li className="flex items-start gap-3 py-3">
      <Icon
        aria-label={LABELS[status]}
        className={cn(
          "mt-0.5 size-5 shrink-0",
          status === "pass" && "text-success",
          status === "warn" && "text-warning",
          status === "fail" && "text-destructive",
          status === "pending" && "text-muted-foreground animate-spin",
        )}
      />
      <div className="grid min-w-0 gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-muted-foreground truncate font-mono text-xs">{detail}</span>
      </div>
    </li>
  );
}
