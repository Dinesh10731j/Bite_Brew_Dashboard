"use client";

import { useBackendResource } from "@/hooks/useBackendResource";
import { normalizeBoolean, normalizeMessage, normalizeOrder, unwrapApiData } from "@/lib/dashboard-normalizers";
import { dashboardApi } from "@/lib/api/dashboard";

type DashboardView = {
  metrics: { label: string; value: string; delta: string }[];
  trafficSummary: { label: string; visitors: number; orders: number; revenue: number }[];
  recentOrders: ReturnType<typeof normalizeOrder>[];
  topSellingItems: {
    id?: string;
    name?: string;
    orders?: number;
    revenue?: string;
    price?: string;
    imageUrl?: string;
    available?: boolean;
    featured?: boolean;
  }[];
  topLocations: { place?: string; visitors?: number }[];
  notifications: {
    id: string;
    type: "order" | "message" | "system";
    content: string;
    timestamp: string;
    isRead: boolean;
    priority: "high" | "medium" | "low";
    actionLink: string;
  }[];
  recentMessages: ReturnType<typeof normalizeMessage>[];
};

export function useDashboard() {
  const resource = useBackendResource<DashboardView>({
    fallback: {
      metrics: [
        { label: "Orders", value: "0", delta: "Live" },
        { label: "Menu Items", value: "0", delta: "Live" },
        { label: "Unread Messages", value: "0", delta: "Live" },
        { label: "Notifications", value: "0", delta: "Live" },
        { label: "Total Sales", value: "NPR 0", delta: "Live" },
      ],
      trafficSummary: [],
      recentOrders: [],
      topSellingItems: [],
      topLocations: [],
      notifications: [],
      recentMessages: [],
    },
    loader: async () => {
      const apiResponse = await dashboardApi.getDashboardOverview({ limit: 5 });
      const overviewData: any = unwrapApiData(apiResponse) ?? {};

      const cards = overviewData?.cards ?? {};
      const trafficData = overviewData?.trafficSummary ?? {};
      const trafficDays = Array.isArray(trafficData?.days) ? trafficData.days : [];

      const metrics = [
        { label: "Orders", value: String(Number(cards?.ordersCount ?? 0)), delta: "Live" },
        { label: "Menu Items", value: String(Number(cards?.menuCount ?? 0)), delta: "Live" },
        { label: "Unread Messages", value: String(Number(cards?.unreadMessages ?? 0)), delta: "Live" },
        { label: "Notifications", value: String(Number(cards?.unreadNotifications ?? 0)), delta: "Live" },
        { label: "Total Sales", value: `NPR ${Number(cards?.totalSales ?? 0).toLocaleString()}`, delta: "Live" },
      ];

      const trafficSummary = trafficDays.map((item: any) => ({
        label: item?.day ? new Date(item.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "-",
        visitors: Number(item?.count ?? 0),
        orders: 0,
        revenue: 0,
      }));

      const recentOrders = Array.isArray(overviewData?.recentOrders)
        ? overviewData.recentOrders.map(normalizeOrder)
        : [];

      const orderVolumeByItemId = new Map<string, number>();
      if (Array.isArray(overviewData?.recentOrders)) {
        for (const order of overviewData.recentOrders) {
          const orderItems = Array.isArray(order?.orderItems) ? order.orderItems : [];
          for (const orderItem of orderItems) {
            const itemId = String(orderItem?.menuItemId ?? orderItem?.menuItem?.id ?? "");
            if (!itemId) continue;
            const quantity = Number(orderItem?.quantity ?? 0);
            if (!quantity) continue;
            orderVolumeByItemId.set(itemId, (orderVolumeByItemId.get(itemId) ?? 0) + quantity);
          }
        }
      }

      const topSellingItems = Array.isArray(overviewData?.topSellingItems)
        ? overviewData.topSellingItems.map((item: any) => {
            const backendOrders = Number(item?.orders ?? item?.orderCount);
            const popularity = Number(item?.popularity);
            const derivedOrders = orderVolumeByItemId.get(String(item?.id ?? "")) ?? 0;
            const resolvedOrders =
              (Number.isFinite(backendOrders) && backendOrders > 0 && backendOrders) ||
              (Number.isFinite(popularity) && popularity > 0 && popularity) ||
              (derivedOrders > 0 && derivedOrders) ||
              undefined;

            return {
              id: item?.id ?? item?.menuItem?.id ?? undefined,
              name: item?.name ?? item?.menuItem?.name ?? "Item",
              orders: resolvedOrders,
              revenue: item?.revenue ? `NPR ${Number(item.revenue).toLocaleString()}` : undefined,
              price: item?.price ? `NPR ${Number(item.price).toLocaleString()}` : undefined,
              imageUrl: item?.image ?? item?.imageUrl ?? item?.menuItem?.image ?? item?.menuItem?.imageUrl,
              available: item?.available ?? item?.menuItem?.available,
              featured: item?.featured ?? item?.menuItem?.featured,
            };
          })
        : [];

      const topLocations = Array.isArray(overviewData?.topLocations)
        ? overviewData.topLocations.map((item: any) => ({
            place: item?.city && item?.country && item.city !== "Unknown"
              ? `${item.city}, ${item.country}`
              : item?.city ?? item?.country ?? "Unknown",
            visitors: Number(item?.visitors ?? 0),
          }))
        : [];

      const notifications = Array.isArray(overviewData?.notifications)
        ? overviewData.notifications.slice(0, 5).map((item: any) => ({
            id: item?.id ?? item?._id ?? "",
            type: String(item?.type ?? "SYSTEM").toLowerCase() as "order" | "message" | "system",
            content: item?.content ?? "",
            timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
            isRead: normalizeBoolean(item?.isRead ?? item?.read),
            priority: String(item?.priority ?? "MEDIUM").toLowerCase() as "high" | "medium" | "low",
            actionLink: item?.actionLink ?? "#",
          }))
        : [];

      const recentMessages = Array.isArray(overviewData?.recentMessages)
        ? overviewData.recentMessages.slice(0, 5).map(normalizeMessage)
        : [];

      return {
        metrics,
        trafficSummary,
        recentOrders,
        topSellingItems,
        topLocations,
        notifications,
        recentMessages,
      };
    },
    resetOnError: true,
  });

  return resource;
}
