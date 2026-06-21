"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/shared";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden p-3 sm:p-4 md:p-6">
      <div className="mx-auto max-w-[1600px]">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <div
          className={cn(
            "flex min-h-screen min-w-0 flex-1 flex-col gap-4 md:gap-6",
            sidebarCollapsed ? "xl:pl-[120px]" : "xl:pl-[304px]"
          )}
        >
          <TopBar
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />
          <main className="min-w-0 space-y-4 md:space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
