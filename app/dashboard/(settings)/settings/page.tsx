import { APIKeysManager } from "@/components/dashboard-blocks/settings/APIKeysManager";
import { BrandingSettings } from "@/components/dashboard-blocks/settings/BrandingSettings";
import { BusinessSettings } from "@/components/dashboard-blocks/settings/BusinessSettings";
import { EmailSettings } from "@/components/dashboard-blocks/settings/EmailSettings";
import { IntegrationSettings } from "@/components/dashboard-blocks/settings/IntegrationSettings";
import { NotificationSettings } from "@/components/dashboard-blocks/settings/NotificationSettings";
import { OpeningHours } from "@/components/dashboard-blocks/settings/OpeningHours";
import { PaymentSettings } from "@/components/dashboard-blocks/settings/PaymentSettings";
import { ThemeSettings } from "@/components/dashboard-blocks/settings/ThemeSettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <BusinessSettings />
      <div className="grid gap-6 xl:grid-cols-2">
        <PaymentSettings />
        <NotificationSettings />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <EmailSettings />
        <ThemeSettings />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <IntegrationSettings />
        <APIKeysManager />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <BrandingSettings />
        <OpeningHours />
      </div>
    </div>
  );
}
