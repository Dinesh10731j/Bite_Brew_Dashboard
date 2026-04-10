import { BreakdownBlock } from "@/components/dashboard-blocks/common";

export function VisitorsByCountry() {
  return (
    <BreakdownBlock
      title="Visitors by Country"
      description="Geographic traffic across Nepal, India, and others."
      data={[
        { label: "Nepal", value: 62 },
        { label: "India", value: 24 },
        { label: "Others", value: 14 }
      ]}
      pie
    />
  );
}
