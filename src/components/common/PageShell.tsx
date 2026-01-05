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
    <div className={cn(
      'px-4 sm:px-6 lg:px-8',
      'py-4 sm:py-6 lg:py-8',
      maxWidthClasses[maxWidth],
      'mx-auto w-full',
      className
    )}>
      {(title || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            {title && (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex-shrink-0 w-full sm:w-auto">
              {headerActions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

