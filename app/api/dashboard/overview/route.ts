import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/auth";

const BACKEND_OVERVIEW_URL = "http://localhost:7000/api/v1/bite-brew/dashboard/overview";

export async function GET(request: Request) {
  const headerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const cookieStore = await cookies();
  const token =
    headerToken ??
    cookieStore.get(TOKEN_COOKIE)?.value ??
    cookieStore.get("accessToken")?.value ??
    cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Missing access token cookie for dashboard overview" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = url.searchParams.get("limit");
  const backendUrl = new URL(BACKEND_OVERVIEW_URL);

  if (limit) {
    backendUrl.searchParams.set("limit", limit);
  }

  try {
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json({ message: "Failed to load dashboard overview" }, { status: 500 });
  }
}
