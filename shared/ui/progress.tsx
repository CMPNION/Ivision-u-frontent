import * as React from "react";

import { cn } from "@/shared/lib/cn";

type ProgressProps = React.ComponentPropsWithoutRef<"div"> & {
  value?: number;
  max?: number;
};

export function Progress({
  className,
  value = 0,
  max = 100,
  ...props
}: ProgressProps): React.JSX.Element {
  const safeMax = Math.max(1, max);
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = (clampedValue / safeMax) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clampedValue}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-100",
        className,
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-[#c1f11d] transition-all duration-300 ease-out"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
