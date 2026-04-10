import { BlockCard } from "@/components/dashboard-blocks/common";
import { Select } from "@/components/shared/ui/Select";

export function RoleSelector() {
  return (
    <BlockCard title="Permissions">
      <div className="grid gap-3 md:grid-cols-3">
        <Select defaultValue="admin">
          <option>admin</option>
          <option>manager</option>
          <option>staff</option>
        </Select>
        <Select defaultValue="Orders & Messages">
          <option>Orders & Messages</option>
          <option>Reports only</option>
          <option>Full access</option>
        </Select>
        <Select defaultValue="Active">
          <option>Active</option>
          <option>Suspended</option>
        </Select>
      </div>
    </BlockCard>
  );
}
