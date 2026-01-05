'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminProducts, useDeleteProduct } from '@/services/queries/adminQueries';
import { formatCurrency } from '@/lib/utils';
import { Button, Input, Badge } from '@/components/ui';
import { useToast } from '@/components/ui/ToastProvider';
import { PageShell, LoadingState, Pagination } from '@/components/common';
import { DataTable } from '@/components/features/admin/DataTable';
import type { Column } from '@/components/features/admin/DataTable';
import { Product } from '@/types/product';
import { useDebouncedValue } from '@/hooks';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, isLoading } = useAdminProducts(page, 20, debouncedSearch);
  const deleteProduct = useDeleteProduct();
  const { showToast } = useToast();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(id, {
        onSuccess: () => {
          showToast('Product deleted successfully', 'success');
        },
      });
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      render: (product) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">{product.category}</div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (product) => <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (product) => <div className="text-sm text-gray-900">{product.stock}</div>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (product) => (
        <Badge variant={product.isActive ? 'success' : 'default'}>
          {product.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product) => (
        <div className="space-x-2">
          <Link href={`/admin/products/${product.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Products"
      headerActions={
        <Link href="/admin/products/new">
          <Button>Add New Product</Button>
        </Link>
      }
    >
      <div className="mb-6">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products found"
        keyExtractor={(product) => product.id}
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

