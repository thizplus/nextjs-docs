'use client';

import { useState } from 'react';
import { Eye, Search, ArrowLeft } from 'lucide-react';
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
  const [days, setDays] = useState(30);
  const { data, isLoading, error } = usePageAnalytics({ days, limit: 10 });

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

  const pageColumns = [
    { key: 'pageName', header: 'หน้า' },
    {
      key: 'viewCount',
      header: 'เข้าชม',
      render: (item: PageViewStats) => item.viewCount.toLocaleString(),
    },
    {
      key: 'uniqueUsers',
      header: 'Unique Users',
      render: (item: PageViewStats) => item.uniqueUsers.toLocaleString(),
    },
  ];

  const searchColumns = [
    { key: 'query', header: 'คำค้นหา' },
    {
      key: 'searchType',
      header: 'ประเภท',
      render: (item: PopularSearchStats) => <TypeBadge type={item.searchType} />,
    },
    {
      key: 'count',
      header: 'จำนวน',
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
            <h1 className="text-2xl font-bold">สถิติหน้า</h1>
            <p className="text-muted-foreground">วิเคราะห์การเข้าชมหน้าและการค้นหา</p>
          </div>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[140px]">
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
              title="Page Views"
              value={data?.totalViews ?? 0}
              description={`การเข้าชม ${days} วันล่าสุด`}
              icon={Eye}
            />
            <StatsCard
              title="การค้นหา"
              value={data?.totalSearches ?? 0}
              description={`การค้นหา ${days} วันล่าสุด`}
              icon={Search}
            />
          </>
        )}
      </div>

      {/* Trend Chart */}
      <TrendChart
        title="แนวโน้มการเข้าชม"
        description={`จำนวนการเข้าชมหน้ารายวัน ${days} วันล่าสุด`}
        data={data?.viewTrend ?? []}
        isLoading={isLoading}
      />

      {/* Tables */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TopItemsTable
          title="หน้ายอดนิยม"
          description="หน้าที่มีการเข้าชมมากที่สุด"
          data={data?.topPages ?? []}
          columns={pageColumns}
          isLoading={isLoading}
        />
        <TopItemsTable
          title="คำค้นหายอดนิยม"
          description="คำค้นหาที่ผู้ใช้ค้นหาบ่อย"
          data={data?.popularSearches ?? []}
          columns={searchColumns}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
