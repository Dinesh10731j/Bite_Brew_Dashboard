import { Search } from "lucide-react";

export function SearchInput() {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-brand/15 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <Search className="h-4 w-4 text-slate-400" />
      <input placeholder="Search" className="w-full bg-transparent text-sm outline-none dark:text-white" />
    </div>
  );
}
