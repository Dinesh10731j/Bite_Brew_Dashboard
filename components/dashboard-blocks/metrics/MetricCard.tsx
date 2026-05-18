import { MetricPanel } from "@/components/dashboard-blocks/common";
import { Bell, DollarSign, Mail, Package, UtensilsCrossed } from "lucide-react";

export function MetricCard(props: { label: string; value: string; delta: string }) {
  const label = props.label.toLowerCase();
  const icon = label.includes("order")
    ? <Package className="h-4 w-4" />
    : label.includes("menu")
      ? <UtensilsCrossed className="h-4 w-4" />
      : label.includes("message")
        ? <Mail className="h-4 w-4" />
        : label.includes("notification")
          ? <Bell className="h-4 w-4" />
          : label.includes("sales")
            ? <DollarSign className="h-4 w-4" />
            : undefined;
  return <MetricPanel {...props} icon={icon} />;
}
