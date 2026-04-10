import { orders } from "@/lib/mock-data";

export function OrderTimeline() {
  const timeline = orders[0].timeline;
  return (
    <div className="space-y-4">
      {timeline.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${item.active ? "bg-brand" : "bg-slate-300 dark:bg-white/15"}`} />
          <div className="flex flex-1 items-center justify-between rounded-2xl bg-brand-soft/50 px-4 py-3 dark:bg-white/5">
            <span className="font-medium text-brand-ink dark:text-white">{item.label}</span>
            <span className="text-sm text-slate-500 dark:text-slate-300">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
