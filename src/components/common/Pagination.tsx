'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  showInfo = false,
  totalItems,
  itemsPerPage = 20,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || totalPages * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else if (baseUrl) {
      const url = new URL(baseUrl, window.location.origin);
      url.searchParams.set('page', page.toString());
      window.location.href = url.toString();
    }
  };

  const renderPageButton = (page: number) => {
    const isActive = page === currentPage;
    const content = (
      <button
        onClick={() => handlePageChange(page)}
        className={cn(
          'px-4 py-2 rounded transition-colors',
          isActive
            ? 'bg-primary text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        )}
        disabled={isActive}
      >
        {page}
      </button>
    );

    if (baseUrl && !onPageChange) {
      const url = new URL(baseUrl, window.location.origin);
      url.searchParams.set('page', page.toString());
      return (
        <Link key={page} href={url.toString()}>
          {content}
        </Link>
      );
    }

    return <span key={page}>{content}</span>;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className={cn('flex items-center justify-between border-t pt-4', className)}>
      {showInfo && totalItems && (
        <div className="text-sm text-gray-700">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </Button>

        <div className="flex space-x-2">
          {getVisiblePages().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 py-2 text-gray-500">
                  ...
                </span>
              );
            }
            return renderPageButton(page as number);
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

