import { SettingsSection } from "@/components/dashboard-blocks/common";

export function ThemeSettings() {
  return (
    <SettingsSection
      title="Theme Settings"
      fields={[
        { label: "Primary Color", value: "#207659" },
        { label: "Secondary Color", value: "#1a5a46" },
        { label: "Mode", value: "Dark / Light toggle enabled" }
      ]}
    />
  );
}
