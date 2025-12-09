"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/features/search";
import { usePlaceSearch } from "@/features/places";
import { useGoogleMapsApiKey } from "@/hooks/usePublicConfig";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Rating } from "@/shared/components/common/Rating";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/shared/components/ui/drawer";
import {
  MapPin,
  List,
  Map as MapIcon,
  Navigation,
  AlertCircle,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import type { PlaceResult } from "@/shared/types/models";

// Place Card Component
function PlaceCard({
  place,
  isSelected,
  onClick,
  onOpenMaps,
  showMapButton = false,
}: {
  place: PlaceResult;
  isSelected: boolean;
  onClick: () => void;
  onOpenMaps: () => void;
  showMapButton?: boolean;
}) {
  return (
    <Card
      className={`py-0 gap-0 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          {place.photoUrl ? (
            <img
              src={place.photoUrl}
              alt={place.name}
              className="w-20 h-20 object-cover rounded-md flex-shrink-0"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-1">{place.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Rating rating={place.rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                ({place.reviewCount})
              </span>
            </div>
            {place.types?.[0] && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {place.types[0]}
              </Badge>
            )}
            <div className="flex gap-2 mt-2">
              <Link href={`/dashboard/place/${place.placeId}`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  รายละเอียด
                </Button>
              </Link>
              {showMapButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMaps();
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                  Maps
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Map Component
function MapEmbed({
  googleMapsApiKey,
  selectedPlace,
  userLocation,
  searchQuery,
}: {
  googleMapsApiKey: string;
  selectedPlace: PlaceResult | null;
  userLocation: { lat: number; lng: number } | null;
  searchQuery: string;
}) {
  const getMapEmbedUrl = () => {
    if (selectedPlace?.lat && selectedPlace?.lng) {
      return `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(selectedPlace.name)}&center=${selectedPlace.lat},${selectedPlace.lng}&zoom=15`;
    } else if (userLocation) {
      return `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=${userLocation.lat},${userLocation.lng}&zoom=14`;
    } else if (searchQuery) {
      return `https://www.google.com/maps/embed/v1/search?key=${googleMapsApiKey}&q=${encodeURIComponent(searchQuery + " ประเทศไทย")}`;
    }
    return `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=13.7563,100.5018&zoom=12`;
  };

  if (googleMapsApiKey) {
    return (
      <iframe
        src={getMapEmbedUrl()}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  // Fallback to OpenStreetMap
  return (
    <iframe
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
        selectedPlace?.lat && selectedPlace?.lng
          ? `${selectedPlace.lng - 0.02},${selectedPlace.lat - 0.02},${selectedPlace.lng + 0.02},${selectedPlace.lat + 0.02}`
          : userLocation
          ? `${userLocation.lng - 0.05},${userLocation.lat - 0.05},${userLocation.lng + 0.05},${userLocation.lat + 0.05}`
          : "100.4,13.65,100.6,13.85"
      }&layer=mapnik${
        selectedPlace?.lat && selectedPlace?.lng
          ? `&marker=${selectedPlace.lat},${selectedPlace.lng}`
          : userLocation
          ? `&marker=${userLocation.lat},${userLocation.lng}`
          : ""
      }`}
      className="w-full h-full border-0"
    />
  );
}

function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const { apiKey: googleMapsApiKey } = useGoogleMapsApiKey();

  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const searchQuery = queryParam || "สถานที่ท่องเที่ยว กรุงเทพ";

  const { data: placesData, isLoading, error } = usePlaceSearch(
    { q: searchQuery, pageSize: 20 },
    true
  );

  const places = placesData?.results || [];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser ไม่รองรับ Geolocation");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setIsLoadingLocation(false);
        alert("ไม่สามารถเข้าถึงตำแหน่งของคุณได้");
      }
    );
  };

  const handleSearch = (newQuery: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    router.push(`/dashboard/map${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const openInGoogleMaps = (place: PlaceResult) => {
    const url = place.lat && place.lng
      ? `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}&query_place_id=${place.placeId}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
    window.open(url, "_blank");
  };

  const handlePlaceClick = (place: PlaceResult) => {
    setSelectedPlace(place);
    // On mobile, open drawer
    if (window.innerWidth < 768) {
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <MapIcon className="h-5 w-5 md:h-6 md:w-6" />
              แผนที่
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              ค้นหาและดูสถานที่บนแผนที่
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetLocation}
            disabled={isLoadingLocation}
            className="gap-1 md:gap-2"
          >
            {isLoadingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">ตำแหน่งของฉัน</span>
          </Button>
        </div>

        <SearchBar
          initialQuery={queryParam}
          onSearch={handleSearch}
          placeholder="ค้นหาสถานที่..."
        />
      </div>

      {/* Main Content */}
      {/* Mobile: List only, tap to open drawer with map */}
      <div className="flex-1 min-h-0 md:hidden">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="space-y-3 pr-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : "เกิดข้อผิดพลาด"}
              </AlertDescription>
            </Alert>
          ) : places.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">ไม่พบสถานที่</p>
            </div>
          ) : (
            <div className="space-y-3 pr-2">
              {places.map((place) => (
                <PlaceCard
                  key={place.placeId}
                  place={place}
                  isSelected={selectedPlace?.placeId === place.placeId}
                  onClick={() => handlePlaceClick(place)}
                  onOpenMaps={() => openInGoogleMaps(place)}
                  showMapButton={false}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Mobile Drawer for Map */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="pb-2">
              <div className="flex items-center justify-between">
                <DrawerTitle className="line-clamp-1">
                  {selectedPlace?.name || "แผนที่"}
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
              {selectedPlace && (
                <div className="flex items-center gap-2 mt-1">
                  <Rating rating={selectedPlace.rating} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    ({selectedPlace.reviewCount} รีวิว)
                  </span>
                </div>
              )}
            </DrawerHeader>

            <div className="flex-1 min-h-[40vh] px-4">
              <Card className="py-0 gap-0 h-full overflow-hidden">
                <MapEmbed
                  googleMapsApiKey={googleMapsApiKey}
                  selectedPlace={selectedPlace}
                  userLocation={userLocation}
                  searchQuery={searchQuery}
                />
              </Card>
            </div>

            {selectedPlace && (
              <div className="p-4 flex gap-2">
                <Link href={`/dashboard/place/${selectedPlace.placeId}`} className="flex-1">
                  <Button className="w-full">ดูรายละเอียด</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => openInGoogleMaps(selectedPlace)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Google Maps
                </Button>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: Split view */}
      <div className="flex-1 hidden md:flex gap-4 min-h-0">
        {/* Places List */}
        <div className="w-2/5 lg:w-1/3">
          <ScrollArea className="h-full pr-2">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error instanceof Error ? error.message : "เกิดข้อผิดพลาด"}
                </AlertDescription>
              </Alert>
            ) : places.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">ไม่พบสถานที่</p>
              </div>
            ) : (
              <div className="space-y-3">
                {places.map((place) => (
                  <PlaceCard
                    key={place.placeId}
                    place={place}
                    isSelected={selectedPlace?.placeId === place.placeId}
                    onClick={() => setSelectedPlace(place)}
                    onOpenMaps={() => openInGoogleMaps(place)}
                    showMapButton={true}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Map */}
        <div className="w-3/5 lg:w-2/3">
          <Card className="py-0 gap-0 h-full overflow-hidden">
            <MapEmbed
              googleMapsApiKey={googleMapsApiKey}
              selectedPlace={selectedPlace}
              userLocation={userLocation}
              searchQuery={searchQuery}
            />
          </Card>

          {/* Selected Place Info Bar */}
          {selectedPlace && (
            <Card className="py-0 gap-0 mt-2">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-1">{selectedPlace.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {selectedPlace.address || selectedPlace.types?.[0]}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/dashboard/place/${selectedPlace.placeId}`}>
                      <Button size="sm">รายละเอียด</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInGoogleMaps(selectedPlace)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <div className="space-y-4 pb-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex-1">
            {/* Mobile skeleton */}
            <div className="md:hidden space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            {/* Desktop skeleton */}
            <div className="hidden md:flex gap-4 h-full">
              <div className="w-1/3 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
              <Skeleton className="w-2/3 h-full" />
            </div>
          </div>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
