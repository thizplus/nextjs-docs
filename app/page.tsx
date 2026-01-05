'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/shared/components/layouts';
import { SearchBar } from '@/features/search';
import { PlaceCard, usePlaceSearch } from '@/features/places';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { useAuth } from '@/shared/hooks';
import {
  MapPin,
  Sparkles,
  AlertCircle,
  X,
  Heart,
  Folder,
  ChevronRight,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, isGuest } = useAuth();
  const isSearching = searchQuery.trim().length > 0;

  // Only call API when user is searching
  const { data: placesData, isLoading, error } = usePlaceSearch(
    {
      q: searchQuery,
      pageSize: 12,
    },
    isSearching // Only enable when searching
  );

  const places = placesData?.results || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                ค้นหาสถานที่ท่องเที่ยว
              </h1>
              <p className="text-lg text-muted-foreground">
                ระบบค้นหาข้อมูลท่องเที่ยวอัจฉริยะ สำหรับมัคคุเทศก์และนักท่องเที่ยว
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar
                  initialQuery={searchQuery}
                  placeholder="พิมพ์ชื่อจังหวัด/สถานที่ที่ต้องการค้นหา..."
                  onSearch={handleSearch}
                />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard/ai">
                      <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Mode
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        เข้าสู่ระบบใช้ AI
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Guest Banner */}
        {isGuest && (
          <section className="bg-primary/5 border-y">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">เข้าสู่ระบบเพื่อใช้งานเต็มรูปแบบ</p>
                    <p className="text-sm text-muted-foreground">
                      ค้นหาไม่จำกัด, AI สรุปข้อมูล, บันทึกรายการโปรด
                    </p>
                  </div>
                </div>
                <Link href="/login">
                  <Button size="sm">
                    เข้าสู่ระบบ
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Search Results - Only show when searching */}
        {isSearching && (
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    ผลการค้นหา &quot;{searchQuery}&quot;
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {isLoading ? 'กำลังค้นหา...' : `พบ ${places.length} สถานที่`}
                  </p>
                </div>
                <Button variant="ghost" onClick={clearSearch} className="gap-2">
                  <X className="h-4 w-4" />
                  ล้างการค้นหา
                </Button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error instanceof Error
                      ? error.message
                      : 'เกิดข้อผิดพลาดในการโหลดข้อมูล'}
                  </AlertDescription>
                </Alert>
              )}

              {/* Places Grid */}
              {!isLoading && !error && places.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {places.map((place) => (
                    <PlaceCard key={place.placeId} place={place} showDistance={false} />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && places.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    ไม่พบสถานที่สำหรับ &quot;{searchQuery}&quot;
                  </p>
                  <Button variant="outline" onClick={clearSearch} className="mt-4">
                    ล้างการค้นหา
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Quick Search Tags - Show when not searching */}
        {!isSearching && (
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4 space-y-4">
              <h2 className="text-xl font-bold">ค้นหาด่วน</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'ตลาดจตุจักร',
                  'วัดพระแก้ว',
                  'สวนลุมพินี',
                  'ไอคอนสยาม',
                  'วัดอรุณ',
                  'เจ้าพระยา',
                  'ตลาดน้ำ',
                  'อยุธยา',
                  'เชียงใหม่',
                  'ภูเก็ต',
                ].map((place) => (
                  <Button
                    key={place}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleSearch(place)}
                  >
                    <Search className="h-3 w-3 mr-1" />
                    {place}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section (Login Required) */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">ฟีเจอร์สำหรับสมาชิก</h2>
              <p className="text-muted-foreground mt-2">
                เข้าสู่ระบบเพื่อใช้งานฟีเจอร์ขั้นสูง
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Search */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI สรุปข้อมูล</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  ให้ AI ช่วยสรุปข้อมูลสถานที่ท่องเที่ยว แนะนำเส้นทาง
                  และตอบคำถามเกี่ยวกับการท่องเที่ยว
                </p>
                {isAuthenticated ? (
                  <Link href="/dashboard/ai">
                    <Button size="sm">ใช้งาน AI</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      เข้าสู่ระบบ
                    </Button>
                  </Link>
                )}
              </div>

              {/* Favorites */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">บันทึกรายการโปรด</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  บันทึกสถานที่ที่ชื่นชอบไว้ดูภายหลัง
                  และจัดการรายการโปรดได้ง่าย
                </p>
                {isAuthenticated ? (
                  <Link href="/dashboard/my-folder">
                    <Button size="sm">ดูรายการโปรด</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      เข้าสู่ระบบ
                    </Button>
                  </Link>
                )}
              </div>

              {/* Folders */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Folder className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">สร้างโฟลเดอร์</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  จัดหมวดหมู่สถานที่ท่องเที่ยวเป็นโฟลเดอร์
                  วางแผนทริปได้สะดวก
                </p>
                {isAuthenticated ? (
                  <Link href="/dashboard/my-folder">
                    <Button size="sm">จัดการโฟลเดอร์</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      เข้าสู่ระบบ
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-semibold">STOU Smart Tour</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ระบบค้นหาข้อมูลท่องเที่ยวสำหรับมหาวิทยาลัยสุโขทัยธรรมาธิราช
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
