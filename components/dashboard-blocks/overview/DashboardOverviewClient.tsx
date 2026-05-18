"use client";

import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { PremiumLoader } from "@/components/shared/ui/PremiumLoader";
import { PieChart } from "@/components/shared/charts/PieChart";
import { MetricGrid } from "@/components/dashboard-blocks/metrics/MetricGrid";
import { useDashboard } from "@/hooks/useDashboard";
import { useRealtimeResourceRefresh } from "@/hooks/useRealtimeUpdates";
import { cn } from "@/lib/shared";
import { Bell, Globe2, Mail, Package, PieChart as PieChartIcon } from "lucide-react";
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

      <div className="h-80 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />

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
  const topSellingPieData = dashboard.data.topSellingItems.slice(0, 6).map((item, index) => ({
    label: item.name ?? `Item ${index + 1}`,
    value: Number(item.orders ?? 0),
    color: ["#207659", "#38a169", "#7fcfb2", "#155744", "#9fd8bf", "#0f4a37"][index % 6],
  })).filter((entry) => entry.value > 0);

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
              <BlockCard
                title="Top Items Share"
                description="Order share by top-selling items."
                icon={<PieChartIcon className="h-5 w-5" />}
              >
                {topSellingPieData.length ? (
                  <div className="rounded-2xl border border-brand/10 bg-brand-soft/30 p-3 dark:border-white/10 dark:bg-white/[0.02]">
                    <PieChart data={topSellingPieData} />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-300">No item order-volume data yet.</p>
                )}
              </BlockCard>
            </div>
            <BlockCard
              title="Top Selling Items"
              description="Best performers by order volume."
              icon={<PieChartIcon className="h-5 w-5" />}
            >
              <TopSellingItems items={dashboard.data.topSellingItems} />
            </BlockCard>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <BlockCard title="Recent Orders" description="Latest 5 orders" icon={<Package className="h-5 w-5" />}>
                <RecentOrders data={dashboard.data.recentOrders} />
              </BlockCard>
              <BlockCard title="Recent Messages" description="Latest 5 customer messages" icon={<Mail className="h-5 w-5" />}>
                <RecentMessages data={dashboard.data.recentMessages} />
              </BlockCard>
              <BlockCard title="Notifications" description="Latest 5 alerts" icon={<Bell className="h-5 w-5" />}>
                <NotificationsWidget items={dashboard.data.notifications} />
              </BlockCard>
            </div>
            <BlockCard title="Top Locations" description="Where your traffic is coming from." icon={<Globe2 className="h-5 w-5" />}>
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
