import type { LucideIcon } from "lucide-react";

type IconBaseProps = {
  icon: LucideIcon;
  className?: string;
};

export function IconBase({ icon: Icon, className }: IconBaseProps) {
  return <Icon className={className ?? "h-5 w-5"} strokeWidth={1.9} />;
}
