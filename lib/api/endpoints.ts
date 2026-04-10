const base = "http://localhost:7000/api/v1/bite-brew";

export const apiEndpoints = {
  health: `${base}/health`,
  auth: {
    signup: `${base}/auth/signup`,
    signin: `${base}/auth/signin`,
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
    updateStatus: (id: string) => `${base}/newsletter/${id}/status`,
    remove: (id: string) => `${base}/newsletter/${id}`
  },
  notifications: {
    create: `${base}/notifications`
  }
};
