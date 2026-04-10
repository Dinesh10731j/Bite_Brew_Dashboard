import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Java Brew & Bites Dashboard",
  description: "Cafe dashboard for analytics, orders, and operations."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
