'use client';

import React, { ReactNode } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data available',
  onRowClick,
  keyExtractor,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} variant="minimal" />;
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-sm overflow-hidden', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

