"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { canAccessDashboard } from "@/lib/auth";
import type { CurrentUser } from "@/lib/types";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<CurrentUser> => {
      return dashboardApi.getCurrentUser() as Promise<CurrentUser>;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const role = query.data?.data?.role ?? null;
  const isAllowed = canAccessDashboard(role);

  return {
    ...query,
    user: query.data?.data,
    isAllowed,
    isForbidden: !query.isLoading && !isAllowed && !!query.data,
  };
}