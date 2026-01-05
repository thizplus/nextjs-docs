"use client";

import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Rating } from "@/shared/components/common/Rating";
import { FavoriteButton } from "@/shared/components/common/FavoriteButton";
import { FolderButton } from "@/shared/components/common/FolderButton";
import { ShareButton } from "@/shared/components/common/ShareButton";
import { MapPin } from "lucide-react";
import type { PlaceResult } from "@/shared/types/models";
import { useAuth } from "@/shared/hooks";

const PRICE_LEVELS: Record<number, string> = {
  0: "ฟรี",
  1: "฿",
  2: "฿฿",
  3: "฿฿฿",
  4: "฿฿฿฿",
};

interface PlaceCardProps {
  place: PlaceResult;
  showDistance?: boolean;
  /** Pre-fetched folder status for this place */
  isInFolder?: boolean;
  /** Pre-fetched favorite status for this place */
  isFavorite?: boolean;
  /** Use dashboard route for authenticated users (default: true) */
  useDashboardRoute?: boolean;
}

export function PlaceCard({
  place,
  showDistance = true,
  isInFolder,
  isFavorite,
  useDashboardRoute = true,
}: PlaceCardProps) {
  const { isAuthenticated, hasHydrated } = useAuth();
  const category = place.types?.[0] || "สถานที่";

  // Link to dashboard route for authenticated users, public route for guests
  // IMPORTANT: Use public path until hydrated to avoid hydration mismatch
  const detailPath = hasHydrated && useDashboardRoute && isAuthenticated
    ? `/dashboard/place/${place.placeId}`
    : `/place/${place.placeId}`;

  const placeUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.placeId}`;

  // สร้าง item สำหรับ FavoriteButton (heart toggle)
  const favoriteItem = {
    type: "place" as const,
    externalId: place.placeId,
    title: place.name,
    url: placeUrl,
    thumbnailUrl: place.photoUrl,
    rating: place.rating,
    reviewCount: place.reviewCount,
    address: place.address,
    metadata: {
      lat: place.lat,
      lng: place.lng,
      types: place.types,
    },
  };

  // สร้าง item สำหรับ FolderButton (add to folder)
  const folderItem = {
    type: "place",
    title: place.name,
    url: placeUrl,
    thumbnailUrl: place.photoUrl,
    description: place.address,
    metadata: {
      placeId: place.placeId,
      lat: place.lat,
      lng: place.lng,
      rating: place.rating,
      reviewCount: place.reviewCount,
      types: place.types,
    },
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow py-0 gap-0">
      <Link href={detailPath}>
        <div className="relative aspect-video overflow-hidden">
          {place.photoUrl ? (
            <img
              src={place.photoUrl}
              alt={place.name}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-blue-500" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            {/* Show FavoriteButton and FolderButton only when logged in */}
            {hasHydrated && isAuthenticated && (
              <>
                <div onClick={(e) => e.preventDefault()}>
                  <FavoriteButton
                    item={favoriteItem}
                    size="sm"
                    variant="default"
                    initialIsFavorite={isFavorite}
                  />
                </div>
                <div onClick={(e) => e.preventDefault()}>
                  <FolderButton
                    item={folderItem}
                    size="sm"
                    variant="default"
                    isSaved={isInFolder}
                  />
                </div>
              </>
            )}
            <div onClick={(e) => e.preventDefault()}>
              <ShareButton
                title={place.name}
                url={detailPath}
                size="sm"
                variant="default"
              />
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={detailPath} className="block">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-primary">
            {place.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <Rating rating={place.rating} size="sm" />
          {place.reviewCount > 0 && (
            <span className="text-xs text-muted-foreground">
              ({place.reviewCount.toLocaleString()})
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">{category}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {place.priceLevel !== undefined && place.priceLevel >= 0 && (
              <span className="font-medium">
                {PRICE_LEVELS[place.priceLevel] || ""}
              </span>
            )}
            {showDistance && place.distanceText && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{place.distanceText}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
