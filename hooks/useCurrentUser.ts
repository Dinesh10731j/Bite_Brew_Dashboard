"use client";

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import { canAccessDashboard, getAccessToken } from '@/lib/auth';
import type { CurrentUser } from '@/lib/types';

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<CurrentUser> => {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Missing access token");
      }
      return dashboardApi.getCurrentUser(token) as Promise<CurrentUser>;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const isAllowed = canAccessDashboard(query.data?.data.role ?? null);

  return {
    ...query,
    user: query.data?.data,
    isAllowed,
    isForbidden: !query.isLoading && !isAllowed && !!query.data,
  };
}
