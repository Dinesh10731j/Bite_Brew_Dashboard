"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlockCard, GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Input } from "@/components/shared/ui/Input";
import { Button } from "@/components/shared/ui/Button";
import { Select } from "@/components/shared/ui/Select";
import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";

type Subscriber = {
  id: string;
  email: string;
  status: string;
  createdAt: string;
};

function normalizeSubscriber(item: any): Subscriber {
  return {
    id: item?.id ?? item?._id ?? "",
    email: item?.email ?? "subscriber@example.com",
    status: String(item?.status ?? "active"),
    createdAt: item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-",
  };
}

export function NewsletterApiWorkspace() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [headline, setHeadline] = useState("");
  const [intro, setIntro] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const subscribersQuery = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const response = await dashboardApi.getNewsletterSubscribers({ page: 1, limit: 100 });
      return extractList<any>(response).map(normalizeSubscriber);
    },
    refetchInterval: 10000,
  });

  const campaignMutation = useMutation({
    mutationFn: async () => {
      await dashboardApi.sendNewsletterCampaign({
        subject,
        headline,
        intro,
        sendToSubscribers: true,
      });
    },
    onSuccess: () => {
      setSubject("");
      setHeadline("");
      setIntro("");
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await dashboardApi.updateNewsletterStatus(id, status);
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["newsletter-subscribers"] });
      const previous = queryClient.getQueryData<Subscriber[]>(["newsletter-subscribers"]);
      queryClient.setQueryData<Subscriber[]>(["newsletter-subscribers"], (current = []) =>
        current.map((item) => (item.id === id ? { ...item, status } : item))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["newsletter-subscribers"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await dashboardApi.deleteNewsletterSubscriber(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
  });

  const subscribers = subscribersQuery.data ?? [];
  const filtered = useMemo(
    () => (statusFilter === "all" ? subscribers : subscribers.filter((item) => item.status === statusFilter)),
    [subscribers, statusFilter]
  );

  return (
    <div className="space-y-6">
      <ResourceNote
        error={subscribersQuery.error instanceof Error ? subscribersQuery.error.message : ""}
        loading={subscribersQuery.isLoading}
        fallbackLabel="newsletter"
      />

      <BlockCard title="Send Campaign" description="Send newsletter campaigns to subscribers.">
        <div className="grid gap-3 md:grid-cols-2">
          <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" />
          <Input value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Headline" />
          <Input
            value={intro}
            onChange={(event) => setIntro(event.target.value)}
            placeholder="Intro"
            className="md:col-span-2"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => void campaignMutation.mutateAsync()}
            disabled={!subject.trim() || !headline.trim()}
          >
            Send Campaign
          </Button>
        </div>
      </BlockCard>

      <BlockCard title="Filter" description="Filter subscribers by status.">
        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">active</option>
          <option value="paused">paused</option>
          <option value="unsubscribed">unsubscribed</option>
        </Select>
      </BlockCard>

      <GenericTable
        title="Subscribers"
        description="Manage subscriber status and removal."
        headers={["Email", "Status", "Created", "Actions"]}
        rows={filtered.map((subscriber) => [
          subscriber.email,
          <Select
            key={`${subscriber.id}-status`}
            value={subscriber.status}
            onChange={(event) =>
              void statusMutation.mutateAsync({ id: subscriber.id, status: event.target.value })
            }
            className="py-2 text-xs"
          >
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="unsubscribed">unsubscribed</option>
          </Select>,
          subscriber.createdAt,
          <Button
            key={`${subscriber.id}-delete`}
            variant="danger"
            className="px-3 py-2 text-xs"
            onClick={() => void deleteMutation.mutateAsync(subscriber.id)}
          >
            Delete
          </Button>,
        ])}
      />
    </div>
  );
}