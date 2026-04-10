"use client";

const TOKEN_COOKIE = "jbb_access_token";

export function getAccessToken() {
  if (typeof document === "undefined") {
    return "";
  }

  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${TOKEN_COOKIE}=`));

  return entry ? decodeURIComponent(entry.split("=")[1] ?? "") : "";
}

export function setAccessToken(token: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function clearAccessToken() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function extractAccessToken(payload: any): string {
  return (
    payload?.accessToken ??
    payload?.token ??
    payload?.data?.accessToken ??
    payload?.data?.token ??
    payload?.tokens?.accessToken ??
    payload?.data?.tokens?.accessToken ??
    ""
  );
}
