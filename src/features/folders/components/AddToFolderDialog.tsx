"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { useFolders, useAddFolderItem, useCheckItemInFolders, useCreateFolder } from "../hooks";
import type { AddFolderItemRequest } from "@/shared/types/request";

type CreateFolderForm = {
  name: string;
  description?: string;
  isPublic: boolean;
};

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
  const [activeTab, setActiveTab] = useState<"select" | "create">("select");

  const { data: foldersData, isLoading: isLoadingFolders } = useFolders();
  const { data: checkResult } = useCheckItemInFolders(item.url, open && !!item.url);
  const addFolderItem = useAddFolderItem();
  const createFolder = useCreateFolder();

  const t = useTranslations("folder");
  const tValidation = useTranslations("validation");
  const tCommon = useTranslations("common");

  const folders = foldersData?.folders || [];
  const savedFolderIds = checkResult?.folderIds || [];

  const createFolderSchema = z.object({
    name: z
      .string()
      .min(1, tValidation("required", { field: tValidation("folderName") }))
      .max(100, tValidation("maxLength", { field: tValidation("folderName"), max: "100" })),
    description: z.string().max(500, tValidation("maxLength", { field: tValidation("folderDescription"), max: "500" })).optional(),
    isPublic: z.boolean(),
  });

  const form = useForm<CreateFolderForm>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
    },
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedFolderId(null);
      setActiveTab("select");
      form.reset();
    }
  }, [open, form]);

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

  const handleCreateFolder = async (data: CreateFolderForm) => {
    try {
      await createFolder.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        isPublic: data.isPublic,
      });
      toast.success(t("created"));
      form.reset();
      setActiveTab("select");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("createFailed")
      );
    }
  };

  const isFolderAlreadySaved = (folderId: string) => {
    return savedFolderIds.includes(folderId);
  };

  const availableFoldersCount = folders.filter(f => !isFolderAlreadySaved(f.id)).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>เพิ่มไปยัง Folder</DialogTitle>
          <DialogDescription className="line-clamp-1">
            "{item.title}"
          </DialogDescription>
        </DialogHeader>

        {/* Custom Tab Buttons - ใช้ div และ button ธรรมดา */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("select")}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === "select"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            เลือก Folder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1",
              activeTab === "create"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Plus className="h-4 w-4" />
            สร้างใหม่
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "select" ? (
          <div className="mt-4">
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
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setActiveTab("create")}
                >
                  <Plus className="h-4 w-4" />
                  สร้าง Folder ใหม่
                </Button>
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
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                            isAlreadySaved
                              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 cursor-not-allowed opacity-75"
                              : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted/50"
                          )}
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

                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    ยกเลิก
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddToFolder}
                    disabled={!selectedFolderId || addFolderItem.isPending || availableFoldersCount === 0}
                  >
                    {addFolderItem.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    เพิ่มไปยัง Folder
                  </Button>
                </DialogFooter>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateFolder)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("folderName")} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t("namePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("folderDescription")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("descriptionPlaceholder")}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>{t("public")}</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          {t("sharePublic")}
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("select")}
                  >
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    type="button"
                    disabled={createFolder.isPending}
                    onClick={form.handleSubmit(handleCreateFolder)}
                  >
                    {createFolder.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("createFolder")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
