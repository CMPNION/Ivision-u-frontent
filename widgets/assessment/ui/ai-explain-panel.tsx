"use client";

import { AlertTriangle, Bot } from "lucide-react";

import type { Assessment } from "@/shared/types/candidate";
import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/ui/badge";

type Props = {
  explainability?: Assessment["explainability"];
  className?: string;
  title?: string;
};

export function AIExplainPanel({
  explainability,
  className,
  title = "AI объяснимость",
}: Props): React.JSX.Element {
  const hasReasoning = Boolean(explainability?.reasoning?.trim());
  const flags = explainability?.flags ?? [];
  const hasFlags = flags.length > 0;

  const isEmpty = !hasReasoning && !hasFlags;

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
      aria-label={title}
    >
      <div className="mb-4 flex items-center gap-2">
        <Bot className="h-5 w-5 text-[#c1f11d]" aria-hidden />
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          Нет данных объяснимости для этого кандидата.
        </div>
      ) : (
        <div className="space-y-4">
          {hasReasoning && (
            <div className="rounded-lg border border-[#c1f11d]/40 bg-[#c1f11d]/15 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#2f3b00]">
                Обоснование AI
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-800">
                {explainability?.reasoning}
              </p>
            </div>
          )}

          {hasFlags && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />
                Флаги/наблюдения
              </div>
              <div className="flex flex-wrap gap-2">
                {flags.map((flag) => (
                  <Badge
                    key={flag}
                    variant="warning"
                    className="flex items-center gap-1 px-3 py-1 text-xs"
                  >
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIExplainPanel;
