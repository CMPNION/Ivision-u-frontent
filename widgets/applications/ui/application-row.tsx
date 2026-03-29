"use client";

import { ArrowRight, Calendar, Tag } from "lucide-react";
import Link from "next/link";

import type {
  ApplicationFullView,
  ApplicationStatus,
} from "@/shared/types/applications";
import { cn } from "@/shared/lib/cn";

type Props = {
  view: ApplicationFullView;
  href?: string;
  className?: string;
  onSelect?: (id: string) => void;
};

const statusLabel: Record<ApplicationStatus, string> = {
  pending: "Ожидает",
  revoken: "Отозвана",
  considering: "Рассматривается",
  denied: "Отклонена",
  approved: "Одобрена",
};

const statusTone: Record<ApplicationStatus, string> = {
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  revoken: "bg-amber-50 text-amber-700 border-amber-100",
  considering: "bg-blue-50 text-blue-700 border-blue-100",
  denied: "bg-rose-50 text-rose-700 border-rose-100",
  approved: "bg-[#c1f11d]/20 text-[#2f3b00] border-[#c1f11d]/50",
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function ApplicationRow({
  view,
  href,
  className,
  onSelect,
}: Props): React.JSX.Element {
  const { application, user, cluster } = view;
  const aiScore = Number(application.ai_recommendation?.totalScore ?? 0);
  const aiProbability = Number(
    application.ai_recommendation?.aiProbability ?? 0,
  );
  const content = (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c1f11d]/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c1f11d] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:flex-row sm:items-center sm:gap-4",
        className,
      )}
      onClick={() => onSelect?.(application.id)}
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-base font-semibold text-slate-900">
            {user.first_name} {user.last_name}
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
              statusTone[application.status],
            )}
          >
            {statusLabel[application.status]}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-4 w-4" aria-hidden />
            <span>Подана: {formatDate(application.created_at)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            AI: {aiScore}/100
          </span>
          <span className="text-xs text-slate-500">
            Вероятность AI: {aiProbability}%
          </span>
          {application.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
            >
              <Tag className="h-3.5 w-3.5" aria-hidden />
              {tag}
            </span>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Кластер:{" "}
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(cluster.interview_video_url, "_blank");
            }}
            role="button"
            tabIndex={0}
            className="cursor-pointer font-semibold text-[#2f3b00] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c1f11d] focus-visible:ring-offset-2"
          >
            Скачать видео
          </span>{" "}
          •{" "}
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(cluster.essay_document_url, "_blank");
            }}
            role="button"
            tabIndex={0}
            className="cursor-pointer font-semibold text-[#2f3b00] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c1f11d] focus-visible:ring-offset-2"
          >
            Скачать эссе (PDF)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-[#2f3b00]">
        <span>Анализ</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-0"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default ApplicationRow;
