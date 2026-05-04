"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";

type MutationOptions<TData, TResult> = {
  optimisticData?: TData | ((current: TData) => TData);
  rollbackOnError?: boolean;
  onSuccess?: (result: TResult, current: TData) => TData | void;
  onError?: (error: Error) => void;
};

type UseBackendResourceOptions<TData> = {
  fallback: TData;
  loader: () => Promise<TData>;
  enabled?: boolean;
  resetOnError?: boolean;
};

type ResourceState<TData> = {
  data: TData;
  loading: boolean;
  error: string;
  refreshing: boolean;
  mutating: boolean;
  mutationError: string;
  refresh: () => Promise<void>;
  setData: Dispatch<SetStateAction<TData>>;
  runMutation: <TResult>(action: () => Promise<TResult>, options?: MutationOptions<TData, TResult>) => Promise<TResult>;
  clearError: () => void;
};

export function useBackendResource<TData>({
  fallback,
  loader,
  enabled = true,
  resetOnError = false,
}: UseBackendResourceOptions<TData>): ResourceState<TData> {
  const [data, setData] = useState<TData>(fallback);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [mutating, setMutating] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const mountedRef = useRef(true);
  const initialLoadRef = useRef(true);
  const loaderRef = useRef(loader);
  const fallbackRef = useRef(fallback);
  const pathname = usePathname();

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    fallbackRef.current = fallback;
  }, [fallback]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled) return;

    const isFirstLoad = initialLoadRef.current;
    if (!isFirstLoad) {
      setRefreshing(true);
    }
    setError("");

    try {
      const next = await loaderRef.current();
      if (!mountedRef.current) return;
      setData(next);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : "Unable to load data.");
      if (resetOnError) {
        setData(fallbackRef.current);
      }
    } finally {
      initialLoadRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [enabled, resetOnError]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [enabled, pathname, refresh]);

  const runMutation = useCallback(
    async <TResult>(action: () => Promise<TResult>, options: MutationOptions<TData, TResult> = {}) => {
      const previous = data;
      const shouldRollback = options.rollbackOnError ?? true;
      const optimisticData = options.optimisticData;

      if (optimisticData !== undefined) {
        setData((current) =>
          typeof optimisticData === "function"
            ? (optimisticData as (value: TData) => TData)(current)
            : (optimisticData as TData)
        );
      }

      setMutating(true);
      setMutationError("");

      try {
        const result = await action();
        if (options.onSuccess) {
          setData((current) => {
            const next = options.onSuccess?.(result, current);
            return next === undefined ? current : next;
          });
        }
        return result;
      } catch (err) {
        const parsedError = err instanceof Error ? err : new Error("Request failed");
        setMutationError(parsedError.message);
        options.onError?.(parsedError);

        if (shouldRollback && optimisticData !== undefined) {
          setData(previous);
        }
        throw parsedError;
      } finally {
        if (mountedRef.current) {
          setMutating(false);
        }
      }
    },
    [data]
  );

  const clearError = useCallback(() => {
    setError("");
    setMutationError("");
  }, []);

  return {
    data,
    loading,
    refreshing,
    error,
    mutating,
    mutationError,
    refresh,
    setData,
    runMutation,
    clearError,
  };
}
