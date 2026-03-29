"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Filter, Search } from "lucide-react";

import type { Candidate } from "@/shared/types/candidate";
import { getCandidates } from "@/shared/api/mockData";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { CandidateRow } from "@/widgets/pipeline/ui/candidate-row";
import {
  getSortableAppliedAt,
  getSortableScore,
} from "@/entities/candidate/model/selectors";

type SortOrder = "asc" | "desc";
type StatusFilter = Candidate["status"] | "all";

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "pending", label: "Ожидает" },
  { value: "considering", label: "Рассматривается" },
  { value: "approved", label: "Одобрен" },
  { value: "denied", label: "Отклонён" },
];

export function PipelineBoard(): React.JSX.Element {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const candidates = useMemo(() => getCandidates(), []);

  const filtered = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    const direction = sortOrder === "desc" ? -1 : 1;

    return candidates
      .filter((candidate) => {
        const matchStatus = status === "all" || candidate.status === status;
        const matchSearch =
          !normalizedQuery ||
          candidate.fullName.toLowerCase().includes(normalizedQuery);
        return matchStatus && matchSearch;
      })
      .map((candidate, index) => ({ candidate, index }))
      .sort((a, b) => {
        const scoreDiff =
          (getSortableScore(a.candidate) - getSortableScore(b.candidate)) *
          direction;

        if (scoreDiff !== 0) return scoreDiff;

        const dateDiff =
          (new Date(getSortableAppliedAt(a.candidate)).getTime() -
            new Date(getSortableAppliedAt(b.candidate)).getTime()) *
          direction;

        if (dateDiff !== 0) return dateDiff;

        return a.index - b.index;
      })
      .map(({ candidate }) => candidate);
  }, [candidates, search, status, sortOrder]);

  const toggleSort = (): void => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Smart Pipeline</CardTitle>
          <p className="text-sm text-slate-500">
            Поиск, фильтры по статусу и сортировка по AI оценке.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:w-60 md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 shadow-sm transition focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className="h-8 rounded-md border-none bg-transparent text-sm text-slate-800 focus:outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={toggleSort}
              className="inline-flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "desc"
                ? "AI оценка: высокие → низкие"
                : "AI оценка: низкие → высокие"}
            </Button>

            <span className="text-xs text-slate-500 sm:text-sm">
              Найдено:{" "}
              <span className="font-semibold text-slate-900">
                {filtered.length}
              </span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            Нет кандидатов по заданным критериям.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((candidate) => (
              <CandidateRow key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
