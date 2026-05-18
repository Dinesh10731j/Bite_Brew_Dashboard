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
import type { TrafficPoint } from "@/lib/shared";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function LineChart({ data, heightClass = "h-64" }: { data: TrafficPoint[]; heightClass?: string }) {
  const labels = data.map((item) => item.label);
  const visitors = data.map((item) => item.visitors ?? 0);

  return (
    <div className={`${heightClass} w-full`}>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Visitors",
              data: visitors,
              borderColor: "#207659",
              backgroundColor: "rgba(32, 118, 89, 0.2)",
              fill: true,
              tension: 0.35,
              pointRadius: 3,
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
