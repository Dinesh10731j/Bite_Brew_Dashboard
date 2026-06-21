import type { JwtPayload, UserRole } from "@/lib/shared";

export const TOKEN_COOKIE = "access_token" as const;
export const REFRESH_TOKEN_COOKIE = "refresh_token" as const;
export const DASHBOARD_ROLES: UserRole[] = ["admin", "manager", "staff"];
const TOKEN_STORAGE_KEY = "bite-brew.access-token";
const REFRESH_TOKEN_STORAGE_KEY = "bite-brew.refresh-token";

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function normalizeToken(value?: string | null): string {
  if (!value) return "";
  return value.trim().replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "");
}

function readCookie(name: string): string {
  if (!isBrowser()) return "";

  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!cookie) return "";

  try {
    return normalizeToken(decodeURIComponent(cookie.slice(prefix.length)));
  } catch {
    return normalizeToken(cookie.slice(prefix.length));
  }
}

function getCookieMaxAge(token: string) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return 60 * 60 * 24 * 7;

  const secondsRemaining = Math.floor(payload.exp - Date.now() / 1000);
  return Math.max(secondsRemaining, 0);
}

function writeTokenCookie(name: string, token: string) {
  if (!isBrowser()) return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=${getCookieMaxAge(token)}${secure}`;
}

function expireCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; Path=/; SameSite=Lax; Max-Age=0`;
}

export function getAccessToken(): string {
  if (!isBrowser()) return "";

  return (
    normalizeToken(window.localStorage.getItem(TOKEN_STORAGE_KEY)) ||
    readCookie(TOKEN_COOKIE) ||
    readCookie("accessToken") ||
    readCookie("token")
  );
}

export function getRefreshToken(): string {
  if (!isBrowser()) return "";

  return (
    normalizeToken(window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)) ||
    readCookie(REFRESH_TOKEN_COOKIE) ||
    readCookie("refreshToken")
  );
}

export function cacheAccessToken(token: string) {
  const normalized = normalizeToken(token);
  if (!isBrowser() || !normalized) return;

  window.localStorage.setItem(TOKEN_STORAGE_KEY, normalized);
  writeTokenCookie(TOKEN_COOKIE, normalized);
}

export function cacheRefreshToken(token: string) {
  const normalized = normalizeToken(token);
  if (!isBrowser() || !normalized) return;

  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, normalized);
  writeTokenCookie(REFRESH_TOKEN_COOKIE, normalized);
}

export function clearAccessToken() {
  if (!isBrowser()) return;

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  expireCookie(TOKEN_COOKIE);
  expireCookie(REFRESH_TOKEN_COOKIE);
  expireCookie("accessToken");
  expireCookie("refreshToken");
  expireCookie("token");
}

export function extractAccessToken(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const obj = payload as Record<string, any>;
  return normalizeToken(
    obj.accessToken ??
    obj.access_token ??
    obj.token ??
    obj.data?.accessToken ??
    obj.data?.access_token ??
    obj.data?.token ??
    obj.tokens?.accessToken ??
    obj.tokens?.access_token ??
    obj.data?.tokens?.accessToken ??
    obj.data?.tokens?.access_token ??
    ""
  );
}

export function extractRefreshToken(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const obj = payload as Record<string, any>;
  return normalizeToken(
    obj.refreshToken ??
    obj.refresh_token ??
    obj.data?.refreshToken ??
    obj.data?.refresh_token ??
    obj.tokens?.refreshToken ??
    obj.tokens?.refresh_token ??
    obj.data?.tokens?.refreshToken ??
    obj.data?.tokens?.refresh_token ??
    ""
  );
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payloadStr = token.replace(/^Bearer\s+/i, "").split(".")[1];
    if (!payloadStr) return null;

    const padded = payloadStr.padEnd(payloadStr.length + ((4 - (payloadStr.length % 4)) % 4), "=");
    const decoder =
      typeof atob === "function"
        ? atob
        : (value: string) => Buffer.from(value, "base64").toString("utf8");
    const decoded = JSON.parse(decoder(padded)) as JwtPayload;

    if (decoded.exp && Date.now() >= decoded.exp * 1000) return null;

    return decoded;
  } catch {
    return null;
  }
}

export function canAccessDashboard(role: UserRole | null): boolean {
  return role ? DASHBOARD_ROLES.includes(role) : false;
}

export function getJwtFromLogin(payload: unknown): string {
  return extractAccessToken(payload);
}
