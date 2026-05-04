import { apiService } from "@/services/api/dashboard-api";

type QueryParams = Record<string, string | number | boolean | undefined>;

type UserRole = "admin" | "user" | "manager" | "staff";
type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";

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

function normalizeQuery(argA?: string | QueryParams, argB?: QueryParams): QueryParams | undefined {
  if (typeof argA === "string") return argB;
  return argA;
}

function pickId(idOrToken: string, maybeId?: string): string {
  return maybeId ?? idOrToken;
}

export const dashboardApi = {
  health: () => apiService.dashboard.overview({ limit: 1 }),

  signup: (body: { name: string; email: string; password: string }) => apiService.auth.signup(body),
  signin: (body: { email: string; password: string }) => apiService.auth.signin(body),
  logout: () => apiService.auth.logout(),
  forgotPassword: (body: { email: string }) => apiService.auth.forgotPassword(body),
  resetPassword: (body: { email: string; token: string; password: string; confirmPassword: string }) =>
    apiService.auth.resetPassword(body),

  getUsers: (tokenOrParams?: string | QueryParams, params?: QueryParams) =>
    apiService.users.list(normalizeQuery(tokenOrParams, params)),
  getCurrentUser: () => apiService.users.me(),
  updateUserRole: (id: string, tokenOrRole: string | UserRole, maybeRole?: UserRole) => {
    const role = (maybeRole ?? tokenOrRole) as UserRole;
    return apiService.users.updateRole(id, role === "staff" ? "manager" : role);
  },

  getMenuCategories: (params?: QueryParams) => apiService.menu.categories.list(params),
  createMenuCategory: (tokenOrBody: string | { name: string; description?: string; isActive?: boolean }, maybeBody?: { name: string; description?: string; isActive?: boolean }) =>
    apiService.menu.categories.create(typeof tokenOrBody === "string" ? (maybeBody ?? { name: "" }) : tokenOrBody),
  updateMenuCategory: (
    id: string,
    tokenOrBody: string | { name?: string; description?: string; isActive?: boolean },
    maybeBody?: { name?: string; description?: string; isActive?: boolean }
  ) => apiService.menu.categories.update(id, typeof tokenOrBody === "string" ? (maybeBody ?? {}) : tokenOrBody),
  deleteMenuCategory: (id: string) => apiService.menu.categories.remove(id),

  getMenuItems: (params?: QueryParams) => apiService.menu.items.list(params),
  createMenuItem: (
    tokenOrBody:
      | string
      | {
          name: string;
          categoryId: string;
          price: number;
          description?: string;
          image?: string;
          available?: boolean;
          featured?: boolean;
          discount?: number;
        },
    maybeBody?: {
      name: string;
      categoryId: string;
      price: number;
      description?: string;
      image?: string;
      available?: boolean;
      featured?: boolean;
      discount?: number;
    }
  ) => apiService.menu.items.create(typeof tokenOrBody === "string" ? (maybeBody ?? {}) : tokenOrBody),
  createMenuItemMultipart: (tokenOrFormData: string | FormData, maybeFormData?: FormData) =>
    apiService.menu.items.create(tokenOrFormData instanceof FormData ? tokenOrFormData : (maybeFormData as FormData)),
  updateMenuItem: (id: string, tokenOrBody: string | Record<string, unknown>, maybeBody?: Record<string, unknown>) =>
    apiService.menu.items.update(id, typeof tokenOrBody === "string" ? (maybeBody ?? {}) : tokenOrBody),
  deleteMenuItem: (id: string) => apiService.menu.items.remove(id),

  getOrders: (tokenOrParams?: string | QueryParams, params?: QueryParams) =>
    apiService.orders.list(normalizeQuery(tokenOrParams, params)),
  createOrder: (body: Record<string, unknown>) => apiService.orders.create(body),
  getOrderById: (id: string) => apiService.orders.detail(id),
  updateOrderStatus: (id: string, tokenOrStatus: string | OrderStatus, maybeStatus?: OrderStatus) =>
    apiService.orders.updateStatus(id, (maybeStatus ?? tokenOrStatus) as string),

  createMessage: (body: { senderName: string; content: string; phone?: string; email?: string; source?: string }) =>
    apiService.messages.create(body),
  getMessages: (tokenOrParams?: string | QueryParams, params?: QueryParams) =>
    apiService.messages.list(normalizeQuery(tokenOrParams, params)),
  markMessageRead: (id: string, tokenOrRead?: string | boolean, maybeRead?: boolean) =>
    apiService.messages.markRead(id, typeof tokenOrRead === "boolean" ? tokenOrRead : (maybeRead ?? true)),
  deleteMessage: (id: string) => apiService.messages.remove(id),

  subscribeNewsletter: (email: string) => apiService.newsletter.subscribe(email),
  getNewsletterSubscribers: (tokenOrParams?: string | QueryParams, params?: QueryParams) =>
    apiService.newsletter.list(normalizeQuery(tokenOrParams, params)),
  sendNewsletterCampaign: (tokenOrBody: string | NewsletterCampaignBody, maybeBody?: NewsletterCampaignBody) =>
    apiService.newsletter.campaign((typeof tokenOrBody === "string" ? maybeBody : tokenOrBody) ?? {}),
  updateNewsletterStatus: (id: string, tokenOrStatus: string, maybeStatus?: string) =>
    apiService.newsletter.updateStatus(id, maybeStatus ?? tokenOrStatus),
  deleteNewsletterSubscriber: (id: string) => apiService.newsletter.remove(id),

  createNotification: (tokenOrBody: string | Record<string, unknown>, maybeBody?: Record<string, unknown>) =>
    apiService.notifications.create((typeof tokenOrBody === "string" ? maybeBody : tokenOrBody) ?? {}),
  getNotifications: (tokenOrParams?: string | QueryParams, params?: QueryParams) =>
    apiService.notifications.list(normalizeQuery(tokenOrParams, params)),
  markNotificationRead: (id: string, tokenOrRead?: string | boolean, maybeRead?: boolean) =>
    apiService.notifications.markRead(id, typeof tokenOrRead === "boolean" ? tokenOrRead : (maybeRead ?? true)),
  markAllNotificationsRead: () => apiService.notifications.markAllRead(),
  deleteNotification: (id: string) => apiService.notifications.remove(id),

  getGallery: (params?: QueryParams) => apiService.gallery.list(params),
  createGalleryJson: (tokenOrBody: string | Record<string, unknown>, maybeBody?: Record<string, unknown>) =>
    apiService.gallery.create((typeof tokenOrBody === "string" ? maybeBody : tokenOrBody) ?? {}),
  createGalleryMultipart: (tokenOrFormData: string | FormData, maybeFormData?: FormData) =>
    apiService.gallery.create(tokenOrFormData instanceof FormData ? tokenOrFormData : (maybeFormData as FormData)),
  updateGallery: (id: string, tokenOrBody: string | Record<string, unknown>, maybeBody?: Record<string, unknown>) =>
    apiService.gallery.update(id, typeof tokenOrBody === "string" ? (maybeBody ?? {}) : tokenOrBody),
  deleteGallery: (id: string) => apiService.gallery.remove(id),

  uploadImage: (tokenOrImage: string | File, imageOrFolder?: File | string, maybeFolder?: string) => {
    const image = tokenOrImage instanceof File ? tokenOrImage : (imageOrFolder as File);
    const folder = tokenOrImage instanceof File ? (imageOrFolder as string | undefined) : maybeFolder;
    return apiService.uploads.image(image, folder);
  },

  getDashboardOverview: (tokenOrParams?: string | { limit?: number }, params?: { limit?: number }) =>
    apiService.dashboard.overview(typeof tokenOrParams === "string" ? params : tokenOrParams),
  getAnalyticsSummary: (tokenOrParams?: string | { days?: number }, params?: { days?: number }) =>
    apiService.analytics.summary(typeof tokenOrParams === "string" ? params : tokenOrParams),
  getSalesReport: (tokenOrParams?: string | { from?: string; to?: string }, params?: { from?: string; to?: string }) =>
    apiService.reports.sales(typeof tokenOrParams === "string" ? params : tokenOrParams),
  getActivityLogs: (tokenOrParams?: string | QueryParams, params?: QueryParams) =>
    apiService.activityLogs.list(normalizeQuery(tokenOrParams, params)),
};
