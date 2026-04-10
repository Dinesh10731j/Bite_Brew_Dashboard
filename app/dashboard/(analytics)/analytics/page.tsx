import { BounceRateChart } from "@/components/dashboard-blocks/analytics/BounceRateChart";
import { BrowserStats } from "@/components/dashboard-blocks/analytics/BrowserStats";
import { DeviceBreakdown } from "@/components/dashboard-blocks/analytics/DeviceBreakdown";
import { OSStats } from "@/components/dashboard-blocks/analytics/OSStats";
import { PageViewsChart } from "@/components/dashboard-blocks/analytics/PageViewsChart";
import { ReferrersChart } from "@/components/dashboard-blocks/analytics/ReferrersChart";
import { TrafficOverTime } from "@/components/dashboard-blocks/analytics/TrafficOverTime";
import { UserSessions } from "@/components/dashboard-blocks/analytics/UserSessions";
import { VisitorsByCity } from "@/components/dashboard-blocks/analytics/VisitorsByCity";
import { VisitorsByCountry } from "@/components/dashboard-blocks/analytics/VisitorsByCountry";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { RealtimeUsersWidget } from "../realtime-users";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-24 xl:pb-6">
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
      <BlockCard title="Analytics API Mapping" description="Endpoints ready for real backend integration.">
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-200">
          <p>`GET /orders` for order-linked conversion insights</p>
          <p>`GET /messages` for customer inquiry activity</p>
          <p>`GET /newsletter` for audience growth overlays</p>
          <p>`GET /users` and `GET /users/me` for management analytics</p>
        </div>
      </BlockCard>
    </div>
  );
}
