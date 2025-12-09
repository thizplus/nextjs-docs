import { Star, StarHalf } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface RatingProps {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Rating({
  rating,
  maxRating = 5,
  showValue = true,
  size = "md",
  className,
}: RatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const iconSize = sizeClasses[size];

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={cn(iconSize, "fill-yellow-400 text-yellow-400")}
        />
      );
    }

    if (hasHalfStar && stars.length < maxRating) {
      stars.push(
        <StarHalf
          key="half"
          className={cn(iconSize, "fill-yellow-400 text-yellow-400")}
        />
      );
    }

    const emptyStars = maxRating - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={cn(iconSize, "text-gray-300")}
        />
      );
    }

    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">{renderStars()}</div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
