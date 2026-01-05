"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { AddToFolderDialog } from "@/features/folders";
import type { AddFolderItemRequest } from "@/shared/types/request";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface FolderButtonProps {
  item: Omit<AddFolderItemRequest, "type"> & { type: string };
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  /** Pre-fetched status: if true, shows filled icon */
  isSaved?: boolean;
}

export function FolderButton({
  item,
  size = "md",
  variant = "ghost",
  isSaved = false,
}: FolderButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

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
              aria-label={isSaved ? "จัดการ Folder" : "เพิ่มลง Folder"}
            >
              <FolderPlus
                className={cn(
                  "h-5 w-5 transition-colors",
                  isSaved && "fill-blue-500 text-blue-500",
                  !isSaved && "hover:fill-blue-500 hover:text-blue-500"
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSaved ? "อยู่ใน Folder แล้ว" : "เพิ่มลง Folder"}</p>
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
