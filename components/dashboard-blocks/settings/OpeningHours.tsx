import { SettingsSection } from "@/components/dashboard-blocks/common";

export function OpeningHours() {
  return (
    <SettingsSection
      title="Opening Hours"
      fields={[
        { label: "Weekdays", value: "7:00 AM - 9:00 PM" },
        { label: "Weekends", value: "8:00 AM - 10:00 PM" },
        { label: "Holiday Rule", value: "Manual override available" }
      ]}
    />
  );
}
