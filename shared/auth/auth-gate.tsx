"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { UserRole } from "@/shared/types/applications";
import { getAccountByEmail, mockAccounts } from "@/shared/auth/accounts";

type SessionUser = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  token?: string;
  refreshToken?: string;
};

type LoginResponse = {
  token: string;
  refresh_token: string;
  user: {
    email: string;
    role: UserRole;
    first_name?: string;
    last_name?: string;
    firstName?: string;
    lastName?: string;
  };
};

type RegisterPayload = {
  first_name: string;
  last_name: string;
  birth_date?: string;
  email: string;
  password: string;
  role: UserRole;
};

type RegisterResponse = {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  refresh_token: string;
};

export const availableAccounts = mockAccounts.map((account) => ({
  email: account.email,
  password: account.password,
  role: account.role,
  fullName: `${account.firstName} ${account.lastName}`,
}));

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

function normalizeUser(user: LoginResponse["user"]): SessionUser {
  return {
    email: user.email,
    role: user.role,
    firstName: user.first_name ?? user.firstName ?? "",
    lastName: user.last_name ?? user.lastName ?? "",
  };
}

export async function loginWithApi(
  email: string,
  password: string,
): Promise<SessionUser> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Неверный email или пароль");
  }

  const data = (await response.json()) as LoginResponse;
  const session = normalizeUser(data.user);
  session.token = data.token;
  session.refreshToken = data.refresh_token;

  writeSession(session);
  return session;
}

export function loginMock(email: string, password: string): SessionUser {
  const account = getAccountByEmail(email);
  if (!account || account.password !== password) {
    throw new Error("Неверный email или пароль");
  }

  const session: SessionUser = {
    email: account.email,
    role: account.role,
    firstName: account.firstName,
    lastName: account.lastName,
  };

  writeSession(session);
  return session;
}

export async function registerWithApi(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Не удалось зарегистрировать пользователя");
  }

  return (await response.json()) as RegisterResponse;
}

export function logout(): void {
  clearSession();
}

type AuthGateProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  /**
   * Опциональный fallback, пока идёт проверка сессии.
   */
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
    pathname.startsWith("/login") || pathname.startsWith("/register");
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
      router.replace(redirectTo + `?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isRoleAllowed) {
      router.replace("/login");
    }
  }, [session, ready, isRoleAllowed, router, redirectTo, pathname, isAuthPage]);

  return <>{children}</>;
}
