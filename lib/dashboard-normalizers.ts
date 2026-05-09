import type { Message, Order, TrafficPoint } from "@/lib/types";

export type AnalyticsSummaryView = {
  days: number;
  totalVisits: number;
  revenue: number;
  totalOrders: number;
  totalMessages: number;
  conversionRate: number;
  dailyOrders: { label: string; count: number }[];
  dailyRevenue: { label: string; revenue: number }[];
  salesOverview: TrafficPoint[];
};

const orderStatusMap: Record<string, Order["orderStatus"]> = {
  pending: "pending",
  confirmed: "confirmed",
  preparing: "preparing",
  ready: "ready",
  completed: "completed",
  cancelled: "cancelled",
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function unwrapApiData<T = any>(payload: unknown): T {
  if (!isObject(payload)) {
    return payload as T;
  }

  const first = Object.prototype.hasOwnProperty.call(payload, "data")
    ? (payload as Record<string, unknown>).data
    : payload;

  if (isObject(first) && Object.prototype.hasOwnProperty.call(first, "data")) {
    return (first as Record<string, unknown>).data as T;
  }

  return first as T;
}

export function extractArrayData<T = any>(payload: unknown): T[] {
  const unwrapped = unwrapApiData(payload);
  if (Array.isArray(unwrapped)) return unwrapped as T[];
  if (isObject(unwrapped)) {
    const candidates = ["items", "rows", "results", "list"];
    for (const key of candidates) {
      const value = (unwrapped as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

export function findArrayData<T = any>(payload: unknown): T[] | null {
  const unwrapped = unwrapApiData(payload);
  if (Array.isArray(unwrapped)) return unwrapped as T[];
  if (isObject(unwrapped)) {
    const candidates = ["items", "rows", "results", "list"];
    for (const key of candidates) {
      const value = (unwrapped as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return null;
}

function normalizedOrderStatus(value: unknown): Order["orderStatus"] {
  const raw = String(value ?? "pending").toLowerCase();
  return orderStatusMap[raw] ?? "pending";
}

export function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "read"].includes(normalized)) return true;
    if (["false", "0", "no", "unread", ""].includes(normalized)) return false;
  }
  return fallback;
}

export function normalizeOrder(item: any): Order {
  const status = normalizedOrderStatus(item?.status ?? item?.orderStatus);
  const paymentMethodRaw = String(item?.paymentMethod ?? "cash").toLowerCase();
  const paymentMethod: Order["paymentMethod"] =
    paymentMethodRaw === "esewa" ? "eSewa" : paymentMethodRaw === "khalti" ? "Khalti" : "cash";
  const paymentStatus: Order["paymentStatus"] = String(item?.paymentStatus ?? "pending").toLowerCase() === "paid" ? "paid" : "pending";

  const items = Array.isArray(item?.items) ? item.items : Array.isArray(item?.orderItems) ? item.orderItems : [];
  const quantity = Number(item?.quantity ?? items.reduce((sum: number, part: any) => sum + Number(part?.quantity ?? 1), 0) ?? 1) || 1;

  const totalPrice =
    Number(item?.totalPrice ?? item?.total ?? item?.amount ?? 0) ||
    items.reduce((sum: number, part: any) => sum + Number(part?.price ?? part?.menuItem?.price ?? 0) * Number(part?.quantity ?? 1), 0);

  const orderTypeRaw = String(item?.orderType ?? "takeaway").toLowerCase();
  const orderType: Order["orderType"] =
    orderTypeRaw === "delivery" ? "delivery" : orderTypeRaw === "dine_in" || orderTypeRaw === "dine-in" ? "dine-in" : "takeaway";

  const orderItemImages = items
    .map((part: any) => part?.menuItem?.image ?? part?.image)
    .filter((url: any) => typeof url === "string" && url.trim().length > 0);

  return {
    id: item?.orderNumber ?? item?.id ?? item?._id ?? "JBB-0000",
    backendId: item?.id ?? item?._id ?? undefined,
    customerName: item?.customerName ?? "Customer",
    phone: item?.phone ?? "-",
    email: item?.email ?? "-",
    itemsOrdered: items.length ? items.map((part: any) => part?.menuItem?.name ?? part?.name ?? "Item").join(", ") : "Order item",
    quantity,
    totalPrice,
    orderType,
    paymentMethod,
    paymentStatus,
    orderStatus: status,
    tableNumber: item?.tableNumber ?? undefined,
    deliveryAddress: item?.deliveryAddress ?? undefined,
    orderItemImages,
    createdTime: item?.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-",
    timeline: [
      { label: "Pending", time: item?.createdAt ? "Created" : "--", active: true },
      { label: "Confirmed", time: ["confirmed", "preparing", "ready", "completed"].includes(status) ? "Updated" : "--", active: ["confirmed", "preparing", "ready", "completed"].includes(status) },
      { label: "Preparing", time: ["preparing", "ready", "completed"].includes(status) ? "Kitchen" : "--", active: ["preparing", "ready", "completed"].includes(status) },
      { label: "Completed", time: status === "completed" ? "Done" : "--", active: status === "completed" },
    ],
  };
}

export function normalizeMessage(item: any): Message {
  return {
    id: item?.id ?? item?._id ?? "MSG",
    backendId: item?.id ?? item?._id ?? undefined,
    senderName: item?.senderName ?? "Customer",
    phone: item?.phone ?? "-",
    email: item?.email ?? "-",
    content: item?.content ?? "",
    timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
    isRead: normalizeBoolean(item?.isRead ?? item?.read),
    replyStatus: item?.replyStatus === "replied" ? "replied" : "pending",
    source: item?.source ?? "Website form",
  };
}

function parseDailySeries(series: any[] | undefined, labelField: string, valueField: string) {
  if (!Array.isArray(series)) return [] as { key: string; label: string; value: number }[];
  return series.map((item) => ({
    key: item?.[labelField] ? String(item[labelField]) : String(item?.label ?? "-"),
    label: item?.[labelField]
      ? new Date(item[labelField]).toLocaleDateString(undefined, { month: "short", day: "numeric" })
      : String(item?.label ?? "-"),
    value: Number(item?.[valueField] ?? item?.value ?? 0),
  }));
}

export function normalizeAnalyticsSummary(response: any, days = 7): AnalyticsSummaryView {
  const data = unwrapApiData(response) ?? {};
  const totals = data?.totals ?? {};

  const dailyVisits = parseDailySeries(data?.dailyVisits, "day", "count");
  const dailyOrders = parseDailySeries(data?.dailyOrders, "day", "count");
  const dailyRevenue = parseDailySeries(data?.dailyRevenue, "day", "amount");

  const ordersByKey = new Map(dailyOrders.map((item) => [item.key, item.value]));
  const revenueByKey = new Map(dailyRevenue.map((item) => [item.key, item.value]));
  const visitsChart: TrafficPoint[] = dailyVisits.length
    ? dailyVisits.map((item) => ({
        label: item.label,
        visitors: item.value,
        orders: ordersByKey.get(item.key) ?? 0,
        revenue: revenueByKey.get(item.key) ?? 0,
      }))
    : [];

  return {
    days,
    totalVisits: Number(totals?.visits ?? data?.totalVisits ?? 0),
    revenue: Number(data?.revenue ?? totals?.revenue ?? 0),
    totalOrders: Number(totals?.orders ?? data?.totalOrders ?? 0),
    totalMessages: Number(totals?.messages ?? data?.totalMessages ?? 0),
    conversionRate: (() => {
      const raw = Number(data?.conversionRate ?? 0);
      if (!Number.isFinite(raw)) return 0;
      return raw <= 1 ? raw * 100 : raw;
    })(),
    dailyOrders: dailyOrders.map((item) => ({ label: item.label, count: item.value })),
    dailyRevenue: dailyRevenue.map((item) => ({ label: item.label, revenue: item.value })),
    salesOverview: visitsChart,
  };
}
