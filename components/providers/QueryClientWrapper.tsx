"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsProvider } from "@/store/notifications-context";

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

export function QueryClientWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthRedirectHandler>
          <NotificationsProvider>{children}</NotificationsProvider>
        </AuthRedirectHandler>
      </ThemeProvider>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}