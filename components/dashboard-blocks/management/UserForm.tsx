import { BlockCard } from "@/components/dashboard-blocks/common";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";

export function UserForm() {
  return (
    <BlockCard title="Add Admin User" action={<Button>Save User</Button>}>
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Full name" />
        <Input placeholder="Email address" />
        <Select defaultValue="staff">
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </Select>
      </div>
    </BlockCard>
  );
}
