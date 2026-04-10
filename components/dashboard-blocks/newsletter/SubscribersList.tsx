import { GenericTable } from "@/components/dashboard-blocks/common";

export function SubscribersList({ rows }: { rows: string[][] }) {
  return (
    <GenericTable
      title="Subscribers"
      description="Newsletter audience and signup status."
      headers={["Email", "Status", "Joined"]}
      rows={rows}
    />
  );
}
