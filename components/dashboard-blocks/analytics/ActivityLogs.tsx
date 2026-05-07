"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Shield, Globe, Monitor, Smartphone } from "lucide-react";
import { BlockCard, GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Badge } from "@/components/shared/ui/Badge";
import { Select } from "@/components/shared/ui/Select";

import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";

type ActivityLog = {
  id: string;
  type: "visit" | "admin_action";
  userId: string | null;
  userName?: string | null;
  ip: string;
  country: string;
  city: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  sessionId: string | null;
  timestamp: string;
  action?: string;
  details?: string;
};

function normalizeActivityLog(item: any): ActivityLog {
  return {
    id: item?.id ?? "",
    type: item?.type ?? "visit",
    userId: item?.userId ?? null,
    userName: item?.userName ?? null,
    ip: item?.ip ?? "",
    country: item?.country ?? "Unknown",
    city: item?.city ?? "Unknown",
    device: item?.device ?? null,
    browser: item?.browser ?? null,
    os: item?.os ?? null,
    referrer: item?.referrer ?? null,
    sessionId: item?.sessionId ?? null,
    timestamp: item?.timestamp ?? "",
    action: item?.action,
    details: item?.details,
  };
}


function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

function getActivityIcon(type: string) {
  switch (type) {
    case "admin_action":
      return <Shield className="h-4 w-4" />;
    case "visit":
    default:
      return <Eye className="h-4 w-4" />;
  }
}

function getDeviceIcon(device: string | null) {
  if (!device) return <Monitor className="h-4 w-4" />;
  if (device.includes("Mobile") || device.includes("Phone")) return <Smartphone className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
}

export function ActivityLogsWorkspace() {
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"all" | "visit" | "admin_action">("all");
  const [limit] = useState(20);

  const activityQuery = useQuery({
    queryKey: ["activity-logs", currentPage, limit],
    queryFn: async () => {
      const response = await dashboardApi.getActivityLogs({
        page: currentPage,
        limit,
      });
      // response is { message, data: [...], pagination: {...} }
      const fullResponse = response as { data: any[]; pagination: any };
      return {
        data: extractList<any>(fullResponse).map(normalizeActivityLog),
        pagination: fullResponse.pagination || {
          total: 0,
          page: currentPage,
          limit,
          totalPages: 0,
        },
      };
    },
  });

  const filteredActivities = useMemo(() => {
    if (typeFilter === "all") return activityQuery.data?.data ?? [];
    return (activityQuery.data?.data ?? []).filter((activity) => activity.type === typeFilter);
  }, [activityQuery.data?.data, typeFilter]);

  const renderTypeBadge = (type: string) => {
    const isAdminAction = type === "admin_action";
    return (
      <Badge tone={isAdminAction ? "danger" : "brand"} className="flex items-center gap-2">
        {getActivityIcon(type)}
        {type.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const renderLocation = (country: string, city: string) => {
    if (country === "Unknown" && city === "Unknown") {
      return <span className="text-slate-500">Unknown Location</span>;
    }
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-slate-400" />
        <span>{[city, country].filter(Boolean).join(", ")}</span>
      </div>
    );
  };

  const renderDeviceInfo = (device: string | null, browser: string | null, os: string | null) => {
    const info = [device, browser, os].filter(Boolean);
    if (info.length === 0) return <span className="text-slate-500">-</span>;

    return (
      <div className="flex items-center gap-2">
        {getDeviceIcon(device)}
        <span className="text-sm">{info.join(" • ")}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ResourceNote
        error={activityQuery.error instanceof Error ? activityQuery.error.message : ""}
        loading={activityQuery.isLoading}
        fallbackLabel="activity logs"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-brand-ink dark:text-white">Activity Logs</h2>
          <Select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as "all" | "visit" | "admin_action")}
            className="w-40"
          >
            <option value="all">All Activities</option>
            <option value="visit">Visits Only</option>
            <option value="admin_action">Admin Actions Only</option>
          </Select>
        </div>
        <div className="text-sm text-slate-500">
          Page {currentPage} of {activityQuery.data?.pagination.totalPages ?? 0}
        </div>
      </div>

      <GenericTable
        title="Recent Activity"
        description="User visits and admin actions with location and device information."
        headers={["Type", "User", "Location", "Device Info", "IP Address", "Timestamp", "Details"]}
        rows={filteredActivities.map((activity) => [
          renderTypeBadge(activity.type),
          activity.userId || activity.userName ? (
            <div className="flex flex-col">
              {activity.userName ? (
                <span className="text-sm font-medium">{activity.userName}</span>
              ) : (
                <span className="text-sm font-medium">User</span>
              )}
              {activity.userId ? (
                <span className="font-mono text-xs text-slate-500">
                  {activity.userId.slice(0, 8)}...
                </span>
              ) : (
                <span className="font-mono text-xs text-slate-500">-</span>
              )}
            </div>
          ) : (
            <span className="text-slate-500">Anonymous</span>
          ),

          renderLocation(activity.country, activity.city),
          renderDeviceInfo(activity.device, activity.browser, activity.os),
          <span className="font-mono text-sm">{activity.ip}</span>,
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {formatTimestamp(activity.timestamp)}
          </span>,
          activity.type === "admin_action" ? (
            <div className="space-y-1">
              <div className="text-sm font-medium">{activity.action}</div>
              {activity.details && (
                <div className="text-xs text-slate-500">{activity.details}</div>
              )}
            </div>
          ) : (
            activity.referrer ? (
              <div className="text-xs text-slate-500 truncate max-w-48" title={activity.referrer}>
                {activity.referrer}
              </div>
            ) : (
              <span className="text-slate-500">-</span>
            )
          ),
        ])}
        page={currentPage}
        totalPages={activityQuery.data?.pagination.totalPages ?? 0}
        onPreviousPage={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        onNextPage={() => setCurrentPage((prev) => Math.min(activityQuery.data?.pagination.totalPages ?? 1, prev + 1))}
      />

      {activityQuery.data?.pagination.total && (
        <div className="text-center text-sm text-slate-500">
          Showing {filteredActivities.length} of {activityQuery.data.pagination.total} activities
        </div>
      )}
    </div>
  );
}