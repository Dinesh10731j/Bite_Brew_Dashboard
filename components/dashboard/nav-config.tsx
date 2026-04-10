import type { ReactNode } from "react";
import { AnalyticsIcon } from "@/components/icons/AnalyticsIcon";
import { DashboardIcon } from "@/components/icons/DashboardIcon";
import { ManagementIcon } from "@/components/icons/ManagementIcon";
import { MessagesIcon } from "@/components/icons/MessagesIcon";
import { NewsletterIcon } from "@/components/icons/NewsletterIcon";
import { NotificationsIcon } from "@/components/icons/NotificationsIcon";
import { OrdersIcon } from "@/components/icons/OrdersIcon";
import { ReportsIcon } from "@/components/icons/ReportsIcon";
import { SettingsIcon } from "@/components/icons/SettingsIcon";

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <AnalyticsIcon /> },
  { label: "Orders", href: "/dashboard/orders", icon: <OrdersIcon /> },
  { label: "Messages", href: "/dashboard/messages", icon: <MessagesIcon /> },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: <NewsletterIcon /> },
  { label: "Notifications", href: "/dashboard/notifications", icon: <NotificationsIcon /> },
  { label: "Management", href: "/dashboard/management", icon: <ManagementIcon /> },
  { label: "Reports", href: "/dashboard/reports", icon: <ReportsIcon /> },
  { label: "Settings", href: "/dashboard/settings", icon: <SettingsIcon /> }
];
