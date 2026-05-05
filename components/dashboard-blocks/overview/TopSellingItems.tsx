import { Badge } from "@/components/shared/ui/Badge";
import { Empty } from "@/components/shared/ui/Empty";
import { formatNumber } from "@/lib/utils";

type TopItem = {
  id?: string;
  name?: string;
  orders?: number;
  revenue?: string;
  price?: string;
  image?: string;
  imageUrl?: string;
  available?: boolean;
  featured?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TopSellingItems({ items = [] }: { items?: TopItem[] }) {
  if (!items.length) {
    return <Empty title="No Top Items" description="Backend did not return top-selling items yet." />;
  }

  const highestOrders = Math.max(...items.map((item) => Number(item.orders ?? 0)), 1);
  const hasOrderVolume = items.some((item) => Number(item.orders ?? 0) > 0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const name = item.name?.trim() || "Menu item";
        const orders = Number(item.orders ?? 0);
        const performance = hasOrderVolume
          ? Math.max(8, Math.round((orders / highestOrders) * 100))
          : Math.max(40, 100 - index * 12);
        const imageSrc = item.imageUrl ?? item.image;
        const rank = index + 1;

        return (
          <div
            key={`${name}-${index}`}
            className="rounded-2xl border border-brand/15 bg-white p-3 shadow-sm transition hover:border-brand/30 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-brand-soft/80 ring-1 ring-brand/15 dark:bg-brand/20">
                {imageSrc ? (
                  <img src={imageSrc} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-brand-ink dark:text-white">
                    {getInitials(name)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold text-brand-ink dark:text-white">{name}</p>
                  <Badge tone={rank === 1 ? "success" : rank === 2 ? "brand" : "warning"}>
                    #{rank}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {item.price ? <Badge tone="warning">{item.price}</Badge> : null}
                  {item.revenue ? <Badge tone="brand">{item.revenue} revenue</Badge> : null}
                  {orders > 0 ? (
                    <Badge tone="neutral">{formatNumber(orders)} orders</Badge>
                  ) : (
                    <Badge tone="neutral">No order volume data</Badge>
                  )}
                  {item.featured ? <Badge tone="success">Featured</Badge> : null}
                  {item.available === false ? <Badge tone="danger">Out of stock</Badge> : null}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
                <span>Performance</span>
                <span>{performance}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-500"
                  style={{ width: `${performance}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
