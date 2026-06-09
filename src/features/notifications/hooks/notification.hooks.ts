import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/endpoints";
import type { Notification, UseNotificationsReturn } from "../types/notification.types";

const NOTIFICATION_KEY = ["notifications"] as const;

// ── Fetch
async function fetchNotifications(): Promise<Notification[]> {
  const res = await api.post<{ data: { response: Notification[] } }>(
    API_ENDPOINTS.USER_NOTIFICATION.GET_NOTIFICATION
  );
  return res.data?.data?.response ?? [];
}

// ── Mark as read
async function markNotificationRead(notification_id: string | number | "all") {
  await api.post(API_ENDPOINTS.USER_NOTIFICATION.READ_NOTIFICATION, { notification_id });
}

// ── Hook
export function useNotifications(
  refetchInterval = 1500000 // 15s — same as old code
): UseNotificationsReturn {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: NOTIFICATION_KEY,
    queryFn: fetchNotifications,
    refetchInterval, // auto-poll — replaces setInterval
    staleTime: 0, // always fresh
  });

  const unreadCount = notifications.filter(
    (n) => n.read_status === "0" || n.read_status === 0
  ).length;

  // ── Mark single or all as read
  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEY });
      const prev = queryClient.getQueryData<Notification[]>(NOTIFICATION_KEY) ?? [];

      queryClient.setQueryData<Notification[]>(NOTIFICATION_KEY, (old = []) =>
        old.map((n) => (id === "all" || n.id === id ? { ...n, read_status: "1" as const } : n))
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      // Rollback on error
      if (ctx?.prev) queryClient.setQueryData(NOTIFICATION_KEY, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEY });
    },
  });

  return { notifications, unreadCount, isLoading, markAsRead };
}
