import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthGuard(redirectTo: string = '/auth/login') {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      // Store current path as redirect URL if it's not an auth page
      if (typeof window !== "undefined" && pathname) {
        if (
          !pathname.startsWith("/auth") &&
          !pathname.startsWith("/login") &&
          !pathname.startsWith("/register")
        ) {
          const redirectUrl = encodeURIComponent(pathname);
          router.push(`${redirectTo}?redirect=${redirectUrl}`);
        } else {
          router.push(redirectTo);
        }
      } else {
        router.push(redirectTo);
      }
    }
  }, [user, initialized, router, redirectTo, pathname]);

  return { user, isAuthenticated: !!user, isLoading: !initialized };
}

