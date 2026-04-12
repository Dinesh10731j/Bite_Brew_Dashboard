"use client";

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/api/axios';
import type { CurrentUser, User } from '@/lib/types';
const ALLOWED_ROLES: User['role'][] = ['admin', 'staff', 'manager'];

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<CurrentUser> => {
      const response = await axiosInstance.get('/bite-brew/users/me');
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const isAllowed = query.data?.data.role ? ALLOWED_ROLES.includes(query.data.data.role) : false;

  return {
    ...query,
    user: query.data?.data,
    isAllowed,
    isForbidden: !query.isLoading && !isAllowed && !!query.data,
  };
}
