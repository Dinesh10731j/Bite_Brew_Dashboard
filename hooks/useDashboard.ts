import { notifications, orders, overviewMetrics, topLocations, topSellingItems, trafficSummary } from "@/lib/mock-data";

export function useDashboard() {
  return {
    metrics: overviewMetrics,
    trafficSummary,
    recentOrders: orders.slice(0, 5),
    topSellingItems,
    topLocations,
    notifications: notifications.slice(0, 5)
  };
}
