import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BITE_BREW_API_URL ?? "http://localhost:7000/api/v1/bite-brew";
const PROTECTED_PROXY_PREFIX = "/dashboard/api/protected";
const PUBLIC_ENDPOINTS = [
  "/health",
  "/auth/signup",
  "/auth/signin",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
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

  if (isBrowser && !isAuthOrPublic && path.startsWith("/")) {
    config.baseURL = "";
    config.url = `${PROTECTED_PROXY_PREFIX}${path}`;
  }

  if (config.data instanceof FormData) {
    config.headers = config.headers ?? {};
    delete config.headers["Content-Type"];
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.response?.data?.error?.message ??
      error.message ??
      "Request failed";

    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login") &&
      (status === 401 || status === 403)
    ) {
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
