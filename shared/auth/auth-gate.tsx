"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { UserRole } from "@/shared/types/applications";
import { authAPI } from "@/shared/api/client";

type SessionUser = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  token?: string;
  refreshToken?: string;
};

const STORAGE_KEY = "auth.session";

function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function writeSession(user: SessionUser): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export async function login(
  email: string,
  password: string,
): Promise<SessionUser> {
  try {
    const { session } = await authAPI.login(email, password);
    return {
      email: session.email,
      role: session.role as UserRole,
      firstName: session.firstName,
      lastName: session.lastName,
      token: session.token,
      refreshToken: session.refreshToken,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Неверный email или пароль");
  }
}

export async function register(payload: {
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<SessionUser> {
  try {
    const { session } = await authAPI.register({
      first_name: payload.first_name,
      last_name: payload.last_name,
      birth_date: payload.birth_date,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });
    return {
      email: session.email,
      role: session.role as UserRole,
      firstName: session.firstName,
      lastName: session.lastName,
      token: session.token,
      refreshToken: session.refreshToken,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Не удалось зарегистрировать пользователя");
  }
}

export function logout(): void {
  authAPI.logout();
  clearSession();
}

type AuthGateProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
};

export function useSessionState(): {
  session: SessionUser | null;
  ready: boolean;
} {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handle = () => setSession(readSession());
    handle();
    setReady(true);
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  return { session, ready };
}

export function useSessionUser(): SessionUser | null {
  return useSessionState().session;
}

export function AuthGate({
  children,
  allowedRoles,
  redirectTo = "/login",
  fallback = null,
}: AuthGateProps): React.JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const { session, ready } = useSessionState();

  if (isAuthPage) {
    return <>{children}</>;
  }

  const isRoleAllowed = useMemo(() => {
    if (!session) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(session.role);
  }, [session, allowedRoles]);

  useEffect(() => {
    if (isAuthPage || !ready) return;

    if (!session) {
      router.replace(
        `${redirectTo}?next=${encodeURIComponent(pathname || "/")}`,
      );
      return;
    }
    if (!isRoleAllowed) {
      router.replace("/login");
    }
  }, [session, ready, isRoleAllowed, router, redirectTo, pathname, isAuthPage]);

  return <>{children}</>;
}
