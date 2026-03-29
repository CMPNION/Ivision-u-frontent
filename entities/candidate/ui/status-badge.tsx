"use client";

import type { Candidate } from "@/shared/types/candidate";
import {
  getStatusLabel,
  getStatusVariant,
} from "@/entities/candidate/model/selectors";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";

type Props = {
  status: Candidate["status"];
  className?: string;
  /**
   * Показывать иконку-точку перед текстом.
   */
  withDot?: boolean;
};

const dotColors: Record<Candidate["status"], string> = {
  approved: "bg-[#c1f11d]",
  denied: "bg-rose-500",
  considering: "bg-amber-500",
  pending: "bg-slate-400",
};

export function StatusBadge({
  status,
  className,
  withDot = true,
}: Props): React.JSX.Element {
  return (
    <Badge
      variant={getStatusVariant(status)}
      className={cn("flex items-center gap-2", className)}
    >
      {withDot && (
        <span
          aria-hidden
          className={cn("h-2.5 w-2.5 rounded-full", dotColors[status])}
        />
      )}
      <span>{getStatusLabel(status)}</span>
    </Badge>
  );
}
