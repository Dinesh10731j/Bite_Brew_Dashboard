import { SettingsSection } from "@/components/dashboard-blocks/common";

export function APIKeysManager() {
  return (
    <SettingsSection
      title="API Keys"
      fields={[
        { label: "Public Key", value: "pk_live_••••••" },
        { label: "Secret Key", value: "sk_live_••••••" },
        { label: "Webhook", value: "Enabled" }
      ]}
    />
  );
}
