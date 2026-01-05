import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const ADMIN_ROLES = ['super_admin', 'admin', 'staff'] as const;

export function useAdminGuard(redirectTo: string = '/login') {
  const router = useRouter();
  const { user, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) return;

    if (!user || !ADMIN_ROLES.includes(user.role as any)) {
      router.push(redirectTo);
    }
  }, [user, initialized, router, redirectTo]);

  const isAdmin = user ? ADMIN_ROLES.includes(user.role as any) : false;

  return { user, isAdmin, isLoading: !initialized };
}

