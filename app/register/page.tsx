"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { register } from "@/shared/auth/auth-gate";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
};

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirm) {
      setError("Пароль и подтверждение не совпадают.");
      return;
    }

    setLoading(true);
    try {
      await register({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        birth_date: "2000-01-01", // Default value, should be added to form
        email: form.email.trim(),
        password: form.password,
        role: "abiturient",
      });
      setSuccess("Учётная запись создана. Выполните вход.");
      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось зарегистрироваться.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-12">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c1f11d]">
          inVision U Admissions
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Регистрация
        </h1>
        <p className="text-sm text-slate-500 sm:text-base">
          Заполните данные, чтобы создать учётную запись. После подтверждения вы
          сможете войти в систему.
        </p>
      </header>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#c1f11d]" />
            Создание аккаунта
          </CardTitle>
          <CardDescription>
            Укажите персональные данные и пароль для создания учётной записи.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                Имя
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                Фамилия
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              Рабочий email
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                Пароль
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange("password")}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                Подтвердите пароль
                <input
                  type="password"
                  required
                  value={form.confirm}
                  onChange={handleChange("confirm")}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
                />
              </label>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-[#c1f11d]/40 bg-[#c1f11d]/20 px-3 py-2 text-sm text-[#2f3b00]">
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Создаём..." : "Зарегистрироваться"}
            </Button>

            <div className="text-center text-sm text-slate-600">
              Уже есть аккаунт?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#2f3b00] hover:underline"
              >
                Войти
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
