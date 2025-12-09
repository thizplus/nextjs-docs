"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlaceDetail } from "@/features/places";
import { Rating } from "@/shared/components/common/Rating";
import { FavoriteButton } from "@/shared/components/common/FavoriteButton";
import { ShareButton } from "@/shared/components/common/ShareButton";
import { ImageSlider } from "@/shared/components/common/ImageSlider";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

export default function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: place, isLoading, error } = usePlaceDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 w-full rounded-lg" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">ไม่พบข้อมูลสถานที่</p>
        <Link href="/dashboard/search">
          <Button variant="link" className="mt-4">
            กลับไปค้นหา
          </Button>
        </Link>
      </div>
    );
  }

  const photos = place.photos || [];
  const reviews = place.reviews || [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        กลับ
      </Button>

      {/* Image Slider */}
      {photos.length > 0 && (
        <ImageSlider
          images={photos.map((photo, index) => ({
            url: photo.url,
            alt: `${place.name} ${index + 1}`,
          }))}
          imageHeight="180px"
        />
      )}

      {/* Title & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
          <div className="flex items-center gap-4">
            <Rating rating={place.rating} size="md" />
            <span className="text-muted-foreground">
              ({place.reviewCount.toLocaleString()} รีวิว)
            </span>
            {place.types?.[0] && <Badge>{place.types[0]}</Badge>}
          </div>
        </div>
        <div className="flex gap-2">
          <FavoriteButton
            item={{
              type: "place",
              title: place.name,
              url: `https://www.google.com/maps/place/?q=place_id:${place.placeId}`,
              thumbnailUrl: place.photos?.[0]?.url,
              description: place.formattedAddress,
              metadata: {
                placeId: place.placeId,
                lat: place.lat,
                lng: place.lng,
                rating: place.rating,
                reviewCount: place.reviewCount,
                types: place.types,
              },
            }}
          />
          <ShareButton title={place.name} url={`/dashboard/place/${place.placeId}`} />
        </div>
      </div>

      <Separator />

      {/* Details */}
      <div className="space-y-6">
        {/* Types/Categories */}
        {place.types && place.types.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">หมวดหมู่</h3>
            <div className="flex flex-wrap gap-2">
              {place.types.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Hours Accordion */}
        <Card className="py-0">
          <CardContent className="p-0">
            <Accordion type="multiple" defaultValue={["contact", "hours"]} className="w-full">
              {/* ข้อมูลติดต่อ */}
              <AccordionItem value="contact" className="border-b">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold">ข้อมูลติดต่อ</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground break-words">{place.formattedAddress}</span>
                    </div>
                    {place.phone && (
                      <div className="flex gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a href={`tel:${place.phone}`} className="text-primary hover:underline break-all">
                          {place.phone}
                        </a>
                      </div>
                    )}
                    {place.website && (
                      <div className="flex gap-2 min-w-0">
                        <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                          title={place.website}
                        >
                          {place.website}
                        </a>
                      </div>
                    )}
                    {place.googleMapsUrl && (
                      <div className="pt-2">
                        <a
                          href={place.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <MapPin className="h-4 w-4" />
                          ดูใน Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* เวลาทำการ */}
              {place.openingHours && place.openingHours.length > 0 && (
                <AccordionItem value="hours" className="border-b-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">เวลาทำการ</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-1.5 text-sm">
                      {place.openingHours.map((hour, index) => (
                        <div key={index} className="text-muted-foreground">
                          {hour}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">รีวิว</h2>
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${place.placeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  ดูรีวิวทั้งหมด
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <Card key={idx} className="py-0 gap-0">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={review.photoUrl} />
                        <AvatarFallback>{review.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{review.author}</p>
                          <span className="text-sm text-muted-foreground">
                            {review.time}
                          </span>
                        </div>
                        <Rating rating={review.rating} size="sm" showValue={false} />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {review.text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
