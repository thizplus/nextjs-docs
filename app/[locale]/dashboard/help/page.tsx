"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { HelpCircle, Mail, Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

// FAQ structure definition for type safety
const faqStructure = {
  gettingStarted: ["createAccount", "forgotPassword", "otherUniversity"],
  search: ["howToSearch", "aiMode", "imageSearch", "voiceSearch"],
  folders: ["whatIsFolder", "createFolder", "saveToFolder", "shareFolder"],
  favorites: ["whatIsFavorites", "differenceFolders"],
  privacy: ["dataSecurity", "deleteAccount"],
} as const;

export default function HelpPage() {
  const t = useTranslations("help");
  const [searchQuery, setSearchQuery] = useState("");

  // Build FAQs from translations
  const faqs = Object.entries(faqStructure).map(([categoryKey, items]) => ({
    category: t(`faqs.${categoryKey}.category`),
    items: items.map((itemKey) => ({
      question: t(`faqs.${categoryKey}.${itemKey}.q`),
      answer: t(`faqs.${categoryKey}.${itemKey}.a`),
    })),
  }));

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchQuestions")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            {t("contact")}
          </CardTitle>
          <CardDescription>
            {t("contactDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" asChild>
            <a href="mailto:toutour.com@gmail.com">
              toutour.com@gmail.com
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>{t("faqTitle")}</CardTitle>
          <CardDescription>
            {searchQuery ? t("foundAnswers", { count: filteredFaqs.reduce((acc, cat) => acc + cat.items.length, 0) }) : t("faqDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length > 0 ? (
            <div className="space-y-6">
              {filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="font-semibold mb-3 text-primary">
                    {category.category}
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t("noResultsFor", { query: searchQuery })}
              </p>
              <Button variant="link" onClick={() => setSearchQuery("")}>
                {t("clearSearch")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
