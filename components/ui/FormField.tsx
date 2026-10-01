import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  description?: string;
  children: ReactNode;
};

/** Label + control + accessible error message. The control must set `aria-describedby`. */
export function FormField({ id, label, error, description, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {description && !error ? (
        <p id={`${id}-description`} className="text-muted-foreground text-sm">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hasError: boolean): string {
  return hasError ? `${id}-error` : `${id}-description`;
}
