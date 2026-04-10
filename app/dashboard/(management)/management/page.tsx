import { ActivityLog } from "@/components/dashboard-blocks/management/ActivityLog";
import { ManagementLinks } from "@/components/dashboard-blocks/management/ManagementLinks";
import { ManagementPreview } from "@/components/dashboard-blocks/management/ManagementPreview";
import { RoleSelector } from "@/components/dashboard-blocks/management/RoleSelector";
import { UserForm } from "@/components/dashboard-blocks/management/UserForm";
import { UsersList } from "@/components/dashboard-blocks/management/UsersList";

export default function ManagementPage() {
  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ManagementLinks />
      <ManagementPreview />
      <UsersList />
      <div className="grid gap-6 xl:grid-cols-2">
        <UserForm />
        <RoleSelector />
      </div>
      <ActivityLog />
    </div>
  );
}
