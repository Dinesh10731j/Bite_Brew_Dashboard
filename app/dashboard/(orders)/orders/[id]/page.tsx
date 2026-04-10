import { OrderDetailCard } from "@/components/dashboard-blocks/orders/OrderDetailCard";
import { OrderTimeline } from "@/components/dashboard-blocks/orders/OrderTimeline";

export default function OrderDetailPage() {
  return (
    <div className="grid gap-6 pb-24 xl:grid-cols-[1.2fr_0.8fr] xl:pb-6">
      <OrderDetailCard />
      <OrderTimeline />
    </div>
  );
}
