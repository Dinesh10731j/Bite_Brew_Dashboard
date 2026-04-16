"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { TrafficPoint } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function AreaChart({ data }: { data: TrafficPoint[] }) {
  return (
    <div className="h-64 w-full">
      <Line
        data={{
          labels: data.map((item) => item.label),
          datasets: [
            {
              label: "Revenue",
              data: data.map((item) => item.revenue ?? 0),
              borderColor: "#1a5a46",
              backgroundColor: "rgba(26, 90, 70, 0.25)",
              fill: true,
              tension: 0.35,
              pointRadius: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
}
