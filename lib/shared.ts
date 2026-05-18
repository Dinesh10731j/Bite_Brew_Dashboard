import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type UserRole = "admin" | "staff" | "manager" | "user";

export interface loginFormValues {
  email: string;
  password: string;
}

export interface loginResponse {
  message: string;
  isCached?: boolean;
  accessToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    token?: string;
    user?: User;
    tokens?: {
      accessToken?: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export type Metric = {
  label: string;
  value: string;
  delta: string;
  trend?: "up" | "down";
};

export type TrafficPoint = {
  label: string;
  visitors: number;
  orders?: number;
  revenue?: number;
};

export type Order = {
  id: string;
  backendId?: string;
  customerName: string;
  phone: string;
  email: string;
  itemsOrdered: string;
  quantity: number;
  totalPrice: number;
  orderType: "dine-in" | "takeaway" | "delivery";
  paymentMethod: "cash" | "eSewa" | "Khalti";
  paymentStatus: "paid" | "pending";
  orderStatus: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  tableNumber?: string;
  deliveryAddress?: string;
  createdTime: string;
  timeline: { label: string; time: string; active: boolean }[];
  orderItemImages?: string[];
};

export type Message = {
  id: string;
  backendId?: string;
  senderName: string;
  phone: string;
  email: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  replyStatus: "pending" | "replied";
  source: string;
};

export type Notification = {
  id: string;
  type: "order" | "message" | "system";
  content: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  actionLink: string;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  availability: "in stock" | "out of stock";
  image: string;
  featured: boolean;
  discount?: string;
  popularity: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  category: "Food" | "Interior" | "Events";
  uploadDate: string;
  tags: string[];
  featured: boolean;
};

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  exp: number;
  iat?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type CurrentUser = ApiResponse<User>;

export interface DashboardOverviewCards {
  ordersCount: number;
  menuCount: number;
  unreadMessages: number;
  unreadNotifications: number;
  totalSales: number;
}

export interface TrafficDay {
  day: string;
  count: number;
}

export interface TrafficSummary {
  days: TrafficDay[];
  trend: string;
}

export interface TopLocationApi {
  city: string;
  country: string;
  visitors: number;
}

export interface DashboardOverviewResponse {
  cards: DashboardOverviewCards;
  trafficSummary: TrafficSummary;
  topSellingItems: any[];
  recentOrders: any[];
  recentMessages: any[];
  notifications: any[];
  topLocations: TopLocationApi[];
}

export type TopBarProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}
