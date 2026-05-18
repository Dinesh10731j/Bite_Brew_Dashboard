import type { JwtPayload, UserRole } from "@/lib/shared";

export const TOKEN_COOKIE = "access_token" as const;
export const DASHBOARD_ROLES: UserRole[] = ["admin", "manager", "staff"];

export function getAccessToken(): string {
  return "";
}

export function cacheAccessToken(_token: string) {
  // Cookie-based auth only: backend stores secure HTTP-only cookies.
}

export function clearAccessToken() {
  // Cookie-based auth only: use /auth/logout to clear server session cookie.
}

export function extractAccessToken(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const obj = payload as Record<string, any>;
  return (
    obj.accessToken ??
    obj.token ??
    obj.data?.accessToken ??
    obj.data?.token ??
    obj.tokens?.accessToken ??
    obj.data?.tokens?.accessToken ??
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
