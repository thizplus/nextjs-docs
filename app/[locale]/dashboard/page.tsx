"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/features/search";
import { PlaceCard, usePlaceSearch } from "@/features/places";
import { useBatchCheckItemsInFolders } from "@/features/folders";
import { useBatchCheckFavorites } from "@/features/favorites";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MapPin, Sparkles, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useAuth } from "@/shared/hooks";

export default function DashboardHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;
  const { isAuthenticated } = useAuth();

  const t = useTranslations("homepage");
  const tCommon = useTranslations("common");
  const tSearch = useTranslations("search");

  // ค้นหาตาม query หรือสถานที่ยอดนิยมในกรุงเทพฯ
  const { data: placesData, isLoading, error } = usePlaceSearch(
    {
      q: isSearching ? searchQuery : "สถานที่ท่องเที่ยว กรุงเทพ",
      pageSize: isSearching ? 12 : 8
    },
    true
  );

  const places = placesData?.results || [];

  // Generate URLs for batch check (only when authenticated)
  const placeUrls = useMemo(() => {
    if (!isAuthenticated || places.length === 0) return [];
    return places.map((place) =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.placeId}`
    );
  }, [places, isAuthenticated]);

  // Batch check folder status (1 request instead of N)
  const { data: folderCheckData } = useBatchCheckItemsInFolders(
    placeUrls,
    isAuthenticated && placeUrls.length > 0
  );

  // Create a map for quick lookup
  const folderStatusMap = useMemo(() => {
    if (!folderCheckData?.items) return {};
    const map: Record<string, boolean> = {};
    for (const [url, status] of Object.entries(folderCheckData.items)) {
      map[url] = status.isSaved;
    }
    return map;
  }, [folderCheckData]);

  // Generate externalIds for batch favorite check
  const placeIds = useMemo(() => {
    if (!isAuthenticated || places.length === 0) return [];
    return places.map((place) => place.placeId);
  }, [places, isAuthenticated]);

  // Batch check favorite status (1 request instead of N)
  const { data: favoriteCheckData } = useBatchCheckFavorites(
    placeIds,
    isAuthenticated && placeIds.length > 0
  );

  // Create a map for quick lookup
  const favoriteStatusMap = useMemo(() => {
    if (!favoriteCheckData?.items) return {};
    const map: Record<string, boolean> = {};
    for (const [extId, status] of Object.entries(favoriteCheckData.items)) {
      map[extId] = status.isFavorite;
    }
    return map;
  }, [favoriteCheckData]);

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
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("dashboardSubtitle")}
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          initialQuery={searchQuery}
          placeholder={t("searchPlaceholder")}
          onSearch={handleSearch}
        />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/ai">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              {t("aiMode")}
            </Button>
          </Link>
          <Link href="/dashboard/search?type=place">
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              {t("searchPlaces")}
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
                  {t("searchResults")} "{searchQuery}"
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {tCommon("foundPlaces", { count: places.length })}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {t("popularPlaces")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t("popularPlacesDesc")}
                </p>
              </>
            )}
          </div>
          {isSearching ? (
            <Button variant="ghost" onClick={clearSearch} className="gap-2">
              <X className="h-4 w-4" />
              {tCommon("clearSearch")}
            </Button>
          ) : (
            <Link href="/dashboard/search?type=place">
              <Button variant="link">{tCommon("seeMore")} →</Button>
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
              {error instanceof Error ? error.message : tCommon("loadError")}
            </AlertDescription>
          </Alert>
        )}

        {/* Places Grid */}
        {!isLoading && !error && places.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map((place) => {
              const placeUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.placeId}`;
              return (
                <PlaceCard
                  key={place.placeId}
                  place={place}
                  showDistance={false}
                  isInFolder={folderStatusMap[placeUrl] ?? false}
                  isFavorite={favoriteStatusMap[place.placeId] ?? false}
                />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && places.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {isSearching ? `${t("noPlaceFound")} "${searchQuery}"` : t("noPlacesAvailable")}
            </p>
            {isSearching && (
              <Button variant="outline" onClick={clearSearch} className="mt-4">
                {tCommon("clearSearch")}
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Quick Links - แสดงเมื่อไม่ได้ค้นหา */}
      {!isSearching && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("quickSearch")}</h2>
          <div className="flex flex-wrap gap-2">
            {(["chatuchak", "grandPalace", "lumphini", "iconsiam", "watArun", "chaoPhraya", "floatingMarket", "ayutthaya"] as const).map((placeKey) => (
              <Button
                key={placeKey}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleSearch(t(`quickSearchPlaces.${placeKey}`))}
              >
                {t(`quickSearchPlaces.${placeKey}`)}
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
