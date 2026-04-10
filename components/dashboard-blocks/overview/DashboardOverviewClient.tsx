"use client";

import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { messages as fallbackMessages, notifications as fallbackNotifications, orders as fallbackOrders, overviewMetrics, topLocations, topSellingItems } from "@/lib/mock-data";
import { useBackendResource } from "@/hooks/useBackendResource";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { MetricGrid } from "@/components/dashboard-blocks/metrics/MetricGrid";
import { NotificationsWidget } from "./NotificationsWidget";
import { RecentMessages } from "./RecentMessages";
import { RecentOrders } from "./RecentOrders";
import { TopLocations } from "./TopLocations";
import { TopSellingItems } from "./TopSellingItems";
import { TrafficChart } from "./TrafficChart";

export function DashboardOverviewClient() {
  const token = getAccessToken();

  const ordersResource = useBackendResource(fallbackOrders, async () => {
    if (!token) return fallbackOrders;
    const response: any = await dashboardApi.getOrders(token, { page: 1, limit: 5 });
    return Array.isArray(response?.data)
      ? response.data.map((item: any) => ({
          ...fallbackOrders[0],
          id: item?.orderNumber ?? item?.id ?? item?._id ?? fallbackOrders[0].id,
          customerName: item?.customerName ?? fallbackOrders[0].customerName,
          phone: item?.phone ?? "-",
          email: item?.email ?? "-",
          itemsOrdered: Array.isArray(item?.items)
            ? item.items.map((part: any) => part?.menuItem?.name ?? part?.name ?? "Item").join(", ")
            : fallbackOrders[0].itemsOrdered,
          quantity: Array.isArray(item?.items)
            ? item.items.reduce((sum: number, part: any) => sum + Number(part?.quantity ?? 1), 0)
            : fallbackOrders[0].quantity,
          totalPrice: Number(item?.totalPrice ?? 0) || fallbackOrders[0].totalPrice,
          orderType: item?.orderType ?? fallbackOrders[0].orderType,
          paymentMethod: item?.paymentMethod ?? fallbackOrders[0].paymentMethod,
          paymentStatus: item?.paymentStatus ?? fallbackOrders[0].paymentStatus,
          orderStatus: item?.status === "completed" ? "completed" : item?.status === "preparing" ? "preparing" : "confirmed",
          createdTime: item?.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : fallbackOrders[0].createdTime
        }))
      : fallbackOrders;
  });

  const messagesResource = useBackendResource(fallbackMessages, async () => {
    if (!token) return fallbackMessages;
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

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <MetricGrid metrics={overviewMetrics} />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <TrafficChart />
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
          <NotificationsWidget items={fallbackNotifications} />
        </BlockCard>
      </div>
      <BlockCard title="Top Locations" description="Where your traffic is coming from.">
        <TopLocations items={topLocations} />
      </BlockCard>
    </div>
  );
}
