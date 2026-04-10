import type { TrafficPoint } from "@/lib/types";

export function LineChart({ data }: { data: TrafficPoint[] }) {
  const max = Math.max(...data.map((item) => item.visitors));
  const points = data
    .map((item, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${100 - (item.visitors / max) * 80}`)
    .join(" ");

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 100 100" className="h-44 w-full overflow-visible">
        <defs>
          <linearGradient id="trafficFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#207659" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#207659" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="#207659" strokeWidth="3" points={points} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="grid grid-cols-7 gap-2 text-xs text-slate-400">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}
