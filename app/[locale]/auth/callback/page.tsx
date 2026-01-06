"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginWithOAuth = useAuthStore((state) => state.loginWithOAuth);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setStatus('error');
        setError(decodeURIComponent(errorParam));
        return;
      }

      if (!token) {
        setStatus('error');
        setError('ไม่พบ Token สำหรับเข้าสู่ระบบ');
        return;
      }

      try {
        await loginWithOAuth(token);
        setStatus('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    };

    handleCallback();
  }, [searchParams, loginWithOAuth, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      {/* Loading */}
      {status === 'loading' && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">กำลังเข้าสู่ระบบ...</p>
        </>
      )}

      {/* Success */}
      {status === 'success' && (
        <>
          <CheckCircle2 className="h-10 w-10 text-green-500" />
          <p className="text-muted-foreground">เข้าสู่ระบบสำเร็จ</p>
        </>
      )}

      {/* Error */}
      {status === 'error' && (
        <>
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
            กลับไปหน้าเข้าสู่ระบบ
          </Button>
        </>
      )}
    </div>
  );
}

function AuthCallbackFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">กำลังเข้าสู่ระบบ...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<AuthCallbackFallback />}>
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
