"use client";

import Link from "next/link";
import { notifications } from "@/mock/notifications";
import { formatDateTime } from "@/lib/utils";

export function NotificationList() {
  return (
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
      </div>
      <div className="divide-y">
        {notifications.map((notif) => (
          <Link
            key={notif.id}
            href={notif.link || "#"}
            className="block p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${notif.read ? "bg-gray-300" : "bg-primary"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(notif.createdAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

