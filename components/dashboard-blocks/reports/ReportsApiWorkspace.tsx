"use client";

import { useMemo } from "react";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { BestSellingItems } from "./BestSellingItems";
import { ConversionTrend } from "./ConversionTrend";
import { CustomerGrowth } from "./CustomerGrowth";
import { ExportButton } from "./ExportButton";
import { OrdersTrend } from "./OrdersTrend";
import { RevenueReport } from "./RevenueReport";
import { TrafficTrend } from "./TrafficTrend";

type SalesReportView = {
  revenue: number;
  orders: number;
  topItems: { name?: string; orders?: number; revenue?: string }[];
};

const fallbackReport: SalesReportView = {
  revenue: 0,
  orders: 0,
  topItems: []
};

export function ReportsApiWorkspace() {
  const token = getAccessToken();

  const resource = useBackendResource<SalesReportView>(fallbackReport, async () => {
    if (!token) {
      return fallbackReport;
    }

    const response: any = await dashboardApi.getSalesReport(token);
    const data = response?.data ?? {};

    return {
      revenue: Number(data?.totals?.revenue ?? data?.totalRevenue ?? 0),
      orders: Number(data?.totals?.orders ?? data?.totalOrders ?? 0),
      topItems: Array.isArray(data?.topItems)
        ? data.topItems.map((item: any) => ({
            name: item?.name ?? item?.menuItem?.name ?? "Item",
            orders: Number(item?.orders ?? item?.quantity ?? 0),
            revenue: item?.revenue ? `NPR ${Number(item.revenue).toLocaleString()}` : undefined
          }))
        : []
    };
  });

  const headline = useMemo(
    () => ({
      revenue: `NPR ${resource.data.revenue.toLocaleString()}`,
      orders: resource.data.orders.toLocaleString()
    }),
    [resource.data.revenue, resource.data.orders]
  );

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="reports" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <RevenueReport />
        <OrdersTrend />
        <CustomerGrowth />
        <ConversionTrend />
      </div>
      <BlockCard title="Live Sales Summary" description="Data from GET /reports/sales.">
        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-200 md:grid-cols-2">
          <p>Total Revenue: {headline.revenue}</p>
          <p>Total Orders: {headline.orders}</p>
        </div>
      </BlockCard>
      <TrafficTrend />
      <BlockCard title="Best Selling Items">
        {resource.data.topItems.length ? (
          <div className="space-y-3">
            {resource.data.topItems.slice(0, 8).map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl bg-brand-soft/60 px-4 py-3 dark:bg-white/5">
                <p className="font-medium text-brand-ink dark:text-white">{item.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{item.orders} orders</p>
              </div>
            ))}
          </div>
        ) : (
          <BestSellingItems />
        )}
      </BlockCard>
      <ExportButton />
    </div>
  );
}
