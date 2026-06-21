import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import {
  cacheAccessToken,
  cacheRefreshToken,
  clearAccessToken,
  extractAccessToken,
  extractRefreshToken,
  getAccessToken,
} from "@/lib/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BITE_BREW_API_URL ?? "http://localhost:7000/api/v1/bite-brew";
const PROTECTED_PROXY_PREFIX = "/dashboard/api/protected";
const AUTH_PROXY_PREFIX = "/dashboard/api/auth";
const PUBLIC_ENDPOINTS = [
  "/health",
  "/auth/signup",
  "/auth/signin",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh-token",
  "/newsletter/subscribe",
];

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<void> | null = null;

async function refreshTokens(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = http
      .post("/auth/refresh-token", {}, { withCredentials: true })
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

http.interceptors.request.use((config) => {
  const rawUrl = config.url ?? "";
  const path = rawUrl.startsWith("http") ? new URL(rawUrl).pathname : rawUrl;
  const isBrowser = typeof window !== "undefined";
  const method = String(config.method ?? "GET").toUpperCase();
  const isPublicGet =
    method === "GET" &&
    (path.startsWith("/menu/") || path.startsWith("/gallery") || path.startsWith("/health"));
  const isPublicMutation =
    (path === "/orders" && method === "POST") ||
    (path === "/messages" && method === "POST") ||
    (path === "/newsletter/subscribe" && method === "POST");
  const isAuthOrPublic = PUBLIC_ENDPOINTS.includes(path) || isPublicGet || isPublicMutation;

  if (isBrowser && path.startsWith("/auth/")) {
    config.baseURL = "";
    config.url = `${AUTH_PROXY_PREFIX}${path.slice("/auth".length)}`;
  } else if (isBrowser && !isAuthOrPublic && path.startsWith("/")) {
    config.baseURL = "";
    config.url = `${PROTECTED_PROXY_PREFIX}${path}`;
  }

  if (isBrowser) {
    const token = getAccessToken();
    if (token && !path.startsWith("/auth/signin") && !path.startsWith("/auth/signup")) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (config.data instanceof FormData) {
    config.headers = config.headers ?? {};
    delete config.headers["Content-Type"];
  }

  return config;
});

http.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      const accessToken = extractAccessToken(response.data);
      const refreshToken = extractRefreshToken(response.data);

      if (accessToken) cacheAccessToken(accessToken);
      if (refreshToken) cacheRefreshToken(refreshToken);
    }

    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.response?.data?.error?.message ??
      error.message ??
      "Request failed";
    const requestUrl = originalRequest?.url ?? "";
    const isRefreshRequest = requestUrl.includes("/auth/refresh-token");
    const isAuthError = status === 401 || status === 403;

    if (typeof window !== "undefined" && isAuthError && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      try {
        await refreshTokens();
        return http.request(originalRequest);
      } catch {
        // fall through to auth-error dispatch below
      }
    }

    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login") &&
      isAuthError
    ) {
      clearAccessToken();
      window.dispatchEvent(new CustomEvent("bite-brew:auth-error", { detail: { status } }));
    }

    return Promise.reject(new ApiError(message, status));
  }
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<T>(config);
  return response.data;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function unwrapData<T>(payload: unknown): T {
  if (!isObject(payload)) return payload as T;

  const data = Object.prototype.hasOwnProperty.call(payload, "data")
    ? (payload as Record<string, unknown>).data
    : payload;

  if (isObject(data) && Object.prototype.hasOwnProperty.call(data, "data")) {
    return (data as Record<string, unknown>).data as T;
  }

  return data as T;
}

export function extractList<T>(payload: unknown): T[] {
  const data = unwrapData<unknown>(payload);
  if (Array.isArray(data)) return data as T[];

  if (isObject(data)) {
    const candidates = ["items", "rows", "results", "list"];
    for (const key of candidates) {
      const value = (data as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as T[];
    }
  }

  return [];
}
