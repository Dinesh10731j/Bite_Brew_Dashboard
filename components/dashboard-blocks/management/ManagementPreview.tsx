import Link from "next/link";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { galleryItems, menuItems } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/shared/ui/Badge";

export function ManagementPreview() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <BlockCard
        title="Menu & Pricing Preview"
        description="Item name, category, price, stock, discount, and popularity."
        action={<Link href="/dashboard/management/menu" className="text-sm font-semibold text-brand">Open Menu</Link>}
      >
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="flex items-start justify-between rounded-2xl bg-brand-soft/50 px-4 py-3 dark:bg-white/5">
              <div>
                <p className="font-medium text-brand-ink dark:text-white">{item.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {item.category} • {item.description}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-brand-ink dark:text-white">{formatCurrency(item.price)}</p>
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  <Badge tone={item.availability === "in stock" ? "success" : "danger"}>{item.availability}</Badge>
                  {item.featured && <Badge tone="brand">Featured</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </BlockCard>
      <BlockCard
        title="Gallery Preview"
        description="Images, categories, upload dates, tags, featured markers, and reorder tools."
        action={<Link href="/dashboard/management/gallery" className="text-sm font-semibold text-brand">Open Gallery</Link>}
      >
        <div className="space-y-3">
          {galleryItems.map((item) => (
            <div key={item.id} className="rounded-2xl bg-brand-soft/50 px-4 py-3 dark:bg-white/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-brand-ink dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {item.category} • Uploaded {item.uploadDate}
                  </p>
                </div>
                {item.featured && <Badge tone="warning">Featured</Badge>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    #{tag}
                  </Badge>
                ))}
                <Badge tone="brand">Drag & reorder</Badge>
                <Badge tone="danger">Delete / edit</Badge>
              </div>
            </div>
          ))}
        </div>
      </BlockCard>
    </div>
  );
}
