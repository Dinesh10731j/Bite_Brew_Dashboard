import type { Order } from "@/lib/shared";
import { Badge } from "@/components/shared/ui/Badge";
import { formatCurrency } from "@/lib/shared";
import { Empty } from "@/components/shared/ui/Empty";
import { CircleUserRound, Hash, ReceiptText } from "lucide-react";

export function RecentOrders({ data = [] }: { data?: Order[] }) {
  if (!data.length) {
    return <Empty title="No Recent Orders" description="No order records were returned by backend yet." />;
  }

  const statusTone: Record<Order["orderStatus"], "neutral" | "brand" | "success" | "warning" | "danger"> = {
    pending: "warning",
    confirmed: "brand",
    preparing: "brand",
    ready: "success",
    completed: "success",
    cancelled: "danger",
  };

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((order, index) => (
        <div
          key={`${order.id}-${index}`}
          className="rounded-2xl border border-brand/15 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1 font-semibold text-brand-ink dark:text-white">
                <CircleUserRound className="h-4 w-4 text-brand" />
                {order.customerName}
              </p>
              <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300">
                <Hash className="h-3.5 w-3.5 text-brand/80" />#{order.id}
              </p>
            </div>
            <Badge tone={statusTone[order.orderStatus]}>{order.orderStatus}</Badge>
          </div>
          <p className="mt-2 line-clamp-1 text-sm text-slate-600 dark:text-slate-300">{order.itemsOrdered}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-semibold text-brand-ink dark:text-white">
              {formatCurrency(order.totalPrice)}
            </p>
            <div className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-brand" />
              <Badge tone="neutral">{order.quantity} qty</Badge>
              <Badge tone="brand">{order.orderType}</Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
