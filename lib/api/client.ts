import axiosInstance from './axios';
import { clearAccessToken, getAccessToken } from '@/lib/auth';

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (typeof window !== "undefined" && error.response?.status === 401) {
      clearAccessToken();
      window.location.href = '/login?reason=unauthorized';
    }
    if (typeof window !== "undefined" && error.response?.status === 403) {
      window.location.href = '/login?reason=forbidden';
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }
  return config;
});

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RequestConfig = {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
};

export async function apiRequest<T = any>(url: string, config: RequestConfig = {}) {
  try {
    const response = await axiosInstance({
      url,
      method: config.method ?? 'GET' as any,
      data: config.body,
      params: config.params,
      headers: config.token ? { Authorization: `Bearer ${config.token}` } : undefined,
    });
    return response.data as T;
  } catch (error: any) {
    const status = error?.status ?? error?.response?.status;
    const message = error?.message ?? "Request failed";
    throw new Error(status ? `${message} (HTTP ${status})` : message);
  }
}
