"use client";

import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { PremiumLoader } from "@/components/shared/ui/PremiumLoader";
import { MetricGrid } from "@/components/dashboard-blocks/metrics/MetricGrid";
import { useDashboard } from "@/hooks/useDashboard";
import { useRealtimeResourceRefresh } from "@/hooks/useRealtimeUpdates";
import { cn } from "@/lib/utils";
import { NotificationsWidget } from "./NotificationsWidget";
import { RecentMessages } from "./RecentMessages";
import { RecentOrders } from "./RecentOrders";
import { TopLocations } from "./TopLocations";
import { TopSellingItems } from "./TopSellingItems";
import { TrafficChart } from "./TrafficChart";

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6 pb-24 xl:pb-6" aria-hidden="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`metric-skeleton-${index}`} className="h-28 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="h-80 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-80 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`card-skeleton-${index}`} className="h-72 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
    </div>
  );
}

export function DashboardOverviewClient() {
  const dashboard = useDashboard();
  useRealtimeResourceRefresh(["dashboard", "orders", "messages", "notifications", "analytics"], dashboard.refresh);
  const isInitialLoading = dashboard.loading;

  return (
    <div className="relative">
      {isInitialLoading && <PremiumLoader overlay label="Syncing dashboard data..." />}

      <div className={cn("transition-all duration-200", isInitialLoading && "pointer-events-none blur-[2px]")}>
        {isInitialLoading ? (
          <DashboardOverviewSkeleton />
        ) : (
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
        )}
      </div>

      {dashboard.refreshing && !isInitialLoading && (
        <div className="pointer-events-none fixed inset-x-0 top-16 z-40 mx-auto w-fit rounded-full border border-brand/20 bg-white/85 px-4 py-2 shadow-sm backdrop-blur dark:border-brand/30 dark:bg-slate-900/80">
          <span className="text-xs font-medium text-brand-ink dark:text-slate-100">Refreshing data...</span>
        </div>
      )}
    </div>
  );
}
