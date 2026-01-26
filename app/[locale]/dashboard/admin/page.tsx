'use client';

import { Users, Heart, Folder, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAdminDashboard } from '@/features/admin';
import { StatsCard } from '@/features/admin/components/StatsCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const { data: stats, isLoading, error } = useAdminDashboard();

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">{tCommon('error')}</h2>
          <p className="text-muted-foreground">{tCommon('loadError')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('overview.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-1 h-3 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title={t('overview.totalUsers')}
              value={stats?.totalUsers ?? 0}
              description={`${stats?.activeUsers ?? 0} ${t('overview.users')} (7 ${t('pages.last7days').split(' ')[0]})`}
              icon={Users}
            />
            <StatsCard
              title={t('overview.totalFavorites')}
              value={stats?.totalFavorites ?? 0}
              description={t('common.items')}
              icon={Heart}
            />
            <StatsCard
              title={t('overview.totalFolders')}
              value={stats?.totalFolders ?? 0}
              description={t('common.folders')}
              icon={Folder}
            />
            <StatsCard
              title={t('overview.totalPageViews')}
              value={stats?.totalPageViews ?? 0}
              description={t('common.views')}
              icon={Eye}
            />
          </>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('pages.title')}</CardTitle>
            <CardDescription>{t('pages.topPagesDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/pages">
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 size-4" />
                {tCommon('seeMore')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('folders.title')}</CardTitle>
            <CardDescription>{t('folders.topFoldersDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/folders">
              <Button variant="outline" className="w-full">
                <Folder className="mr-2 size-4" />
                {tCommon('seeMore')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('favorites.title')}</CardTitle>
            <CardDescription>{t('favorites.topPlacesDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/favorites">
              <Button variant="outline" className="w-full">
                <Heart className="mr-2 size-4" />
                {tCommon('seeMore')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
