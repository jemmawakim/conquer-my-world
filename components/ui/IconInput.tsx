import type { LucideIcon } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

type IconInputProps = InputProps & {
  icon: LucideIcon;
};

/** Input with a leading decorative icon. Ref and register() props pass straight through. */
export function IconInput({ icon: Icon, className, ...props }: IconInputProps) {
  return (
    <div className="group relative">
      <Icon
        aria-hidden="true"
        className="text-muted-foreground group-focus-within:text-brand pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 transition-colors"
      />
      <Input className={cn("h-11 rounded-lg pl-10", className)} {...props} />
    </div>
  );
}
