"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new auth register page
    router.replace("/auth/register");
  }, [router]);

  return null;
}
