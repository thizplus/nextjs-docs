"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Folder, Check, CheckCircle2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { useFolders, useAddFolderItem, useCheckItemInFolders } from "../hooks";
import { CreateFolderDialog } from "./CreateFolderDialog";
import type { AddFolderItemRequest } from "@/shared/types/request";

interface AddToFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Omit<AddFolderItemRequest, "type"> & { type: string };
}

export function AddToFolderDialog({
  open,
  onOpenChange,
  item,
}: AddToFolderDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const { data: foldersData, isLoading: isLoadingFolders } = useFolders();
  const { data: checkResult } = useCheckItemInFolders(item.url, open && !!item.url);
  const addFolderItem = useAddFolderItem();

  const folders = foldersData?.folders || [];
  const savedFolderIds = checkResult?.folderIds || [];

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedFolderId(null);
    }
  }, [open]);

  const handleAddToFolder = async () => {
    if (!selectedFolderId) {
      toast.error("กรุณาเลือก Folder");
      return;
    }

    try {
      await addFolderItem.mutateAsync({
        folderId: selectedFolderId,
        type: item.type as AddFolderItemRequest["type"],
        title: item.title,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        description: item.description,
        metadata: item.metadata,
      });
      toast.success(`เพิ่ม "${item.title}" ไปยัง Folder เรียบร้อย`);
      setSelectedFolderId(null);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถเพิ่มไปยัง Folder ได้"
      );
    }
  };

  const isFolderAlreadySaved = (folderId: string) => {
    return savedFolderIds.includes(folderId);
  };

  // Count how many folders are available (not already saved)
  const availableFoldersCount = folders.filter(f => !isFolderAlreadySaved(f.id)).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มไปยัง Folder</DialogTitle>
          <DialogDescription className="line-clamp-1">
            เลือก Folder สำหรับ "{item.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoadingFolders ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">ยังไม่มี Folder</p>
              <CreateFolderDialog
                trigger={
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    สร้าง Folder ใหม่
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {savedFolderIds.length > 0 && (
                <div className="mb-3 p-2 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    บันทึกไว้แล้วใน {savedFolderIds.length} Folder
                  </p>
                </div>
              )}

              <ScrollArea className="h-[250px] pr-4">
                <div className="space-y-2">
                  {folders.map((folder) => {
                    const isAlreadySaved = isFolderAlreadySaved(folder.id);
                    const isSelected = selectedFolderId === folder.id;

                    return (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => {
                          if (!isAlreadySaved) {
                            setSelectedFolderId(folder.id);
                          }
                        }}
                        disabled={isAlreadySaved}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                          isAlreadySaved
                            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 cursor-not-allowed opacity-75"
                            : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {folder.coverImageUrl ? (
                            <img
                              src={folder.coverImageUrl}
                              alt={folder.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                              <Folder className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium line-clamp-1">{folder.name}</p>
                            {isAlreadySaved && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                บันทึกแล้ว
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {folder.itemCount} รายการ
                          </p>
                        </div>
                        {isAlreadySaved ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : isSelected ? (
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="mt-4 pt-4 border-t">
                <CreateFolderDialog
                  trigger={
                    <Button variant="ghost" className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      สร้าง Folder ใหม่
                    </Button>
                  }
                />
              </div>
            </>
          )}
        </div>

        {folders.length > 0 && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleAddToFolder}
              disabled={!selectedFolderId || addFolderItem.isPending || availableFoldersCount === 0}
            >
              {addFolderItem.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              เพิ่มไปยัง Folder
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
