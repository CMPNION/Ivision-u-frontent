"use client";

import { Fragment } from "react";
import { CheckCircle, Circle } from "lucide-react";

import type { Assessment } from "@/shared/types/candidate";
import { cn } from "@/shared/lib/cn";

type Props = {
  milestones: Assessment["keyMilestones"];
  className?: string;
  title?: string;
  /**
   * Показывать ли чекмарки для завершённых шагов
   */
  completedCount?: number;
};

export function MilestonesTimeline({
  milestones,
  className,
  title = "Ключевые этапы",
  completedCount = 0,
}: Props): React.JSX.Element {
  const hasItems = milestones && milestones.length > 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {hasItems && (
          <span className="text-xs text-slate-500">
            Завершено: {Math.min(completedCount, milestones.length)} /{" "}
            {milestones.length}
          </span>
        )}
      </div>

      {!hasItems ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          Нет данных по этапам.
        </div>
      ) : (
        <ol className="relative space-y-5 border-l border-slate-200 pl-4">
          {milestones.map((milestone, index) => {
            const isDone = index < completedCount;
            const Icon = isDone ? CheckCircle : Circle;

            return (
              <Fragment key={`${milestone}-${index}`}>
                <li className="group relative pl-2">
                  <span className="absolute -left-[33px] flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#c1f11d] ring-2 ring-white">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isDone ? "text-[#c1f11d]" : "text-slate-300",
                      )}
                      aria-hidden
                    />
                  </span>
                  <div className="text-sm font-medium text-slate-900">
                    {milestone}
                  </div>
                  <div className="text-xs text-slate-500">Шаг {index + 1}</div>
                </li>
              </Fragment>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default MilestonesTimeline;
