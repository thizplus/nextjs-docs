'use client';

import { Folder, FolderOpen, Lock, Globe, ArrowLeft } from 'lucide-react';
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
  const { data, isLoading, error } = useFolderAnalytics();

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

  const folderColumns = [
    { key: 'folderName', header: 'ชื่อโฟลเดอร์' },
    { key: 'ownerName', header: 'เจ้าของ' },
    {
      key: 'itemCount',
      header: 'รายการ',
      render: (item: TopFolderStats) => item.itemCount.toLocaleString(),
    },
    {
      key: 'isPublic',
      header: 'สถานะ',
      render: (item: TopFolderStats) => (
        <Badge variant={item.isPublic ? 'default' : 'secondary'}>
          {item.isPublic ? (
            <>
              <Globe className="mr-1 size-3" />
              สาธารณะ
            </>
          ) : (
            <>
              <Lock className="mr-1 size-3" />
              ส่วนตัว
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
          <h1 className="text-2xl font-bold">สถิติโฟลเดอร์</h1>
          <p className="text-muted-foreground">ภาพรวมโฟลเดอร์ที่ผู้ใช้สร้าง</p>
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
              title="โฟลเดอร์ทั้งหมด"
              value={data?.stats.totalFolders ?? 0}
              icon={Folder}
            />
            <StatsCard
              title="โฟลเดอร์สาธารณะ"
              value={data?.stats.publicFolders ?? 0}
              icon={Globe}
            />
            <StatsCard
              title="โฟลเดอร์ส่วนตัว"
              value={data?.stats.privateFolders ?? 0}
              icon={Lock}
            />
            <StatsCard
              title="รายการทั้งหมด"
              value={data?.stats.totalItems ?? 0}
              description={`เฉลี่ย ${(data?.stats.avgItemsPerFolder ?? 0).toFixed(1)} รายการ/โฟลเดอร์`}
              icon={FolderOpen}
            />
          </>
        )}
      </div>

      {/* Trend Chart */}
      <TrendChart
        title="แนวโน้มการสร้างโฟลเดอร์"
        description="จำนวนโฟลเดอร์ที่ถูกสร้างรายวัน 30 วันล่าสุด"
        data={data?.creationTrend ?? []}
        isLoading={isLoading}
        color="hsl(var(--chart-2))"
      />

      {/* Top Folders Table */}
      <TopItemsTable
        title="โฟลเดอร์ที่มีรายการมากที่สุด"
        description="Top 10 โฟลเดอร์ที่มีจำนวนรายการมากที่สุด"
        data={data?.topFolders ?? []}
        columns={folderColumns}
        isLoading={isLoading}
      />
    </div>
  );
}
