import type { TrafficPoint } from "@/lib/types";

export function AreaChart({ data }: { data: TrafficPoint[] }) {
  const max = Math.max(...data.map((item) => item.visitors));
  const points = data
    .map((item, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${100 - (item.visitors / max) * 80}`)
    .join(" ");
  const area = `0,100 ${points} 100,100`;

  return (
    <svg viewBox="0 0 100 100" className="h-44 w-full overflow-visible">
      <defs>
        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#207659" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#207659" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaFill)" />
      <polyline fill="none" stroke="#1a5a46" strokeWidth="3" points={points} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
