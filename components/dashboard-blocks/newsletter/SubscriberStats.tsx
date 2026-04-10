import { MetricGrid } from "@/components/dashboard-blocks/metrics/MetricGrid";

export function SubscriberStats() {
  return (
    <MetricGrid
      metrics={[
        { label: "Total Subscribers", value: "1,284", delta: "+9.4%" },
        { label: "New Today", value: "18", delta: "+3.1%" },
        { label: "New This Week", value: "72", delta: "+6.8%" }
      ]}
    />
  );
}
