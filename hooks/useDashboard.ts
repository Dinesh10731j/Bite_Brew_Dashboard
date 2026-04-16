"use client";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { useBackendResource } from "@/hooks/useBackendResource";
import {
  messages as fallbackMessages,
  notifications as fallbackNotifications,
  orders as fallbackOrders,
  overviewMetrics,
  topLocations,
  topSellingItems,
  trafficSummary,
} from "@/lib/mock-data";
import { findArrayData, normalizeMessage, normalizeOrder, unwrapApiData } from "@/lib/dashboard-normalizers";

async function fetchOverview(limit = 5) {
  const token = getAccessToken();
  return dashboardApi.getDashboardOverview(token, { limit });
}

export function useDashboard() {
  const resource = useBackendResource({
    fallback: {
      metrics: overviewMetrics,
      trafficSummary,
      recentOrders: fallbackOrders.slice(0, 5),
      topSellingItems,
      topLocations,
      notifications: fallbackNotifications.slice(0, 5),
      recentMessages: fallbackMessages.slice(0, 5),
    },
    loader: async () => {
      const token = getAccessToken();
      const [overviewResponse, messagesResponse, notificationsResponse, analyticsResponse] = await Promise.all([
        fetchOverview(5),
        dashboardApi.getMessages(token, { page: 1, limit: 5 }),
        dashboardApi.getNotifications(token, { page: 1, limit: 5 }),
        dashboardApi.getAnalyticsSummary(token, { days: 7 }),
      ]);

      const overviewData: any = unwrapApiData(overviewResponse) ?? {};
      const cards = overviewData?.cards ?? {};
      const recentOrders = Array.isArray(overviewData?.recentOrders)
        ? overviewData.recentOrders.map(normalizeOrder)
        : fallbackOrders.slice(0, 5);

      const analyticsData: any = unwrapApiData(analyticsResponse) ?? {};
      const dailyVisits = Array.isArray(analyticsData?.dailyVisits) ? analyticsData.dailyVisits : [];
      const messagesData = findArrayData(messagesResponse);
      const notificationsData = findArrayData(notificationsResponse);

      return {
        metrics: [
          { label: "Orders", value: String(Number(cards?.ordersCount ?? 0)), delta: "Live" },
          { label: "Menu Items", value: String(Number(cards?.menuCount ?? 0)), delta: "Live" },
          { label: "Unread Messages", value: String(Number(cards?.unreadMessages ?? 0)), delta: "Live" },
          { label: "Notifications", value: String(Number(cards?.unreadNotifications ?? 0)), delta: "Live" },
          { label: "Total Sales", value: `NPR ${Number(cards?.totalSales ?? 0).toLocaleString()}`, delta: "Live" },
        ],
        trafficSummary: dailyVisits.length
          ? dailyVisits.map((item: any) => ({
              label: item?.day ? new Date(item.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "-",
              visitors: Number(item?.count ?? 0),
              orders: 0,
              revenue: 0,
            }))
          : trafficSummary,
        recentOrders,
        topSellingItems,
        topLocations,
        notifications: notificationsData
          ? notificationsData.slice(0, 5).map((item: any) => ({
              id: item?.id ?? item?._id ?? "NOT-1",
              type: String(item?.type ?? "SYSTEM").toLowerCase() as "order" | "message" | "system",
              content: item?.content ?? "",
              timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
              isRead: Boolean(item?.isRead),
              priority: String(item?.priority ?? "MEDIUM").toLowerCase() as "high" | "medium" | "low",
              actionLink: item?.actionLink ?? "#",
          }))
          : fallbackNotifications.slice(0, 5),
        recentMessages: messagesData
          ? messagesData.slice(0, 5).map(normalizeMessage)
          : fallbackMessages.slice(0, 5),
      };
    },
    resetOnError: false,
  });

  return resource;
}
