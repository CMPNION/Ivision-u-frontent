"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  createApplication,
  getApplications,
  getUserByEmail,
  revokeApplication,
} from "@/shared/api/mockApplications";
import {
  type ApplicationFullView,
  type ApplicationStatus,
  type User,
} from "@/shared/types/applications";
import { useSessionState } from "@/shared/auth/auth-gate";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";

type FormState = {
  videoFile: File | null;
  essayFile: File | null;
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

function findApplicationForUser(
  userId: string,
): ApplicationFullView | undefined {
  return getApplications().find((v) => v.user.id === userId);
}

function ensureUser(
  session: { email: string; firstName?: string; lastName?: string } | null,
): User | undefined {
  if (!session) return undefined;
  const existing = getUserByEmail(session.email);
  if (existing) return existing;

  return {
    id: session.email,
    first_name: session.firstName ?? "",
    last_name: session.lastName ?? "",
    birth_date: "",
    avatar: "",
    role: "abiturient",
    email: session.email,
    created_at: new Date(0).toISOString(),
  };
}

export default function ApplicantPage(): React.JSX.Element {
  const { session, ready } = useSessionState();
  const isApplicant = session?.role === "abiturient";
  const router = useRouter();
  const pathname = usePathname();

  const [currentApplication, setCurrentApplication] = useState<
    ApplicationFullView | undefined
  >(undefined);

  const [form, setForm] = useState<FormState>({
    videoFile: null,
    essayFile: null,
  });
  const [hydrated, setHydrated] = useState(false);

  const currentUser = useMemo(
    () => (isApplicant ? ensureUser(session) : undefined),
    [session, isApplicant],
  );

  useEffect(() => {
    if (!currentUser) return;
    const existing = findApplicationForUser(currentUser.id);
    setCurrentApplication(existing);
  }, [currentUser]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!session || !isApplicant || !currentUser) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [ready, session, isApplicant, currentUser, router, pathname]);

  if (!ready) {
    return null;
  }
  if (!session || !isApplicant || !currentUser) {
    return null;
  }

  const isSubmitDisabled =
    Boolean(currentApplication) &&
    currentApplication.application.status !== "revoken";
  const submitDisabled = hydrated ? isSubmitDisabled : false;

  const canRevoke =
    Boolean(currentApplication) &&
    currentApplication?.application.status === "pending";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!currentUser || !session) return;

    const clusterId = `cluster-${Math.random().toString(36).slice(2, 8)}`;
    const videoUrl = form.videoFile
      ? URL.createObjectURL(form.videoFile)
      : "about:blank";
    const essayUrl = form.essayFile
      ? URL.createObjectURL(form.essayFile)
      : "about:blank";

    const view = createApplication({
      user: currentUser,
      cluster: {
        id: clusterId,
        interview_video_url: videoUrl,
        essay_document_url: essayUrl,
      },
      tags: [],
      ai_recommendation: {},
    });
    setCurrentApplication(view);
  };

  const handleRevoke = (): void => {
    if (!currentApplication) return;
    const updated = revokeApplication(currentApplication.application.id);
    if (updated) setCurrentApplication({ ...updated });
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Кабинет абитуриента
        </h1>
        <p className="text-sm text-slate-500 sm:text-base">
          Подайте заявку и отслеживайте статус.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Подать заявку</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Видео интервью (файл)</span>
                  <span className="text-xs text-slate-500">
                    Формат: MP4 / H.264
                  </span>
                </div>
                <input
                  required
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      videoFile: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="block w-full cursor-pointer rounded-lg border border-[#c1f11d]/60 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#c1f11d] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-900 hover:border-[#c1f11d] focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
                />
                {form.videoFile?.name && (
                  <div className="text-xs text-slate-500">
                    Выбрано: {form.videoFile.name}
                  </div>
                )}
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Эссе (PDF)</span>
                  <span className="text-xs text-slate-500">Формат: PDF</span>
                </div>
                <input
                  required
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      essayFile: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="block w-full cursor-pointer rounded-lg border border-[#c1f11d]/60 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#c1f11d] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-900 hover:border-[#c1f11d] focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
                />
                {form.essayFile?.name && (
                  <div className="text-xs text-slate-500">
                    Выбрано: {form.essayFile.name}
                  </div>
                )}
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={submitDisabled}>
                Подать заявку (status: pending)
              </Button>
              {submitDisabled && (
                <span className="text-xs text-slate-500">
                  Заявка уже подана. Отзовите, чтобы подать новую.
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Моя заявка</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentApplication ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Заявка ещё не подана.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[currentApplication.application.status]}`}
                >
                  {statusLabel[currentApplication.application.status]}
                </span>
                <span className="text-xs text-slate-500">
                  Создана:{" "}
                  {formatDate(currentApplication.application.created_at)}
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Кластер</div>
                <div className="mt-1 text-xs text-slate-600">
                  Видео:{" "}
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        currentApplication.cluster.interview_video_url,
                        "_blank",
                      )
                    }
                    className="font-semibold text-[#2f3b00] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c1f11d] focus-visible:ring-offset-2"
                  >
                    Скачать файл
                  </button>
                </div>
                <div className="text-xs text-slate-600">
                  Эссе:{" "}
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        currentApplication.cluster.essay_document_url,
                        "_blank",
                      )
                    }
                    className="font-semibold text-[#2f3b00] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c1f11d] focus-visible:ring-offset-2"
                  >
                    Скачать файл
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Теги</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {currentApplication.application.tags.length === 0 ? (
                    <span className="text-xs text-slate-400">Нет тегов</span>
                  ) : (
                    currentApplication.application.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">AI анализ</div>
                <div className="mt-2 space-y-1 rounded-md bg-[#c1f11d]/15 px-3 py-2 text-sm text-[#2f3b00]">
                  <div className="flex items-center justify-between">
                    <span>Статус</span>
                    <span>
                      {currentApplication.application.ai_recommendation
                        ?.status ?? "Ожидает данных"}
                    </span>
                  </div>
                  <Progress
                    value={
                      currentApplication.application.ai_recommendation
                        ?.totalScore ?? 0
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  disabled={!canRevoke}
                  onClick={handleRevoke}
                >
                  Отозвать заявку (revoken)
                </Button>
                {!canRevoke && (
                  <span className="text-xs text-slate-500">
                    Отозвать можно только в статусе pending.
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
