import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/auth";

const BACKEND_BASE_URL = "http://localhost:7000/api/v1/bite-brew";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function normalizeToken(value?: string | null): string {
  if (!value) return "";

  let token = value.trim().replace(/^Bearer\s+/i, "");
  if (!token) return "";

  try {
    token = decodeURIComponent(token);
  } catch {
    // Keep original token when value is not URI encoded.
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

async function buildBackendUrl(request: Request, context: RouteContext): Promise<URL> {
  const params = await context.params;
  const segments = Array.isArray(params?.path) ? params.path : [];
  const encodedPath = segments.map((segment) => encodeURIComponent(segment)).join("/");
  const backendUrl = new URL(`${BACKEND_BASE_URL}/${encodedPath}`);
  const incomingUrl = new URL(request.url);
  incomingUrl.searchParams.forEach((value, key) => backendUrl.searchParams.append(key, value));
  return backendUrl;
}

async function handleProxy(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const { bearerToken, accessCookieToken, refreshCookieToken } = extractTokens(request, cookieStore);

  const backendUrl = await buildBackendUrl(request, context);
  const requestCookieHeader = request.headers.get("cookie") ?? "";
  const cookieHeader = buildForwardCookieHeader(requestCookieHeader, accessCookieToken, refreshCookieToken);
  const requestContentType = request.headers.get("content-type");

  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
  }

  try {
    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers: {
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(accessCookieToken ? { "x-access-token": accessCookieToken } : {}),
        ...(refreshCookieToken ? { "x-refresh-token": refreshCookieToken } : {}),
        ...(requestContentType ? { "Content-Type": requestContentType } : {}),
      },
      body,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = await response.json();
      return NextResponse.json(json, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: contentType ? { "content-type": contentType } : undefined,
    });
  } catch {
    return NextResponse.json({ message: "Failed to proxy backend request" }, { status: 500 });
  }
}

export async function GET(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}
