"use client";

import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { AreaChart } from "@/components/shared/charts/AreaChart";
import { Badge } from "@/components/shared/ui/Badge";
import { BarChart } from "@/components/shared/charts/BarChart";
import { LineChart } from "@/components/shared/charts/LineChart";
import { PieChart } from "@/components/shared/charts/PieChart";
import { Empty } from "@/components/shared/ui/Empty";
import { ActivityLogsWorkspace } from "./ActivityLogs";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { formatNumber, formatPercent } from "@/lib/shared";

export function AnalyticsApiWorkspace() {
  const analytics = useAnalytics(7);
  const salesOverview = analytics.charts.salesOverview;
  const salesReport = useBackendResource<{ topItems: { name: string; quantity: number; orders?: number }[] }>({
    fallback: { topItems: [] },
    loader: async () => {
      const response: any = await dashboardApi.getSalesReport();
      const data = response?.data ?? {};
      const topItems = Array.isArray(data?.topItems)
        ? data.topItems.map((item: any) => ({
            name: item?.name ?? item?.menuItem?.name ?? "Other",
            quantity: Number(item?.quantity ?? item?.orders ?? 0),
          }))
        : [];
      return { topItems };
    },
    resetOnError: false,
  });

  const revenueData = analytics.charts.revenueAnalytics.map((item) => ({
    label: item.label,
    visitors: 0,
    orders: 0,
    revenue: item.value,
  }));

  const latestPoint = salesOverview[salesOverview.length - 1];
  const prevPoint = salesOverview[salesOverview.length - 2];
  const visitDeltaPercent =
    prevPoint && prevPoint.visitors > 0
      ? ((latestPoint?.visitors ?? 0) - prevPoint.visitors) / prevPoint.visitors
      : 0;
  const conversionTone = analytics.data.conversionRate >= 2 ? "success" : analytics.data.conversionRate >= 1 ? "warning" : "danger";
  const ordersData = analytics.charts.ordersPerDay;
  const hasOrdersData = ordersData.some((item) => item.value > 0);
  const topItemMixData = salesReport.data.topItems.slice(0, 6).map((item, index) => ({
    label: item.name,
    value: item.quantity,
    color: ["#207659", "#38a169", "#7fcfb2", "#155744", "#9fd8bf", "#0f4a37"][index % 6],
  }));

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={analytics.error} loading={analytics.loading} fallbackLabel="analytics" />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-12">
        <BlockCard title="Visits" description="Total tracked traffic" className="xl:col-span-3">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{formatNumber(analytics.data.totalVisits)}</p>
          <div className="mt-3">
            <Badge tone={visitDeltaPercent >= 0 ? "success" : "danger"}>
              {visitDeltaPercent >= 0 ? "+" : ""}
              {formatPercent(Math.abs(visitDeltaPercent) * 100)} vs previous point
            </Badge>
          </div>
        </BlockCard>
        <BlockCard title="Revenue" description="Gross sales captured" className="xl:col-span-3">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">NPR {formatNumber(analytics.data.revenue)}</p>
          <div className="mt-3">
            <Badge tone="brand">Live backend value</Badge>
          </div>
        </BlockCard>
        <BlockCard title="Orders" description="Total completed/active records" className="xl:col-span-2">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{formatNumber(analytics.data.totalOrders)}</p>
          <div className="mt-3">
            <Badge tone="neutral">{hasOrdersData ? "Daily points available" : "Sparse daily points"}</Badge>
          </div>
        </BlockCard>
        <BlockCard title="Conversion" description="Visit to order conversion" className="xl:col-span-2">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{analytics.data.conversionRate.toFixed(2)}%</p>
          <div className="mt-3">
            <Badge tone={conversionTone}>{conversionTone === "danger" ? "Needs attention" : "Healthy"}</Badge>
          </div>
        </BlockCard>
        <BlockCard title="Messages" description="Inbound customer messages" className="xl:col-span-2">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{formatNumber(analytics.data.totalMessages)}</p>
          <div className="mt-3">
            <Badge tone={analytics.data.totalMessages > 0 ? "brand" : "neutral"}>
              {analytics.data.totalMessages > 0 ? "New messages present" : "No new messages"}
            </Badge>
          </div>
        </BlockCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <BlockCard title="Sales Overview" description="Visitors trend with matched order/revenue points." className="xl:col-span-8">
          {salesOverview.length ? (
            <LineChart data={salesOverview} />
          ) : (
            <Empty title="No Sales Overview" description="Backend did not return sales overview points." />
          )}
        </BlockCard>
        <BlockCard title="Performance Snapshot" description="Current period context." className="xl:col-span-4">
          <div className="space-y-4">
            <div className="rounded-2xl bg-brand-soft/60 p-4 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Latest Visits</p>
              <p className="mt-2 text-2xl font-semibold text-brand-ink dark:text-white">
                {latestPoint ? formatNumber(latestPoint.visitors) : "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-brand-soft/60 p-4 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Latest Orders</p>
              <p className="mt-2 text-2xl font-semibold text-brand-ink dark:text-white">
                {latestPoint ? formatNumber(latestPoint.orders ?? 0) : "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-brand-soft/60 p-4 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Latest Revenue</p>
              <p className="mt-2 text-2xl font-semibold text-brand-ink dark:text-white">
                NPR {latestPoint ? formatNumber(latestPoint.revenue ?? 0) : "-"}
              </p>
            </div>
          </div>
        </BlockCard>
      </div>

      <BlockCard title="Top Items Mix" description="How many times each item was ordered (e.g., Mojito, Other).">
        {topItemMixData.length ? (
          <PieChart data={topItemMixData} />
        ) : (
          <Empty title="No Item Mix" description="Backend did not return top item counts yet." />
        )}
      </BlockCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <BlockCard title="Orders Per Day" description="Order spikes and low-volume days.">
          {ordersData.length ? (
            <BarChart data={ordersData} />
          ) : (
            <Empty title="No Orders Data" description="Backend did not return daily order points." />
          )}
        </BlockCard>

        <BlockCard title="Revenue Analytics" description="Revenue trend by day.">
          {revenueData.length ? (
            <AreaChart data={revenueData} />
          ) : (
            <Empty title="No Revenue Data" description="Backend did not return daily revenue points." />
          )}
        </BlockCard>
      </div>

      <ActivityLogsWorkspace />
    </div>
  );
}
