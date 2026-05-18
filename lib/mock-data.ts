import type { GalleryItem, MenuItem, Message, Metric, Notification, Order, TrafficPoint } from "@/lib/shared";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/shared";

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
    id: "1066cd61-3389-4458-8d7e-901c39602251",
    backendId: "1066cd61-3389-4458-8d7e-901c39602251",
    customerName: "Dinesh Tamang",
    phone: "9878656789",
    email: "dinesh.tamang1@example.com",
    itemsOrdered: "Mojito, Mojito",
    quantity: 2,
    totalPrice: 379,
    orderType: "dine-in",
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "completed",
    createdTime: "09:05 AM",
    timeline: [
      { label: "Pending", time: "08:50 AM", active: true },
      { label: "Confirmed", time: "08:55 AM", active: true },
      { label: "Preparing", time: "09:00 AM", active: true },
      { label: "Completed", time: "09:05 AM", active: true }
    ]
  },
  {
    id: "d2f56016-fdd4-43e1-b839-06fbaa8007b7",
    backendId: "d2f56016-fdd4-43e1-b839-06fbaa8007b7",
    customerName: "Himal Rijal",
    phone: "9876554123",
    email: "himal.rijal1@example.com",
    itemsOrdered: "Mojito",
    quantity: 1,
    totalPrice: 180,
    orderType: "delivery",
    paymentMethod: "cash",
    paymentStatus: "pending",
    orderStatus: "cancelled",
    deliveryAddress: "Kathmandu",
    createdTime: "09:25 AM",
    timeline: [
      { label: "Pending", time: "09:15 AM", active: true },
      { label: "Confirmed", time: "09:18 AM", active: true },
      { label: "Preparing", time: "--", active: false },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "153b5603-e181-43f7-8277-345be2722790",
    backendId: "153b5603-e181-43f7-8277-345be2722790",
    customerName: "Himal Rijal",
    phone: "9876554123",
    email: "himal.rijal2@example.com",
    itemsOrdered: "Cappuccino, Mojito",
    quantity: 2,
    totalPrice: 360,
    orderType: "delivery",
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "completed",
    deliveryAddress: "Kathmandu",
    createdTime: "09:45 AM",
    timeline: [
      { label: "Pending", time: "09:35 AM", active: true },
      { label: "Confirmed", time: "09:38 AM", active: true },
      { label: "Preparing", time: "09:42 AM", active: true },
      { label: "Completed", time: "09:45 AM", active: true }
    ]
  },
  {
    id: "44403eb1-aafd-4153-bc7c-22b70da796c0",
    backendId: "44403eb1-aafd-4153-bc7c-22b70da796c0",
    customerName: "Himal Rijal",
    phone: "9876554123",
    email: "himal.rijal3@example.com",
    itemsOrdered: "Mojito",
    quantity: 1,
    totalPrice: 180,
    orderType: "delivery",
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "ready",
    deliveryAddress: "Kathmandu",
    createdTime: "10:10 AM",
    timeline: [
      { label: "Pending", time: "09:55 AM", active: true },
      { label: "Confirmed", time: "10:00 AM", active: true },
      { label: "Preparing", time: "10:06 AM", active: true },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "eef881b3-e205-4ede-99e5-92e078ae47a8",
    backendId: "eef881b3-e205-4ede-99e5-92e078ae47a8",
    customerName: "Dinesh Tamang",
    phone: "9876567897",
    email: "dinesh.tamang2@example.com",
    itemsOrdered: "Mojito, Mojito",
    quantity: 2,
    totalPrice: 360,
    orderType: "dine-in",
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "ready",
    createdTime: "10:22 AM",
    timeline: [
      { label: "Pending", time: "10:05 AM", active: true },
      { label: "Confirmed", time: "10:10 AM", active: true },
      { label: "Preparing", time: "10:18 AM", active: true },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "c498d9ee-62f9-4c75-9e23-aa05911d3315",
    backendId: "c498d9ee-62f9-4c75-9e23-aa05911d3315",
    customerName: "Dinesh Tamang",
    phone: "9876567897",
    email: "dinesh.tamang3@example.com",
    itemsOrdered: "Mojito",
    quantity: 2,
    totalPrice: 360,
    orderType: "dine-in",
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "ready",
    createdTime: "10:36 AM",
    timeline: [
      { label: "Pending", time: "10:20 AM", active: true },
      { label: "Confirmed", time: "10:25 AM", active: true },
      { label: "Preparing", time: "10:32 AM", active: true },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "3772a00f-405e-41c1-9288-9389c6cb5ae5",
    backendId: "3772a00f-405e-41c1-9288-9389c6cb5ae5",
    customerName: "Dinesh Tamang",
    phone: "9876567897",
    email: "dinesh.tamang4@example.com",
    itemsOrdered: "Cappuccino",
    quantity: 1,
    totalPrice: 180,
    orderType: "dine-in",
    paymentMethod: "cash",
    paymentStatus: "pending",
    orderStatus: "cancelled",
    createdTime: "10:58 AM",
    timeline: [
      { label: "Pending", time: "10:50 AM", active: true },
      { label: "Confirmed", time: "--", active: false },
      { label: "Preparing", time: "--", active: false },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "df6148b8-8524-46be-8ad7-b0e8a291ff6d",
    backendId: "df6148b8-8524-46be-8ad7-b0e8a291ff6d",
    customerName: "Dinesh Tamang",
    phone: "9876546785",
    email: "dinesh.tamang5@example.com",
    itemsOrdered: "Mojito, Mojito",
    quantity: 4,
    totalPrice: 720,
    orderType: "dine-in",
    paymentMethod: "cash",
    paymentStatus: "pending",
    orderStatus: "pending",
    createdTime: "11:12 AM",
    timeline: [
      { label: "Pending", time: "11:12 AM", active: true },
      { label: "Confirmed", time: "--", active: false },
      { label: "Preparing", time: "--", active: false },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "53f08050-4793-4370-b1fb-d457e7956d05",
    backendId: "53f08050-4793-4370-b1fb-d457e7956d05",
    customerName: "Dinesh Tamang",
    phone: "9856456312",
    email: "dinesh.tamang6@example.com",
    itemsOrdered: "Mojito",
    quantity: 1,
    totalPrice: 180,
    orderType: "delivery",
    paymentMethod: "cash",
    paymentStatus: "pending",
    orderStatus: "pending",
    deliveryAddress: "Kathmandu",
    createdTime: "11:18 AM",
    timeline: [
      { label: "Pending", time: "11:18 AM", active: true },
      { label: "Confirmed", time: "--", active: false },
      { label: "Preparing", time: "--", active: false },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "b93d378f-7147-4845-929b-dea6a6e115a0",
    backendId: "b93d378f-7147-4845-929b-dea6a6e115a0",
    customerName: "Rajan Siwakoti",
    phone: "9876546785",
    email: "rajan.siwakoti@example.com",
    itemsOrdered: "Mojito",
    quantity: 2,
    totalPrice: 360,
    orderType: "delivery",
    paymentMethod: "cash",
    paymentStatus: "paid",
    orderStatus: "ready",
    deliveryAddress: "Kathmandu",
    createdTime: "11:30 AM",
    timeline: [
      { label: "Pending", time: "11:15 AM", active: true },
      { label: "Confirmed", time: "11:20 AM", active: true },
      { label: "Preparing", time: "11:27 AM", active: true },
      { label: "Completed", time: "--", active: false }
    ]
  },
  {
    id: "1773a691-7bcc-462c-91bc-ac52de1f36d5",
    backendId: "1773a691-7bcc-462c-91bc-ac52de1f36d5",
    customerName: "Dinesh Tamang",
    phone: "9876546785",
    email: "dinesh.tamang7@example.com",
    itemsOrdered: "Cappuccino",
    quantity: 1,
    totalPrice: 180,
    orderType: "dine-in",
    paymentMethod: "cash",
    paymentStatus: "pending",
    orderStatus: "pending",
    createdTime: "11:45 AM",
    timeline: [
      { label: "Pending", time: "11:45 AM", active: true },
      { label: "Confirmed", time: "--", active: false },
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
