import { Button } from "@/components/shared/ui/Button";

export function TableActions() {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" className="px-3 py-2 text-xs">
        View
      </Button>
      <Button className="px-3 py-2 text-xs">Edit</Button>
    </div>
  );
}
