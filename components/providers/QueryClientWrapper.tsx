"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { NotificationsProvider } from "@/store/notifications-context";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

function AuthRedirectHandler({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const onAuthError = () => {
      router.replace("/login?reason=unauthorized");
    };

    window.addEventListener("bite-brew:auth-error", onAuthError);
    return () => {
      window.removeEventListener("bite-brew:auth-error", onAuthError);
    };
  }, [router]);

  return <>{children}</>;
}

function RealtimeBridge() {
  useRealtimeUpdates();
  return null;
}

function RouteRefreshBridge() {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    const routeQueryKeys: Record<string, unknown[][]> = {
      "/dashboard/orders": [["orders"], ["menu-items"]],
      "/dashboard/messages": [["messages"]],
      "/dashboard/notifications": [["notifications"]],
      "/dashboard/newsletter": [["newsletter-subscribers"]],
      "/dashboard/management/menu": [["menu-categories"], ["menu-items"]],
      "/dashboard/management/gallery": [["gallery"]],
      "/dashboard/management/users": [["users"]],
      "/dashboard/management/activity-logs": [["activity-logs"]],
      "/dashboard/reports": [["reports"]],
      "/dashboard/analytics": [["analytics"]],
    };

    const keys = routeQueryKeys[pathname] ?? [];
    keys.forEach((queryKey) => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.refetchQueries({ queryKey, type: "active" });
    });
  }, [pathname, queryClient]);

  return null;
}

export function QueryClientWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              const status = error instanceof Error && "status" in error ? Number(error.status) : undefined;
              if (status === 401 || status === 403) return false;
              return failureCount < 1;
            },
            staleTime: 0,
            refetchOnMount: "always",
            refetchOnReconnect: "always",
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeBridge />
      <RouteRefreshBridge />
      <ThemeProvider>
        <AuthRedirectHandler>
          <NotificationsProvider>{children}</NotificationsProvider>
        </AuthRedirectHandler>
      </ThemeProvider>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
