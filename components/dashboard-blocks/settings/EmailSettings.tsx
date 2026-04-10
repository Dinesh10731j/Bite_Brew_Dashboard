import { SettingsSection } from "@/components/dashboard-blocks/common";

export function EmailSettings() {
  return (
    <SettingsSection
      title="Email Settings"
      fields={[
        { label: "Sender", value: "newsletter@javabrewbites.com" },
        { label: "SMTP", value: "Configured" },
        { label: "Newsletter Status", value: "Ready to send" }
      ]}
    />
  );
}
