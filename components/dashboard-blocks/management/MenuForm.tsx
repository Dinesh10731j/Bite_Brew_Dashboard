import { BlockCard } from "@/components/dashboard-blocks/common";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";

export function MenuForm() {
  return (
    <BlockCard title="Add Menu Item" action={<Button>Save Item</Button>}>
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Item name" />
        <Select defaultValue="Coffee">
          <option>Coffee</option>
          <option>Tea</option>
          <option>Snacks</option>
        </Select>
        <Input placeholder="Price" />
        <Input placeholder="Discount" />
      </div>
    </BlockCard>
  );
}
