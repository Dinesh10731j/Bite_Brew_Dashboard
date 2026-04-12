import { BlockCard } from "@/components/dashboard-blocks/common";
import { LineChart } from "@/components/shared/charts/LineChart";
import { trafficSummary } from "@/lib/mock-data";

export function TrafficChart({ data = trafficSummary }: { data?: typeof trafficSummary }) {
  return (
    <BlockCard title="Traffic Summary" description="Last 7 days of visitor activity and trend movement.">
      <LineChart data={data} />
    </BlockCard>
  );
}
