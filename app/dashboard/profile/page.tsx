"use client";

import { useUser, useLogout } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useFavorites } from "@/features/favorites";
import { useFolders } from "@/features/folders";
import { useSearchHistory } from "@/features/search";
import { Clock, Heart, LogOut, Search, FolderHeart } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const user = useUser();
  const logout = useLogout();
  const { data: favoritesData, isLoading: favoritesLoading } = useFavorites();
  const { data: foldersData, isLoading: foldersLoading } = useFolders();
  const { data: historyData, isLoading: historyLoading } = useSearchHistory();

  const favorites = favoritesData?.favorites || [];
  const folders = foldersData?.folders || [];
  const searchHistory = historyData?.histories || [];

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">กรุณาเข้าสู่ระบบ</p>
        <Link href="/login">
          <Button className="mt-4">เข้าสู่ระบบ</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6 flex-wrap">
            <Avatar className="h-24 w-24">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`} />
              <AvatarFallback className="text-2xl">{user.firstName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.firstName} {user.lastName}</h1>
              <p className="text-muted-foreground mb-3">{user.email}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">@{user.username}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/settings">
                <Button variant="outline">แก้ไขโปรไฟล์</Button>
              </Link>
              <Button variant="destructive" className="gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Search History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              ประวัติการค้นหา
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : searchHistory.length > 0 ? (
              <div className="space-y-3">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/dashboard/search?q=${encodeURIComponent(item.query)}`}
                        className="text-sm hover:text-primary hover:underline"
                      >
                        {item.query}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("th-TH")}
                      </span>
                    </div>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.searchType}
                      </Badge>
                    </div>
                    {index < Math.min(searchHistory.length, 5) - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                ยังไม่มีประวัติการค้นหา
              </p>
            )}
            {searchHistory.length > 5 && (
              <Button variant="link" className="w-full mt-4">
                ดูทั้งหมด
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              รายการโปรด
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoritesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : favorites.length > 0 ? (
              <div className="space-y-3">
                {favorites.slice(0, 5).map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-3">
                      {item.thumbnailUrl && (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/dashboard/place/${item.externalId || item.id}`}
                          className="text-sm font-medium hover:text-primary hover:underline line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {index < Math.min(favorites.length, 5) - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                ยังไม่มีรายการโปรด
              </p>
            )}
            {favorites.length > 5 && (
              <Link href="/dashboard/my-folder">
                <Button variant="link" className="w-full mt-4">
                  ดูทั้งหมด
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Folders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderHeart className="h-5 w-5" />
            โฟลเดอร์ของฉัน
          </CardTitle>
        </CardHeader>
        <CardContent>
          {foldersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : folders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.slice(0, 6).map((folder) => (
                <Link
                  key={folder.id}
                  href={`/dashboard/my-folder/${folder.id}`}
                  className="block"
                >
                  <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-start gap-3">
                      {folder.coverImageUrl ? (
                        <img
                          src={folder.coverImageUrl}
                          alt={folder.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <FolderHeart className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">{folder.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {folder.itemCount} รายการ
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              ยังไม่มีโฟลเดอร์
            </p>
          )}
          {folders.length > 6 && (
            <Link href="/dashboard/my-folder">
              <Button variant="link" className="w-full mt-4">
                ดูทั้งหมด ({folders.length} โฟลเดอร์)
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="py-0 gap-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {searchHistory.length}
                </p>
                <p className="text-sm text-muted-foreground">ครั้งที่ค้นหา</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="py-0 gap-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/10">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {favorites.length}
                </p>
                <p className="text-sm text-muted-foreground">รายการโปรด</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="py-0 gap-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <FolderHeart className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {foldersLoading ? "-" : folders.length}
                </p>
                <p className="text-sm text-muted-foreground">โฟลเดอร์</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
