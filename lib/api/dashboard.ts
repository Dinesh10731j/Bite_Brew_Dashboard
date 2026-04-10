import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export const dashboardApi = {
  health: () => apiRequest(apiEndpoints.health),
  signin: (body: { email: string; password: string }) =>
    apiRequest(apiEndpoints.auth.signin, { method: "POST", body }),
  signup: (body: { name: string; email: string; password: string }) =>
    apiRequest(apiEndpoints.auth.signup, { method: "POST", body }),
  forgotPassword: (body: { email: string }) =>
    apiRequest(apiEndpoints.auth.forgotPassword, { method: "POST", body }),
  resetPassword: (body: { email: string; token: string; password: string; confirmPassword: string }) =>
    apiRequest(apiEndpoints.auth.resetPassword, { method: "POST", body }),
  getUsers: (token: string, params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest(apiEndpoints.users.list, { token, params }),
  getCurrentUser: (token: string) => apiRequest(apiEndpoints.users.me, { token }),
  updateUserRole: (id: string, token: string, role: "admin" | "user" | "manager") =>
    apiRequest(apiEndpoints.users.updateRole(id), { method: "PATCH", token, body: { role } }),
  getMenuCategories: (params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest(apiEndpoints.menu.categories, { params }),
  createMenuCategory: (token: string, body: { name: string; description?: string; isActive?: boolean }) =>
    apiRequest(apiEndpoints.menu.categories, { method: "POST", token, body }),
  updateMenuCategory: (id: string, token: string, body: { name?: string; description?: string; isActive?: boolean }) =>
    apiRequest(apiEndpoints.menu.category(id), { method: "PATCH", token, body }),
  deleteMenuCategory: (id: string, token: string) =>
    apiRequest(apiEndpoints.menu.category(id), { method: "DELETE", token }),
  getMenuItems: (params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest(apiEndpoints.menu.items, { params }),
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
  ) => apiRequest(apiEndpoints.menu.items, { method: "POST", token, body }),
  updateMenuItem: (id: string, token: string, body: Record<string, unknown>) =>
    apiRequest(apiEndpoints.menu.item(id), { method: "PATCH", token, body }),
  deleteMenuItem: (id: string, token: string) =>
    apiRequest(apiEndpoints.menu.item(id), { method: "DELETE", token }),
  createOrder: (body: Record<string, unknown>, token?: string) =>
    apiRequest(apiEndpoints.orders.list, { method: "POST", token, body }),
  getOrders: (token: string, params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest(apiEndpoints.orders.list, { token, params }),
  getOrderById: (id: string, token: string) => apiRequest(apiEndpoints.orders.detail(id), { token }),
  updateOrderStatus: (id: string, token: string, status: string) =>
    apiRequest(apiEndpoints.orders.updateStatus(id), { method: "PATCH", token, body: { status } }),
  createMessage: (body: Record<string, unknown>) =>
    apiRequest(apiEndpoints.messages.list, { method: "POST", body }),
  getMessages: (token: string, params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest(apiEndpoints.messages.list, { token, params }),
  markMessageRead: (id: string, token: string, isRead = true) =>
    apiRequest(apiEndpoints.messages.markRead(id), { method: "PATCH", token, body: { isRead } }),
  deleteMessage: (id: string, token: string) =>
    apiRequest(apiEndpoints.messages.remove(id), { method: "DELETE", token }),
  subscribeNewsletter: (email: string) =>
    apiRequest(apiEndpoints.newsletter.subscribe, { method: "POST", body: { email } }),
  getNewsletterSubscribers: (token: string, params?: Record<string, string | number | boolean | undefined>) =>
    apiRequest(apiEndpoints.newsletter.list, { token, params }),
  updateNewsletterStatus: (id: string, token: string, status: string) =>
    apiRequest(apiEndpoints.newsletter.updateStatus(id), { method: "PATCH", token, body: { status } }),
  deleteNewsletterSubscriber: (id: string, token: string) =>
    apiRequest(apiEndpoints.newsletter.remove(id), { method: "DELETE", token }),
  createNotification: (token: string, body: { content: string; type?: string; priority?: string }) =>
    apiRequest(apiEndpoints.notifications.create, { method: "POST", token, body })
};
