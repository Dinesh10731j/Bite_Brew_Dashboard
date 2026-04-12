"use client";

import type { ReactNode } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/shared/ui/Button";

export default function Layout({ children }: { children: ReactNode }) {
  const { isLoading, isForbidden, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-500 mx-auto"></div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isForbidden) {
    // Middleware handles most cases, this is fallback
    window.location.href = '/forbidden';
    return null;
  }

  if (error) {
    // Middleware handles 401 redirect, but catch client errors
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading profile. Please refresh.</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
