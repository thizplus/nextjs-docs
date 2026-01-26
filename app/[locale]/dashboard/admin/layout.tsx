'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useUser } from '@/features/auth';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const user = useUser();
  const t = useTranslations('admin');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-lg font-semibold">{t('accessDenied.title')}</h2>
          <p className="text-muted-foreground">{t('accessDenied.message')}</p>
          <Link href="/dashboard">
            <Button>{t('accessDenied.backToHome')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
