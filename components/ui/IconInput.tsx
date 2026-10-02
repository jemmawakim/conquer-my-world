import type { LucideIcon } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

type IconInputProps = InputProps & {
  icon: LucideIcon;
};

/** Filled, borderless input with a leading icon. Ref and register() props pass straight through. */
export function IconInput({ icon: Icon, className, ...props }: IconInputProps) {
  return (
    <div className="group relative">
      <Icon
        aria-hidden="true"
        className="text-muted-foreground group-focus-within:text-foreground pointer-events-none absolute top-1/2 left-4 size-[1.125rem] -translate-y-1/2 transition-colors"
      />
      <Input
        className={cn(
          "bg-secondary h-14 rounded-2xl border-transparent pl-12 text-base shadow-none md:text-base",
          "hover:bg-accent transition-[background-color,box-shadow]",
          "focus-visible:bg-accent focus-visible:ring-brand focus-visible:border-transparent focus-visible:ring-2",
          "aria-invalid:ring-destructive/70 aria-invalid:ring-2",
          className,
        )}
        {...props}
      />
    </div>
  );
}
