'use client';

import { useOrders } from '@/services/queries/orderQueries';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/features/order/OrderStatusBadge';
import { PageShell, LoadingState, EmptyState } from '@/components/common';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-16 w-16 text-gray-400" />}
        title="No orders yet"
        description="Start shopping to see your orders here"
        action={{
          label: 'Start Shopping',
          href: '/products',
        }}
      />
    );
  }

  return (
    <PageShell title="My Orders">
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/user/orders/${order.id}`}
            className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

