import { GenericTable } from "@/components/dashboard-blocks/common";

export function ActivityLog() {
  return (
    <GenericTable
      title="Staff Activity Logs"
      description="Assigned tasks, login history, and recent actions."
      headers={["User", "Action", "Module", "Time"]}
      rows={[
        ["Mina Staff", "Updated order status", "Orders", "10:42 AM"],
        ["Rajan Ops", "Published menu item", "Menu", "09:55 AM"],
        ["Aarav Admin", "Viewed report export", "Reports", "08:31 AM"]
      ]}
    />
  );
}
