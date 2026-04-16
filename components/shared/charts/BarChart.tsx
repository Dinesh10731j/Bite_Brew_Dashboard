"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function BarChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-64 w-full">
      <Bar
        data={{
          labels: data.map((item) => item.label),
          datasets: [
            {
              label: "Value",
              data: data.map((item) => item.value),
              backgroundColor: "rgba(32, 118, 89, 0.75)",
              borderRadius: 8,
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
