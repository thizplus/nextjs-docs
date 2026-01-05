"use client";

import Image from "next/image";
import Link from "next/link";
import type { RelatedVideo } from "@/shared/types/models";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Play, Eye } from "lucide-react";

interface RelatedVideosSectionProps {
  videos: RelatedVideo[];
}

function formatViewCount(count?: number): string {
  if (!count) return "";
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

export function RelatedVideosSection({ videos }: RelatedVideosSectionProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Play className="h-5 w-5 text-red-500" />
        <h2 className="text-xl font-semibold">วิดีโอที่เกี่ยวข้อง</h2>
        <Badge variant="outline" className="text-xs">
          YouTube
        </Badge>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Link
            key={video.videoId}
            href={`/dashboard/video/${video.videoId}`}
            className="group"
          >
            <Card className="overflow-hidden py-0 gap-0 transition-shadow hover:shadow-md">
              {/* Thumbnail */}
              <div className="relative aspect-video">
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                )}
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-3">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate">{video.channelTitle}</span>
                  {video.viewCount && (
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Eye className="h-3 w-3" />
                      {formatViewCount(video.viewCount)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
