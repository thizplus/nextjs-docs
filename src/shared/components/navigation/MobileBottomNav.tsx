"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Sparkles, Folder, User } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navItems = [
  {
    title: "หน้าแรก",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "ค้นหา",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    title: "AI",
    href: "/dashboard/ai",
    icon: Sparkles,
  },
  {
    title: "โฟลเดอร์",
    href: "/dashboard/my-folder",
    icon: Folder,
  },
  {
    title: "โปรไฟล์",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary")} />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
