import { BreakdownBlock } from "@/components/dashboard-blocks/common";

export function BrowserStats() {
  return (
    <BreakdownBlock
      title="Browser Stats"
      description="Top browsers used by visitors."
      data={[
        { label: "Chrome", value: 58 },
        { label: "Safari", value: 18 },
        { label: "Edge", value: 14 },
        { label: "Firefox", value: 10 }
      ]}
    />
  );
}
