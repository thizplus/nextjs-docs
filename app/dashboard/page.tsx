"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/features/search";
import { PlaceCard, usePlaceSearch } from "@/features/places";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MapPin, Sparkles, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

export default function DashboardHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;

  // ค้นหาตาม query หรือสถานที่ยอดนิยมในกรุงเทพฯ
  const { data: placesData, isLoading, error } = usePlaceSearch(
    {
      q: isSearching ? searchQuery : "สถานที่ท่องเที่ยว กรุงเทพ",
      pageSize: isSearching ? 12 : 8
    },
    true
  );

  const places = placesData?.results || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            ค้นหาสถานที่ท่องเที่ยว
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            ค้นหาและจัดการสถานที่ท่องเที่ยวที่คุณสนใจ
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          initialQuery={searchQuery}
          placeholder="พิมพ์ชื่อจังหวัด/สถานที่ที่ต้องการค้นหา..."
          onSearch={handleSearch}
        />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/ai">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Mode
            </Button>
          </Link>
          <Link href="/dashboard/search?type=place">
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              ค้นหาสถานที่
            </Button>
          </Link>
        </div>
      </section>

      {/* Search Results or Featured Destinations */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            {isSearching ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ผลการค้นหา "{searchQuery}"
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  พบ {places.length} สถานที่
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  สถานที่ยอดนิยม
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  สถานที่ท่องเที่ยวที่นักท่องเที่ยวแนะนำ
                </p>
              </>
            )}
          </div>
          {isSearching ? (
            <Button variant="ghost" onClick={clearSearch} className="gap-2">
              <X className="h-4 w-4" />
              ล้างการค้นหา
            </Button>
          ) : (
            <Link href="/dashboard/search?type=place">
              <Button variant="link">ดูทั้งหมด →</Button>
            </Link>
          )}
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
              {error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล"}
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
              {isSearching ? `ไม่พบสถานที่สำหรับ "${searchQuery}"` : "ไม่พบสถานที่ท่องเที่ยว"}
            </p>
            {isSearching && (
              <Button variant="outline" onClick={clearSearch} className="mt-4">
                ล้างการค้นหา
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Quick Links - แสดงเมื่อไม่ได้ค้นหา */}
      {!isSearching && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">ค้นหาด่วน</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "ตลาดจตุจักร",
              "วัดพระแก้ว",
              "สวนลุมพินี",
              "ไอคอนสยาม",
              "วัดอรุณ",
              "เจ้าพระยา",
              "ตลาดน้ำ",
              "อยุธยา",
            ].map((place) => (
              <Button
                key={place}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleSearch(place)}
              >
                {place}
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
