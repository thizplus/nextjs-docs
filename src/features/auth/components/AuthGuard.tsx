"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useHasHydrated } from "../stores/authStore";
import { Skeleton } from "@/shared/components/ui/skeleton";

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

  // Show loading while hydrating
  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // If not authenticated after hydration, don't render children (redirect will happen)
  if (!token) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
