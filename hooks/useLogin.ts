"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { loginFormValues, loginResponse } from "@/lib/types";
import { canAccessDashboard } from "@/lib/auth";
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
      const role = data?.user?.role ?? data?.data?.user?.role ?? null;

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      if (role && !canAccessDashboard(role)) {
        toast.error("Forbidden: your role cannot access the dashboard.");
        router.replace("/login?reason=forbidden");
        return;
      }

      toast.success("Login successful.");
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
};