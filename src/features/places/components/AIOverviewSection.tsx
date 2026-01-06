"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { AIPlaceOverview } from "@/shared/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Sparkles,
  History,
  Star,
  Clock,
  Lightbulb,
} from "lucide-react";

interface AIOverviewSectionProps {
  overview: AIPlaceOverview;
}

export function AIOverviewSection({ overview }: AIOverviewSectionProps) {
  const t = useTranslations("ai");
  const locale = useLocale();
  const [formattedDate, setFormattedDate] = useState<string>("");

  // Format date on client-side only to avoid hydration mismatch
  useEffect(() => {
    if (overview.generatedAt) {
      setFormattedDate(
        new Date(overview.generatedAt).toLocaleDateString(
          locale === "th" ? "th-TH" : "en-US"
        )
      );
    }
  }, [overview.generatedAt, locale]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{t("aiOverview")}</h2>
        <Badge variant="secondary" className="text-xs">
          {t("aiGenerated")}
        </Badge>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-muted-foreground leading-relaxed">
            {overview.summary}
          </p>
        </CardContent>
      </Card>

      {/* History */}
      {overview.history && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4" />
              {t("historySection")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {overview.history}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Highlights */}
      {overview.highlights && overview.highlights.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" />
              {t("highlights")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {overview.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Best Time to Visit */}
      {overview.bestTimeToVisit && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              {t("bestTimeToVisit")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {overview.bestTimeToVisit}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {overview.tips && overview.tips.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4" />
              {t("tips")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {overview.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-500 mt-1">💡</span>
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Generated At */}
      {overview.generatedAt && formattedDate && (
        <p className="text-xs text-muted-foreground text-right">
          {t("generatedByAI", { date: formattedDate })}
        </p>
      )}
    </div>
  );
}
