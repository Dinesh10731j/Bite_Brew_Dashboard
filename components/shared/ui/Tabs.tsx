"use client";

type TabsProps = {
  tabs: string[];
  active?: string;
};

export function Tabs({ tabs, active }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={
            active === tab
              ? "rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
              : "rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-ink dark:bg-white/10 dark:text-white"
          }
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
