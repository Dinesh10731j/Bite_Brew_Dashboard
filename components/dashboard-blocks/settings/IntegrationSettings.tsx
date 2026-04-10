import { SettingsSection } from "@/components/dashboard-blocks/common";

export function IntegrationSettings() {
  return (
    <SettingsSection
      title="Integrations"
      fields={[
        { label: "Google Analytics", value: "Pending key" },
        { label: "WhatsApp", value: "Connected" },
        { label: "Maps", value: "Connected" }
      ]}
    />
  );
}
