'use client';

import { useState } from 'react';
import { Eye, Search, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePageAnalytics } from '@/features/admin';
import { StatsCard } from '@/features/admin/components/StatsCard';
import { TopItemsTable, TypeBadge } from '@/features/admin/components/TopItemsTable';
import { TrendChart } from '@/features/admin/components/TrendChart';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import type { PageViewStats, PopularSearchStats } from '@/features/admin';

export default function AdminPagesPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [days, setDays] = useState(30);
  const { data, isLoading, error } = usePageAnalytics({ days, limit: 10 });

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

  const pageColumns = [
    { key: 'pageName', header: t('pages.pageName') },
    {
      key: 'viewCount',
      header: t('pages.viewCount'),
      render: (item: PageViewStats) => item.viewCount.toLocaleString(),
    },
    {
      key: 'uniqueUsers',
      header: t('pages.uniqueUsers'),
      render: (item: PageViewStats) => item.uniqueUsers.toLocaleString(),
    },
  ];

  const searchColumns = [
    { key: 'query', header: t('pages.query') },
    {
      key: 'searchType',
      header: t('pages.searchType'),
      render: (item: PopularSearchStats) => <TypeBadge type={item.searchType} />,
    },
    {
      key: 'count',
      header: t('pages.searchCount'),
      render: (item: PopularSearchStats) => item.count.toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{t('pages.title')}</h1>
            <p className="text-muted-foreground">{t('pages.subtitle')}</p>
          </div>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{t('pages.last7days')}</SelectItem>
            <SelectItem value="30">{t('pages.last30days')}</SelectItem>
            <SelectItem value="90">{t('pages.last90days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
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
              title={t('pages.totalViews')}
              value={data?.totalViews ?? 0}
              description={`${days} ${t('pages.period').toLowerCase()}`}
              icon={Eye}
            />
            <StatsCard
              title={t('pages.totalSearches')}
              value={data?.totalSearches ?? 0}
              description={`${days} ${t('pages.period').toLowerCase()}`}
              icon={Search}
            />
          </>
        )}
      </div>

      {/* Trend Chart */}
      <TrendChart
        title={t('pages.pageViewTrend')}
        description={`${days} ${t('pages.period').toLowerCase()}`}
        data={data?.viewTrend ?? []}
        isLoading={isLoading}
      />

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TopItemsTable
          title={t('pages.topPages')}
          description={t('pages.topPagesDesc')}
          data={data?.topPages ?? []}
          columns={pageColumns}
          isLoading={isLoading}
          emptyMessage={t('pages.noData')}
        />
        <TopItemsTable
          title={t('pages.popularSearches')}
          description={t('pages.popularSearchesDesc')}
          data={data?.popularSearches ?? []}
          columns={searchColumns}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
