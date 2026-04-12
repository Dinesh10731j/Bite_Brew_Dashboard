"use client";

import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { BounceRateChart } from "./BounceRateChart";
import { BrowserStats } from "./BrowserStats";
import { DeviceBreakdown } from "./DeviceBreakdown";
import { OSStats } from "./OSStats";
import { PageViewsChart } from "./PageViewsChart";
import { ReferrersChart } from "./ReferrersChart";
import { TrafficOverTime } from "./TrafficOverTime";
import { UserSessions } from "./UserSessions";
import { VisitorsByCity } from "./VisitorsByCity";
import { VisitorsByCountry } from "./VisitorsByCountry";
import { RealtimeUsersWidget } from "@/app/dashboard/(analytics)/realtime-users";

type AnalyticsSummaryView = {
  days: number;
  totalVisits: number;
  revenue: number;
  totalOrders: number;
};

const fallbackSummary: AnalyticsSummaryView = {
  days: 7,
  totalVisits: 0,
  revenue: 0,
  totalOrders: 0
};

export function AnalyticsApiWorkspace() {
  const token = getAccessToken();

  const summaryResource = useBackendResource<AnalyticsSummaryView>(fallbackSummary, async () => {
    if (!token) {
      return fallbackSummary;
    }

    const response: any = await dashboardApi.getAnalyticsSummary(token, { days: 7 });
    const data = response?.data ?? {};

    return {
      days: 7,
      totalVisits: Number(data?.totalVisits ?? data?.visits ?? 0),
      revenue: Number(data?.revenue ?? data?.totalRevenue ?? 0),
      totalOrders: Number(data?.totalOrders ?? 0)
    };
  });

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={summaryResource.error} loading={summaryResource.loading} fallbackLabel="analytics" />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <TrafficOverTime />
        <RealtimeUsersWidget />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <UserSessions />
        <BounceRateChart />
        <PageViewsChart />
        <RealtimeUsersWidget />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <VisitorsByCountry />
        <VisitorsByCity />
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <DeviceBreakdown />
        <BrowserStats />
        <OSStats />
      </div>
      <ReferrersChart />
      <BlockCard title="Live Analytics Summary" description="Data from GET /analytics/summary (days=7).">
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-200 md:grid-cols-3">
          <p>Visits: {summaryResource.data.totalVisits.toLocaleString()}</p>
          <p>Orders: {summaryResource.data.totalOrders.toLocaleString()}</p>
          <p>Revenue: NPR {summaryResource.data.revenue.toLocaleString()}</p>
        </div>
      </BlockCard>
    </div>
  );
}
