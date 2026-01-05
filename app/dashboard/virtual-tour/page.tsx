"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Globe, ExternalLink, MapPin, Building2, Compass, Camera } from "lucide-react";

const virtualTours = [
  {
    id: 1,
    title: "360Cities Thailand",
    description: "สำรวจสถานที่ท่องเที่ยวทั่วประเทศไทยในมุมมอง 360 องศา คอลเลกชันภาพพาโนรามาคุณภาพสูงจากช่างภาพทั่วโลก",
    url: "https://www.360cities.net/area/thailand",
    icon: Compass,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    tags: ["360°", "Panorama", "Photography"],
  },
  {
    id: 2,
    title: "360Stories Thailand",
    description: "เรื่องราวและประสบการณ์เสมือนจริงของประเทศไทย นำเสนอวัฒนธรรม ประวัติศาสตร์ และสถานที่สำคัญ",
    url: "https://360stories.com/thailand",
    icon: Camera,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    tags: ["VR", "Stories", "Culture"],
  },
  {
    id: 3,
    title: "King Power MahaNakhon",
    description: "ทัวร์เสมือนจริงตึก King Power MahaNakhon จุดชมวิวที่สูงที่สุดในกรุงเทพฯ พร้อม Glass Tray สุดตื่นเต้น",
    url: "https://kingpowermahanakhon.co.th/virtualtour/",
    icon: Building2,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    tags: ["Landmark", "Bangkok", "Skywalk"],
  },
  {
    id: 4,
    title: "Thai Virtual Tour",
    description: "รวมทัวร์เสมือนจริงสถานที่ท่องเที่ยวยอดนิยมในประเทศไทย วัด พระราชวัง พิพิธภัณฑ์ และอื่นๆ",
    url: "https://thaivirtualtour.com/",
    icon: MapPin,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    tags: ["Temple", "Palace", "Museum"],
  },
];

export default function VirtualTourPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Virtual Tour</h1>
            <p className="text-sm text-muted-foreground">
              สำรวจสถานที่ท่องเที่ยวผ่านทัวร์เสมือนจริง 360 องศา
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {virtualTours.map((tour) => {
          const IconComponent = tour.icon;
          return (
            <Card
              key={tour.id}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tour.bgGradient} opacity-50 transition-opacity group-hover:opacity-70`}
              />

              {/* Content */}
              <CardContent className="relative p-6">
                <div className="flex flex-col gap-4">
                  {/* Icon & Title */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tour.gradient} text-white shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{tour.title}</h3>
                        <div className="flex gap-1.5 mt-1">
                          {tour.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tour.description}
                  </p>

                  {/* Action Button */}
                  <Button
                    asChild
                    className={`w-full bg-gradient-to-r ${tour.gradient} hover:opacity-90 transition-opacity`}
                  >
                    <a
                      href={tour.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>เข้าชมทัวร์เสมือนจริง</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Globe className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">เกี่ยวกับ Virtual Tour</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Virtual Tour ช่วยให้คุณสามารถสำรวจสถานที่ท่องเที่ยวต่างๆ ได้จากทุกที่ทุกเวลา
                ผ่านเทคโนโลยีภาพ 360 องศาและ VR เหมาะสำหรับการวางแผนการเดินทางหรือเรียนรู้เกี่ยวกับสถานที่ก่อนไปจริง
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
