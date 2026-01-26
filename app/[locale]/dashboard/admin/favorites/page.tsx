'use client';

import { useState } from 'react';
import { Heart, ArrowLeft, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useFavoriteAnalytics } from '@/features/admin';
import { StatsCard } from '@/features/admin/components/StatsCard';
import { TopItemsTable } from '@/features/admin/components/TopItemsTable';
import { TrendChart } from '@/features/admin/components/TrendChart';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import type { TopFavoritedItem } from '@/features/admin';

export default function AdminFavoritesPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [days, setDays] = useState(30);
  const { data, isLoading, error } = useFavoriteAnalytics({ days, limit: 10 });

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

  const topItemColumns = [
    {
      key: 'title',
      header: t('favorites.placeName'),
      render: (item: TopFavoritedItem) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-10 rounded-lg">
            <AvatarImage src={item.thumbnailUrl} alt={item.title} className="object-cover" />
            <AvatarFallback className="rounded-lg">
              <MapPin className="size-4" />
            </AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[250px] font-medium">{item.title}</span>
        </div>
      ),
    },
    {
      key: 'favoriteCount',
      header: t('favorites.favoriteCount'),
      render: (item: TopFavoritedItem) => (
        <div className="flex items-center gap-1.5">
          <Heart className="size-4 fill-red-500 text-red-500" />
          <span className="font-semibold">{item.favoriteCount.toLocaleString()}</span>
          <span className="text-muted-foreground">{t('common.users')}</span>
        </div>
      ),
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
            <h1 className="text-2xl font-bold">{t('favorites.title')}</h1>
            <p className="text-muted-foreground">{t('favorites.subtitle')}</p>
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
              title={t('favorites.totalFavorites')}
              value={data?.stats.totalFavorites ?? 0}
              description={t('common.items')}
              icon={Heart}
            />
            <StatsCard
              title={t('favorites.topPlaces')}
              value={data?.stats.byType?.place ?? data?.stats.totalFavorites ?? 0}
              description={t('common.items')}
              icon={MapPin}
            />
          </>
        )}
      </div>

      {/* Trend Chart */}
      <TrendChart
        title={t('favorites.favoriteTrend')}
        description={t('favorites.favoriteTrendDesc')}
        data={data?.favoriteTrend ?? []}
        isLoading={isLoading}
        color="hsl(var(--chart-3))"
      />

      {/* Top Items Table */}
      <TopItemsTable
        title={t('favorites.topPlaces')}
        description={t('favorites.topPlacesDesc')}
        data={data?.topItems ?? []}
        columns={topItemColumns}
        isLoading={isLoading}
        emptyMessage={t('favorites.noData')}
      />
    </div>
  );
}
