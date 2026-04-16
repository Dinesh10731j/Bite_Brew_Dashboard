import { Badge } from "@/components/shared/ui/Badge";

export function OrderStatusBadge({ status }: { status: string }) {
  const tone =
    status === "completed"
      ? "success"
      : status === "preparing" || status === "ready"
        ? "warning"
        : status === "cancelled"
          ? "danger"
          : "brand";
  return <Badge tone={tone}>{status}</Badge>;
}
