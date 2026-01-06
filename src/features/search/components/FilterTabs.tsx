"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { SearchType } from "@/shared/types/common";
import { Sparkles, Globe, Image, Video, Map, MapPin, LucideIcon } from "lucide-react";

interface FilterTabsProps {
  activeTab: SearchType;
  onTabChange: (tab: SearchType) => void;
}

type TabKey = "ai" | "all" | "place" | "website" | "image" | "video" | "map";

const tabs: { value: SearchType; key: TabKey; icon: LucideIcon | null }[] = [
  { value: "ai", key: "ai", icon: Sparkles },
  { value: "all", key: "all", icon: null },
  { value: "place", key: "place", icon: MapPin },
  { value: "website", key: "website", icon: Globe },
  { value: "image", key: "image", icon: Image },
  { value: "video", key: "video", icon: Video },
  { value: "map", key: "map", icon: Map },
];

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  const t = useTranslations("search");

  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as SearchType)}>
      <TabsList className="w-full justify-start overflow-x-auto">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2"
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {t(`tabs.${tab.key}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
