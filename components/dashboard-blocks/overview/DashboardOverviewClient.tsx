"use client";

import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { MetricGrid } from "@/components/dashboard-blocks/metrics/MetricGrid";
import { useDashboard } from "@/hooks/useDashboard";
import { useRealtimeResourceRefresh } from "@/hooks/useRealtimeUpdates";
import { NotificationsWidget } from "./NotificationsWidget";
import { RecentMessages } from "./RecentMessages";
import { RecentOrders } from "./RecentOrders";
import { TopLocations } from "./TopLocations";
import { TopSellingItems } from "./TopSellingItems";
import { TrafficChart } from "./TrafficChart";

export function DashboardOverviewClient() {
  const dashboard = useDashboard();
  useRealtimeResourceRefresh(["dashboard", "orders", "messages", "notifications", "analytics"], dashboard.refresh);

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={dashboard.error} loading={dashboard.loading} fallbackLabel="overview" />
      <MetricGrid metrics={dashboard.data.metrics} />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <TrafficChart data={dashboard.data.trafficSummary} />
        <BlockCard title="Top Selling Items" description="Best performers by order volume.">
          <TopSellingItems items={dashboard.data.topSellingItems} />
        </BlockCard>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <BlockCard title="Recent Orders" description="Latest 5 orders">
          <RecentOrders data={dashboard.data.recentOrders} />
        </BlockCard>
        <BlockCard title="Recent Messages" description="Latest 5 customer messages">
          <RecentMessages data={dashboard.data.recentMessages} />
        </BlockCard>
        <BlockCard title="Notifications" description="Latest 5 alerts">
          <NotificationsWidget items={dashboard.data.notifications} />
        </BlockCard>
      </div>
      <BlockCard title="Top Locations" description="Where your traffic is coming from.">
        <TopLocations items={dashboard.data.topLocations} />
      </BlockCard>
    </div>
  );
}
