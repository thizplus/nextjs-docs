"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Plus, Folder, Lock, Globe } from "lucide-react";
import { useFolders, CreateFolderDialog } from "@/features/folders";

export default function MyFolderPage() {
  const { data: foldersData, isLoading } = useFolders();
  const folders = foldersData?.folders || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">โฟลเดอร์ของฉัน</h1>
          <p className="text-muted-foreground mt-1">
            จัดการและเก็บรวบรวมสถานที่ท่องเที่ยวที่คุณสนใจ
          </p>
        </div>
        <CreateFolderDialog
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              สร้าง Folder ใหม่
            </Button>
          }
        />
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {folders.map((folder) => (
          <Link key={folder.id} href={`/dashboard/my-folder/${folder.id}`}>
            <Card className="py-0 gap-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="relative aspect-square overflow-hidden">
                {folder.coverImageUrl ? (
                  <img
                    src={folder.coverImageUrl}
                    alt={folder.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900 dark:to-sky-900 flex items-center justify-center">
                    <Folder className="h-12 w-12 text-blue-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {folder.isPublic ? (
                    <div className="p-1.5 rounded-full bg-green-500/90 text-white">
                      <Globe className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-full bg-black/50 text-white">
                      <Lock className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                  {folder.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {folder.itemCount} รายการ
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {folders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Folder className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">ยังไม่มี Folder</h3>
          <p className="text-muted-foreground max-w-md mb-4">
            สร้าง Folder เพื่อเก็บรวบรวมสถานที่ท่องเที่ยวที่คุณสนใจ
          </p>
          <CreateFolderDialog
            trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                สร้าง Folder แรก
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
