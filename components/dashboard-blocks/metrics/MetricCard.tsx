import { MetricPanel } from "@/components/dashboard-blocks/common";

export function MetricCard(props: { label: string; value: string; delta: string }) {
  return <MetricPanel {...props} />;
}
