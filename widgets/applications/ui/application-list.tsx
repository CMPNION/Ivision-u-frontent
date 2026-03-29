"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getApplications,
  filterApplicationsByDate,
  markConsidering,
} from "@/shared/api/mockApplications";
import {
  type ApplicationFullView,
  type UserRole,
} from "@/shared/types/applications";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import ApplicationRow from "@/widgets/applications/ui/application-row";

type Props = {
  className?: string;
};

const roleOptions: UserRole[] = ["committee", "abiturient"];

export default function ApplicationList({
  className,
}: Props): React.JSX.Element {
  const all = useMemo(() => getApplications(), []);
  const [role, setRole] = useState<UserRole>("committee");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [views, setViews] = useState<ApplicationFullView[]>(all);

  useEffect(() => {
    const next = filterApplicationsByDate(
      fromDate || undefined,
      toDate || undefined,
    );
    setViews(next);
  }, [fromDate, toDate]);

  const handleSelect = (id: string): void => {
    if (role !== "committee") return;
    markConsidering(id);
    const next = filterApplicationsByDate(
      fromDate || undefined,
      toDate || undefined,
    );
    setViews(next);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Список заявок (Комитет)</CardTitle>
          <p className="text-sm text-slate-500">
            Фильтр по дате подачи и выбор роли для теста потоков.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {roleOptions.map((option) => (
            <Button
              key={option}
              variant={role === option ? "default" : "secondary"}
              size="sm"
              onClick={() => setRole(option)}
            >
              Роль: {option}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-medium text-slate-700">
            Фильтр по дате подачи
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              От:
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              До:
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
              />
            </label>
          </div>
        </div>

        {views.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Заявок по заданным датам нет.
          </div>
        ) : (
          <div className="space-y-3">
            {views.map((view) => (
              <ApplicationRow
                key={view.application.id}
                view={view}
                href={`/applications/${view.application.id}`}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
