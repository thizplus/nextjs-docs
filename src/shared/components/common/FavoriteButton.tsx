"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { AddToFolderDialog, useCheckItemInFolders } from "@/features/folders";
import type { AddFolderItemRequest } from "@/shared/types/request";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface FavoriteButtonProps {
  item: Omit<AddFolderItemRequest, "type"> & { type: string };
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
}

export function FavoriteButton({
  item,
  size = "md",
  variant = "ghost",
}: FavoriteButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check if item is saved in any folder
  const { data: checkResult } = useCheckItemInFolders(item.url, !!item.url);
  const isSaved = checkResult?.isSaved || false;
  const savedFolders = checkResult?.folders || [];

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  const tooltipContent = isSaved
    ? `บันทึกใน: ${savedFolders.map((f) => f.name).join(", ")}`
    : "เพิ่มลง Folder";

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size="icon"
              className={cn(sizeClasses[size])}
              onClick={() => setIsDialogOpen(true)}
              aria-label={isSaved ? "แก้ไข Folder" : "เพิ่มลง Folder"}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isSaved
                    ? "fill-red-500 text-red-500"
                    : "hover:fill-red-500 hover:text-red-500"
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AddToFolderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={item}
      />
    </>
  );
}
