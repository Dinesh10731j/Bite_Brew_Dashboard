import { BlockCard } from "@/components/dashboard-blocks/common";
import { BestSellingItems } from "@/components/dashboard-blocks/reports/BestSellingItems";
import { ConversionTrend } from "@/components/dashboard-blocks/reports/ConversionTrend";
import { CustomerGrowth } from "@/components/dashboard-blocks/reports/CustomerGrowth";
import { ExportButton } from "@/components/dashboard-blocks/reports/ExportButton";
import { OrdersTrend } from "@/components/dashboard-blocks/reports/OrdersTrend";
import { RevenueReport } from "@/components/dashboard-blocks/reports/RevenueReport";
import { TrafficTrend } from "@/components/dashboard-blocks/reports/TrafficTrend";

export default function ReportsPage() {
  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <RevenueReport />
        <OrdersTrend />
        <CustomerGrowth />
        <ConversionTrend />
      </div>
      <TrafficTrend />
      <BlockCard title="Best Selling Items">
        <BestSellingItems />
      </BlockCard>
      <ExportButton />
    </div>
  );
}
