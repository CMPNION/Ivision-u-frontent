"use client";

import React from "react";

import { useSessionState } from "@/shared/auth/auth-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

function InitialsAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): React.JSX.Element {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  return (
    <div className="flex size-14 items-center justify-center rounded-full bg-[#c1f11d]/20 text-lg font-semibold text-[#2f3b00] ring-1 ring-[#c1f11d]/50">
      {initials || "?"}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function ApplicantProfilePage(): React.JSX.Element {
  const { session, ready } = useSessionState();

  if (!ready) {
    return <></>;
  }

  if (!session) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Профиль</h1>
        <p className="text-sm text-slate-500">
          Нет активной сессии. Войдите, чтобы увидеть данные абитуриента.
        </p>
      </section>
    );
  }

  const fullName = `${session.firstName} ${session.lastName}`.trim();
  const roleLabel =
    session.role === "abiturient"
      ? "Абитуриент"
      : session.role === "committee"
        ? "Член приёмной комиссии"
        : session.role;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c1f11d]">
          inVision U
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Профиль абитуриента
        </h1>
        <p className="text-sm text-slate-500 sm:text-base">
          Базовые данные текущего пользователя. Готово к подключению API (фото,
          контакты, доп. поля).
        </p>
      </header>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <InitialsAvatar
              firstName={session.firstName}
              lastName={session.lastName}
            />
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-slate-900">
                {fullName || "Неизвестный пользователь"}
              </CardTitle>
              <p className="text-sm text-slate-500 break-all">
                {session.email}
              </p>
            </div>
          </div>
          <Badge variant="success" className="bg-[#c1f11d]/20 text-[#2f3b00]">
            {roleLabel}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="Имя" value={session.firstName || "—"} />
            <InfoRow label="Фамилия" value={session.lastName || "—"} />
            <InfoRow label="Email" value={session.email || "—"} />
            <InfoRow label="Роль" value={roleLabel} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
