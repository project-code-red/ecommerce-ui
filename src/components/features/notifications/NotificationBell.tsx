"use client";

import { Bell } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { notifications } from "@/mock/notifications";

export function NotificationBell() {
  const { notificationDrawerOpen, openNotificationDrawer, closeNotificationDrawer } = useUIStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => (notificationDrawerOpen ? closeNotificationDrawer() : openNotificationDrawer())}
        className="relative p-2 hover:bg-gray-800 rounded"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

