"use client";

import type { Order } from "@/lib/types";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import {
  messages as fallbackMessages,
  notifications as fallbackNotifications,
  orders as fallbackOrders,
  overviewMetrics,
  topLocations,
  topSellingItems,
  trafficSummary
} from "@/lib/mock-data";
import { useBackendResource } from "@/hooks/useBackendResource";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { MetricGrid } from "@/components/dashboard-blocks/metrics/MetricGrid";
import { NotificationsWidget } from "./NotificationsWidget";
import { RecentMessages } from "./RecentMessages";
import { RecentOrders } from "./RecentOrders";
import { TopLocations } from "./TopLocations";
import { TopSellingItems } from "./TopSellingItems";
import { TrafficChart } from "./TrafficChart";

async function fetchAnalyticsSummary(days = 7) {
  const token = getAccessToken();
  const response = await fetch(`/dashboard/api/analytics/summary?days=${days}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Failed to load analytics summary" }));
    throw new Error(payload?.message ?? "Failed to load analytics summary");
  }

  return response.json();
}

async function fetchOverview(limit = 5) {
  const token = getAccessToken();
  const response = await fetch(`/dashboard/api/overview?limit=${limit}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Failed to load dashboard overview" }));
    throw new Error(payload?.message ?? "Failed to load dashboard overview");
  }

  return response.json();
}

function normalizeOverviewOrder(item: any, fallback: Order): Order {
  const rawStatus = String(item?.status ?? "pending").toLowerCase();
  const normalizedStatus: Order["orderStatus"] =
    rawStatus === "completed"
      ? "completed"
      : rawStatus === "preparing"
        ? "preparing"
        : rawStatus === "pending"
          ? "pending"
          : "confirmed";

  const rawOrderType = String(item?.orderType ?? "").toLowerCase();
  const orderType: Order["orderType"] =
    rawOrderType === "delivery"
      ? "delivery"
      : rawOrderType === "dine_in" || rawOrderType === "dine-in"
        ? "dine-in"
        : "takeaway";

  const orderItems = Array.isArray(item?.orderItems) ? item.orderItems : Array.isArray(item?.items) ? item.items : [];

  return {
    ...fallback,
    id: item?.orderNumber ?? item?.id ?? item?._id ?? fallback.id,
    customerName: item?.customerName ?? fallback.customerName,
    phone: item?.phone ?? "-",
    email: item?.email ?? "-",
    itemsOrdered: orderItems.length
      ? orderItems.map((part: any) => part?.menuItem?.name ?? part?.name ?? "Item").join(", ")
      : fallback.itemsOrdered,
    quantity: orderItems.length
      ? orderItems.reduce((sum: number, part: any) => sum + Number(part?.quantity ?? 1), 0)
      : fallback.quantity,
    totalPrice: Number(item?.totalPrice ?? 0) || fallback.totalPrice,
    orderType,
    paymentMethod: item?.paymentMethod ?? fallback.paymentMethod,
    paymentStatus: item?.paymentStatus ?? fallback.paymentStatus,
    orderStatus: normalizedStatus,
    tableNumber: item?.tableNumber ?? undefined,
    deliveryAddress: item?.deliveryAddress ?? undefined,
    createdTime: item?.createdAt
      ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : fallback.createdTime
  };
}

export function DashboardOverviewClient() {
  const metricsResource = useBackendResource(overviewMetrics, async () => {
    const overviewResponse: any = await fetchOverview(5);
    const cards = overviewResponse?.data?.cards ?? {};

    const totalOrders = Number(cards?.ordersCount ?? 0);
    const menuCount = Number(cards?.menuCount ?? 0);
    const unreadMessages = Number(cards?.unreadMessages ?? 0);
    const unreadNotifications = Number(cards?.unreadNotifications ?? 0);
    const totalSales = Number(cards?.totalSales ?? 0);

    return [
      { label: "Orders", value: `${totalOrders || fallbackOrders.length}`, delta: "Live" },
      { label: "Menu Items", value: `${menuCount}`, delta: "Live" },
      { label: "Unread Messages", value: `${unreadMessages}`, delta: "Live" },
      { label: "Notifications", value: `${unreadNotifications}`, delta: "Live" },
      { label: "Total Sales", value: totalSales ? `NPR ${totalSales.toLocaleString()}` : "NPR 0", delta: "Live" }
    ];
  });

  const trafficResource = useBackendResource(trafficSummary, async () => {
    const response: any = await fetchAnalyticsSummary(7);
    const dailyVisits = response?.data?.dailyVisits;

    if (!Array.isArray(dailyVisits) || !dailyVisits.length) {
      return trafficSummary;
    }

    return dailyVisits.map((item: any) => ({
      label: item?.day
        ? new Date(item.day).toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : "-",
      visitors: Number(item?.count ?? 0),
      orders: 0,
      revenue: 0
    }));
  });

  const ordersResource = useBackendResource(fallbackOrders, async () => {
    const response: any = await fetchOverview(5);
    const items = response?.data?.recentOrders ?? [];

    return Array.isArray(items)
      ? items.map((item: any) => normalizeOverviewOrder(item, fallbackOrders[0]))
      : fallbackOrders;
  });

  const messagesResource = useBackendResource(fallbackMessages, async () => {
    const token = getAccessToken();
    const response: any = await dashboardApi.getMessages(token, { page: 1, limit: 5 });
    return Array.isArray(response?.data)
      ? response.data.map((item: any) => ({
          id: item?.id ?? item?._id ?? "MSG",
          senderName: item?.senderName ?? "Customer",
          phone: item?.phone ?? "-",
          email: item?.email ?? "-",
          content: item?.content ?? "",
          timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
          isRead: Boolean(item?.isRead),
          replyStatus: item?.replyStatus ?? "pending",
          source: item?.source ?? "Website form"
        }))
      : fallbackMessages;
  });

  const notificationsResource = useBackendResource(fallbackNotifications, async () => {
    const token = getAccessToken();
    const response: any = await dashboardApi.getNotifications(token, { page: 1, limit: 5 });
    const rows = response?.data ?? [];
    return Array.isArray(rows)
      ? rows.map((item: any) => ({
          id: item?.id ?? item?._id ?? "NOT-1",
          type: String(item?.type ?? "SYSTEM").toLowerCase() as "order" | "message" | "system",
          content: item?.content ?? "",
          timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
          isRead: Boolean(item?.isRead),
          priority: String(item?.priority ?? "MEDIUM").toLowerCase() as "high" | "medium" | "low",
          actionLink: item?.actionLink ?? "#"
        }))
      : fallbackNotifications;
  });

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <MetricGrid metrics={metricsResource.data} />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <TrafficChart data={trafficResource.data} />
        <BlockCard title="Top Selling Items" description="Best performers by order volume.">
          <TopSellingItems items={topSellingItems} />
        </BlockCard>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <BlockCard title="Recent Orders" description="Latest 5 orders">
          <RecentOrders data={ordersResource.data} />
        </BlockCard>
        <BlockCard title="Recent Messages" description="Latest 5 customer messages">
          <RecentMessages data={messagesResource.data} />
        </BlockCard>
        <BlockCard title="Notifications" description="Latest 5 alerts">
          <NotificationsWidget items={notificationsResource.data} />
        </BlockCard>
      </div>
      <BlockCard title="Top Locations" description="Where your traffic is coming from.">
        <TopLocations items={topLocations} />
      </BlockCard>
    </div>
  );
}
