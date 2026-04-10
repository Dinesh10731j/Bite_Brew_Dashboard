import { MetricGrid } from "@/components/dashboard-blocks/metrics/MetricGrid";

export function CampaignMetrics() {
  return (
    <MetricGrid
      metrics={[
        { label: "Open Rate", value: "41%", delta: "+2.8%" },
        { label: "Click Rate", value: "12%", delta: "+1.4%" },
        { label: "Unsubscribes", value: "0.7%", delta: "-0.1%" }
      ]}
    />
  );
}
