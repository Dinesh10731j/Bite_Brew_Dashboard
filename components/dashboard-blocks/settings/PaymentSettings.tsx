import { SettingsSection } from "@/components/dashboard-blocks/common";

export function PaymentSettings() {
  return (
    <SettingsSection
      title="Payment Integrations"
      fields={[
        { label: "eSewa", value: "Connected" },
        { label: "Khalti", value: "Connected" },
        { label: "Cash", value: "Enabled" }
      ]}
    />
  );
}
