"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect to new auth login page with any query params preserved
    const redirect = searchParams.get("redirect");
    const newUrl = redirect
      ? `/auth/login?redirect=${encodeURIComponent(redirect)}`
      : "/auth/login";
    router.replace(newUrl);
  }, [router, searchParams]);

  return null;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginRedirect />
    </Suspense>
  );
}
