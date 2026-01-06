"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { usePlaceDetailEnhanced, placesKeys } from "../hooks";
import { AIOverviewSection } from "./AIOverviewSection";
import { GuideInfoSection } from "./GuideInfoSection";
import { RelatedVideosSection } from "./RelatedVideosSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

interface AIContentSectionProps {
  placeId: string;
  placeName: string;
}

function AILoadingSkeleton({ generatingText }: { generatingText: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">{generatingText}</span>
      </div>
      <Card>
        <CardContent className="pt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}

export function AIContentSection({ placeId, placeName }: AIContentSectionProps) {
  const queryClient = useQueryClient();
  const { data: enhancedData, isLoading, error } = usePlaceDetailEnhanced(placeId);
  const t = useTranslations("ai");
  const tPlace = useTranslations("place");

  // Poll when status is "generating"
  useEffect(() => {
    if (enhancedData?.aiStatus !== "generating") return;

    const pollInterval = setInterval(() => {
      // Refetch the query
      queryClient.invalidateQueries({
        queryKey: placesKeys.detailEnhanced(placeId, undefined, undefined),
      });
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [enhancedData?.aiStatus, placeId, queryClient]);

  // Show nothing if unavailable and not loading
  const hasAIContent = enhancedData?.aiOverview ||
    enhancedData?.guideInfo ||
    (enhancedData?.relatedVideos && enhancedData.relatedVideos.length > 0);

  if (error) {
    return null; // Silently fail - AI content is optional
  }

  // Initial loading
  if (isLoading) {
    return (
      <>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Content</h2>
          </div>
          <AILoadingSkeleton generatingText={t("generating")} />
        </div>
      </>
    );
  }

  // Status is "generating" - show skeleton with polling
  if (enhancedData?.aiStatus === "generating") {
    return (
      <>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Content</h2>
          </div>
          <AILoadingSkeleton generatingText={t("generating")} />
        </div>
      </>
    );
  }

  // Status is "unavailable" or no AI content
  if (enhancedData?.aiStatus === "unavailable" || !hasAIContent) {
    return null;
  }

  // Status is "ready" - show AI content
  return (
    <>
      <Separator />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" disabled={!enhancedData?.aiOverview}>
            AI Overview
          </TabsTrigger>
          <TabsTrigger value="guide" disabled={!enhancedData?.guideInfo}>
            Guide Info
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            disabled={!enhancedData?.relatedVideos || enhancedData.relatedVideos.length === 0}
          >
            {tPlace("videos")} ({enhancedData?.relatedVideos?.length || 0})
          </TabsTrigger>
        </TabsList>

        {enhancedData?.aiOverview && (
          <TabsContent value="overview" className="mt-4">
            <AIOverviewSection overview={enhancedData.aiOverview} />
          </TabsContent>
        )}

        {enhancedData?.guideInfo && (
          <TabsContent value="guide" className="mt-4">
            <GuideInfoSection guideInfo={enhancedData.guideInfo} />
          </TabsContent>
        )}

        {enhancedData?.relatedVideos && enhancedData.relatedVideos.length > 0 && (
          <TabsContent value="videos" className="mt-4">
            <RelatedVideosSection videos={enhancedData.relatedVideos} />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}
