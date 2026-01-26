"use client";

import dynamic from "next/dynamic";
import { AuthGuard } from "@/features/auth";
import { MobileBottomNav } from "@/shared/components/navigation/MobileBottomNav";
import { DynamicBreadcrumb } from "@/shared/components/navigation/DynamicBreadcrumb";
import { LanguageSwitcher } from "@/shared/components/common/LanguageSwitcher";
import { Separator } from "@/shared/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { PageViewTracker } from "@/shared/components/analytics/PageViewTracker";

// Dynamic import to avoid hydration mismatch with Radix UI Collapsible
const AppSidebar = dynamic(
  () => import("@/shared/components/navigation/sidebar").then((mod) => mod.AppSidebar),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <PageViewTracker />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
            </div>
            <div className="px-4">
              <LanguageSwitcher />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 pb-20 md:pb-4 h-full min-w-0 overflow-x-hidden">
            {children}
          </div>
          <MobileBottomNav />
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
