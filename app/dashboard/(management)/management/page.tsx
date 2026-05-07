import { ManagementLinks } from "@/components/dashboard-blocks/management/ManagementLinks";
import { ManagementPreview } from "@/components/dashboard-blocks/management/ManagementPreview";

export default function ManagementPage() {
  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ManagementLinks />
      <ManagementPreview />
    </div>
  );
}


