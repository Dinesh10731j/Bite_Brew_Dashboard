import type { GalleryItem, MenuItem, Message, Metric, Notification, Order, TrafficPoint } from "@/lib/types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

export const overviewMetrics: Metric[] = [
  { label: "Total Visitors", value: formatNumber(12840), delta: "+12.4%", trend: "up" },
  { label: "Active Users", value: "146 live", delta: "+8.1%", trend: "up" },
  { label: "Orders Today", value: "94", delta: "+18.0%", trend: "up" },
  { label: "Revenue Today", value: formatCurrency(48750), delta: "+10.6%", trend: "up" },
  { label: "Conversion Rate", value: formatPercent(6.8), delta: "-0.4%", trend: "down" }
];

export const trafficSummary: TrafficPoint[] = [
  { label: "Sun", visitors: 920, orders: 58, revenue: 22100 },
  { label: "Mon", visitors: 1100, orders: 66, revenue: 26600 },
  { label: "Tue", visitors: 1320, orders: 74, revenue: 30100 },
  { label: "Wed", visitors: 1410, orders: 81, revenue: 32800 },
  { label: "Thu", visitors: 1540, orders: 85, revenue: 36500 },
  { label: "Fri", visitors: 1710, orders: 92, revenue: 42100 },
  { label: "Sat", visitors: 1980, orders: 109, revenue: 50600 }
];

export const orders: Order[] = [
  {
    id: "JBB-1001",
    customerName: "Sujan Karki",
    phone: "+977-9812345678",
    email: "sujan@example.com",
    itemsOrdered: "Cold Brew, Croissant",
    quantity: 3,
    totalPrice: 1150,
    orderType: "dine-in",
    paymentMethod: "eSewa",
    paymentStatus: "paid",
    orderStatus: "completed",
    tableNumber: "T-04",
    createdTime: "10:12 AM",
    timeline: [
      { label: "Pending", time: "10:02 AM", active: true },
      { label: "Confirmed", time: "10:05 AM", active: true },
      { label: "Preparing", time: "10:07 AM", active: true },
      { label: "Completed", time: "10:12 AM", active: true }
    ]
  },
  {
    id: "JBB-1002",
    customerName: "Aarohi Shah",
    phone: "+977-9800001122",
    email: "aarohi@example.com",
    itemsOrdered: "Matcha Latte, Muffin",
    quantity: 2,
    totalPrice: 890,
    orderType: "takeaway",
    paymentMethod: "cash",
    paymentStatus: "pending",
    orderStatus: "preparing",
    createdTime: "10:35 AM",
    timeline: [
      { label: "Pending", time: "10:28 AM", active: true },
      { label: "Confirmed", time: "10:30 AM", active: true },
      { label: "Preparing", time: "10:35 AM", active: true },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "JBB-1003",
    customerName: "Ritika Singh",
    phone: "+91-9822212212",
    email: "ritika@example.com",
    itemsOrdered: "Americano, Garlic Toast",
    quantity: 2,
    totalPrice: 760,
    orderType: "delivery",
    paymentMethod: "Khalti",
    paymentStatus: "paid",
    orderStatus: "confirmed",
    deliveryAddress: "Baneshwor, Kathmandu",
    createdTime: "11:02 AM",
    timeline: [
      { label: "Pending", time: "10:55 AM", active: true },
      { label: "Confirmed", time: "11:02 AM", active: true },
      { label: "Preparing", time: "--", active: false },
      { label: "Completed", time: "--", active: false }
    ]
  }
];

export const messages: Message[] = [
  {
    id: "MSG-1",
    senderName: "Nisha Lama",
    phone: "+977-9800032145",
    email: "nisha@example.com",
    content: "Do you offer private bookings for small events?",
    timestamp: "15 min ago",
    isRead: false,
    replyStatus: "pending",
    source: "Website form"
  },
  {
    id: "MSG-2",
    senderName: "Anmol Thapa",
    phone: "+977-9800012345",
    email: "anmol@example.com",
    content: "Can I preorder breakfast for tomorrow morning?",
    timestamp: "42 min ago",
    isRead: true,
    replyStatus: "replied",
    source: "WhatsApp"
  }
];

export const notifications: Notification[] = [
  {
    id: "NOT-1",
    type: "order",
    content: "New delivery order received from Boudha.",
    timestamp: "2 min ago",
    isRead: false,
    priority: "high",
    actionLink: "/dashboard/orders/JBB-1003"
  },
  {
    id: "NOT-2",
    type: "message",
    content: "Unread message from Nisha Lama.",
    timestamp: "15 min ago",
    isRead: false,
    priority: "medium",
    actionLink: "/dashboard/messages"
  },
  {
    id: "NOT-3",
    type: "system",
    content: "Weekly backup completed successfully.",
    timestamp: "1 hour ago",
    isRead: true,
    priority: "low",
    actionLink: "/dashboard/settings"
  }
];

export const topSellingItems = [
  { name: "Signature Cold Brew", orders: 124, revenue: formatCurrency(43400) },
  { name: "Masala Chiya", orders: 98, revenue: formatCurrency(19600) },
  { name: "Chicken Club Sandwich", orders: 72, revenue: formatCurrency(28800) }
];

export const topLocations = [
  { place: "Kathmandu", visitors: 4210 },
  { place: "Pokhara", visitors: 1730 },
  { place: "Nepal", visitors: 6240 },
  { place: "India", visitors: 1510 }
];

export const menuItems: MenuItem[] = [
  {
    id: "MN-1",
    name: "Caramel Latte",
    category: "Coffee",
    price: 420,
    description: "Espresso with caramel cream and velvety milk.",
    availability: "in stock",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    featured: true,
    discount: "10%",
    popularity: 216
  },
  {
    id: "MN-2",
    name: "Himalayan Tea Pot",
    category: "Tea",
    price: 350,
    description: "Slow-steeped tea with herbs and citrus peel.",
    availability: "in stock",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    featured: false,
    popularity: 172
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: "GL-1",
    title: "Signature drinks spread",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    category: "Food",
    uploadDate: "2026-04-05",
    tags: ["coffee", "featured", "menu"],
    featured: true
  },
  {
    id: "GL-2",
    title: "Main seating area",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
    category: "Interior",
    uploadDate: "2026-04-02",
    tags: ["interior", "cozy", "space"],
    featured: false
  },
  {
    id: "GL-3",
    title: "Open mic evening",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    category: "Events",
    uploadDate: "2026-03-28",
    tags: ["event", "community", "night"],
    featured: true
  }
];
