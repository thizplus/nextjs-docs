"use client"

import * as React from "react"
import {
  Home,
  Search,
  Folder,
  User,
  Settings,
  HelpCircle,
  Sparkles,
  Image,
  Video,
  Globe,
  Plane,
  QrCode,
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

const data = {
  navMain: [
    {
      title: "หน้าแรก",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "AI Assistant",
      url: "/dashboard/ai",
      icon: Sparkles,
    },
    {
      title: "ค้นหา",
      url: "/dashboard/search",
      icon: Search,
      items: [
        {
          title: "ทั้งหมด",
          url: "/dashboard/search?type=all",
        },
        {
          title: "เว็บไซต์",
          url: "/dashboard/search?type=website",
        },
        {
          title: "รูปภาพ",
          url: "/dashboard/search?type=image",
        },
        {
          title: "วิดีโอ",
          url: "/dashboard/search?type=video",
        },
      ],
    },
    {
      title: "โฟลเดอร์ของฉัน",
      url: "/dashboard/my-folder",
      icon: Folder,
    },
    {
      title: "โปรไฟล์",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
  navSecondary: [
    {
      title: "QR Code",
      url: "/dashboard/qr-code",
      icon: QrCode,
    },
    {
      title: "ตั้งค่า",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "ช่วยเหลือ",
      url: "/dashboard/help",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Plane className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">STOU Smart Tour</span>
                  <span className="truncate text-xs">มสธ.</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ? {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
        } : {
          name: "Guest",
          email: "guest@stou.ac.th",
          avatar: "/avatars/guest.jpg",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
