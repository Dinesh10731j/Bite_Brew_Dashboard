type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type RequestConfig = {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(url: string, params?: RequestConfig["params"]) {
  if (!params) {
    return url;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `${url}?${query}` : url;
}

export async function apiRequest<T>(url: string, config: RequestConfig = {}) {
  const response = await fetch(buildUrl(url, config.params), {
    method: config.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(config.token ? { Authorization: `Bearer ${config.token}` } : {})
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload as T;
}
