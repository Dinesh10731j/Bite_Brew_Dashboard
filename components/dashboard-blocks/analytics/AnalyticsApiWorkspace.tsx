"use client";

import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useBackendResource } from "@/hooks/useBackendResource";
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
  totalMessages: number;
  conversionRate: number;
};

const fallbackSummary: AnalyticsSummaryView = {
  days: 7,
  totalVisits: 0,
  revenue: 0,
  totalOrders: 0,
  totalMessages: 0,
  conversionRate: 0
};

async function fetchAnalyticsSummary(days = 7) {
  const token = getAccessToken();
  const response = await fetch(`/dashboard/api/analytics/summary?days=${days}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Failed to load analytics summary" }));
    throw new Error(payload?.message ?? "Failed to load analytics summary");
  }

  return response.json();
}

export function AnalyticsApiWorkspace() {
  const summaryResource = useBackendResource<AnalyticsSummaryView>(fallbackSummary, async () => {
    const response: any = await fetchAnalyticsSummary(7);
    const data = response?.data ?? {};
    const totals = data?.totals ?? {};

    return {
      days: 7,
      totalVisits: Number(totals?.visits ?? 0),
      revenue: Number(data?.revenue ?? 0),
      totalOrders: Number(totals?.orders ?? 0),
      totalMessages: Number(totals?.messages ?? 0),
      conversionRate: Number(data?.conversionRate ?? 0),
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
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-200 md:grid-cols-5">
          <p>Visits: {summaryResource.data.totalVisits.toLocaleString()}</p>
          <p>Orders: {summaryResource.data.totalOrders.toLocaleString()}</p>
          <p>Messages: {summaryResource.data.totalMessages.toLocaleString()}</p>
          <p>Revenue: NPR {summaryResource.data.revenue.toLocaleString()}</p>
          <p>Conversion: {summaryResource.data.conversionRate.toFixed(2)}%</p>
        </div>
      </BlockCard>
    </div>
  );
}
