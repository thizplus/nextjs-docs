import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Rating } from "@/shared/components/common/Rating";
import { FavoriteButton } from "@/shared/components/common/FavoriteButton";
import { ShareButton } from "@/shared/components/common/ShareButton";
import { MapPin, ExternalLink } from "lucide-react";

interface SearchResult {
  id: string;
  type: "place" | "website" | "image" | "video";
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  distance?: string;
  domain?: string;
  duration?: string;
  channel?: string;
  views?: string;
}

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const isPlace = result.type === "place";
  const isWebsite = result.type === "website";
  const isImage = result.type === "image";
  const isVideo = result.type === "video";

  if (isImage) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <a href={result.url} target="_blank" rel="noopener noreferrer">
          <div className="aspect-square overflow-hidden">
            <img
              src={result.thumbnail}
              alt={result.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        </a>
        <CardContent className="p-2">
          <p className="text-xs text-muted-foreground line-clamp-1">
            {result.title}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isVideo && result.channel) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <a href={result.url} target="_blank" rel="noopener noreferrer">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={result.thumbnail}
              alt={result.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {result.duration}
            </div>
          </div>
        </a>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm mb-1 line-clamp-2">
            {result.title}
          </h3>
          <p className="text-xs text-muted-foreground">{result.channel}</p>
          {result.views && (
            <p className="text-xs text-muted-foreground">
              {result.views} ครั้ง
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isPlace && result.rating !== undefined) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={result.url}>
          <div className="relative aspect-video overflow-hidden">
            <img
              src={result.thumbnail}
              alt={result.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <div onClick={(e) => e.preventDefault()}>
                <FavoriteButton
                  item={{
                    type: "place",
                    title: result.title,
                    url: `https://www.google.com/maps/place/?q=place_id:${result.id}`,
                    thumbnailUrl: result.thumbnail,
                    description: result.description,
                    metadata: {
                      placeId: result.id,
                      rating: result.rating,
                      reviewCount: result.reviewCount,
                    },
                  }}
                  size="sm"
                  variant="default"
                />
              </div>
              <div onClick={(e) => e.preventDefault()}>
                <ShareButton
                  title={result.title}
                  url={result.url}
                  size="sm"
                  variant="default"
                />
              </div>
            </div>
          </div>
        </Link>

        <CardContent className="p-4">
          <Link href={result.url}>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-primary">
              {result.title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {result.description}
          </p>

          <div className="flex items-center gap-2 mb-2">
            <Rating rating={result.rating} size="sm" />
            {result.reviewCount && (
              <span className="text-xs text-muted-foreground">
                ({result.reviewCount.toLocaleString()})
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary">{result.category}</Badge>
            {result.distance && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{result.distance} กม.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isWebsite && result.domain) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex gap-3">
              {result.thumbnail && (
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-24 h-24 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-primary flex items-center gap-2">
                  {result.title}
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </h3>
                <p className="text-sm text-green-600 mb-1">{result.domain}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.description}
                </p>
              </div>
            </div>
          </a>
        </CardContent>
      </Card>
    );
  }

  return null;
}
