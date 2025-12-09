"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SearchBar, FilterTabs, useWebsiteSearch, useInfiniteImageSearch, useVideoSearch, useSearch } from "@/features/search";
import { SearchType } from "@/shared/types/common";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { FavoriteButton } from "@/shared/components/common/FavoriteButton";
import { Rating } from "@/shared/components/common/Rating";
import { AlertCircle, Search, ExternalLink, ChevronLeft, ChevronRight, MapPin, Play, Loader2 } from "lucide-react";
import type { ImageResult } from "@/shared/types/models";

const PAGE_SIZE = 20;

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params from URL
  const queryParam = searchParams.get("q") || "";
  const typeParam = (searchParams.get("type") as SearchType) || "all";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [query, setQuery] = useState(queryParam);
  const [searchType, setSearchType] = useState<SearchType>(typeParam);
  const [page, setPage] = useState(pageParam);

  // Update URL when state changes
  const updateURL = (newQuery: string, newType: SearchType, newPage: number) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newType !== "website") params.set("type", newType);
    if (newPage > 1) params.set("page", newPage.toString());

    const url = `/dashboard/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url, { scroll: false });
  };

  // General search (Tab "ทั้งหมด")
  const generalQuery = useSearch(
    { q: query, page, pageSize: PAGE_SIZE },
    searchType === "all" && !!query
  );

  // Website search
  const websiteQuery = useWebsiteSearch(
    { q: query, page, pageSize: PAGE_SIZE },
    searchType === "website" && !!query
  );

  // Image search (Infinite Query for Load More)
  const imageQuery = useInfiniteImageSearch(
    { q: query, pageSize: 10 },
    searchType === "image" && !!query
  );

  // Video search
  const videoQuery = useVideoSearch(
    { q: query, page, pageSize: PAGE_SIZE },
    searchType === "video" && !!query
  );

  // Determine current query state (for non-image types)
  const getCurrentQueryState = () => {
    switch (searchType) {
      case "all": return generalQuery;
      case "website": return websiteQuery;
      case "video": return videoQuery;
      default: return websiteQuery;
    }
  };

  const currentQuery = getCurrentQueryState();

  // Handle image search separately due to infinite query
  const isLoading = searchType === "image" ? imageQuery.isLoading : currentQuery.isLoading;
  const error = searchType === "image" ? imageQuery.error : currentQuery.error;

  // Flatten image results from infinite query pages
  const imageResults = imageQuery.data?.pages?.flatMap(page => page.results) || [];
  const results = searchType === "image" ? imageResults : (currentQuery.data?.results || []);

  const totalCount = searchType === "image"
    ? (imageQuery.data?.pages?.[0]?.totalCount || imageResults.length)
    : (currentQuery.data?.totalCount || 0);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Sync state with URL params
  useEffect(() => {
    if (queryParam !== query) setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (typeParam !== searchType) setSearchType(typeParam);
  }, [typeParam]);

  useEffect(() => {
    if (pageParam !== page) setPage(pageParam);
  }, [pageParam]);

  // Handle search
  const handleSearch = (newQuery: string) => {
    // If AI mode is selected, redirect to AI page
    if (searchType === "ai") {
      router.push(`/dashboard/ai?q=${encodeURIComponent(newQuery)}`);
      return;
    }

    setQuery(newQuery);
    setPage(1);
    updateURL(newQuery, searchType, 1);
  };

  // Handle type change
  const handleTypeChange = (type: SearchType) => {
    // If AI mode is selected, redirect to AI page with current query
    if (type === "ai") {
      if (query) {
        router.push(`/dashboard/ai?q=${encodeURIComponent(query)}`);
      } else {
        router.push("/dashboard/ai");
      }
      return;
    }

    // If map is selected, redirect to map page
    if (type === "map") {
      if (query) {
        router.push(`/dashboard/map?q=${encodeURIComponent(query)}`);
      } else {
        router.push("/dashboard/map");
      }
      return;
    }

    setSearchType(type);
    setPage(1);
    updateURL(query, type, 1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    updateURL(query, searchType, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const showPages = 5;

      if (totalPages <= showPages) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (page <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        } else if (page >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = page - 1; i <= page + 1; i++) pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((pageNum, index) => (
          pageNum === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
          ) : (
            <Button
              key={pageNum}
              variant={page === pageNum ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(pageNum as number)}
            >
              {pageNum}
            </Button>
          )
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 pb-4">
        <SearchBar
          initialQuery={query}
          onSearch={handleSearch}
        />
      </div>

      {/* Filter Tabs */}
      <FilterTabs activeTab={searchType} onTabChange={handleTypeChange} />

      {/* Results */}
      <div className="min-h-[60vh]">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error instanceof Error ? error.message : 'เกิดข้อผิดพลาด'}</AlertDescription>
          </Alert>
        )}

        {/* Empty State - No Query */}
        {!query && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">ค้นหาสถานที่ท่องเที่ยว</h3>
            <p className="text-muted-foreground max-w-md">
              พิมพ์ชื่อจังหวัด สถานที่ หรือสิ่งที่คุณสนใจในช่องค้นหาด้านบน
            </p>
          </div>
        )}

        {/* Empty State - No Results */}
        {query && results.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">ไม่พบผลลัพธ์</h3>
            <p className="text-muted-foreground max-w-md">
              ไม่พบผลลัพธ์สำหรับ &ldquo;{query}&rdquo;
              <br />
              ลองค้นหาด้วยคำอื่นหรือเปลี่ยนประเภทการค้นหา
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !isLoading && (
          <div className="space-y-6">
            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {searchType === "image" ? (
                  <>แสดง {results.length} รูปภาพสำหรับ &ldquo;{query}&rdquo;</>
                ) : (
                  <>
                    พบ {totalCount.toLocaleString()} ผลลัพธ์สำหรับ &ldquo;{query}&rdquo;
                    {totalPages > 1 && ` (หน้า ${page} จาก ${totalPages})`}
                  </>
                )}
              </p>
            </div>

            {/* All Results - Mixed Layout */}
            {searchType === "all" && (
              <div className="space-y-8">
                {/* Places Section */}
                {results.filter((r: any) => r.placeId).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      สถานที่
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {results.filter((r: any) => r.placeId).map((place: any) => (
                        <Card key={place.placeId} className="py-0 gap-0 overflow-hidden hover:shadow-lg transition-shadow group">
                          <Link href={`/dashboard/place/${place.placeId}`}>
                            <div className="relative aspect-video overflow-hidden bg-muted">
                              {place.thumbnailUrl ? (
                                <img
                                  src={place.thumbnailUrl}
                                  alt={place.title}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <MapPin className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </Link>
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Link href={`/dashboard/place/${place.placeId}`}>
                                  <h3 className="font-medium text-sm mb-1 line-clamp-1 hover:text-primary">
                                    {place.title}
                                  </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-1">
                                  <Rating rating={place.rating || 0} size="sm" />
                                  <span className="text-xs text-muted-foreground">
                                    ({place.reviewCount || 0})
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {place.snippet}
                                </p>
                              </div>
                              <FavoriteButton
                                item={{
                                  type: "place",
                                  title: place.title,
                                  url: `https://www.google.com/maps/place/?q=place_id:${place.placeId}`,
                                  thumbnailUrl: place.thumbnailUrl,
                                  description: place.snippet,
                                  metadata: {
                                    placeId: place.placeId,
                                    lat: place.lat,
                                    lng: place.lng,
                                    rating: place.rating,
                                    reviewCount: place.reviewCount,
                                    types: place.types,
                                  },
                                }}
                                size="sm"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos Section */}
                {results.filter((r: any) => r.videoId).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      วิดีโอ
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {results.filter((r: any) => r.videoId).map((video: any) => (
                        <Card key={video.videoId} className="py-0 gap-0 overflow-hidden hover:shadow-lg transition-shadow">
                          <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                            <div className="relative aspect-video overflow-hidden bg-muted">
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                              />
                              {video.duration && (
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                                  {video.duration}
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center">
                                  <Play className="h-6 w-6 text-white fill-white" />
                                </div>
                              </div>
                            </div>
                          </a>
                          <CardContent className="p-3">
                            <h3 className="font-medium text-sm mb-1 line-clamp-2">
                              {video.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">{video.source}</p>
                            {video.viewCount && (
                              <p className="text-xs text-muted-foreground">
                                {Number(video.viewCount).toLocaleString()} ครั้ง
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Websites Section */}
                {results.filter((r: any) => r.type === "website").length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      เว็บไซต์
                    </h3>
                    <div className="space-y-3">
                      {results.filter((r: any) => r.type === "website").map((website: any, index: number) => (
                        <Card key={`web-${index}`} className="py-0 gap-0 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <a
                              href={website.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <h3 className="font-semibold mb-1 line-clamp-1 hover:text-primary flex items-center gap-2">
                                {website.title}
                                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                              </h3>
                              <p className="text-sm text-green-600 mb-1">{website.source}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {website.snippet}
                              </p>
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image Results - Masonry Layout with Load More */}
            {searchType === "image" && (
              <div className="space-y-6">
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 space-y-2">
                  {results.map((result: any, index: number) => (
                    <a
                      key={`image-${result.url}-${index}`}
                      href={result.contextLink || result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group break-inside-avoid mb-2"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-muted">
                        <img
                          src={result.thumbnailUrl || result.url}
                          alt={result.title}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.parentElement!.parentElement!.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs line-clamp-2">{result.title}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Load More Button */}
                {imageQuery.hasNextPage && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => imageQuery.fetchNextPage()}
                      disabled={imageQuery.isFetchingNextPage}
                      className="min-w-[200px]"
                    >
                      {imageQuery.isFetchingNextPage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          กำลังโหลด...
                        </>
                      ) : (
                        <>แสดงเพิ่มเติม ({results.length} / ~100)</>
                      )}
                    </Button>
                  </div>
                )}

                {/* End of results message */}
                {!imageQuery.hasNextPage && results.length > 0 && (
                  <p className="text-center text-sm text-muted-foreground pt-4">
                    แสดงครบทั้งหมด {results.length} รูปภาพ
                  </p>
                )}
              </div>
            )}

            {/* Website Results */}
            {searchType === "website" && (
              <div className="space-y-3">
                {results.map((result: any, index: number) => (
                  <Card key={`website-${result.url}-${index}`} className="py-0 gap-0 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="font-semibold mb-1 line-clamp-1 hover:text-primary flex items-center gap-2">
                          {result.title}
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        </h3>
                        <p className="text-sm text-green-600 mb-1">{result.displayLink}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.snippet}
                        </p>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Video Results */}
            {searchType === "video" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((result: any) => (
                  <Card key={result.videoId} className="py-0 gap-0 overflow-hidden hover:shadow-lg transition-shadow">
                    <a href={`https://www.youtube.com/watch?v=${result.videoId}`} target="_blank" rel="noopener noreferrer">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={result.thumbnailUrl}
                          alt={result.title}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {result.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                            {result.duration}
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                    </a>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm mb-1 line-clamp-2">
                        {result.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{result.channelTitle}</p>
                      {result.viewCount && (
                        <p className="text-xs text-muted-foreground">
                          {Number(result.viewCount).toLocaleString()} ครั้ง
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination (not for image search - uses Load More) */}
            {searchType !== "image" && renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
