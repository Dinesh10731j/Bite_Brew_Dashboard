"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/services/api/http";

const REALTIME_EVENT = "bite-brew:realtime-update";
const REALTIME_URL =
  process.env.NEXT_PUBLIC_BITE_BREW_REALTIME_URL ??
  API_BASE_URL.replace(/\/api\/v1\/bite-brew\/?$/, "");

type RealtimePayload = {
  resource?: string;
  action?: string;
  data?: unknown;
};

const eventResources: Record<string, string[]> = {
  "dashboard:updated": ["dashboard", "orders", "messages", "notifications"],
  "order:created": ["dashboard", "orders", "reports", "analytics", "notifications"],
  "order:updated": ["dashboard", "orders", "reports", "analytics", "notifications"],
  "order:status": ["dashboard", "orders", "reports", "analytics", "notifications"],
  "message:created": ["dashboard", "messages", "notifications"],
  "message:updated": ["dashboard", "messages"],
  "notification:created": ["dashboard", "notifications"],
  "notification:updated": ["dashboard", "notifications"],
  "menu:updated": ["dashboard", "menu", "reports"],
  "gallery:updated": ["gallery"],
  "newsletter:updated": ["newsletter"],
  "analytics:updated": ["dashboard", "analytics", "reports"],
};

function queryKeysForResource(resource: string) {
  switch (resource) {
    case "orders":
      return [["orders"]];
    case "messages":
      return [["messages"]];
    case "notifications":
      return [["notifications"]];
    case "menu":
      return [["menu-categories"], ["menu-items"]];
    case "gallery":
      return [["gallery"]];
    case "newsletter":
      return [["newsletter-subscribers"]];
    case "users":
      return [["users"]];
    default:
      return [];
  }
}

function dispatchRealtime(resources: string[], payload: RealtimePayload) {
  window.dispatchEvent(
    new CustomEvent(REALTIME_EVENT, {
      detail: {
        ...payload,
        resources,
      },
    })
  );
}

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!REALTIME_URL) return;

    let socket: Socket | null = io(REALTIME_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    const handleEvent = (eventName: string, payload: RealtimePayload = {}) => {
      const resources = eventResources[eventName] ?? (payload.resource ? [payload.resource] : ["dashboard"]);

      for (const resource of resources) {
        for (const queryKey of queryKeysForResource(resource)) {
          void queryClient.invalidateQueries({ queryKey });
        }
      }

      dispatchRealtime(resources, { ...payload, action: payload.action ?? eventName });
    };

    Object.keys(eventResources).forEach((eventName) => {
      socket?.on(eventName, (payload) => handleEvent(eventName, payload));
    });

    socket.on("resource:changed", (payload: RealtimePayload) => {
      handleEvent(`${payload.resource}:updated`, payload);
    });

    return () => {
      socket?.removeAllListeners();
      socket?.disconnect();
      socket = null;
    };
  }, [queryClient]);
}

export function useRealtimeResourceRefresh(resources: string[], refresh: () => Promise<void>) {
  useEffect(() => {
    const resourceSet = new Set(resources);
    const onRealtimeUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ resources?: string[] }>).detail;
      const changed = detail?.resources ?? [];
      if (changed.some((resource) => resourceSet.has(resource))) {
        void refresh();
      }
    };

    window.addEventListener(REALTIME_EVENT, onRealtimeUpdate);
    return () => window.removeEventListener(REALTIME_EVENT, onRealtimeUpdate);
  }, [refresh, resources.join("|")]);
}
