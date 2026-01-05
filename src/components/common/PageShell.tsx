'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export function PageShell({
  title,
  subtitle,
  children,
  className,
  headerActions,
  maxWidth = '7xl',
}: PageShellProps) {
  return (
    <div className={cn('px-4 sm:px-6 lg:px-8 py-8', maxWidthClasses[maxWidth], className)}>
      {(title || headerActions) && (
        <div className="flex items-center justify-between mb-8">
          <div>
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

