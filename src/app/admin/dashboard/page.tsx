"use client";

import { useAdminStats } from "@/services/queries/adminQueries";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold">{stats?.pendingOrders || 0}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Products</h3>
          <p className="text-3xl font-bold">{stats?.activeProducts || 0}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </Card>
      </div>
    </div>
  );
}

