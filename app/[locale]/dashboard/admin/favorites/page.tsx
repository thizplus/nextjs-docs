'use client';

import { useState } from 'react';
import { Heart, ArrowLeft, MapPin } from 'lucide-react';
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
  const [days, setDays] = useState(30);
  // ตอนนี้รองรับแค่ place เท่านั้น
  const { data, isLoading, error } = useFavoriteAnalytics({ days, limit: 10 });

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">เกิดข้อผิดพลาด</h2>
          <p className="text-muted-foreground">ไม่สามารถโหลดข้อมูลได้</p>
        </div>
      </div>
    );
  }

  const topItemColumns = [
    {
      key: 'title',
      header: 'สถานที่',
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
      header: 'จำนวน Favorites',
      render: (item: TopFavoritedItem) => (
        <div className="flex items-center gap-1.5">
          <Heart className="size-4 fill-red-500 text-red-500" />
          <span className="font-semibold">{item.favoriteCount.toLocaleString()}</span>
          <span className="text-muted-foreground">คน</span>
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
            <h1 className="text-2xl font-bold">สถิติรายการโปรด</h1>
            <p className="text-muted-foreground">สถานที่ที่ผู้ใช้บันทึกเป็น Favorites</p>
          </div>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 วัน</SelectItem>
            <SelectItem value="30">30 วัน</SelectItem>
            <SelectItem value="90">90 วัน</SelectItem>
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
              title="สถานที่โปรดทั้งหมด"
              value={data?.stats.totalFavorites ?? 0}
              description="จำนวนสถานที่ที่ถูกบันทึกเป็น Favorites"
              icon={Heart}
            />
            <StatsCard
              title="สถานที่"
              value={data?.stats.byType?.place ?? data?.stats.totalFavorites ?? 0}
              description="รองรับเฉพาะสถานที่ในตอนนี้"
              icon={MapPin}
            />
          </>
        )}
      </div>

      {/* Trend Chart */}
      <TrendChart
        title="แนวโน้มการบันทึกสถานที่โปรด"
        description={`จำนวน Favorites รายวัน ${days} วันล่าสุด`}
        data={data?.favoriteTrend ?? []}
        isLoading={isLoading}
        color="hsl(var(--chart-3))"
      />

      {/* Top Items Table */}
      <TopItemsTable
        title="สถานที่ยอดนิยม"
        description="Top 10 สถานที่ที่ผู้ใช้บันทึกเป็น Favorites มากที่สุด"
        data={data?.topItems ?? []}
        columns={topItemColumns}
        isLoading={isLoading}
        emptyMessage="ยังไม่มีสถานที่ที่ถูกบันทึกเป็น Favorites"
      />
    </div>
  );
}
