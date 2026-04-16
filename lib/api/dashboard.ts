import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { getAccessToken } from "@/lib/auth";

type QueryParams = Record<string, string | number | boolean | undefined>;

type UserRole = "admin" | "user" | "manager" | "staff";

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";

type NotificationType = "ORDER" | "MESSAGE" | "SYSTEM";

type NotificationPriority = "HIGH" | "MEDIUM" | "LOW";

type NewsletterCampaignBody = {
  subject: string;
  headline: string;
  intro?: string;
  offerTitle?: string;
  offerDescription?: string;
  events?: string[];
  couponCode?: string;
  validUntil?: string;
  ctaText?: string;
  ctaUrl?: string;
  sendToSubscribers?: boolean;
  sendToRegisteredUsers?: boolean;
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type ProtectedRequestConfig = {
  method?: HttpMethod;
  body?: unknown;
  params?: QueryParams;
  token?: string;
};

const protectedBase = "/dashboard/api/protected";

function buildQuery(params?: QueryParams) {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null);
  if (!entries.length) return "";
  const search = new URLSearchParams();
  entries.forEach(([key, value]) => search.set(key, String(value)));
  return `?${search.toString()}`;
}

async function protectedRequest<T = any>(path: string, config: ProtectedRequestConfig = {}) {
  const method = config.method ?? "GET";
  const token = config.token || getAccessToken();
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (config.body instanceof FormData) {
    body = config.body;
  } else if (config.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(config.body);
  }

  const response = await fetch(`${protectedBase}${path}${buildQuery(config.params)}`, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers,
    body: method === "GET" ? undefined : body,
  });

  const payload = await response
    .json()
    .catch(() => ({} as Record<string, unknown>));
  if (!response.ok) {
    const message =
      (payload as any)?.message ??
      (payload as any)?.error?.message ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return payload as T;
}

