"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { loginFormValues, loginResponse } from "@/lib/types";
import { cacheAccessToken, canAccessDashboard, decodeJwt, getJwtFromLogin } from "@/lib/auth";
import { toast } from "sonner";
import { dashboardApi } from "@/lib/api/dashboard";

const loginApi = async (data: loginFormValues): Promise<loginResponse> => {
  try {
    return await dashboardApi.signin(data) as loginResponse;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

export const UseUserLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<loginResponse, Error, loginFormValues>({
    mutationKey: ["login"],
    mutationFn: loginApi,
    onSuccess: (data) => {
      const token = getJwtFromLogin(data);
      const role = decodeJwt(token)?.role ?? data.user?.role ?? null;

      if (token) {
        cacheAccessToken(token);
      }

      queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      if (!role) {
        router.replace("/dashboard");
        return;
      }

      if (!canAccessDashboard(role)) {
        toast.error("Forbidden: your role cannot access the dashboard.");
        router.replace("/login?reason=forbidden");
        return;
      }

      toast.success("Login successful.");
      router.replace('/dashboard');
    },
    onError: (error) => {
      console.error(error.message || 'Login failed');
      toast.error(error.message || 'Login failed');
    },
  });
};

