import { DateRangePicker } from "@/components/shared/forms/DateRangePicker";
import { SearchInput } from "@/components/shared/forms/SearchInput";

export function OrderFilters() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <SearchInput />
      <DateRangePicker />
    </div>
  );
}
