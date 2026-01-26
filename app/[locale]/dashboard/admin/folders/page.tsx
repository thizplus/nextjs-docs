'use client';

import { Folder, FolderOpen, Lock, Globe, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useFolderAnalytics } from '@/features/admin';
import { StatsCard } from '@/features/admin/components/StatsCard';
import { TopItemsTable } from '@/features/admin/components/TopItemsTable';
import { TrendChart } from '@/features/admin/components/TrendChart';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import type { TopFolderStats } from '@/features/admin';

export default function AdminFoldersPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const { data, isLoading, error } = useFolderAnalytics();

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

  const folderColumns = [
    { key: 'folderName', header: t('folders.folderName') },
    { key: 'ownerName', header: t('folders.owner') },
    {
      key: 'itemCount',
      header: t('folders.itemCount'),
      render: (item: TopFolderStats) => item.itemCount.toLocaleString(),
    },
    {
      key: 'isPublic',
      header: t('folders.status'),
      render: (item: TopFolderStats) => (
        <Badge variant={item.isPublic ? 'default' : 'secondary'}>
          {item.isPublic ? (
            <>
              <Globe className="mr-1 size-3" />
              {t('folders.public')}
            </>
          ) : (
            <>
              <Lock className="mr-1 size-3" />
              {t('folders.private')}
            </>
          )}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{t('folders.title')}</h1>
          <p className="text-muted-foreground">{t('folders.subtitle')}</p>
        </div>
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
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title={t('folders.totalFolders')}
              value={data?.stats.totalFolders ?? 0}
              icon={Folder}
            />
            <StatsCard
              title={t('folders.publicFolders')}
              value={data?.stats.publicFolders ?? 0}
              icon={Globe}
            />
            <StatsCard
              title={t('folders.privateFolders')}
              value={data?.stats.privateFolders ?? 0}
              icon={Lock}
            />
            <StatsCard
              title={t('folders.totalItems')}
              value={data?.stats.totalItems ?? 0}
              description={`${(data?.stats.avgItemsPerFolder ?? 0).toFixed(1)} ${t('common.avgPerFolder')}`}
              icon={FolderOpen}
            />
          </>
        )}
      </div>

      {/* Trend Chart */}
      <TrendChart
        title={t('folders.creationTrend')}
        description={t('folders.creationTrendDesc')}
        data={data?.creationTrend ?? []}
        isLoading={isLoading}
        color="hsl(var(--chart-2))"
      />

      {/* Top Folders Table */}
      <TopItemsTable
        title={t('folders.topFolders')}
        description={t('folders.topFoldersDesc')}
        data={data?.topFolders ?? []}
        columns={folderColumns}
        isLoading={isLoading}
        emptyMessage={t('folders.noData')}
      />
    </div>
  );
}
