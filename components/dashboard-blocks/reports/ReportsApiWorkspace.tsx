"use client";

import { useMemo } from "react";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { Empty } from "@/components/shared/ui/Empty";
import { ExportButton } from "./ExportButton";

type SalesReportView = {
  revenue: number;
  orders: number;
  topItems: { name?: string; orders?: number; revenue?: string }[];
};

const initialReport: SalesReportView = {
  revenue: 0,
  orders: 0,
  topItems: [],
};

export function ReportsApiWorkspace() {
  const resource = useBackendResource<SalesReportView>({
    fallback: initialReport,
    loader: async () => {
      const response: any = await dashboardApi.getSalesReport();
      const data = response?.data ?? {};
      return {
        revenue: Number(data?.totals?.revenue ?? data?.totalRevenue ?? 0),
        orders: Number(data?.totals?.orders ?? data?.totalOrders ?? 0),
        topItems: Array.isArray(data?.topItems)
          ? data.topItems.map((item: any) => ({
              name: item?.name ?? item?.menuItem?.name ?? "Item",
              orders: Number(item?.orders ?? item?.quantity ?? 0),
              revenue: item?.revenue ? `NPR ${Number(item.revenue).toLocaleString()}` : undefined,
            }))
          : [],
      };
    },
    resetOnError: true,
  });

  const headline = useMemo(
    () => ({
      revenue: `NPR ${resource.data.revenue.toLocaleString()}`,
      orders: resource.data.orders.toLocaleString(),
    }),
    [resource.data.revenue, resource.data.orders]
  );

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="reports" />

      <div className="grid gap-6 md:grid-cols-2">
        <BlockCard title="Total Revenue">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{headline.revenue}</p>
        </BlockCard>
        <BlockCard title="Total Orders">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{headline.orders}</p>
        </BlockCard>
      </div>

      <BlockCard title="Best Selling Items" description="Data from /reports/sales topItems.">
        {resource.data.topItems.length ? (
          <div className="space-y-3">
            {resource.data.topItems.slice(0, 10).map((item, index) => (
              <div
                key={`${item.name ?? "Unknown"}-${index}`}
                className="flex items-center justify-between rounded-2xl bg-brand-soft/60 px-4 py-3 dark:bg-white/5"
              >
                <p className="font-medium text-brand-ink dark:text-white">{item.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{item.orders ?? 0} orders</p>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No Report Items" description="Backend did not return best-selling items yet." />
        )}
      </BlockCard>

      <ExportButton />
    </div>
  );
}