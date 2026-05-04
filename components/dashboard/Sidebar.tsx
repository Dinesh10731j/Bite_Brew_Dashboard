"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Coffee, LogOut } from "lucide-react";
import { Card } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { cn } from "@/lib/utils";
import { CollapsibleNav } from "./CollapsibleNav";
import { dashboardApi } from "@/lib/api/dashboard";

type SidebarProps = {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export function Sidebar({ collapsed = false, mobileOpen = false, onCloseMobile }: SidebarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await dashboardApi.logout();
      queryClient.clear();
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
      queryClient.clear();
    } finally {
      onCloseMobile?.();
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm xl:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-4 left-4 z-50 transition-transform xl:static xl:inset-auto xl:z-auto xl:block xl:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-[120%] xl:translate-x-0",
          collapsed ? "w-[96px]" : "w-[280px]"
        )}
      >
      <Card className="flex min-h-[calc(100vh-2rem)] flex-col bg-panel-grid bg-[size:100%_100%,22px_22px,22px_22px] xl:sticky xl:top-6 xl:min-h-[calc(100vh-3rem)]">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
            <Coffee className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-brand">Cafe Console</p>
              <h1 className="text-lg font-semibold text-brand-ink dark:text-white">Java Brew & Bites</h1>
            </div>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-2xl border border-brand/15 bg-white p-2 text-slate-500 xl:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex-1">
          <CollapsibleNav compact={collapsed} mode="sidebar" onNavigate={onCloseMobile} />
        </div>
        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleLogout}
            className={cn("w-full gap-2", collapsed ? "justify-center px-0" : "justify-start")}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Card>
      </aside>
    </>
  );
}
