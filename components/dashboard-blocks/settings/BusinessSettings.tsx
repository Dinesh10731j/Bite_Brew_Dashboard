import { SettingsSection } from "@/components/dashboard-blocks/common";

export function BusinessSettings() {
  return (
    <SettingsSection
      title="Business Settings"
      fields={[
        { label: "Business Name", value: "Java Brew & Bites" },
        { label: "Address", value: "Baneshwor, Kathmandu, Nepal" },
        { label: "Contact", value: "+977-9800000000 • hello@javabrewbites.com" }
      ]}
    />
  );
}
