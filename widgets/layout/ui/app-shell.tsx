"use client";

import * as React from "react";

import { usePathname } from "next/navigation";

import { AuthGate } from "@/shared/auth/auth-gate";
import { BottomNav } from "@/widgets/layout/ui/bottom-nav";
import { Sidebar } from "@/widgets/layout/ui/sidebar";

/**
 * Клиентский shell для страниц с навигацией и защитой входа.
 * Показывает сайдбар (desktop) и bottom-nav (mobile), ролевое меню определяется по пути:
 * - /applicant... → меню абитуриента
 * - иначе → меню приёмной комиссии
 */
export function AppShell({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");

  const content = (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="hidden md:block border-r border-slate-200 bg-white">
        <Sidebar />
      </aside>

      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">{children}</main>
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AuthGate redirectTo="/login" fallback={null}>
      {content}
    </AuthGate>
  );
}

export default AppShell;
