"use client";

import { useMemo } from "react";
import { useDashboard } from "@/hooks/useDashboard";

export function useMetrics() {
  const dashboard = useDashboard();
  return useMemo(
    () => ({
      ...dashboard,
      data: dashboard.data.metrics,
      metrics: dashboard.data.metrics,
    }),
    [dashboard]
  );
}
