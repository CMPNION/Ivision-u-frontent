"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { logout } from "@/shared/auth/auth-gate";
import { Button } from "@/shared/ui/button";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const committeeNav: NavItem[] = [
  { href: "/dashboard", label: "Пайплайн", icon: LayoutDashboard },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/committee/profile", label: "Профиль", icon: UserCircle2 },
];

const applicantNav: NavItem[] = [
  { href: "/applicant/profile", label: "Профиль", icon: UserCircle2 },
  { href: "/applicant", label: "Заявки", icon: LayoutDashboard },
];

const isActivePath = (pathname: string, href: string): boolean => {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/candidates/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

export function BottomNav(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const isApplicant = pathname?.startsWith("/applicant") ?? false;
  const navItems = isApplicant ? applicantNav : committeeNav;

  const handleLogout = (): void => {
    logout();
    router.push("/login");
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:hidden"
      aria-label="Primary mobile navigation"
    >
      <ul
        className="mx-auto grid h-16 max-w-screen-sm"
        style={{
          gridTemplateColumns: `repeat(${navItems.length + 1}, minmax(0, 1fr))`,
        }}
      >
        {navItems.map((item) => {
          const active = isActivePath(pathname || "", item.href);
          const Icon = item.icon;

          return (
            <li key={item.href} className="h-full">
              <Link
                href={item.href}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1 border-r border-slate-100 text-xs font-medium transition-colors last:border-r-0",
                  active
                    ? "text-[#c1f11d]"
                    : "text-slate-500 hover:text-slate-800 active:text-slate-900",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-[#c1f11d]" : "text-slate-500",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}

        {/* Logout button */}
        <li className="h-full border-l border-rose-100">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-none text-xs font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Выйти</span>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
