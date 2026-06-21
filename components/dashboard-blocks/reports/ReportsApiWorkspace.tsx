"use client";

import { useMemo } from "react";
import { AreaChart } from "@/components/shared/charts/AreaChart";
import { BarChart } from "@/components/shared/charts/BarChart";
import { PieChart } from "@/components/shared/charts/PieChart";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { Empty } from "@/components/shared/ui/Empty";
import { ExportButton } from "./ExportButton";
import { Badge } from "@/components/shared/ui/Badge";
import { Banknote, CalendarRange, ReceiptText, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";

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
  rawDateRange: { from: string; to: string };
  revenue: number;
  orders: number;
  salesByDay: { date: string; orders: number; sales: number }[];
  topItems: { name?: string; orders?: number; sales?: number; revenue?: string }[];
};

const initialReport: SalesReportView = {
  dateRange: { from: "", to: "" },
  rawDateRange: { from: "", to: "" },
  revenue: 0,
  orders: 0,
  salesByDay: [],
  topItems: [],
};

function normalizeItemName(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

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
        ? Array.from(
            data.topItems.reduce(
              (
                acc: Map<string, { name?: string; orders?: number; sales?: number; revenue?: string }>,
                item: any
              ) => {
                const rawName = item?.name ?? item?.menuItem?.name ?? "Item";
                const key = normalizeItemName(rawName) || "item";
                const existing = acc.get(key);
                const nextOrders = Number(item?.quantity ?? item?.orders ?? 0);
                const nextSales = Number(item?.sales ?? 0);
                const mergedOrders = Number(existing?.orders ?? 0) + nextOrders;
                const mergedSales = Number(existing?.sales ?? 0) + nextSales;
                const normalizedName = String(rawName).trim() || "Item";

                acc.set(key, {
                  name: existing?.name ?? normalizedName,
                  orders: mergedOrders,
                  sales: mergedSales,
                  revenue: mergedSales > 0 ? `NPR ${mergedSales.toLocaleString()}` : undefined,
                });
                return acc;
              },
              new Map()
            ).values()
          ).sort((a, b) => Number(b.sales ?? 0) - Number(a.sales ?? 0))
        : [];
      
      return {
        dateRange: { from, to },
        rawDateRange: { from: range?.from ?? "", to: range?.to ?? "" },
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

  const revenueTrendData = useMemo(
    () =>
      resource.data.salesByDay.map((item) => ({
        label: item.date,
        visitors: item.orders,
        revenue: item.sales,
      })),
    [resource.data.salesByDay]
  );

  const ordersBarData = useMemo(
    () =>
      resource.data.salesByDay.map((item) => ({
        label: item.date,
        value: item.orders,
      })),
    [resource.data.salesByDay]
  );

  const topItemsPieData = useMemo(
    () =>
      resource.data.topItems.slice(0, 5).map((item, index) => ({
        label: item.name ?? `Item ${index + 1}`,
        value: Number(item.sales ?? 0),
        color: ["#207659", "#38a169", "#7fcfb2", "#155744", "#9fd8bf"][index % 5],
      })),
    [resource.data.topItems]
  );

  const insights = useMemo(() => {
    const avgOrderValue = resource.data.orders > 0 ? resource.data.revenue / resource.data.orders : 0;

    const peakDay = resource.data.salesByDay.reduce<{ date: string; sales: number } | null>((best, current) => {
      if (!best || current.sales > best.sales) return { date: current.date, sales: current.sales };
      return best;
    }, null);

    const topItem = resource.data.topItems.reduce<{ name?: string; sales?: number; orders?: number } | null>((best, current) => {
      if (!best || Number(current.sales ?? 0) > Number(best.sales ?? 0)) return current;
      return best;
    }, null);

    const from = resource.data.rawDateRange.from ? new Date(resource.data.rawDateRange.from).getTime() : 0;
    const to = resource.data.rawDateRange.to ? new Date(resource.data.rawDateRange.to).getTime() : 0;
    const days = from && to ? Math.max(1, Math.ceil((to - from) / (1000 * 60 * 60 * 24))) : 0;

    return {
      avgOrderValue,
      peakDay,
      topItem,
      dailyAverageSales: days > 0 ? resource.data.revenue / days : 0,
    };
  }, [resource.data]);

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="reports" />

      {headline.dateRange && (
        <BlockCard
          title="Sales Performance Snapshot"
          description="A visual summary of your revenue momentum and item performance."
          className="overflow-hidden bg-gradient-to-r from-brand-soft/80 to-white dark:from-brand/20 dark:to-[#101916]"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-brand/15 bg-white/85 p-4 dark:bg-black/20">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand">
                <CalendarRange className="h-4 w-4" />
                Report Period
              </div>
              <p className="text-base font-semibold text-brand-ink dark:text-white">{headline.dateRange}</p>
            </div>
            <div className="rounded-2xl border border-brand/15 bg-white/85 p-4 dark:bg-black/20">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand">
                <Sparkles className="h-4 w-4" />
                Daily Avg Sales
              </div>
              <p className="text-base font-semibold text-brand-ink dark:text-white">
                NPR {insights.dailyAverageSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </BlockCard>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <BlockCard title="Total Revenue" description="Gross sales in selected range">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-brand-ink dark:text-white">{headline.revenue}</p>
            <Banknote className="h-6 w-6 text-brand" />
          </div>
        </BlockCard>
        <BlockCard title="Total Orders" description="Confirmed order count">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-brand-ink dark:text-white">{headline.orders}</p>
            <ReceiptText className="h-6 w-6 text-brand" />
          </div>
        </BlockCard>
        <BlockCard title="Average Order Value" description="Sales divided by order count">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-brand-ink dark:text-white">
              NPR {insights.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <TrendingUp className="h-6 w-6 text-brand" />
          </div>
        </BlockCard>
        <BlockCard title="Top Revenue Item" description="Best performer by sales">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-brand-ink dark:text-white">{insights.topItem?.name ?? "N/A"}</p>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                NPR {Number(insights.topItem?.sales ?? 0).toLocaleString()}
              </p>
            </div>
            <ShoppingBag className="h-6 w-6 text-brand" />
          </div>
        </BlockCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <BlockCard title="Revenue Trend" description="Daily sales movement across the selected window.">
          {revenueTrendData.length ? (
            <AreaChart data={revenueTrendData} />
          ) : (
            <Empty title="No Revenue Trend" description="Backend did not return salesByDay values." />
          )}
        </BlockCard>
        <BlockCard title="Top Item Revenue Share" description="Revenue split across top-selling items.">
          {topItemsPieData.length ? (
            <PieChart data={topItemsPieData} />
          ) : (
            <Empty title="No Item Mix" description="Backend did not return topItems values." />
          )}
        </BlockCard>
      </div>

      <BlockCard
        title="Order Volume by Day"
        description="Bar view of order count for each sales day."
      >
        {ordersBarData.length ? (
          <BarChart data={ordersBarData} />
        ) : (
          <Empty title="No Order Volume" description="Backend did not return daily order entries." />
        )}
      </BlockCard>

      <BlockCard
        title="Best Selling Items"
        description="Ranked by quantity sold with sales contribution."
      >
        {resource.data.topItems.length ? (
          <div className="space-y-3">
            {resource.data.topItems.slice(0, 10).map((item, index) => (
              <div
                key={`${item.name ?? "Unknown"}-${index}`}
                className="flex items-center justify-between rounded-2xl bg-brand-soft/60 px-4 py-3 dark:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-xs font-semibold text-brand">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-brand-ink dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.orders ?? 0} sold</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {insights.peakDay && index === 0 ? <Badge tone="success">Top Performer</Badge> : null}
                  {item.revenue && <p className="text-sm font-semibold text-brand dark:text-white">{item.revenue}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No Report Items" description="Backend did not return best-selling items yet." />
        )}
      </BlockCard>

      <div className="pt-2">
        <ExportButton />
        {insights.peakDay ? (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
            <TrendingUp className="h-4 w-4 text-brand" />
            Peak day: {insights.peakDay.date} with NPR {insights.peakDay.sales.toLocaleString()} in sales
          </div>
        ) : null}
      </div>
    </div>
  );
}
