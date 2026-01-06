"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
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
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
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
      toast.success(t("saved"));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t("saveFailed"));
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
      toast.error(t("selectImageFile"));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("fileTooLarge"));
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await userService.updateAvatar(file);
      await fetchProfile();
      toast.success(t("photoUploaded"));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t("uploadFailed"));
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm(t("confirmDeletePhoto"))) return;

    try {
      await userService.deleteAvatar();
      await fetchProfile();
      toast.success(t("photoDeleted"));
    } catch {
      toast.error(t("deleteFailed"));
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    // Replace current locale in pathname with new locale
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
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
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
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
              {t("profileInfo")}
            </CardTitle>
            <CardDescription>
              {t("profileInfoDesc")}
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
                  {t("changePhoto")}
                </Button>

                {user.avatar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("deletePhoto")}
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label>{t("email")}</Label>
                <Input
                  value={user.email || "-"}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t("cannotChange")}
                </p>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("firstName")} *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder={t("firstNamePlaceholder")}
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm">
                    {errors.firstName.type === "too_small" ? t("firstNameRequired") : t("firstNameMax")}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("lastName")} *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder={t("lastNamePlaceholder")}
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm">
                    {errors.lastName.type === "too_small" ? t("lastNameRequired") : t("lastNameMax")}
                  </p>
                )}
              </div>

              {/* Provider Info */}
              <div className="space-y-2">
                <Label>{t("loginWith")}</Label>
                <p className="text-sm text-muted-foreground">
                  {user.authProvider === "google" && "Google"}
                  {user.authProvider === "line" && "LINE"}
                  {user.authProvider === "local" && t("email")}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isDirty}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t("saveData")}
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
              {t("appearance")}
            </CardTitle>
            <CardDescription>
              {t("appearanceDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>{t("theme")}</Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="flex gap-3"
              >
                <div>
                  <RadioGroupItem
                    value="light"
                    id="light"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="light"
                    className="flex items-center gap-2 rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Sun className="h-4 w-4" />
                    {t("light")}
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
                    className="flex items-center gap-2 rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Moon className="h-4 w-4" />
                    {t("dark")}
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
              {t("language")}
            </CardTitle>
            <CardDescription>
              {t("languageDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>{t("selectLanguage")}</Label>
              <RadioGroup
                value={locale}
                onValueChange={handleLanguageChange}
                className="flex gap-3"
              >
                <div>
                  <RadioGroupItem
                    value="th"
                    id="lang-th"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="lang-th"
                    className="flex items-center gap-2 rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span>🇹🇭</span>
                    ไทย
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="en"
                    id="lang-en"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="lang-en"
                    className="flex items-center gap-2 rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span>🇺🇸</span>
                    English
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
