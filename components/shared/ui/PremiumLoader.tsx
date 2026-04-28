import { cn } from "@/lib/utils";

type PremiumLoaderProps = {
  label?: string;
  className?: string;
  fullScreen?: boolean;
};

export function PremiumLoader({
  label = "Loading dashboard...",
  className,
  fullScreen = false,
}: PremiumLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen && "min-h-[60vh]",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full border-2 border-brand/15" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand border-r-brand-deep animate-spin" />
        <span className="absolute inset-2 rounded-full bg-gradient-to-br from-brand-soft to-white dark:from-brand/20 dark:to-white/5 shadow-[0_8px_24px_rgba(14,53,42,0.22)]" />
        <span className="absolute inset-[18px] rounded-full bg-brand/90 dark:bg-brand" />
      </div>

      <p className="text-sm font-medium text-slate-600 dark:text-slate-200">{label}</p>
    </div>
  );
}