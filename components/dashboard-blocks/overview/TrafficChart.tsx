import { BlockCard } from "@/components/dashboard-blocks/common";
import { LineChart } from "@/components/shared/charts/LineChart";
import { Empty } from "@/components/shared/ui/Empty";
import { ChartColumn } from "lucide-react";

type TrafficPoint = { label: string; visitors: number; orders?: number; revenue?: number };

export function TrafficChart({ data = [] }: { data?: TrafficPoint[] }) {
  return (
    <BlockCard
      title="Traffic Summary"
      description="Last 7 days of visitor activity and trend movement."
      icon={<ChartColumn className="h-5 w-5" />}
    >
      {data.length ? (
        <LineChart data={data} heightClass="h-44" />
      ) : (
        <Empty title="No Traffic Data" description="Backend did not return traffic summary yet." />
      )}
    </BlockCard>
  );
}
