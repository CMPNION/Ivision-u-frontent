"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Calendar, FileText, Play, User2 } from "lucide-react";

import {
  approveApplication,
  denyApplication,
  getApplicationById,
  markConsidering,
} from "@/shared/api/mockApplications";
import type {
  ApplicationFullView,
  ApplicationStatus,
} from "@/shared/types/applications";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import AIExplainPanel from "@/widgets/assessment/ui/ai-explain-panel";
import MetricsRadar from "@/widgets/assessment/ui/metrics-radar";

import EssayViewer from "@/widgets/assessment/ui/essay-viewer";

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

export default function ApplicationDetailPage(): React.JSX.Element {
  const params = useParams();
  const appId = useMemo(() => {
    const raw = params?.id;
    if (Array.isArray(raw)) return raw[0] ?? "";
    return raw?.toString() ?? "";
  }, [params]);
  const [view, setView] = useState<ApplicationFullView | null>(null);

  // On load: viewing triggers transition pending -> considering
  useEffect(() => {
    if (!appId) return;
    const next = markConsidering(appId) ?? getApplicationById(appId);
    if (next) setView({ ...next });
  }, [appId]);

  const ai = useMemo(() => view?.application.ai_recommendation ?? {}, [view]);

  const handleApprove = (): void => {
    if (!view) return;
    const updated = approveApplication(view.application.id);
    if (updated) setView({ ...updated });
  };

  const handleDeny = (): void => {
    if (!view) return;
    const updated = denyApplication(view.application.id);
    if (updated) setView({ ...updated });
  };

  if (!view) {
    return (
      <section className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Заявка не найдена
        </h1>
        <p className="text-sm text-slate-500">
          Проверьте идентификатор заявки или вернитесь к списку.
        </p>
      </section>
    );
  }

  const { application, user, cluster } = view;
  const totalScore = Number(ai.totalScore ?? 0);
  const aiProbability = Number(ai.aiProbability ?? 0);
  const metrics = ai.metrics ?? {
    leadership: 0,
    resilience: 0,
    techBase: 0,
    socialImpact: 0,
    growthDelta: 0,
  };
  const milestones = ai.keyMilestones ?? [];
  const explainability = ai.explainability ?? {
    reasoning: "",
    flags: [],
  };
  const essayText =
    ai.essayText ??
    "Эссе доступно по ссылке. Загрузите документ, чтобы прочитать полный текст.";

  return (
    <section className="space-y-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 -mx-4 mb-2 bg-gradient-to-b from-white/95 via-white to-white/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border sm:border-slate-200 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-semibold text-slate-900 sm:text-2xl">
                {user.first_name} {user.last_name}
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[application.status]}`}
              >
                {statusLabel[application.status]}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Дата рождения: {formatDate(user.birth_date)} • Подана:{" "}
              {formatDate(application.created_at)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" onClick={handleDeny}>
              Отклонить
            </Button>
            <Button onClick={handleApprove}>Одобрить</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1.15fr]">
        {/* Left column: cluster (video + essay) */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-4 w-4 text-[#2f3b00]" aria-hidden />
                Видео-интервью
              </CardTitle>
              <span className="rounded-full bg-[#c1f11d]/30 px-3 py-1 text-xs font-semibold text-[#2f3b00]">
                AI Transcript Generated
              </span>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-lg bg-slate-100 ring-1 ring-inset ring-slate-200">
                <video
                  controls
                  src={cluster.interview_video_url}
                  className="h-full w-full rounded-lg object-cover"
                >
                  Ваш браузер не поддерживает видео.
                </video>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                <a
                  href={cluster.interview_video_url}
                  download
                  className="font-semibold text-[#2f3b00] hover:underline"
                >
                  Скачать видео (MP4)
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-700" aria-hidden />
                Эссе
              </CardTitle>
              <a
                href={cluster.essay_document_url}
                download
                className="text-xs font-semibold text-[#2f3b00] hover:underline"
              >
                Скачать эссе (PDF)
              </a>
            </CardHeader>
            <CardContent className="space-y-3">
              <EssayViewer text={essayText} flags={explainability.flags} />
              <div className="text-xs text-slate-500">
                <a
                  href={cluster.essay_document_url}
                  download
                  className="font-semibold text-[#2f3b00] hover:underline"
                >
                  Скачать эссе (PDF)
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: analysis */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Информация о заявке</CardTitle>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <User2 className="h-4 w-4" aria-hidden />
                {user.email}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                {application.tags.length === 0 ? (
                  <span className="text-slate-400">Нет тегов</span>
                ) : (
                  application.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-medium"
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    AI оценка
                  </span>
                  <span className="text-lg font-semibold text-slate-900">
                    {totalScore} / 100
                  </span>
                </div>
                <Progress value={totalScore} />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle
                      className="h-4 w-4 text-amber-500"
                      aria-hidden
                    />
                    Вероятность AI
                  </span>
                  <span className="font-semibold text-amber-600">
                    {aiProbability}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Профиль метрик (AI)</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsRadar metrics={metrics} />
            </CardContent>
          </Card>

          <AIExplainPanel explainability={explainability} />
        </div>
      </div>
    </section>
  );
}
