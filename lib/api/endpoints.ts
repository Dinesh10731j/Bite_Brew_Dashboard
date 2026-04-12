const base = "http://localhost:7000/api/v1/bite-brew";

export const apiEndpoints = {
  health: `${base}/health`,
  auth: {
    signup: `${base}/auth/signup`,
    signin: `${base}/auth/signin`,
    logout: `${base}/auth/logout`,
    forgotPassword: `${base}/auth/forgot-password`,
    resetPassword: `${base}/auth/reset-password`
  },
  users: {
    list: `${base}/users`,
    me: `${base}/users/me`,
    updateRole: (id: string) => `${base}/users/${id}/role`
  },
  menu: {
    categories: `${base}/menu/categories`,
    category: (id: string) => `${base}/menu/categories/${id}`,
    items: `${base}/menu/items`,
    item: (id: string) => `${base}/menu/items/${id}`
  },
  orders: {
    list: `${base}/orders`,
    detail: (id: string) => `${base}/orders/${id}`,
    updateStatus: (id: string) => `${base}/orders/${id}/status`
  },
  messages: {
    list: `${base}/messages`,
    markRead: (id: string) => `${base}/messages/${id}/read`,
    remove: (id: string) => `${base}/messages/${id}`
  },
  newsletter: {
    subscribe: `${base}/newsletter/subscribe`,
    list: `${base}/newsletter`,
    campaign: `${base}/newsletter/campaign`,
    updateStatus: (id: string) => `${base}/newsletter/${id}/status`,
    remove: (id: string) => `${base}/newsletter/${id}`
  },
  notifications: {
    create: `${base}/notifications`,
    list: `${base}/notifications`,
    markRead: (id: string) => `${base}/notifications/${id}/read`,
    markReadAll: `${base}/notifications/read-all`,
    remove: (id: string) => `${base}/notifications/${id}`
  },
  gallery: {
    list: `${base}/gallery`,
    create: `${base}/gallery`,
    detail: (id: string) => `${base}/gallery/${id}`,
    remove: (id: string) => `${base}/gallery/${id}`
  },
  uploads: {
    image: `${base}/uploads/image`
  },
  dashboard: {
    overview: `${base}/dashboard/overview`
  },
  analytics: {
    summary: `${base}/analytics/summary`
  },
  reports: {
    sales: `${base}/reports/sales`
  }
};
