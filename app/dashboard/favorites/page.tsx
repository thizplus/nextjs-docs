"use client";

import { useState } from "react";
import Link from "next/link";
import { useFavorites, useRemoveFavorite } from "@/features/favorites";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
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
  Heart,
  MoreVertical,
  Trash2,
  ExternalLink,
  MapPin,
  Video,
  Image as ImageIcon,
  FileText,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Favorite } from "@/shared/types/models";

const ITEM_TYPE_ICONS: Record<string, React.ReactNode> = {
  place: <MapPin className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  image: <ImageIcon className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
  link: <LinkIcon className="h-5 w-5" />,
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  place: "สถานที่",
  video: "วิดีโอ",
  image: "รูปภาพ",
  pdf: "PDF",
  website: "เว็บไซต์",
  link: "ลิงก์",
};

function FavoriteCard({
  favorite,
  onRemove,
}: {
  favorite: Favorite;
  onRemove: () => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getItemUrl = () => {
    if (favorite.type === "place" && favorite.externalId) {
      return `/dashboard/place/${favorite.externalId}`;
    }
    return favorite.url;
  };

  const itemUrl = getItemUrl();
  const isExternalLink = itemUrl.startsWith("http");

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow py-0">
        <div className="flex">
          {/* Thumbnail */}
          <div className="w-28 h-28 flex-shrink-0 bg-muted">
            {favorite.thumbnailUrl ? (
              <img
                src={favorite.thumbnailUrl}
                alt={favorite.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                {ITEM_TYPE_ICONS[favorite.type] || <LinkIcon className="h-8 w-8" />}
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
                      href={itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold line-clamp-1 hover:text-primary flex items-center gap-1"
                    >
                      {favorite.title}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <Link
                      href={itemUrl}
                      className="font-semibold line-clamp-1 hover:text-primary"
                    >
                      {favorite.title}
                    </Link>
                  )}
                  {favorite.address && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {favorite.address}
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
                        <a href={itemUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          เปิดลิงก์
                        </a>
                      ) : (
                        <Link href={itemUrl}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          ดูรายละเอียด
                        </Link>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      ลบออกจากรายการโปรด
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {ITEM_TYPE_LABELS[favorite.type] || favorite.type}
              </Badge>
              {typeof favorite.rating === "number" && favorite.rating > 0 && (
                <span className="text-xs text-muted-foreground">
                  {favorite.rating.toFixed(1)}
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบออกจากรายการโปรด?</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบ &quot;{favorite.title}&quot; ออกจากรายการโปรดหรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={onRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function FavoritesPage() {
  const { data, isLoading, error } = useFavorites();
  const removeFavorite = useRemoveFavorite();

  const handleRemoveFavorite = async (id: string) => {
    try {
      await removeFavorite.mutateAsync(id);
      toast.success("ลบออกจากรายการโปรดแล้ว");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถลบรายการได้"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          ลองใหม่
        </Button>
      </div>
    );
  }

  const favorites = data?.favorites || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
          <Heart className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">รายการโปรด</h1>
          <p className="text-sm text-muted-foreground">
            {favorites.length} รายการที่คุณกดถูกใจ
          </p>
        </div>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">ยังไม่มีรายการโปรด</h3>
          <p className="text-muted-foreground mb-4">
            กดปุ่ม <Heart className="inline h-4 w-4 text-red-500" /> ที่การ์ดสถานที่เพื่อเพิ่มรายการโปรด
          </p>
          <Link href="/dashboard">
            <Button>ค้นหาสถานที่</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              onRemove={() => handleRemoveFavorite(favorite.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
