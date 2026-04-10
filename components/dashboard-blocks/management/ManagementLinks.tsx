import Link from "next/link";
import { ImagePlus, LayoutGrid, Logs, Users } from "lucide-react";
import { BlockCard } from "@/components/dashboard-blocks/common";

const links = [
  {
    title: "Users & Roles",
    description: "Manage admins, staff roles, permissions, and access.",
    href: "/dashboard/management/users",
    icon: Users
  },
  {
    title: "Menu & Pricing",
    description: "Add drinks, snacks, prices, discounts, and stock status.",
    href: "/dashboard/management/menu",
    icon: LayoutGrid
  },
  {
    title: "Gallery",
    description: "Show food, interior, and event photos with featured tags.",
    href: "/dashboard/management/gallery",
    icon: ImagePlus
  },
  {
    title: "Activity Logs",
    description: "Review login history, order assignments, and staff actions.",
    href: "/dashboard/management/activity-logs",
    icon: Logs
  }
];

export function ManagementLinks() {
  return (
    <BlockCard title="Management Sections" description="Quick access to all management modules.">
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-3xl border border-brand/10 bg-brand-soft/40 p-5 transition hover:border-brand/40 hover:bg-brand-soft/70 dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-brand-ink dark:text-white">{link.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{link.description}</p>
            </Link>
          );
        })}
      </div>
    </BlockCard>
  );
}
