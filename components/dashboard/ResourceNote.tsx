"use client";

export function ResourceNote({ error, loading, fallbackLabel }: { error?: string; loading?: boolean; fallbackLabel: string }) {
  if (loading) {
    return <p className="text-sm text-slate-500 dark:text-slate-300">Loading live data...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-amber-600 dark:text-amber-300">
        Live API unavailable, showing {fallbackLabel} demo data.
      </p>
    );
  }

  return <p className="text-sm text-emerald-600 dark:text-emerald-300">Connected to backend data where available.</p>;
}
