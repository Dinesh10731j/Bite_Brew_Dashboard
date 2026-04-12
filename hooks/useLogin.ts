"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axios";
import { apiEndpoints } from "@/lib/api/axios";
const { auth } = apiEndpoints;
import type { loginFormValues, loginResponse } from "@/lib/types";
import { extractAccessToken, setAccessToken } from "@/lib/auth";
 import { toast } from "sonner";

const loginApi = async (data: loginFormValues): Promise<loginResponse> => {
 
  try {
    const response = await axiosInstance.post<loginResponse>(auth.signin, data);
    console.log('Login response:', response.data);
    return response.data;
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
      const token = extractAccessToken(data);
      if (token) {
        setAccessToken(token);
        // Invalidate user query to refetch /users/me for role check + redirect to dashboard
        // Middleware will protect if wrong role
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        toast.success("Login successful! Welcome back.");
        router.push('/dashboard');
      } else {
        console.error('Invalid login response - no token');
      }
    },
    onError: (error) => {
      console.error(error.message || 'Login failed');
      toast.error(error.message || 'Login failed');
    },
  });
};


