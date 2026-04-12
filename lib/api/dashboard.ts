import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

type QueryParams = Record<string, string | number | boolean | undefined>;

type UserRole = "admin" | "user" | "manager";

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

  getUsers: (token: string, params?: QueryParams) => apiRequest(apiEndpoints.users.list, { token, params }),
  getCurrentUser: (token: string) => apiRequest(apiEndpoints.users.me, { token }),
  updateUserRole: (id: string, token: string, role: UserRole) =>
    apiRequest(apiEndpoints.users.updateRole(id), { method: "PATCH", token, body: { role } }),

  getMenuCategories: (params?: QueryParams) => apiRequest(apiEndpoints.menu.categories, { params }),
  createMenuCategory: (token: string, body: { name: string; description?: string; isActive?: boolean }) =>
    apiRequest(apiEndpoints.menu.categories, { method: "POST", token, body }),
  updateMenuCategory: (id: string, token: string, body: { name?: string; description?: string; isActive?: boolean }) =>
    apiRequest(apiEndpoints.menu.category(id), { method: "PATCH", token, body }),
  deleteMenuCategory: (id: string, token: string) =>
    apiRequest(apiEndpoints.menu.category(id), { method: "DELETE", token }),

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
  ) => apiRequest(apiEndpoints.menu.items, { method: "POST", token, body }),
  createMenuItemMultipart: (token: string, formData: FormData) =>
    apiRequest(apiEndpoints.menu.items, { method: "POST", token, body: formData }),
  updateMenuItem: (id: string, token: string, body: Record<string, unknown>) =>
    apiRequest(apiEndpoints.menu.item(id), { method: "PATCH", token, body }),
  deleteMenuItem: (id: string, token: string) => apiRequest(apiEndpoints.menu.item(id), { method: "DELETE", token }),

  createOrder: (body: Record<string, unknown>, token?: string) =>
    apiRequest(apiEndpoints.orders.list, { method: "POST", token, body }),
  getOrders: (token: string, params?: QueryParams) => apiRequest(apiEndpoints.orders.list, { token, params }),
  getOrderById: (id: string, token: string) => apiRequest(apiEndpoints.orders.detail(id), { token }),
  updateOrderStatus: (id: string, token: string, status: OrderStatus) =>
    apiRequest(apiEndpoints.orders.updateStatus(id), { method: "PATCH", token, body: { status } }),

  createMessage: (body: {
    senderName: string;
    content: string;
    phone?: string;
    email?: string;
    source?: string;
  }) => apiRequest(apiEndpoints.messages.list, { method: "POST", body }),
  getMessages: (token: string, params?: QueryParams) => apiRequest(apiEndpoints.messages.list, { token, params }),
  markMessageRead: (id: string, token: string, isRead = true) =>
    apiRequest(apiEndpoints.messages.markRead(id), { method: "PATCH", token, body: { isRead } }),
  deleteMessage: (id: string, token: string) => apiRequest(apiEndpoints.messages.remove(id), { method: "DELETE", token }),

  subscribeNewsletter: (email: string) =>
    apiRequest(apiEndpoints.newsletter.subscribe, { method: "POST", body: { email } }),
  getNewsletterSubscribers: (token: string, params?: QueryParams) =>
    apiRequest(apiEndpoints.newsletter.list, { token, params }),
  sendNewsletterCampaign: (token: string, body: NewsletterCampaignBody) =>
    apiRequest(apiEndpoints.newsletter.campaign, { method: "POST", token, body }),
  updateNewsletterStatus: (id: string, token: string, status: string) =>
    apiRequest(apiEndpoints.newsletter.updateStatus(id), { method: "PATCH", token, body: { status } }),
  deleteNewsletterSubscriber: (id: string, token: string) =>
    apiRequest(apiEndpoints.newsletter.remove(id), { method: "DELETE", token }),

  createNotification: (
    token: string,
    body: {
      content: string;
      type?: NotificationType;
      priority?: NotificationPriority;
      actionLink?: string;
      userId?: string;
    }
  ) => apiRequest(apiEndpoints.notifications.create, { method: "POST", token, body }),
  getNotifications: (token: string, params?: QueryParams) =>
    apiRequest(apiEndpoints.notifications.list, { token, params }),
  markNotificationRead: (id: string, token: string, isRead = true) =>
    apiRequest(apiEndpoints.notifications.markRead(id), { method: "PATCH", token, body: { isRead } }),
  markAllNotificationsRead: (token: string, userId?: string) =>
    apiRequest(apiEndpoints.notifications.markReadAll, {
      method: "PATCH",
      token,
      body: userId ? { userId } : {}
    }),
  deleteNotification: (id: string, token: string) =>
    apiRequest(apiEndpoints.notifications.remove(id), { method: "DELETE", token }),

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
  ) => apiRequest(apiEndpoints.gallery.create, { method: "POST", token, body }),
  createGalleryMultipart: (token: string, formData: FormData) =>
    apiRequest(apiEndpoints.gallery.create, { method: "POST", token, body: formData }),
  updateGallery: (id: string, token: string, body: Record<string, unknown>) =>
    apiRequest(apiEndpoints.gallery.detail(id), { method: "PATCH", token, body }),
  deleteGallery: (id: string, token: string) => apiRequest(apiEndpoints.gallery.remove(id), { method: "DELETE", token }),

  uploadImage: (token: string, image: File, folder?: string) => {
    const formData = new FormData();
    formData.append("image", image);
    if (folder) {
      formData.append("folder", folder);
    }
    return apiRequest(apiEndpoints.uploads.image, { method: "POST", token, body: formData });
  },

  getDashboardOverview: (token: string, params?: { limit?: number }) =>
    apiRequest(apiEndpoints.dashboard.overview, { token, params }),
  getAnalyticsSummary: (token: string, params?: { days?: number }) =>
    apiRequest(apiEndpoints.analytics.summary, { token, params }),
  getSalesReport: (token: string, params?: { from?: string; to?: string }) =>
    apiRequest(apiEndpoints.reports.sales, { token, params })
};
