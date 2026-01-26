"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Home,
  Search,
  Folder,
  User,
  Settings,
  HelpCircle,
  Sparkles,
  Globe,
  MapPin,
  QrCode,
  Languages,
  Heart,
  BarChart3,
  FolderHeart,
  FileBarChart,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { useUser } from "@/features/auth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser()
  const t = useTranslations("nav")
  const tAuth = useTranslations("auth")

  const navMain = [
    {
      title: t("home"),
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: t("aiAssistant"),
      url: "/dashboard/ai",
      icon: Sparkles,
    },
    {
      title: t("search"),
      url: "/dashboard/search",
      icon: Search,
      isActive: true,
      items: [
        {
          title: t("all"),
          url: "/dashboard/search?type=all",
        },
        {
          title: t("website"),
          url: "/dashboard/search?type=website",
        },
        {
          title: t("image"),
          url: "/dashboard/search?type=image",
        },
        {
          title: t("video"),
          url: "/dashboard/search?type=video",
        },
      ],
    },
    {
      title: t("myFolder"),
      url: "/dashboard/my-folder",
      icon: Folder,
    },
    {
      title: t("favorites"),
      url: "/dashboard/favorites",
      icon: Heart,
    },
    {
      title: t("virtualTour"),
      url: "/dashboard/virtual-tour",
      icon: Globe,
    },
    {
      title: t("profile"),
      url: "/dashboard/profile",
      icon: User,
    },
  ]

  const navSecondary = [
    {
      title: t("translate"),
      url: "/dashboard/translate",
      icon: Languages,
    },
    {
      title: t("qrCode"),
      url: "/dashboard/qr-code",
      icon: QrCode,
    },
    {
      title: t("settings"),
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: t("help"),
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ]

  // Admin menu - only visible for admin role
  const navAdmin = [
    {
      title: t("adminDashboard"),
      url: "/dashboard/admin",
      icon: BarChart3,
      items: [
        {
          title: t("adminOverview"),
          url: "/dashboard/admin",
        },
        {
          title: t("adminPages"),
          url: "/dashboard/admin/pages",
        },
        {
          title: t("adminFolders"),
          url: "/dashboard/admin/folders",
        },
        {
          title: t("adminFavorites"),
          url: "/dashboard/admin/favorites",
        },
      ],
    },
  ]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <MapPin className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">STOU Smart Tour</span>
                  <span className="truncate text-xs">{t("stou")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label={t("usageMenu")} />
        {user?.role === "admin" && (
          <NavMain items={navAdmin} label={t("adminMenu")} />
        )}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ? {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: user.avatar,
        } : {
          name: tAuth("guest"),
          email: "guest@stou.ac.th",
          avatar: undefined,
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
