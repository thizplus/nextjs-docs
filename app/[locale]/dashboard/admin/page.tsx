'use client';

import { Users, Heart, Folder, Eye, TrendingUp } from 'lucide-react';
import { useAdminDashboard } from '@/features/admin';
import { StatsCard } from '@/features/admin/components/StatsCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useAdminDashboard();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">ภาพรวมสถิติการใช้งานระบบ</p>
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
              title="ผู้ใช้ทั้งหมด"
              value={stats?.totalUsers ?? 0}
              description={`${stats?.activeUsers ?? 0} คนใช้งาน 7 วันล่าสุด`}
              icon={Users}
            />
            <StatsCard
              title="รายการโปรดทั้งหมด"
              value={stats?.totalFavorites ?? 0}
              description="Favorites ที่ถูกบันทึก"
              icon={Heart}
            />
            <StatsCard
              title="โฟลเดอร์ทั้งหมด"
              value={stats?.totalFolders ?? 0}
              description="Folders ที่ถูกสร้าง"
              icon={Folder}
            />
            <StatsCard
              title="Page Views (90 วัน)"
              value={stats?.totalPageViews ?? 0}
              description="การเข้าชมหน้าทั้งหมด"
              icon={Eye}
            />
          </>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">สถิติหน้า</CardTitle>
            <CardDescription>หน้าที่ผู้ใช้เข้าชมบ่อยที่สุด</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/pages">
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 size-4" />
                ดูรายละเอียด
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">สถิติโฟลเดอร์</CardTitle>
            <CardDescription>โฟลเดอร์ที่ผู้ใช้สร้าง</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/folders">
              <Button variant="outline" className="w-full">
                <Folder className="mr-2 size-4" />
                ดูรายละเอียด
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">สถิติรายการโปรด</CardTitle>
            <CardDescription>รายการที่ถูก Favorite มากที่สุด</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin/favorites">
              <Button variant="outline" className="w-full">
                <Heart className="mr-2 size-4" />
                ดูรายละเอียด
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
