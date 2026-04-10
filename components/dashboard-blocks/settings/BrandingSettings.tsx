import { SettingsSection } from "@/components/dashboard-blocks/common";

export function BrandingSettings() {
  return (
    <SettingsSection
      title="Branding"
      fields={[
        { label: "Logo", value: "Java Brew & Bites primary mark" },
        { label: "Accent", value: "Teal with clean white surfaces" },
        { label: "Tone", value: "Modern hospitality dashboard" }
      ]}
    />
  );
}
