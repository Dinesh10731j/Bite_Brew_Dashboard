import { trafficSummary, topLocations } from "@/lib/mock-data";

export function useAnalytics() {
  return {
    traffic: trafficSummary,
    countryStats: [
      { label: "Nepal", value: 62 },
      { label: "India", value: 24 },
      { label: "Others", value: 14 }
    ],
    cityStats: topLocations
  };
}
