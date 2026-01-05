'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
  variant?: 'default' | 'card' | 'minimal';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const content = (
    <div className={cn('text-center py-12', variant === 'minimal' && 'py-6')}>
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h2 className={cn('font-bold mb-2', variant === 'minimal' ? 'text-xl' : 'text-2xl')}>{title}</h2>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {action && (
        <div>
          {action.href ? (
            <a href={action.href}>
              <Button>{action.label}</Button>
            </a>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <div className={cn('px-4 sm:px-6 lg:px-8 py-8', className)}>
        <Card>{content}</Card>
      </div>
    );
  }

  return (
    <div className={cn('px-4 sm:px-6 lg:px-8 py-8', className)}>
      {content}
    </div>
  );
}

