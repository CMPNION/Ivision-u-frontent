import * as React from "react";

import { cn } from "@/shared/lib/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline";

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200/80",
  success:
    "border-transparent bg-[#c1f11d]/20 text-[#5b6f00] hover:bg-[#c1f11d]/30",
  warning:
    "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200/80",
  danger: "border-transparent bg-rose-100 text-rose-700 hover:bg-rose-200/80",
  outline: "border-slate-200 text-slate-700 bg-white",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
