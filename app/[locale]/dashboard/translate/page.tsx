"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { utilityService } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Volume2,
  Loader2,
  Trash2,
} from "lucide-react";
import { LanguageCode, LANGUAGE_NAMES } from "@/shared/types/common";

// Supported languages for translation
const SUPPORTED_LANGUAGES: { code: LanguageCode; name: string; nativeName: string }[] = [
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
];

export default function TranslatePage() {
  const t = useTranslations("translate");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState<LanguageCode | "auto">("auto");
  const [targetLang, setTargetLang] = useState<LanguageCode>("en");
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error(t("enterText"));
      return;
    }

    setIsLoading(true);
    setDetectedLang(null);

    try {
      const response = await utilityService.translate({
        text: sourceText,
        sourceLang: sourceLang === "auto" ? undefined : sourceLang,
        targetLang: targetLang,
      });

      if (response.success && response.data) {
        setTranslatedText(response.data.translatedText);
        if (response.data.detectedLang) {
          setDetectedLang(response.data.detectedLang);
        }
      } else {
        toast.error(response.message || t("translateFailed"));
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || t("translateError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === "auto") {
      toast.error(t("cannotSwapAuto"));
      return;
    }

    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    // Swap texts
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
    setDetectedLang(null);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "zh" ? "zh-CN" : lang;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
    setDetectedLang(null);
  };

  const getLanguageName = (code: string) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    return lang ? lang.nativeName : code;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Languages className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader className="pb-4">
          {/* Language Selectors - Responsive */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{t("selectLanguage")}</span>
              {/* Clear Button */}
              {(sourceText || translatedText) && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("clear")}
                </Button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Source Language Selector */}
              <Select
                value={sourceLang}
                onValueChange={(value) => setSourceLang(value as LanguageCode | "auto")}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder={t("sourceLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{t("autoDetect")}</SelectItem>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Swap Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapLanguages}
                disabled={sourceLang === "auto" || isLoading}
                title={t("swapLanguages")}
                className="self-center shrink-0"
              >
                <ArrowRightLeft className="h-4 w-4 rotate-90 sm:rotate-0" />
              </Button>

              {/* Target Language Selector */}
              <Select
                value={targetLang}
                onValueChange={(value) => setTargetLang(value as LanguageCode)}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder={t("targetLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {sourceLang === "auto"
                    ? detectedLang
                      ? `${t("detected")}: ${getLanguageName(detectedLang)}`
                      : t("originalText")
                    : getLanguageName(sourceLang)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {sourceText.length}/5000
                </span>
              </div>
              <Textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={t("typePlaceholder")}
                className="min-h-[200px] resize-none"
                maxLength={5000}
              />
              <div className="flex items-center justify-end gap-2">
                {sourceText && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleSpeak(
                          sourceText,
                          sourceLang === "auto" ? detectedLang || "th" : sourceLang
                        )
                      }
                      title={t("listen")}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(sourceText)}
                      title={t("copy")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Translated Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{getLanguageName(targetLang)}</span>
              </div>
              <Textarea
                value={translatedText}
                readOnly
                placeholder={t("resultPlaceholder")}
                className="min-h-[200px] resize-none bg-muted/50"
              />
              <div className="flex items-center justify-end gap-2">
                {translatedText && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSpeak(translatedText, targetLang)}
                      title={t("listen")}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(translatedText)}
                      title={t("copy")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("translating")}
              </>
            ) : (
              <>
                <Languages className="h-4 w-4 mr-2" />
                {t("translateBtn")}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Phrases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("quickPhrases")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(["hello", "thankYou", "whereToilet", "howMuch", "help", "sorry", "delicious", "menu", "beautiful", "takePhoto"] as const).map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => setSourceText(t(`phrases.${key}`))}
                className="rounded-full"
              >
                {t(`phrases.${key}`)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
