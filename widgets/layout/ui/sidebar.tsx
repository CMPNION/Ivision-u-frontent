"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CheckSquare,
  LogOut,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { logout } from "@/shared/auth/auth-gate";
import { Button } from "@/shared/ui/button";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const committeeNav: NavItem[] = [
  { label: "Пайплайн", href: "/dashboard", icon: CheckSquare },
  { label: "Аналитика", href: "/analytics", icon: BarChart3 },
  { label: "Профиль", href: "/committee/profile", icon: UserCircle2 },
];

const applicantNav: NavItem[] = [
  { label: "Профиль", href: "/applicant/profile", icon: UserCircle2 },
  { label: "Заявки", href: "/applicant", icon: CheckSquare },
];

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const isApplicant = pathname?.startsWith("/applicant") ?? false;
  const navItems = isApplicant ? applicantNav : committeeNav;

  const handleLogout = (): void => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#c1f11d]/20 text-[#c1f11d]">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">inVision U</p>
            <p className="text-xs text-slate-500">Дашборд приёмной комиссии</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isApplicant
            ? item.href === "/applicant"
              ? pathname === "/applicant"
              : pathname === item.href || pathname?.startsWith(`${item.href}/`)
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? isApplicant
                    ? "border-[#c1f11d] bg-[#c1f11d]/15 text-slate-900"
                    : "border-[#c1f11d] bg-[#c1f11d]/20 text-[#2f3b00]"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <Icon
                className={[
                  "size-4",
                  isActive
                    ? isApplicant
                      ? "text-[#2f3b00]"
                      : "text-[#c1f11d]"
                    : "text-slate-400 group-hover:text-slate-600",
                ].join(" ")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 px-4 py-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="size-4" />
          <span>Выйти</span>
        </Button>
      </div>
    </aside>
  );
}
