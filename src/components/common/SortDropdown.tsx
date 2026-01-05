'use client';

import { Select } from '@/components/ui/Select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: readonly SortOption[] | SortOption[];
  value: string;
  paramName?: string;
  className?: string;
}

export function SortDropdown({ options, value, paramName = 'sortBy', className }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, e.target.value);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router, paramName]
  );

  return (
    <Select options={[...options]} value={value} onChange={handleSortChange} className={className} />
  );
}

