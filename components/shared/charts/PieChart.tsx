"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  return (
    <div className="mx-auto h-64 w-full max-w-xs">
      <Doughnut
        data={{
          labels: data.map((item) => item.label),
          datasets: [
            {
              data: data.map((item) => item.value),
              backgroundColor: data.map((item) => item.color),
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
      />
    </div>
  );
}
