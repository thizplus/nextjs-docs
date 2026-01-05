"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { favoritesService } from "@/services";
import { useAuth } from "@/shared/hooks";
import { LoginPromptModal } from "@/shared/components/auth/LoginPromptModal";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface FavoriteItem {
  type: "place" | "website" | "image" | "video";
  externalId: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  metadata?: Record<string, unknown>;
}

interface FavoriteButtonProps {
  item: FavoriteItem;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  /** Pre-fetched favorite status - if provided, skips individual API check */
  initialIsFavorite?: boolean;
}

export function FavoriteButton({
  item,
  size = "md",
  variant = "ghost",
  initialIsFavorite,
}: FavoriteButtonProps) {
  const { isAuthenticated, hasHydrated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  // Update state when initialIsFavorite prop changes
  useEffect(() => {
    if (initialIsFavorite !== undefined) {
      setIsFavorite(initialIsFavorite);
    }
  }, [initialIsFavorite]);

  // Only check favorite status if initialIsFavorite was not provided
  useEffect(() => {
    if (initialIsFavorite === undefined && hasHydrated && isAuthenticated && item.externalId) {
      checkFavoriteStatus();
    }
  }, [hasHydrated, isAuthenticated, item.externalId, initialIsFavorite]);

  const checkFavoriteStatus = async () => {
    setIsChecking(true);
    try {
      const response = await favoritesService.check({
        type: item.type,
        externalId: item.externalId,
      });
      if (response.success && response.data) {
        setIsFavorite(response.data.isFavorite);
      }
    } catch {
      // Ignore errors
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await favoritesService.toggle({
        type: item.type,
        externalId: item.externalId,
        title: item.title,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        rating: item.rating,
        reviewCount: item.reviewCount,
        address: item.address,
        metadata: item.metadata,
      });

      if (response.success) {
        const newState = !isFavorite;
        setIsFavorite(newState);
        toast.success(newState ? "เพิ่มในรายการโปรดแล้ว" : "ลบออกจากรายการโปรดแล้ว");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const tooltipContent = isFavorite ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด";

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size="icon"
              className={cn(sizeClasses[size])}
              onClick={handleToggle}
              disabled={isLoading || isChecking}
              aria-label={tooltipContent}
            >
              {isLoading || isChecking ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite && "fill-red-500 text-red-500",
                    !isFavorite && "hover:fill-red-500 hover:text-red-500"
                  )}
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        feature="รายการโปรด"
      />
    </>
  );
}
