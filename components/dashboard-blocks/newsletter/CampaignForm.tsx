"use client";

import { useState } from "react";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { toast } from "sonner";

export function CampaignForm() {
  const [subject, setSubject] = useState("");
  const [headline, setHeadline] = useState("");
  const [intro, setIntro] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const token = getAccessToken();
    if (!subject.trim() || !headline.trim()) {
      toast.error("Subject and headline are required.");
      return;
    }

    try {
      setSending(true);
      await dashboardApi.sendNewsletterCampaign(token, {
        subject: subject.trim(),
        headline: headline.trim(),
        intro: intro.trim() || undefined
      });
      toast.success("Campaign queued successfully.");
      setSubject("");
      setHeadline("");
      setIntro("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send campaign.");
    } finally {
      setSending(false);
    }
  };

  return (
    <BlockCard
      title="Send Email Campaign"
      action={
        <Button onClick={handleSend} disabled={sending}>
          {sending ? "Sending..." : "Send Email"}
        </Button>
      }
    >
      <div className="grid gap-3">
        <Input placeholder="Campaign subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
        <Input placeholder="Campaign headline" value={headline} onChange={(event) => setHeadline(event.target.value)} />
        <textarea
          placeholder="Write your campaign intro..."
          value={intro}
          onChange={(event) => setIntro(event.target.value)}
          className="min-h-36 rounded-3xl border border-brand/15 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>
    </BlockCard>
  );
}
