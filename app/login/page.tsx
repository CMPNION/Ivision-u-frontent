"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";

import { login } from "@/shared/auth/auth-gate";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testAccounts = [
    {
      label: "ПМ — Дима Дмитриев",
      email: "dmidmi11@example.com",
      password: "password123",
    },
    {
      label: "Абитуриент — Абдрахманов Данияр",
      email: "abddan@example.com",
      password: "password123",
    },
  ];

  const quickFill = (accountEmail: string, accountPassword: string): void => {
    setEmail(accountEmail);
    setPassword(accountPassword);
    setError(null);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await login(email.trim(), password);
      const next = searchParams?.get("next");
      const fallback =
        session.role === "committee" ? "/dashboard" : "/applicant";
      router.push(next || fallback);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-12">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c1f11d]">
          inVision U Admissions
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Вход в систему
        </h1>
        <p className="text-sm text-slate-500 sm:text-base">
          Введите корпоративные учётные данные для входа.
        </p>
      </header>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Доступ к системе</CardTitle>
          <CardDescription>
            Введите корпоративные учётные данные для входа в систему.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Если у вас нет доступа или возникли сложности со входом, обратитесь к
          администратору приёмной комиссии.
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-4 w-4 text-[#c1f11d]" />
            Вход
          </CardTitle>
          <CardDescription>Введите email и пароль для входа.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Введите email и пароль для входа. После успешной авторизации вы
            будете перенаправлены в соответствующий кабинет.
          </p>

          <div className="flex flex-wrap gap-2">
            {testAccounts.map((account) => (
              <Button
                key={account.email}
                variant="secondary"
                size="sm"
                onClick={() => quickFill(account.email, account.password)}
              >
                {account.label}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block space-y-1 text-sm text-slate-700">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
              />
            </label>
            <label className="block space-y-1 text-sm text-slate-700">
              Пароль
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-[#c1f11d] focus:outline-none focus:ring-2 focus:ring-[#c1f11d]/60"
              />
            </label>
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Входим..." : "Войти"}
            </Button>
            <p className="text-center text-sm text-slate-600">
              Нет аккаунта?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#c1f11d] hover:underline"
              >
                Зарегистрироваться
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
