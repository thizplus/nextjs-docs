'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';

interface FeatureGateProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
}

export function FeatureGate({ children, feature, fallback }: FeatureGateProps) {
  const { isAuthenticated, hasHydrated } = useAuth();

  // Show loading state while hydrating
  if (!hasHydrated) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg animate-pulse">
        <div className="w-12 h-12 bg-muted rounded-full mb-4" />
        <div className="w-32 h-4 bg-muted rounded mb-2" />
        <div className="w-48 h-4 bg-muted rounded" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Custom fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback - login prompt
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
      <Lock className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">
        ต้องเข้าสู่ระบบ
      </h3>
      <p className="text-muted-foreground text-center mb-4">
        กรุณาเข้าสู่ระบบเพื่อใช้งาน{feature}
      </p>
      <Link href="/login">
        <Button>เข้าสู่ระบบ</Button>
      </Link>
    </div>
  );
}
