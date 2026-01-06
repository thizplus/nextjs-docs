"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type RouteKey = "dashboard" | "search" | "ai" | "my-folder" | "profile" | "settings" | "help" | "place" | "favorites" | "translate" | "qr-code" | "virtual-tour" | "map";

const routeKeyMap: Record<string, RouteKey> = {
  dashboard: "dashboard",
  search: "search",
  ai: "ai",
  "my-folder": "my-folder",
  profile: "profile",
  settings: "settings",
  help: "help",
  place: "place",
  favorites: "favorites",
  translate: "translate",
  "qr-code": "qr-code",
  "virtual-tour": "virtual-tour",
  map: "map",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("breadcrumb");

  // Split pathname and filter empty strings, also filter out locale segments
  const segments = pathname.split("/").filter(Boolean).filter(seg => seg !== "th" && seg !== "en");

  // Generate breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const routeKey = routeKeyMap[segment];
    const name = routeKey ? t(routeKey) : segment;
    const isLast = index === segments.length - 1;

    return {
      href,
      name,
      isLast,
    };
  });

  // Don't show breadcrumb if we're at root dashboard
  if (breadcrumbItems.length <= 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{t("dashboard")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isLast ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && (
              <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
