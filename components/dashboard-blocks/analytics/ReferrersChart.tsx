import { BreakdownBlock } from "@/components/dashboard-blocks/common";

export function ReferrersChart() {
  return (
    <BreakdownBlock
      title="Referrers"
      description="Traffic sources reaching the cafe site."
      data={[
        { label: "Google", value: 46 },
        { label: "Instagram", value: 24 },
        { label: "Direct", value: 18 },
        { label: "WhatsApp", value: 12 }
      ]}
    />
  );
}
