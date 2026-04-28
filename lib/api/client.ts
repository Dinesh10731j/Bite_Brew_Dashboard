import axiosInstance from "./axios";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (typeof window !== "undefined" && (status === 401 || status === 403)) {
      window.dispatchEvent(new CustomEvent("bite-brew:auth-error", { detail: { status } }));
    }
    return Promise.reject(error?.response?.data || { message: error.message });
  }
);

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RequestConfig = {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
};

export async function apiRequest<T = any>(url: string, config: RequestConfig = {}) {
  try {
    const response = await axiosInstance({
      url,
      method: (config.method ?? "GET") as any,
      data: config.body,
      params: config.params,
    });
    return response.data as T;
  } catch (error: any) {
    const status = error?.status ?? error?.response?.status;
    const message = error?.message ?? "Request failed";
    throw new Error(status ? `${message} (HTTP ${status})` : message);
  }
}