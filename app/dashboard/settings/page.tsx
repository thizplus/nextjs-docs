"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUser, useAuthStore } from "@/features/auth";
import { userService } from "@/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Settings,
  Globe,
  Palette,
  Sun,
  Moon,
  Camera,
  Loader2,
  Save,
  Trash2,
  User as UserIcon
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ").max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล").max(50, "นามสกุลต้องไม่เกิน 50 ตัวอักษร"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = useUser();
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await userService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await fetchProfile();
      toast.success("บันทึกข้อมูลสำเร็จ");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await userService.updateAvatar(file);
      await fetchProfile();
      toast.success("อัปโหลดรูปโปรไฟล์สำเร็จ");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "อัปโหลดไม่สำเร็จ");
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm("ต้องการลบรูปโปรไฟล์?")) return;

    try {
      await userService.deleteAvatar();
      await fetchProfile();
      toast.success("ลบรูปโปรไฟล์สำเร็จ");
    } catch {
      toast.error("ลบไม่สำเร็จ");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">ตั้งค่า</h1>
          <p className="text-sm text-muted-foreground">
            จัดการข้อมูลโปรไฟล์และการตั้งค่าบัญชี
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              ข้อมูลโปรไฟล์
            </CardTitle>
            <CardDescription>
              แก้ไขข้อมูลส่วนตัวและรูปโปรไฟล์
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user.firstName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  เปลี่ยนรูป
                </Button>

                {user.avatar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    ลบรูป
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label>อีเมล</Label>
                <Input
                  value={user.email || "-"}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  ไม่สามารถเปลี่ยนแปลงได้
                </p>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">ชื่อ *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="กรอกชื่อ"
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">นามสกุล *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="กรอกนามสกุล"
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Provider Info */}
              <div className="space-y-2">
                <Label>เข้าสู่ระบบด้วย</Label>
                <div className="flex items-center gap-2">
                  {user.authProvider === "google" && (
                    <span className="px-3 py-1 bg-background text-foreground border rounded-full text-sm">
                      Google
                    </span>
                  )}
                  {user.authProvider === "line" && (
                    <span className="px-3 py-1 bg-background text-foreground border rounded-full text-sm">
                      LINE
                    </span>
                  )}
                  {user.authProvider === "local" && (
                    <span className="px-3 py-1 bg-background text-foreground border rounded-full text-sm">
                      อีเมล
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isDirty}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    บันทึกข้อมูล
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              รูปลักษณ์
            </CardTitle>
            <CardDescription>
              ปรับแต่งธีมของแอป
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>ธีม</Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="light"
                    id="light"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Sun className="mb-3 h-6 w-6" />
                    สว่าง
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="dark"
                    id="dark"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Moon className="mb-3 h-6 w-6" />
                    มืด
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              ภาษา
            </CardTitle>
            <CardDescription>
              ภาษาที่ใช้งานในระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 rounded-md border-2 border-primary bg-popover p-4">
              🇹🇭 ไทย
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
