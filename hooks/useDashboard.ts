"use client";

import { dashboardApi } from "@/lib/api/dashboard";
import { useBackendResource } from "@/hooks/useBackendResource";
import { normalizeMessage, normalizeOrder, unwrapApiData } from "@/lib/dashboard-normalizers";

type DashboardView = {
  metrics: { label: string; value: string; delta: string }[];
  trafficSummary: { label: string; visitors: number; orders: number; revenue: number }[];
  recentOrders: ReturnType<typeof normalizeOrder>[];
  topSellingItems: { name?: string; orders?: number; revenue?: string }[];
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

async function fetchOverview(limit = 5) {
  return dashboardApi.getDashboardOverview({ limit });
}

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
      const response = await fetchOverview(5);
      const overviewData: any = unwrapApiData(response) ?? {};

      const cards = overviewData?.cards ?? {};
      const trafficData = overviewData?.trafficSummary ?? {};
      const trafficDays = Array.isArray(trafficData?.days) ? trafficData.days : [];

      return {
        metrics: [
          { label: "Orders", value: String(Number(cards?.ordersCount ?? 0)), delta: "Live" },
          { label: "Menu Items", value: String(Number(cards?.menuCount ?? 0)), delta: "Live" },
          { label: "Unread Messages", value: String(Number(cards?.unreadMessages ?? 0)), delta: "Live" },
          { label: "Notifications", value: String(Number(cards?.unreadNotifications ?? 0)), delta: "Live" },
          { label: "Total Sales", value: `NPR ${Number(cards?.totalSales ?? 0).toLocaleString()}`, delta: "Live" },
        ],
        trafficSummary: trafficDays.map((item: any) => ({
          label: item?.day ? new Date(item.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "-",
          visitors: Number(item?.count ?? 0),
          orders: 0,
          revenue: 0,
        })),
        recentOrders: Array.isArray(overviewData?.recentOrders)
          ? overviewData.recentOrders.map(normalizeOrder)
          : [],
        topSellingItems: Array.isArray(overviewData?.topSellingItems)
          ? overviewData.topSellingItems.map((item: any) => ({
              name: item?.name ?? item?.menuItem?.name ?? "Item",
              orders: item?.orders ? Number(item.orders) : undefined,
              revenue: item?.revenue ? `NPR ${Number(item.revenue).toLocaleString()}` : undefined,
              price: item?.price ? `NPR ${Number(item.price).toLocaleString()}` : undefined,
            }))
          : [],
        topLocations: Array.isArray(overviewData?.topLocations)
          ? overviewData.topLocations.map((item: any) => ({
              place: item?.city && item?.country && item.city !== "Unknown"
                ? `${item.city}, ${item.country}`
                : item?.city ?? item?.country ?? "Unknown",
              visitors: Number(item?.visitors ?? 0),
            }))
          : [],
        notifications: Array.isArray(overviewData?.notifications)
          ? overviewData.notifications.slice(0, 5).map((item: any) => ({
              id: item?.id ?? item?._id ?? "",
              type: String(item?.type ?? "SYSTEM").toLowerCase() as "order" | "message" | "system",
              content: item?.content ?? "",
              timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
              isRead: Boolean(item?.isRead),
              priority: String(item?.priority ?? "MEDIUM").toLowerCase() as "high" | "medium" | "low",
              actionLink: item?.actionLink ?? "#",
            }))
          : [],
        recentMessages: Array.isArray(overviewData?.recentMessages)
          ? overviewData.recentMessages.slice(0, 5).map(normalizeMessage)
          : [],
      };
    },
    resetOnError: true,
  });

  return resource;
}