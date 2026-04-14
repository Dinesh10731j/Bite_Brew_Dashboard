// lib/auth.ts - Client and Server auth utilities
import type { JwtPayload, UserRole } from '@/lib/types';

export const TOKEN_COOKIE = "access_token" as const;
export const DASHBOARD_ROLES: UserRole[] = ["admin", "manager", "staff"];
const TOKEN_STORAGE_KEY = "bite_brew_access_token" as const;

export function getAccessToken(): string {
  if (typeof document === "undefined") return "";

  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`));
  const cookieToken = entry ? decodeURIComponent(entry.split("=")[1] ?? "") : "";

  if (cookieToken) {
    return cookieToken;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
}

export function cacheAccessToken(token: string) {
  if (typeof window === "undefined" || !token) return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken() {
  if (typeof document !== "undefined") {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function extractAccessToken(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const obj = payload as Record<string, any>;
  return (
    obj.accessToken ?? 
    obj.token ?? 
    obj.data?.accessToken ?? 
    obj.data?.token ?? 
    obj.tokens?.accessToken ?? 
    obj.data?.tokens?.accessToken ?? 
    ''
  );
}

// Server-side safe JWT decode (no verification - for middleware routing only)
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payloadStr = token.replace(/^Bearer\s+/i, '').split('.')[1];
    if (!payloadStr) return null;

    const padded = payloadStr.padEnd(payloadStr.length + (4 - payloadStr.length % 4) % 4, '=');
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

export function getUserRoleFromToken(token = getAccessToken()): UserRole | null {
  if (!token) return null;
  const payload = decodeJwt(token);
  return payload?.role ?? null;
}

export function canAccessDashboard(role: UserRole | null): boolean {
  return role ? DASHBOARD_ROLES.includes(role) : false;
}

export function getJwtFromLogin(payload: unknown): string {
  const responseToken = extractAccessToken(payload);
  if (responseToken) {
    return responseToken;
  }

  return getAccessToken();
}



