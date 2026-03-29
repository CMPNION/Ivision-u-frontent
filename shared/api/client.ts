// API client configuration with interceptors

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const STORAGE_KEY = "auth.session";

type SessionUser = {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  token?: string;
  refreshToken?: string;
};

function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function setSession(user: SessionUser | null): void {
  if (typeof window === "undefined") return;
  if (user === null) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> {
  const { skipAuth = false, headers = {}, ...restConfig } = config;

  let session = getSession();
  let token = session?.token;

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add custom headers
  Object.entries(headers).forEach(([key, value]) => {
    requestHeaders[key] = String(value);
  });

  // Add authorization header if token exists and not skipped
  if (token && !skipAuth) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // First attempt
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restConfig,
    headers: requestHeaders,
  });

  // If token is expired (401), try to refresh
  if (response.status === 401 && session?.refreshToken && !skipAuth) {
    const tokens = await refreshAccessToken(session.refreshToken);

    if (tokens) {
      // Update session with new tokens
      session = {
        ...session,
        token: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };
      setSession(session);
      token = tokens.access_token;

      // Retry the request with new token
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restConfig,
        headers: {
          ...requestHeaders,
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // Refresh failed, clear session
      setSession(null);
    }
  }

  // Handle errors
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new ApiError(errorMessage, response.status);
  }

  // Parse response
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return {} as T;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest<{
      token: string;
      refresh_token: string;
      user: {
        id: string;
        email: string;
        role: string;
        first_name: string;
        last_name: string;
        avatar?: string;
        created_at: string;
      };
    }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const session: SessionUser = {
      email: data.user.email,
      role: data.user.role,
      firstName: data.user.first_name,
      lastName: data.user.last_name,
      token: data.token,
      refreshToken: data.refresh_token,
    };

    setSession(session);
    return { session, user: data.user };
  },

  register: async (payload: {
    first_name: string;
    last_name: string;
    birth_date: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const data = await apiRequest<{
      id: string;
      email: string;
      role: string;
      token: string;
      refresh_token: string;
    }>("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const session: SessionUser = {
      email: data.email,
      role: data.role,
      firstName: payload.first_name,
      lastName: payload.last_name,
      token: data.token,
      refreshToken: data.refresh_token,
    };

    setSession(session);
    return { session, ...data };
  },

  logout: () => {
    setSession(null);
  },

  getMe: async () => {
    return apiRequest<{
      id: string;
      email: string;
      role: string;
    }>("/auth/me", {
      method: "GET",
    });
  },

  refreshToken: async (refreshToken: string) => {
    return apiRequest<{
      access_token: string;
      refresh_token: string;
    }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },
};

// Applications API
export const applicationsAPI = {
  list: async (params?: {
    status?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString();
    return apiRequest<{
      items: Array<{
        id: string;
        abitur_id: string;
        cluster_id: string;
        status: string;
        tags: string[];
        ai_recommendation: Record<string, unknown>;
        created_at: string;
      }>;
      total: number;
    }>(`/applications${query ? `?${query}` : ""}`);
  },

  getById: async (id: string) => {
    return apiRequest<{
      application: Record<string, unknown>;
      user: Record<string, unknown>;
      cluster: Record<string, unknown>;
    }>(`/applications/${id}`);
  },

  create: async (data: { abitur_id: string; cluster_id: string }) => {
    return apiRequest<{
      id: string;
      status: string;
      abitur_id: string;
      cluster_id: string;
      tags: string[];
      created_at: string;
    }>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  markConsidering: async (id: string) => {
    return apiRequest<{ status: string }>(
      `/applications/${id}/mark-considering`,
      {
        method: "POST",
      },
    );
  },

  revoke: async (id: string) => {
    return apiRequest<{ status: string }>(`/applications/${id}/revoke`, {
      method: "POST",
    });
  },

  updateStatus: async (id: string, status: "approved" | "denied") => {
    return apiRequest<{ status: string }>(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// Users API
export const usersAPI = {
  getById: async (id: string) => {
    return apiRequest<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      avatar?: string;
      created_at: string;
    }>(`/users/${id}`);
  },

  update: async (
    id: string,
    data: {
      first_name?: string;
      last_name?: string;
      birth_date?: string;
      email?: string;
      avatar?: string;
    },
  ) => {
    return apiRequest<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      avatar?: string;
      created_at: string;
    }>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ status: string }>(`/users/${id}`, {
      method: "DELETE",
    });
  },
};
