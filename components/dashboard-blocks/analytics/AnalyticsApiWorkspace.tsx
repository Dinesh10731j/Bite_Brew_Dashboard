"use client";

import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { AreaChart } from "@/components/shared/charts/AreaChart";
import { BarChart } from "@/components/shared/charts/BarChart";
import { LineChart } from "@/components/shared/charts/LineChart";
import { useAnalytics } from "@/hooks/useAnalytics";

export function AnalyticsApiWorkspace() {
  const analytics = useAnalytics(7);

  const salesOverviewData = analytics.charts.salesOverview.length
    ? analytics.charts.salesOverview
    : [{ label: "No Data", visitors: 0, orders: 0, revenue: 0 }];

  const ordersPerDayData = analytics.charts.ordersPerDay.length
    ? analytics.charts.ordersPerDay
    : [{ label: "No Data", value: 0 }];

  const revenueData = analytics.charts.revenueAnalytics.length
    ? analytics.charts.revenueAnalytics.map((item) => ({
        label: item.label,
        visitors: 0,
        orders: 0,
        revenue: item.value,
      }))
    : [{ label: "No Data", visitors: 0, orders: 0, revenue: 0 }];

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={analytics.error} loading={analytics.loading} fallbackLabel="analytics" />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <BlockCard title="Visits">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{analytics.data.totalVisits.toLocaleString()}</p>
        </BlockCard>
        <BlockCard title="Orders">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{analytics.data.totalOrders.toLocaleString()}</p>
        </BlockCard>
        <BlockCard title="Messages">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{analytics.data.totalMessages.toLocaleString()}</p>
        </BlockCard>
        <BlockCard title="Revenue">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">NPR {analytics.data.revenue.toLocaleString()}</p>
        </BlockCard>
        <BlockCard title="Conversion">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{analytics.data.conversionRate.toFixed(2)}%</p>
        </BlockCard>
      </div>

      <BlockCard title="Sales Overview" description="Dynamic traffic trend from analytics API.">
        <LineChart data={salesOverviewData} />
      </BlockCard>

      <BlockCard title="Orders Per Day" description="Daily orders from analytics API.">
        <BarChart data={ordersPerDayData} />
      </BlockCard>

      <BlockCard title="Revenue Analytics" description="Daily revenue from analytics API.">
        <AreaChart data={revenueData} />
      </BlockCard>
    </div>
  );
}
