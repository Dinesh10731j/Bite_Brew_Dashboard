import { BreakdownBlock } from "@/components/dashboard-blocks/common";

export function OSStats() {
  return (
    <BreakdownBlock
      title="OS Stats"
      description="Operating systems sending traffic."
      data={[
        { label: "Android", value: 41 },
        { label: "iOS", value: 22 },
        { label: "Windows", value: 25 },
        { label: "macOS", value: 12 }
      ]}
    />
  );
}
