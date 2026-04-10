import { SettingsSection } from "@/components/dashboard-blocks/common";

export function NotificationSettings() {
  return (
    <SettingsSection
      title="Notification Settings"
      fields={[
        { label: "Order Alerts", value: "Instant" },
        { label: "Message Alerts", value: "Instant" },
        { label: "System Alerts", value: "Digest + critical" }
      ]}
    />
  );
}
