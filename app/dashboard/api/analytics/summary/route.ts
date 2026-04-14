import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/auth";

const BACKEND_ANALYTICS_URL = "http://localhost:7000/api/v1/bite-brew/analytics/summary";

function normalizeToken(value?: string | null): string {
  if (!value) return "";

  let token = value.trim().replace(/^Bearer\s+/i, "");
  if (!token) return "";

  try {
    token = decodeURIComponent(token);
  } catch {
    // keep original token
  }

  return token.trim().replace(/^"|"$/g, "");
}

function looksLikeJwt(value: string): boolean {
  return value.split(".").length === 3;
}

function buildForwardCookieHeader(requestCookieHeader: string, accessToken: string, refreshToken: string): string {
  const parts: string[] = [];
  if (requestCookieHeader) parts.push(requestCookieHeader);
  if (accessToken) parts.push(`access_token=${encodeURIComponent(accessToken)}`);
  if (refreshToken) parts.push(`refresh_token=${encodeURIComponent(refreshToken)}`);
  return parts.join("; ");
}

function extractTokens(request: Request, cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const headerAuthToken = normalizeToken(request.headers.get("authorization"));
  const accessCookieToken =
    normalizeToken(cookieStore.get(TOKEN_COOKIE)?.value) ||
    normalizeToken(cookieStore.get("accessToken")?.value) ||
    normalizeToken(cookieStore.get("token")?.value);
  const refreshCookieToken =
    normalizeToken(cookieStore.get("refresh_token")?.value) ||
    normalizeToken(cookieStore.get("refreshToken")?.value);

  const candidates = [headerAuthToken, accessCookieToken, refreshCookieToken].filter(Boolean);
  const bearerToken = candidates.find((entry) => looksLikeJwt(entry)) ?? candidates[0] ?? "";

  return {
    bearerToken,
    accessCookieToken,
    refreshCookieToken,
  };
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const { bearerToken, accessCookieToken, refreshCookieToken } = extractTokens(request, cookieStore);

  if (!bearerToken && !accessCookieToken && !refreshCookieToken) {
    const cookieNames = cookieStore.getAll().map((entry) => entry.name);
    return NextResponse.json(
      { message: "Missing access token cookie for analytics summary", cookieNames },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const days = url.searchParams.get("days");
  const backendUrl = new URL(BACKEND_ANALYTICS_URL);

  if (days) {
    backendUrl.searchParams.set("days", days);
  }

  try {
    const requestCookieHeader = request.headers.get("cookie") ?? "";
    const cookieHeader = buildForwardCookieHeader(requestCookieHeader, accessCookieToken, refreshCookieToken);

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(accessCookieToken ? { "x-access-token": accessCookieToken } : {}),
        ...(refreshCookieToken ? { "x-refresh-token": refreshCookieToken } : {}),
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Failed to load analytics summary" }, { status: 500 });
  }
}
