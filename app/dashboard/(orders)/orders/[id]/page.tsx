"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DetailCard } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { dashboardApi } from "@/lib/api/dashboard";
import { normalizeOrder } from "@/lib/dashboard-normalizers";
import { formatCurrency } from "@/lib/utils";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const orderQuery = useQuery({
    queryKey: ["order-detail", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response: any = await dashboardApi.getOrderById(id);
      return normalizeOrder(response?.data ?? response);
    },
  });

  const order = orderQuery.data;

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote
        error={orderQuery.error instanceof Error ? orderQuery.error.message : ""}
        loading={orderQuery.isLoading}
        fallbackLabel="order"
      />

      {order ? (
        <>
          <DetailCard
            title={`Order ${order.id}`}
            items={[
              { label: "Customer", value: order.customerName },
              { label: "Phone", value: order.phone },
              { label: "Email", value: order.email },
              { label: "Items", value: order.itemsOrdered },
              { label: "Quantity", value: String(order.quantity) },
              { label: "Total", value: formatCurrency(order.totalPrice) },
              { label: "Order Type", value: order.orderType },
              { label: "Payment Method", value: order.paymentMethod },
              { label: "Created", value: order.createdTime },
            ]}
          />

          <div className="space-y-4">
            {order.timeline.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${item.active ? "bg-brand" : "bg-slate-300 dark:bg-white/15"}`}
                />
                <div className="flex flex-1 items-center justify-between rounded-2xl bg-brand-soft/50 px-4 py-3 dark:bg-white/5">
                  <span className="font-medium text-brand-ink dark:text-white">{item.label}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-300">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}