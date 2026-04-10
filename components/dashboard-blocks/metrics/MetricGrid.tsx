import { MetricCard } from "./MetricCard";

export function MetricGrid({ metrics }: { metrics: { label: string; value: string; delta: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
