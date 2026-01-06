"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  ChevronsUpDown,
  LogOut,
  User,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar"
import { useLogout } from "@/features/auth"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar?: string
  }
}) {
  const { isMobile } = useSidebar()
  const logout = useLogout()
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const t = useTranslations("nav")
  const tSettings = useTranslations("settings")
  const tCommon = useTranslations("common")

  // Track mounted state to prevent hydration mismatch with theme
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleProfileClick = () => {
    router.push("/dashboard/profile")
  }

  const handleLogout = () => {
    logout()
  }

  const getThemeIcon = () => {
    if (!mounted) return <Sun className="h-4 w-4" />
    if (resolvedTheme === "dark") return <Moon className="h-4 w-4" />
    return <Sun className="h-4 w-4" />
  }

  const toggleTheme = () => {
    if (resolvedTheme === "light") setTheme("dark")
    else setTheme("light")
  }

  const getThemeLabel = () => {
    if (!mounted) return tSettings("lightMode")
    if (resolvedTheme === "dark") return tSettings("darkMode")
    return tSettings("lightMode")
  }

  // Use consistent value for SSR, then actual value after mount
  const dropdownSide = mounted ? (isMobile ? "bottom" : "right") : "right"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={dropdownSide}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {getThemeIcon()}
              {tSettings("theme")}: {getThemeLabel()}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              {tCommon("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
