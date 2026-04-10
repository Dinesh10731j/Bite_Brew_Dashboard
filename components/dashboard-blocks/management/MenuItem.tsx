import Image from "next/image";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { Badge } from "@/components/shared/ui/Badge";
import { Card } from "@/components/shared/ui/Card";
import { menuItems } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function MenuItem({ items = menuItems }: { items?: MenuItemType[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden p-0">
          <div className="relative h-44">
            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
          </div>
          <div className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-brand-ink dark:text-white">{item.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">{item.category}</p>
              </div>
              <Badge tone="brand">{formatCurrency(item.price)}</Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-300">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge tone={item.availability === "in stock" ? "success" : "danger"}>{item.availability}</Badge>
              {item.featured && <Badge tone="brand">Featured</Badge>}
              {item.discount && <Badge tone="warning">{item.discount} off</Badge>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
