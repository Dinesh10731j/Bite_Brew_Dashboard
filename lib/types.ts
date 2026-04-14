export type UserRole = "admin" | "staff" | "manager" | "user";

export interface loginFormValues{
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
  trend: "up" | "down";
};

export type TrafficPoint = {
  label: string;
  visitors: number;
  orders?: number;
  revenue?: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  itemsOrdered: string;
  quantity: number;
  totalPrice: number;
  orderType: "dine-in" | "takeaway" | "delivery";
  paymentMethod: "cash" | "eSewa" | "Khalti";
  paymentStatus: "paid" | "pending";
  orderStatus: "pending" | "confirmed" | "preparing" | "completed";
  tableNumber?: string;
  deliveryAddress?: string;
  createdTime: string;
  timeline: { label: string; time: string; active: boolean }[];
};

export type Message = {
  id: string;
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
