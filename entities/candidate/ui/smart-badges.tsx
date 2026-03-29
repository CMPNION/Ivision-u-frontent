"use client";

import type { Candidate } from "@/shared/types/candidate";
import { getSmartSignals } from "@/entities/candidate/model/selectors";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";
import { AlertTriangle, Gem, Star } from "lucide-react";

type Props = {
  candidate: Candidate;
  className?: string;
  compact?: boolean;
};

const signalMeta = {
  highPotential: {
    label: "Высокий потенциал",
    icon: Star,
    variant: "success" as const,
    hint: "AI оценка ≥ 85",
  },
  hiddenGem: {
    label: "Скрытый талант",
    icon: Gem,
    variant: "warning" as const,
    hint: "Высокий рост и низкий AI риск",
  },
  aiRisk: {
    label: "AI риск",
    icon: AlertTriangle,
    variant: "danger" as const,
    hint: "Вероятность AI ≥ 90%",
  },
};

export function SmartBadges({
  candidate,
  className,
  compact = false,
}: Props): React.JSX.Element | null {
  const signals = getSmartSignals(candidate);

  if (signals.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {signals.map((signal) => {
        const meta = signalMeta[signal];
        const Icon = meta.icon;
        return (
          <Badge
            key={signal}
            variant={meta.variant}
            className={cn(
              "flex items-center gap-1.5",
              !compact && "pr-3",
              compact && "px-2 py-0.5",
            )}
            title={meta.hint}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span className="text-xs font-medium">{meta.label}</span>
          </Badge>
        );
      })}
    </div>
  );
}
