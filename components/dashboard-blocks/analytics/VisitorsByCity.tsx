import { BreakdownBlock } from "@/components/dashboard-blocks/common";

export function VisitorsByCity() {
  return (
    <BreakdownBlock
      title="Visitors by City"
      description="Most active cities sending traffic to Java Brew & Bites."
      data={[
        { label: "Kathmandu", value: 44 },
        { label: "Pokhara", value: 22 },
        { label: "Lalitpur", value: 18 },
        { label: "Others", value: 12 }
      ]}
    />
  );
}
