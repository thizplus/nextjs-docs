"use client";

import { useTranslations } from "next-intl";
import type { PlaceGuideInfo } from "@/shared/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import {
  BookOpen,
  Mic,
  HelpCircle,
  Info,
} from "lucide-react";

interface GuideInfoSectionProps {
  guideInfo: PlaceGuideInfo;
}

export function GuideInfoSection({ guideInfo }: GuideInfoSectionProps) {
  const t = useTranslations("ai");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{t("guideInfo")}</h2>
        <Badge variant="outline" className="text-xs">
          {t("forTourGuides")}
        </Badge>
      </div>

      {/* Quick Facts */}
      {guideInfo.quickFacts && guideInfo.quickFacts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-4 w-4" />
              {t("quickFacts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {guideInfo.quickFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-500 font-bold">#{idx + 1}</span>
                  <span className="text-muted-foreground">{fact}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Talking Points */}
      {guideInfo.talkingPoints && guideInfo.talkingPoints.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic className="h-4 w-4" />
              {t("talkingPoints")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {guideInfo.talkingPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Common Questions (FAQ) */}
      {guideInfo.commonQuestions && guideInfo.commonQuestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="h-4 w-4" />
              {t("commonQuestions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              {guideInfo.commonQuestions.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-sm text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
