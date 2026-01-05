'use client';

import { formatDateTime } from '@/lib/utils';
import { OrderTimelineEvent } from '@/types/order';

interface OrderTimelineProps {
  timeline: OrderTimelineEvent[];
  className?: string;
}

export function OrderTimeline({ timeline, className }: OrderTimelineProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
      <div className="space-y-3">
        {timeline.map((event, idx) => (
          <div key={idx} className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{event.status.replace(/_/g, ' ').toUpperCase()}</p>
              <p className="text-sm text-gray-600">{formatDateTime(event.timestamp)}</p>
              {event.message && <p className="text-sm text-gray-500 mt-1">{event.message}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

