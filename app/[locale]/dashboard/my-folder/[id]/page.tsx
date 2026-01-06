"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useFolderDetail,
  useDeleteFolder,
  useDeleteFolderItem,
  useShareFolder,
  FileUploader,
} from "@/features/folders";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  ArrowLeft,
  MoreVertical,
  Trash2,
  Share2,
  Globe,
  Lock,
  MapPin,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  ExternalLink,
  Folder,
  Upload,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { FolderItem } from "@/shared/types/models";

const ITEM_TYPE_ICONS: Record<string, React.ReactNode> = {
  place: <MapPin className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  image: <ImageIcon className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
  website: <FileText className="h-5 w-5" />,
  link: <LinkIcon className="h-5 w-5" />,
};

// Types that are considered "uploaded files"
const UPLOADED_TYPES = ["image", "video", "pdf"];

function FolderItemCard({
  item,
  onDelete,
  t,
  tCommon,
}: {
  item: FolderItem;
  onDelete: () => void;
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getItemUrl = () => {
    if (item.type === "place" && item.metadata?.placeId) {
      return `/dashboard/place/${item.metadata.placeId}`;
    }
    return item.url;
  };

  const isExternalLink = !getItemUrl().startsWith("/");

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow py-0">
        <div className="flex">
          {/* Thumbnail */}
          <div className="w-28 h-28 flex-shrink-0 bg-muted">
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                {ITEM_TYPE_ICONS[item.type] || <LinkIcon className="h-8 w-8" />}
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {isExternalLink ? (
                    <a
                      href={getItemUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold line-clamp-1 hover:text-primary flex items-center gap-1"
                    >
                      {item.title}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <Link
                      href={getItemUrl()}
                      className="font-semibold line-clamp-1 hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  )}
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      {isExternalLink ? (
                        <a href={getItemUrl()} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t('openLink')}
                        </a>
                      ) : (
                        <Link href={getItemUrl()}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t('viewDetails')}
                        </Link>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('removeFromFolder')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {t(`types.${item.type}` as any) || item.type}
              </Badge>
              {typeof item.metadata?.rating === "number" && (
                <span className="text-xs text-muted-foreground">
                  ⭐ {item.metadata.rating}
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmRemoveItemTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmRemoveItemDesc', { title: item.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Compact file card for the right sidebar
function UploadedFileCard({
  item,
  onDelete,
  t,
  tCommon,
}: {
  item: FolderItem;
  onDelete: () => void;
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const Icon = item.type === "video" ? Video : item.type === "pdf" ? FileText : ImageIcon;

  return (
    <>
      <div className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
        {item.thumbnailUrl || item.url ? (
          item.type === "image" ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </a>
          ) : (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex flex-col items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <Icon className="w-8 h-8 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1 px-1 truncate w-full text-center">
                {item.title}
              </span>
            </a>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Icon className="w-8 h-8 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground mt-1 px-1 truncate w-full text-center">
              {item.title}
            </span>
          </div>
        )}

        {/* Delete button */}
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Type badge */}
        <div className="absolute bottom-1 left-1">
          <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-background/80">
            {t(`types.${item.type}` as any)}
          </Badge>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDeleteFileTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDeleteFileDesc', { title: item.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function FolderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations("folder");
  const tCommon = useTranslations("common");
  const [showDeleteFolderDialog, setShowDeleteFolderDialog] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const { data: folder, isLoading, error, refetch } = useFolderDetail(id);
  const deleteFolder = useDeleteFolder();
  const deleteFolderItem = useDeleteFolderItem(id);
  const shareFolder = useShareFolder();

  const handleDeleteFolder = async () => {
    try {
      await deleteFolder.mutateAsync(id);
      toast.success(t('deleted'));
      router.push("/dashboard/my-folder");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('deleteFailed')
      );
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteFolderItem.mutateAsync(itemId);
      toast.success(t('itemRemoved'));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('removeItemFailed')
      );
    }
  };

  const handleToggleShare = async () => {
    if (!folder) return;
    try {
      await shareFolder.mutateAsync({
        id,
        isPublic: !folder.isPublic,
      });
      toast.success(
        folder.isPublic
          ? t('madePrivate')
          : t('madePublic')
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('statusChangeFailed')
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !folder) {
    return (
      <div className="text-center py-16">
        <Folder className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{t('notFound')}</p>
        <Link href="/dashboard/my-folder">
          <Button variant="outline">{t('backToFolders')}</Button>
        </Link>
      </div>
    );
  }

  const items = folder.items || [];
  // Separate items: places/links vs uploaded files
  const regularItems = items.filter((item) => !UPLOADED_TYPES.includes(item.type));
  const uploadedItems = items.filter((item) => UPLOADED_TYPES.includes(item.type));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{folder.name}</h1>
              {folder.isPublic ? (
                <Globe className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            {folder.description && (
              <p className="text-muted-foreground mt-1">{folder.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {t('items', { count: items.length })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowUploader(!showUploader)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {t('upload')}
            {showUploader ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleShare}>
                {folder.isPublic ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    {t('makePrivate')}
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('sharePublic')}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setShowDeleteFolderDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('deleteFolder')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Upload Section */}
      {showUploader && (
        <Card className="p-4">
          <FileUploader
            folderId={id}
            onUploadComplete={() => {
              refetch();
            }}
          />
        </Card>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left: Regular Items (places, links, etc.) */}
        <div>
          {regularItems.length === 0 && uploadedItems.length === 0 ? (
            <div className="text-center py-16">
              <Folder className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('emptyFolder')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('emptyFolderHint')}
              </p>
              <Link href="/dashboard">
                <Button>{t('goToSearch')}</Button>
              </Link>
            </div>
          ) : regularItems.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">{t('noPlaces')}</p>
              <Link href="/dashboard" className="mt-2 inline-block">
                <Button variant="outline" size="sm">{t('goToSearch')}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {regularItems.map((item) => (
                <FolderItemCard
                  key={item.id}
                  item={item}
                  onDelete={() => handleDeleteItem(item.id)}
                  t={t}
                  tCommon={tCommon}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Uploaded Files Gallery */}
        <div className="lg:sticky lg:top-4 h-fit">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">{t('uploadedFiles')}</h3>
            <span className="text-xs text-muted-foreground">({uploadedItems.length})</span>
          </div>

          {uploadedItems.length === 0 ? (
            <div className="border rounded-lg p-6 text-center bg-muted/30">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                {t('noUploadedFiles')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {uploadedItems.map((item) => (
                <UploadedFileCard
                  key={item.id}
                  item={item}
                  onDelete={() => handleDeleteItem(item.id)}
                  t={t}
                  tCommon={tCommon}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Folder Dialog */}
      <AlertDialog
        open={showDeleteFolderDialog}
        onOpenChange={setShowDeleteFolderDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDeleteDesc', { name: folder.name })}
              {' '}{t('cannotUndo')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('deleteFolder')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
