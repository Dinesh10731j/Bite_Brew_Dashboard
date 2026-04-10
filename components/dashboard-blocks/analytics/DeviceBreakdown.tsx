import { BreakdownBlock } from "@/components/dashboard-blocks/common";

export function DeviceBreakdown() {
  return (
    <BreakdownBlock
      title="Device Breakdown"
      description="Traffic split by screen type."
      data={[
        { label: "Mobile", value: 68 },
        { label: "Desktop", value: 24 },
        { label: "Tablet", value: 8 }
      ]}
      pie
    />
  );
}
