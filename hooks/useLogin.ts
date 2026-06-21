"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { CurrentUser, User, loginFormValues, loginResponse } from "@/lib/shared";
import { cacheAccessToken, canAccessDashboard, clearAccessToken, decodeJwt, extractAccessToken } from "@/lib/auth";
import { toast } from "sonner";
import { dashboardApi } from "@/lib/api/dashboard";

const loginApi = async (data: loginFormValues): Promise<loginResponse> => {
  return (await dashboardApi.signin(data)) as loginResponse;
};

export const UseUserLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<loginResponse, Error, loginFormValues>({
    mutationKey: ["login"],
    mutationFn: loginApi,
    onSuccess: (data) => {
      const token = extractAccessToken(data);
      if (token) cacheAccessToken(token);

      const user = data?.user ?? data?.data?.user ?? null;
      const role = user?.role ?? (token ? decodeJwt(token)?.role : null) ?? null;

      if (role && !canAccessDashboard(role)) {
        clearAccessToken();
        toast.error("Forbidden: your role cannot access the dashboard.");
        router.replace("/login?reason=forbidden");
        return;
      }

      if (user) {
        queryClient.setQueryData<CurrentUser>(["currentUser"], {
          message: data.message ?? "Authenticated",
          data: user as User,
        });
      }

      toast.success("Login successful.");
      router.replace("/dashboard");
      void queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
};
