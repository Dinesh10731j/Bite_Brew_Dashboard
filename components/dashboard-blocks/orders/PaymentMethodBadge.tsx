import { Badge } from "@/components/shared/ui/Badge";

export function PaymentMethodBadge({ method }: { method: string }) {
  return <Badge tone="brand">{method}</Badge>;
}
