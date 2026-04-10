"use client";

import { useEffect, useState } from "react";

type ResourceState<T> = {
  data: T;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T>>;
};

export function useBackendResource<T>(fallback: T, loader: () => Promise<T>): ResourceState<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");

    try {
      const next = await loader();
      setData(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data.");
      setData(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { data, loading, error, refresh, setData };
}