export const dashboardApi = {
  health: () => apiRequest(apiEndpoints.health),

  signup: (body: { name: string; email: string; password: string }) =>
    apiRequest(apiEndpoints.auth.signup, { method: "POST", body }),
  signin: (body: { email: string; password: string }) =>
    apiRequest(apiEndpoints.auth.signin, { method: "POST", body }),
  logout: () => apiRequest(apiEndpoints.auth.logout, { method: "POST" }),
  forgotPassword: (body: { email: string }) =>
    apiRequest(apiEndpoints.auth.forgotPassword, { method: "POST", body }),
  resetPassword: (body: { email: string; token: string; password: string; confirmPassword: string }) =>
    apiRequest(apiEndpoints.auth.resetPassword, { method: "POST", body }),

  getUsers: (token: string, params?: QueryParams) => protectedRequest("/users", { token, params }),
  getCurrentUser: (token: string) => protectedRequest("/users/me", { token }),
  updateUserRole: (id: string, token: string, role: UserRole) =>
    protectedRequest(`/users/${id}/role`, { method: "PATCH", token, body: { role } }),

  getMenuCategories: (params?: QueryParams) => apiRequest(apiEndpoints.menu.categories, { params }),
  createMenuCategory: (token: string, body: { name: string; description?: string; isActive?: boolean }) =>
    protectedRequest("/menu/categories", { method: "POST", token, body }),
  updateMenuCategory: (id: string, token: string, body: { name?: string; description?: string; isActive?: boolean }) =>
    protectedRequest(`/menu/categories/${id}`, { method: "PATCH", token, body }),
  deleteMenuCategory: (id: string, token: string) =>
    protectedRequest(`/menu/categories/${id}`, { method: "DELETE", token }),

  getMenuItems: (params?: QueryParams) => apiRequest(apiEndpoints.menu.items, { params }),
  createMenuItem: (
    token: string,
    body: {
      name: string;
      categoryId: string;
      price: number;
      description?: string;
      image?: string;
      available?: boolean;
      featured?: boolean;
      discount?: number;
    }
  ) => protectedRequest("/menu/items", { method: "POST", token, body }),
  createMenuItemMultipart: (token: string, formData: FormData) =>
    protectedRequest("/menu/items", { method: "POST", token, body: formData }),
  updateMenuItem: (id: string, token: string, body: Record<string, unknown>) =>
    protectedRequest(`/menu/items/${id}`, { method: "PATCH", token, body }),
  deleteMenuItem: (id: string, token: string) => protectedRequest(`/menu/items/${id}`, { method: "DELETE", token }),

  createOrder: (body: Record<string, unknown>, token?: string) =>
    protectedRequest("/orders", { method: "POST", token, body }),
  getOrders: (token: string, params?: QueryParams) => protectedRequest("/orders", { token, params }),
  getOrderById: (id: string, token: string) => protectedRequest(`/orders/${id}`, { token }),
  updateOrder: (id: string, token: string, body: Record<string, unknown>) =>
    protectedRequest(`/orders/${id}`, { method: "PUT", token, body }),
  updateOrderStatus: (id: string, token: string, status: OrderStatus) =>
    protectedRequest(`/orders/${id}/status`, {
      method: "PATCH",
      token,
      body: { status, orderStatus: status.toUpperCase() },
    }),
  deleteOrder: (id: string, token: string) =>
    protectedRequest(`/orders/${id}`, { method: "DELETE", token }),

  createMessage: (body: {
    senderName: string;
    content: string;
    phone?: string;
    email?: string;
    source?: string;
  }) => apiRequest(apiEndpoints.messages.list, { method: "POST", body }),
  getMessages: (token: string, params?: QueryParams) => protectedRequest("/messages", { token, params }),
  markMessageRead: (id: string, token: string, isRead = true) =>
    protectedRequest(`/messages/${id}/read`, { method: "PATCH", token, body: { isRead } }),
  deleteMessage: (id: string, token: string) => protectedRequest(`/messages/${id}`, { method: "DELETE", token }),

  subscribeNewsletter: (email: string) =>
    apiRequest(apiEndpoints.newsletter.subscribe, { method: "POST", body: { email } }),
  getNewsletterSubscribers: (token: string, params?: QueryParams) =>
    protectedRequest("/newsletter", { token, params }),
  sendNewsletterCampaign: (token: string, body: NewsletterCampaignBody) =>
    protectedRequest("/newsletter/campaign", { method: "POST", token, body }),
  updateNewsletterStatus: (id: string, token: string, status: string) =>
    protectedRequest(`/newsletter/${id}/status`, { method: "PATCH", token, body: { status } }),
  deleteNewsletterSubscriber: (id: string, token: string) =>
    protectedRequest(`/newsletter/${id}`, { method: "DELETE", token }),

  createNotification: (
    token: string,
    body: {
      content: string;
      type?: NotificationType;
      priority?: NotificationPriority;
      actionLink?: string;
      userId?: string;
    }
  ) => protectedRequest("/notifications", { method: "POST", token, body }),
  getNotifications: (token: string, params?: QueryParams) =>
    protectedRequest("/notifications", { token, params }),
  markNotificationRead: (id: string, token: string, isRead = true) =>
    protectedRequest(`/notifications/${id}/read`, { method: "PATCH", token, body: { isRead } }),
  markAllNotificationsRead: (token: string, userId?: string) =>
    protectedRequest("/notifications/read-all", {
      method: "PATCH",
      token,
      body: userId ? { userId } : {}
    }),
  deleteNotification: (id: string, token: string) =>
    protectedRequest(`/notifications/${id}`, { method: "DELETE", token }),

  getGallery: (params?: QueryParams) => apiRequest(apiEndpoints.gallery.list, { params }),
  createGalleryJson: (
    token: string,
    body: {
      url: string;
      category?: "FOOD" | "INTERIOR" | "EVENTS";
      tags?: string[];
      featured?: boolean;
      orderIndex?: number;
    }
  ) => protectedRequest("/gallery", { method: "POST", token, body }),
  createGalleryMultipart: (token: string, formData: FormData) =>
    protectedRequest("/gallery", { method: "POST", token, body: formData }),
  updateGallery: (id: string, token: string, body: Record<string, unknown>) =>
    protectedRequest(`/gallery/${id}`, { method: "PATCH", token, body }),
  deleteGallery: (id: string, token: string) => protectedRequest(`/gallery/${id}`, { method: "DELETE", token }),

  uploadImage: (token: string, image: File, folder?: string) => {
    const formData = new FormData();
    formData.append("image", image);
    if (folder) {
      formData.append("folder", folder);
    }
    return protectedRequest("/uploads/image", { method: "POST", token, body: formData });
  },

  getDashboardOverview: (token: string, params?: { limit?: number }) =>
    protectedRequest("/dashboard/overview", { token, params }),
  getAnalyticsSummary: (token: string, params?: { days?: number }) =>
    protectedRequest("/analytics/summary", { token, params }),
  getSalesReport: (token: string, params?: { from?: string; to?: string }) =>
    protectedRequest("/reports/sales", { token, params })
};
