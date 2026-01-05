'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminOrders } from '@/services/queries/adminQueries';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/features/order/OrderStatusBadge';
import { Select, Button } from '@/components/ui';
import { PageShell, LoadingState, Pagination } from '@/components/common';
import { DataTable } from '@/components/features/admin/DataTable';
import type { Column } from '@/components/features/admin/DataTable';
import { Order, OrderStatus } from '@/types/order';
import { ORDER_STATUS_OPTIONS } from '@/lib/constants';

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const { data, isLoading } = useAdminOrders(page, 20, statusFilter || undefined);

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order) => (
        <Link
          href={`/admin/orders/${order.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          #{order.id}
        </Link>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order) => (
        <div>
          <div className="text-sm text-gray-900">{order.address.name}</div>
          <div className="text-sm text-gray-500">{order.userId}</div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (order) => <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>,
    },
    {
      key: 'items',
      header: 'Items',
      render: (order) => <div className="text-sm text-gray-900">{order.items.length} item(s)</div>,
    },
    {
      key: 'total',
      header: 'Total',
      render: (order) => (
        <div className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => <OrderStatusBadge status={order.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order) => (
        <Link
          href={`/admin/orders/${order.id}`}
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          View
        </Link>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <PageShell
      title="Orders"
      headerActions={
        <Select
          options={ORDER_STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as OrderStatus | '');
            setPage(1);
          }}
          className="w-48"
        />
      }
    >
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No orders found"
        keyExtractor={(order) => order.id}
      />
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
          showInfo
          totalItems={data.total}
          itemsPerPage={20}
          className="mt-6"
        />
      )}
    </PageShell>
  );
}

