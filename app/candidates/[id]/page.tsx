import { notFound } from "next/navigation";

import { getCandidateById } from "@/shared/api/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { StatusBadge } from "@/entities/candidate/ui/status-badge";
import { SmartBadges } from "@/entities/candidate/ui/smart-badges";
import MetricsRadar from "@/widgets/assessment/ui/metrics-radar";
import MilestonesTimeline from "@/widgets/assessment/ui/milestones-timeline";
import AIExplainPanel from "@/widgets/assessment/ui/ai-explain-panel";
import EssayViewer from "@/widgets/assessment/ui/essay-viewer";

type PageProps = {
  params: { id: string };
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function CandidatePage({
  params,
}: PageProps): React.JSX.Element {
  const candidate = getCandidateById(params.id);

  if (!candidate) {
    notFound();
  }

  const { aiAssessment } = candidate;

  return (
    <section className="space-y-6">
      {/* Sticky header with actions */}
      <div className="sticky top-0 z-10 -mx-4 mb-2 bg-gradient-to-b from-white/95 via-white to-white/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border sm:border-slate-200 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                {candidate.fullName}
              </h1>
              <StatusBadge status={candidate.status} />
              <SmartBadges candidate={candidate} />
            </div>
            <p className="text-sm text-slate-500">
              Локация: {candidate.location} • Подана:{" "}
              {formatDate(candidate.appliedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Назначить интервью</Button>
            <Button variant="destructive">Отклонить</Button>
            <Button>Одобрить</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1.2fr]">
        {/* Left column */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Видео-интервью</CardTitle>
              <span className="rounded-full bg-[#c1f11d]/30 px-3 py-1 text-xs font-semibold text-[#2f3b00]">
                AI Transcript Generated
              </span>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-lg bg-slate-100 ring-1 ring-inset ring-slate-200">
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Видео плейсхолдер
                </div>
              </div>
            </CardContent>
          </Card>

          <EssayViewer
            text={candidate.essay}
            flags={aiAssessment.explainability.flags}
          />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Итоговая AI оценка</CardTitle>
              <p className="text-sm text-slate-500">
                Суммарный балл и вероятности AI-генерации
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-semibold text-slate-900">
                  {aiAssessment.totalScore}
                </div>
                <div className="text-sm text-slate-500">/ 100</div>
              </div>
              <Progress value={aiAssessment.totalScore} />
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Вероятность AI</span>
                <span className="font-semibold text-amber-600">
                  {aiAssessment.aiProbability}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Профиль метрик</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsRadar metrics={aiAssessment.metrics} />
            </CardContent>
          </Card>

          <AIExplainPanel explainability={aiAssessment.explainability} />

          <MilestonesTimeline
            milestones={aiAssessment.keyMilestones}
            completedCount={Math.floor(aiAssessment.keyMilestones.length / 2)}
          />
        </div>
      </div>
    </section>
  );
}
