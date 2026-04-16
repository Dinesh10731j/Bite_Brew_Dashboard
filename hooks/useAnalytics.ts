"use client";

import { useMemo } from "react";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { normalizeAnalyticsSummary, type AnalyticsSummaryView } from "@/lib/dashboard-normalizers";

const fallbackSummary: AnalyticsSummaryView = {
  days: 7,
  totalVisits: 0,
  revenue: 0,
  totalOrders: 0,
  totalMessages: 0,
  conversionRate: 0,
  dailyOrders: [],
  dailyRevenue: [],
  salesOverview: [],
};

export function useAnalytics(days = 7) {
  const resource = useBackendResource<AnalyticsSummaryView>({
    fallback: fallbackSummary,
    loader: async () => {
      const token = getAccessToken();
      const response: any = await dashboardApi.getAnalyticsSummary(token, { days });
      return normalizeAnalyticsSummary(response, days);
    },
    resetOnError: false,
  });

  const charts = useMemo(() => {
    const salesOverview = resource.data.salesOverview;
    const ordersPerDay = resource.data.dailyOrders.map((item) => ({ label: item.label, value: item.count }));
    const revenueAnalytics = resource.data.dailyRevenue.map((item) => ({ label: item.label, value: item.revenue }));

    return {
      salesOverview,
      ordersPerDay,
      revenueAnalytics,
    };
  }, [resource.data]);

  return {
    ...resource,
    charts,
  };
}
