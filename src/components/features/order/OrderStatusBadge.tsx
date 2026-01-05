'use client';

import { Badge } from '@/components/ui/Badge';
import { ORDER_STATUS_COLORS } from '@/lib/constants';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const variant = ORDER_STATUS_COLORS[status] || 'default';
  const displayText = status.replace(/_/g, ' ').toUpperCase();

  return (
    <Badge variant={variant} className={className}>
      {displayText}
    </Badge>
  );
}

