import { ShoppingCart } from "lucide-react";
import { IconBase } from "./IconBase";

export function OrdersIcon({ className }: { className?: string }) {
  return <IconBase icon={ShoppingCart} className={className} />;
}
