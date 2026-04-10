"use client";

import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { useBackendResource } from "@/hooks/useBackendResource";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { CampaignForm } from "./CampaignForm";
import { CampaignMetrics } from "./CampaignMetrics";
import { CampaignsList } from "./CampaignsList";
import { SubscriberStats } from "./SubscriberStats";
import { SubscribersList } from "./SubscribersList";

type SubscriberRow = [string, string, string];

const fallbackSubscribers: SubscriberRow[] = [
  ["samir@example.com", "Active", "Today"],
  ["muna@example.com", "Active", "This week"],
  ["ayush@example.com", "Paused", "This month"]
];

export function NewsletterApiWorkspace() {
  const token = getAccessToken();
  const resource = useBackendResource<SubscriberRow[]>(fallbackSubscribers, async () => {
    if (!token) {
      return fallbackSubscribers;
    }

    const response: any = await dashboardApi.getNewsletterSubscribers(token, { page: 1, limit: 20 });
    const items = response?.data ?? [];
    return Array.isArray(items)
      ? items.map((item: any) => [
          item?.email ?? "subscriber@example.com",
          item?.status ?? "Active",
          item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"
        ])
      : fallbackSubscribers;
  });

  return (
    <div className="space-y-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="newsletter" />
      <SubscriberStats />
      <CampaignMetrics />
      <SubscribersList rows={resource.data} />
      <CampaignsList />
      <CampaignForm />
    </div>
  );
}
