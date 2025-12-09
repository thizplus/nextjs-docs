"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { SearchType } from "@/shared/types/common";
import { Sparkles, Globe, Image, Video, Map } from "lucide-react";

interface FilterTabsProps {
  activeTab: SearchType;
  onTabChange: (tab: SearchType) => void;
}

const tabs = [
  { value: "ai" as SearchType, label: "AI Mode", icon: Sparkles },
  { value: "all" as SearchType, label: "ทั้งหมด", icon: null },
  { value: "website" as SearchType, label: "เว็บไซต์", icon: Globe },
  { value: "image" as SearchType, label: "รูปภาพ", icon: Image },
  { value: "video" as SearchType, label: "วิดีโอ", icon: Video },
  { value: "map" as SearchType, label: "แผนที่", icon: Map },
];

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
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
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
