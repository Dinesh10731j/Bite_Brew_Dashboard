// lib/auth.ts - Client and Server auth utilities
import type { JwtPayload } from '@/lib/types';

const TOKEN_COOKIE = "access_token" as const;

export function getAccessToken(): string {
  if (typeof document === "undefined") return "";
  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`));
  return entry ? decodeURIComponent(entry.split("=")[1] ?? "") : "";
}

export function setAccessToken(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7 * 4}; SameSite=None; Secure; Domain=.localhost; HttpOnly`;
}

export function clearAccessToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=None; Secure; Domain=.localhost`;
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
    // Remove Bearer if present
    const payloadStr = token.replace(/^Bearer\s+/i, '').split('.')[1];
    if (!payloadStr) return null;
    
    // Pad if needed
    const padded = payloadStr.padEnd(payloadStr.length + (4 - payloadStr.length % 4) % 4, '=');
    
    // Base64 decode
    const decoded = JSON.parse(atob(padded)) as JwtPayload;
    
    // Basic exp check
    if (decoded.exp && Date.now() >= decoded.exp * 1000) return null;
    
    return decoded;
  } catch {
    return null;
  }
}

// Client-side helper to get user role from token
export function getUserRoleFromToken(): 'admin' | 'staff' | 'manager' | 'user' | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodeJwt(token);
  return payload?.role ?? null;
}



