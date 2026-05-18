import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, MapPin, TrendingUp } from "lucide-react";
import { BarChart } from "@/components/shared/charts/BarChart";
import { PieChart } from "@/components/shared/charts/PieChart";
import { DataTable } from "@/components/shared/tables/DataTable";
import { TableCell } from "@/components/shared/tables/TableCell";
import { TableRow } from "@/components/shared/tables/TableRow";
import { Badge } from "@/components/shared/ui/Badge";
import { Button } from "@/components/shared/ui/Button";
import { Card } from "@/components/shared/ui/Card";
import { Empty } from "@/components/shared/ui/Empty";
import { Pagination } from "@/components/shared/ui/Pagination";
import { cn, formatCurrency } from "@/lib/shared";

export function BlockCard({
  title,
  description,
  icon,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-5", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-brand-ink dark:text-white">
            {icon ? <span className="text-brand">{icon}</span> : null}
            <span>{title}</span>
          </h3>
          {description && <p className="text-sm text-slate-500 dark:text-slate-300">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function MetricPanel({ label, value, delta, icon }: { label: string; value: string; delta: string; icon?: ReactNode }) {
  return (
    <Card className="space-y-3 bg-gradient-to-br from-white to-brand-soft/80 dark:from-[#101916] dark:to-brand/10">
      <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
        {icon ? <span className="text-brand">{icon}</span> : null}
        <span>{label}</span>
      </p>
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-3xl font-semibold text-brand-ink dark:text-white">{value}</h3>
        <Badge tone="brand">{delta}</Badge>
      </div>
    </Card>
  );
}

export function InsightList({
  items,
  valueLabel,
}: {
  items: { name?: string; place?: string; orders?: number; visitors?: number; revenue?: string; price?: string }[];
  valueLabel: "orders" | "visitors";
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item.name ?? item.place ?? "insight"}-${index}`}
          className="flex items-center justify-between rounded-2xl bg-brand-soft/60 px-4 py-3 dark:bg-white/5"
        >
          <div>
            <p className="flex items-center gap-1 font-medium text-brand-ink dark:text-white">
              {valueLabel === "visitors" ? <MapPin className="h-4 w-4 text-brand" /> : <TrendingUp className="h-4 w-4 text-brand" />}
              {item.name ?? item.place}
            </p>
            {item.revenue && <p className="text-xs text-slate-500 dark:text-slate-400">{item.revenue}</p>}
            {!item.revenue && item.price && <p className="text-xs text-slate-500 dark:text-slate-400">{item.price}</p>}
          </div>
          {valueLabel === "orders" && item.orders !== undefined && item.orders > 0 ? (
            <Badge tone="brand">{item.orders} orders</Badge>
          ) : valueLabel === "visitors" && item.visitors !== undefined ? (
            <Badge tone="brand">{item.visitors} visitors</Badge>
          ) : (
            <Badge tone="neutral">-</Badge>
          )}
        </div>
      ))}
    </div>
  );
}

export function SimpleList({
  items,
}: {
  items: { title: string; subtitle: string; icon?: ReactNode; badge?: string; tone?: "neutral" | "brand" | "success" | "warning" | "danger" }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
          className="flex items-start justify-between gap-3 rounded-2xl border border-brand/10 px-4 py-3 dark:border-white/10"
        >
          <div className="flex items-start gap-2">
            {item.icon ? <span className="mt-0.5 text-brand">{item.icon}</span> : null}
            <div>
            <p className="font-medium text-brand-ink dark:text-white">{item.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-300">{item.subtitle}</p>
            </div>
          </div>
          {item.badge && <Badge tone={item.tone}>{item.badge}</Badge>}
        </div>
      ))}
    </div>
  );
}

export function TrafficBlock() {
  return (
    <BlockCard title="Traffic Summary" description="Last 7 days of visitor activity and trend movement.">
      <Empty title="No Traffic Data" description="Traffic chart requires backend response data." />
    </BlockCard>
  );
}

export function BreakdownBlock({
  title,
  description,
  data,
  pie = false,
}: {
  title: string;
  description: string;
  data: { label: string; value: number; color?: string }[];
  pie?: boolean;
}) {
  return (
    <BlockCard title={title} description={description}>
      {pie ? (
        <PieChart
          data={data.map((item, index) => ({
            ...item,
            color: item.color ?? ["#207659", "#38a169", "#9fd8bf", "#1a5a46"][index % 4],
          }))}
        />
      ) : (
        <BarChart data={data} />
      )}
    </BlockCard>
  );
}

export function GenericTable({
  title,
  description,
  headers,
  rows,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
}: {
  title: string;
  description?: string;
  headers: string[];
  rows: ReactNode[][];
  page?: number;
  totalPages?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
}) {
  return (
    <BlockCard title={title} description={description}>
      <DataTable headers={headers}>
        {rows.map((row, index) => (
          <TableRow key={`${title}-${index}`}>
            {row.map((cell, cellIndex) => (
              <TableCell key={`${title}-${index}-${cellIndex}`}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </DataTable>
      <Pagination page={page} totalPages={totalPages} onPreviousPage={onPreviousPage} onNextPage={onNextPage} />
    </BlockCard>
  );
}

export function SettingsSection({
  title,
  fields,
}: {
  title: string;
  fields: { label: string; value: string }[];
}) {
  return (
    <BlockCard title={title} action={<Button>Edit</Button>}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field, index) => (
          <div key={`${field.label}-${index}`} className="rounded-2xl bg-brand-soft/50 px-4 py-3 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{field.label}</p>
            <p className="mt-2 font-medium text-brand-ink dark:text-white">{field.value}</p>
          </div>
        ))}
      </div>
    </BlockCard>
  );
}

export function GalleryBlock() {
  return (
    <BlockCard title="Gallery Manager" description="Featured media, tags, and reorder controls.">
      <Empty title="No Gallery Preview" description="Gallery preview requires live backend media data." />
    </BlockCard>
  );
}

export function ExportCard() {
  return (
    <BlockCard
      title="Export Reports"
      description="Download revenue, order, and traffic data."
      action={
        <div className="flex gap-2">
          <Button>Export CSV</Button>
          <Button variant="secondary">Export PDF</Button>
        </div>
      }
    >
      <div className="rounded-3xl bg-gradient-to-r from-brand to-brand-deep p-6 text-white">
        <p className="text-sm text-white/80">Reports ready to download</p>
        <h4 className="mt-2 text-2xl font-semibold">Daily, weekly, and monthly performance bundles</h4>
      </div>
    </BlockCard>
  );
}

export function DetailCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <BlockCard title={title}>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-brand-ink dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </BlockCard>
  );
}

export function ActionLink({ href }: { href: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
      Open
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}

export function FinancialKpi({ label, value }: { label: string; value: number }) {
  return (
    <Card className="space-y-2">
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="text-3xl font-semibold text-brand-ink dark:text-white">{formatCurrency(value)}</p>
    </Card>
  );
}
