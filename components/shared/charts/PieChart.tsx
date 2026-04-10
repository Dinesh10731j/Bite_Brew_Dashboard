export function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  let cumulative = 0;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
      <svg viewBox="0 0 42 42" className="h-48 w-48 -rotate-90">
        {data.map((item) => {
          const start = (cumulative / total) * 100;
          const size = (item.value / total) * 100;
          cumulative += item.value;

          return (
            <circle
              key={item.label}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={item.color}
              strokeWidth="6"
              strokeDasharray={`${size} ${100 - size}`}
              strokeDashoffset={-start}
            />
          );
        })}
      </svg>
      <div className="space-y-3 text-sm">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
            <span className="ml-auto font-semibold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
