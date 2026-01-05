"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useHasHydrated } from "../stores/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (hasHydrated && !token) {
      router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  // Always render children - let the layout handle loading state
  // This prevents sidebar from disappearing during hydration
  // If not authenticated after hydration, redirect will happen via useEffect
  return <>{children}</>;
}
