import { BlockCard } from "@/components/dashboard-blocks/common";
import { LineChart } from "@/components/shared/charts/LineChart";
import { Empty } from "@/components/shared/ui/Empty";

type TrafficPoint = { label: string; visitors: number; orders?: number; revenue?: number };

export function TrafficChart({ data = [] }: { data?: TrafficPoint[] }) {
  return (
    <BlockCard title="Traffic Summary" description="Last 7 days of visitor activity and trend movement.">
      {data.length ? (
        <LineChart data={data} />
      ) : (
        <Empty title="No Traffic Data" description="Backend did not return traffic summary yet." />
      )}
    </BlockCard>
  );
}