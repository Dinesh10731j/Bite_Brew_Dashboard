import { NextResponse } from "next/server";
import {
  REFRESH_TOKEN_COOKIE,
  TOKEN_COOKIE,
  extractAccessToken,
  extractRefreshToken,
} from "@/lib/auth";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BITE_BREW_API_URL ?? "http://localhost:7000/api/v1/bite-brew";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function getSetCookieHeaders(headers: Headers): string[] {
  const withGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  if (typeof withGetSetCookie.getSetCookie === "function") {
    return withGetSetCookie.getSetCookie();
  }

  const header = headers.get("set-cookie");
  return header ? splitSetCookieHeader(header) : [];
}

function splitSetCookieHeader(header: string): string[] {
  const parts: string[] = [];
  let start = 0;
  let inExpires = false;

  for (let index = 0; index < header.length; index += 1) {
    const chunk = header.slice(index, index + 8).toLowerCase();
    if (chunk === "expires=") inExpires = true;

    if (inExpires && header[index] === ";") {
      inExpires = false;
    }

    if (!inExpires && header[index] === ",") {
      parts.push(header.slice(start, index).trim());
      start = index + 1;
    }
  }

  parts.push(header.slice(start).trim());
  return parts.filter(Boolean);
}

function rewriteSetCookieHeader(header: string, request: Request): string {
  const isHttps = new URL(request.url).protocol === "https:";
  const [nameValue, ...attributes] = header.split(";").map((part) => part.trim()).filter(Boolean);
  const nextAttributes: string[] = [];
  let hasPath = false;
  let hasSameSite = false;

  for (const attribute of attributes) {
    const key = attribute.split("=")[0]?.toLowerCase();

    if (key === "domain") continue;
    if (key === "path") {
      hasPath = true;
      nextAttributes.push("Path=/");
      continue;
    }
    if (key === "samesite") {
      hasSameSite = true;
      nextAttributes.push(isHttps ? attribute : "SameSite=Lax");
      continue;
    }
    if (!isHttps && key === "secure") continue;

    nextAttributes.push(attribute);
  }

  if (!hasPath) nextAttributes.push("Path=/");
  if (!hasSameSite) nextAttributes.push("SameSite=Lax");

  return [nameValue, ...nextAttributes].join("; ");
}

function cookieOptions(token: string, request: Request) {
  return {
    httpOnly: false,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax" as const,
    path: "/",
    maxAge: getTokenMaxAge(token),
  };
}

function getTokenMaxAge(token: string) {
  const payload = token.split(".")[1];
  if (!payload) return 60 * 60 * 24 * 7;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as { exp?: number };
    if (!decoded.exp) return 60 * 60 * 24 * 7;

    return Math.max(Math.floor(decoded.exp - Date.now() / 1000), 0);
  } catch {
    return 60 * 60 * 24 * 7;
  }
}

async function buildBackendUrl(request: Request, context: RouteContext): Promise<URL> {
  const params = await context.params;
  const segments = Array.isArray(params?.path) ? params.path : [];
  const encodedPath = segments.map((segment) => encodeURIComponent(segment)).join("/");
  const backendUrl = new URL(`${BACKEND_BASE_URL}/auth/${encodedPath}`);
  const incomingUrl = new URL(request.url);
  incomingUrl.searchParams.forEach((value, key) => backendUrl.searchParams.append(key, value));
  return backendUrl;
}

async function handleAuthProxy(request: Request, context: RouteContext) {
  const backendUrl = await buildBackendUrl(request, context);
  const requestContentType = request.headers.get("content-type");
  const requestCookieHeader = request.headers.get("cookie");
  const requestAuthorization = request.headers.get("authorization");

  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  const backendResponse = await fetch(backendUrl.toString(), {
    method: request.method,
    headers: {
      ...(requestContentType ? { "Content-Type": requestContentType } : {}),
      ...(requestCookieHeader ? { Cookie: requestCookieHeader } : {}),
      ...(requestAuthorization ? { Authorization: requestAuthorization } : {}),
    },
    body,
    cache: "no-store",
  });

  const contentType = backendResponse.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await backendResponse.json() : await backendResponse.text();
  const response = isJson
    ? NextResponse.json(payload, { status: backendResponse.status })
    : new NextResponse(payload, {
        status: backendResponse.status,
        headers: contentType ? { "content-type": contentType } : undefined,
      });

  for (const cookie of getSetCookieHeaders(backendResponse.headers)) {
    response.headers.append("set-cookie", rewriteSetCookieHeader(cookie, request));
  }

  if (isJson) {
    const accessToken = extractAccessToken(payload);
    const refreshToken = extractRefreshToken(payload);

    if (accessToken) {
      response.cookies.set(TOKEN_COOKIE, accessToken, cookieOptions(accessToken, request));
    }
    if (refreshToken) {
      response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions(refreshToken, request));
    }
  }

  if (backendUrl.pathname.endsWith("/auth/logout")) {
    response.cookies.delete(TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    response.cookies.delete("token");
  }

  return response;
}

export async function GET(request: Request, context: RouteContext) {
  return handleAuthProxy(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleAuthProxy(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return handleAuthProxy(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handleAuthProxy(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleAuthProxy(request, context);
}
