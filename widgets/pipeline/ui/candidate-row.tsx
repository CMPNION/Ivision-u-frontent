"use client";

import Link from "next/link";

import type { Candidate } from "@/shared/types/candidate";
import { cn } from "@/shared/lib/cn";

import { Progress } from "@/shared/ui/progress";
import { SmartBadges } from "@/entities/candidate/ui/smart-badges";
import { StatusBadge } from "@/entities/candidate/ui/status-badge";
import { getSortableScore } from "@/entities/candidate/model/selectors";

type Props = {
  candidate: Candidate;
  className?: string;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function CandidateRow({
  candidate,
  className,
}: Props): React.JSX.Element {
  const score = getSortableScore(candidate);

  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className={cn(
        "group block rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c1f11d] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c1f11d] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <div className="text-base font-semibold text-slate-900 sm:text-lg">
              {candidate.fullName}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>{candidate.location}</span>
              <span className="hidden text-slate-300 sm:inline">•</span>
              <span className="text-xs sm:text-sm">
                Подана: {formatDate(candidate.appliedAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={candidate.status} />
            <SmartBadges candidate={candidate} compact />
          </div>
        </div>

        <div className="w-full min-w-[200px] space-y-2 sm:w-64">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">AI оценка</span>
            <span className="text-sm font-semibold text-slate-900">
              {score} / 100
            </span>
          </div>
          <Progress value={score} />
          <div className="flex justify-end text-xs text-slate-500">
            Вероятность AI: {candidate.aiAssessment.aiProbability}%
          </div>
        </div>
      </div>
    </Link>
  );
}
