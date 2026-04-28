"use client";

import { PremiumLoader } from "@/components/shared/ui/PremiumLoader";

export function ResourceNote({ error, loading, fallbackLabel }: { error?: string; loading?: boolean; fallbackLabel: string }) {
  if (loading) {
    return <PremiumLoader label="Syncing live dashboard data..." className="py-2" />;
  }

  if (error) {
    return (
      <p className="text-sm text-rose-600 dark:text-rose-300">
        Unable to load {fallbackLabel} from backend: {error}
      </p>
    );
  }

  return null;
}