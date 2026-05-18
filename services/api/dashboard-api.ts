import { request } from "@/services/api/http";

type QueryParams = Record<string, string | number | boolean | undefined>;

function cleanParams(params?: QueryParams) {
  if (!params) return undefined;
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
}

export const apiService = {
  auth: {
    signup: (body: { name: string; email: string; password: string }) =>
      request({ url: "/auth/signup", method: "POST", data: body }),
    signin: (body: { email: string; password: string }) =>
      request({ url: "/auth/signin", method: "POST", data: body }),
    logout: () => request({ url: "/auth/logout", method: "POST" }),
    forgotPassword: (body: { email: string }) =>
      request({ url: "/auth/forgot-password", method: "POST", data: body }),
    resetPassword: (body: { email: string; token: string; password: string; confirmPassword: string }) =>
      request({ url: "/auth/reset-password", method: "POST", data: body }),
  },

  dashboard: {
    overview: (params?: { limit?: number }) =>
      request({ url: "/dashboard/overview", method: "GET", params: cleanParams(params) }),
  },

  analytics: {
    summary: (params?: { days?: number }) =>
      request({ url: "/analytics/summary", method: "GET", params: cleanParams(params) }),
  },

  reports: {
    sales: (params?: { from?: string; to?: string }) =>
      request({ url: "/reports/sales", method: "GET", params: cleanParams(params) }),
  },

  activityLogs: {
    list: (params?: QueryParams) => request({ url: "/activity-logs", method: "GET", params: cleanParams(params) }),
  },

  users: {
    list: (params?: QueryParams) => request({ url: "/users", method: "GET", params: cleanParams(params) }),
    me: () => request({ url: "/users/me", method: "GET" }),
    updateRole: (id: string, role: "admin" | "manager" | "user") =>
      request({ url: `/users/${id}/role`, method: "PATCH", data: { role } }),
  },

  menu: {
    categories: {
      list: (params?: QueryParams) =>
        request({ url: "/menu/categories", method: "GET", params: cleanParams(params) }),
      create: (body: { name: string; description?: string; isActive?: boolean }) =>
        request({ url: "/menu/categories", method: "POST", data: body }),
      update: (id: string, body: { name?: string; description?: string; isActive?: boolean }) =>
        request({ url: `/menu/categories/${id}`, method: "PATCH", data: body }),
      remove: (id: string) => request({ url: `/menu/categories/${id}`, method: "DELETE" }),
    },
    items: {
      list: (params?: QueryParams) => request({ url: "/menu/items", method: "GET", params: cleanParams(params) }),
      create: (body: Record<string, unknown> | FormData) =>
        request({ url: "/menu/items", method: "POST", data: body }),
      update: (id: string, body: Record<string, unknown> | FormData) =>
        request({ url: `/menu/items/${id}`, method: "PATCH", data: body }),
      remove: (id: string) => request({ url: `/menu/items/${id}`, method: "DELETE" }),
    },
  },

  orders: {
    create: (body: Record<string, unknown>) => request({ url: "/orders", method: "POST", data: body }),
    list: (params?: QueryParams) => request({ url: "/orders", method: "GET", params: cleanParams(params) }),
    detail: (id: string) => request({ url: `/orders/${id}`, method: "GET" }),
    remove: (id: string) => request({ url: `/orders/${id}`, method: "DELETE" }),
    updateStatus: (id: string, status: string) =>
      request({ url: `/orders/${id}/status`, method: "PATCH", data: { status } }),
  },

  messages: {
    create: (body: { senderName: string; content: string; phone?: string; email?: string; source?: string }) =>
      request({ url: "/messages", method: "POST", data: body }),
    list: (params?: QueryParams) => request({ url: "/messages", method: "GET", params: cleanParams(params) }),
    markRead: (id: string, isRead: boolean) =>
      request({ url: `/messages/${id}/read`, method: "PATCH", data: { isRead } }),
    remove: (id: string) => request({ url: `/messages/${id}`, method: "DELETE" }),
  },

  newsletter: {
    subscribe: (email: string) => request({ url: "/newsletter/subscribe", method: "POST", data: { email } }),
    list: (params?: QueryParams) => request({ url: "/newsletter", method: "GET", params: cleanParams(params) }),
    campaign: (body: Record<string, unknown>) => request({ url: "/newsletter/campaign", method: "POST", data: body }),
    updateStatus: (id: string, status: string) =>
      request({ url: `/newsletter/${id}/status`, method: "PATCH", data: { status } }),
    remove: (id: string) => request({ url: `/newsletter/${id}`, method: "DELETE" }),
  },

  notifications: {
    create: (body: Record<string, unknown>) => request({ url: "/notifications", method: "POST", data: body }),
    list: (params?: QueryParams) => request({ url: "/notifications", method: "GET", params: cleanParams(params) }),
    update: (id: string, body: Record<string, unknown>) =>
      request({ url: `/notifications/${id}`, method: "PATCH", data: body }),
    markRead: (id: string, isRead = true) =>
      request({ url: `/notifications/${id}/read`, method: "PATCH", data: { isRead } }),
    markAllRead: () => request({ url: "/notifications/read-all", method: "PATCH", data: {} }),
    remove: (id: string) => request({ url: `/notifications/${id}`, method: "DELETE" }),
  },

  gallery: {
    list: (params?: QueryParams) => request({ url: "/gallery", method: "GET", params: cleanParams(params) }),
    create: (body: Record<string, unknown> | FormData) => request({ url: "/gallery", method: "POST", data: body }),
    update: (id: string, body: Record<string, unknown> | FormData) =>
      request({ url: `/gallery/${id}`, method: "PATCH", data: body }),
    remove: (id: string) => request({ url: `/gallery/${id}`, method: "DELETE" }),
  },

  uploads: {
    image: (file: File, folder?: string) => {
      const formData = new FormData();
      formData.append("image", file);
      if (folder) formData.append("folder", folder);
      return request({ url: "/uploads/image", method: "POST", data: formData });
    },
  },
};
