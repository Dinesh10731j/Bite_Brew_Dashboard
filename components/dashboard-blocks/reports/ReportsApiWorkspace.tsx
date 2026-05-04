"use client";

import { useMemo } from "react";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { Empty } from "@/components/shared/ui/Empty";
import { ExportButton } from "./ExportButton";

type SalesByDay = {
  day: string;
  orders: number;
  sales: number;
};

type TopItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  sales: number;
};

type SalesReportData = {
  range: {
    from: string;
    to: string;
  };
  totals: {
    orders: number;
    sales: number;
  };
  salesByDay: SalesByDay[];
  topItems: TopItem[];
};

type SalesReportView = {
  dateRange: { from: string; to: string };
  revenue: number;
  orders: number;
  salesByDay: { date: string; orders: number; sales: number }[];
  topItems: { name?: string; orders?: number; revenue?: string }[];
};

const initialReport: SalesReportView = {
  dateRange: { from: "", to: "" },
  revenue: 0,
  orders: 0,
  salesByDay: [],
  topItems: [],
};

function formatDate(isoString: string): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export function ReportsApiWorkspace() {
  const resource = useBackendResource<SalesReportView>({
    fallback: initialReport,
    loader: async () => {
      const response: any = await dashboardApi.getSalesReport();
      const data = response?.data ?? {};
      
      // Extract range
      const range = data?.range ?? {};
      const from = range?.from ? formatDate(range.from) : "";
      const to = range?.to ? formatDate(range.to) : "";
      
      // Extract totals (note: backend returns "sales", UI shows "revenue")
      const totals = data?.totals ?? {};
      const revenue = Number(totals?.sales ?? totals?.revenue ?? totals?.totalRevenue ?? 0);
      const orders = Number(totals?.orders ?? totals?.totalOrders ?? 0);
      
      // Extract sales by day
      const salesByDay = Array.isArray(data?.salesByDay)
        ? data.salesByDay.map((item: any) => ({
            date: item?.day ? formatDate(item.day) : "",
            orders: Number(item?.orders ?? 0),
            sales: Number(item?.sales ?? 0),
          }))
        : [];
      
      // Extract top items (map quantity -> orders, sales -> revenue)
      const topItems = Array.isArray(data?.topItems)
        ? data.topItems.map((item: any) => ({
            name: item?.name ?? item?.menuItem?.name ?? "Item",
            orders: Number(item?.quantity ?? item?.orders ?? 0),
            revenue: item?.sales ? `NPR ${Number(item.sales).toLocaleString()}` : undefined,
          }))
        : [];
      
      return {
        dateRange: { from, to },
        revenue,
        orders,
        salesByDay,
        topItems,
      };
    },
    resetOnError: true,
  });

  const headline = useMemo(
    () => ({
      dateRange: resource.data.dateRange.from && resource.data.dateRange.to
        ? `${resource.data.dateRange.from} - ${resource.data.dateRange.to}`
        : "",
      revenue: `NPR ${resource.data.revenue.toLocaleString()}`,
      orders: resource.data.orders.toLocaleString(),
    }),
    [resource.data.dateRange, resource.data.revenue, resource.data.orders]
  );

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="reports" />

      {/* Date Range Display */}
      {headline.dateRange && (
        <BlockCard title="Report Period">
          <p className="text-lg text-brand-ink dark:text-white">{headline.dateRange}</p>
        </BlockCard>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <BlockCard title="Total Revenue">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{headline.revenue}</p>
        </BlockCard>
        <BlockCard title="Total Orders">
          <p className="text-3xl font-semibold text-brand-ink dark:text-white">{headline.orders}</p>
        </BlockCard>
      </div>

      {/* Sales by Day */}
      <BlockCard title="Daily Sales" description="Sales breakdown by day">
        {resource.data.salesByDay.length ? (
          <div className="space-y-3">
            {resource.data.salesByDay.map((item, index) => (
              <div
                key={`${item.date}-${index}`}
                className="flex items-center justify-between rounded-2xl bg-brand-soft/60 px-4 py-3 dark:bg-white/5"
              >
                <div>
                  <p className="font-medium text-brand-ink dark:text-white">{item.date}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.orders} orders
                  </p>
                </div>
                <p className="text-lg font-semibold text-brand dark:text-white">
                  NPR {item.sales.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No Daily Sales" description="Backend did not return daily sales data yet." />
        )}
      </BlockCard>

      {/* Best Selling Items */}
      <BlockCard title="Best Selling Items" description="Top items by quantity and sales">
        {resource.data.topItems.length ? (
          <div className="space-y-3">
            {resource.data.topItems.slice(0, 10).map((item, index) => (
              <div
                key={`${item.name ?? "Unknown"}-${index}`}
                className="flex items-center justify-between rounded-2xl bg-brand-soft/60 px-4 py-3 dark:bg-white/5"
              >
                <div>
                  <p className="font-medium text-brand-ink dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.orders ?? 0} sold
                  </p>
                </div>
                {item.revenue && (
                  <p className="text-sm font-semibold text-brand dark:text-white">
                    {item.revenue}
                  </p>
                )}
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
