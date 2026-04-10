import { GenericTable } from "@/components/dashboard-blocks/common";

export function CampaignsList() {
  return (
    <GenericTable
      title="Campaigns Sent"
      description="Recent newsletter campaigns and performance."
      headers={["Campaign", "Audience", "Open Rate", "Click Rate"]}
      rows={[
        ["Weekend Brunch Drop", "1,240", "42%", "11%"],
        ["Cold Brew Launch", "1,180", "39%", "14%"]
      ]}
    />
  );
}
