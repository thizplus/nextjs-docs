"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { QrCode, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  LineIcon,
  FacebookIcon,
  XIcon,
  TikTokIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/shared/components/common/ShareButton";

// Platform configurations for sharing
const platforms = [
  {
    id: "line",
    name: "LINE",
    color: "#00B900",
    icon: LineIcon,
    getUrl: (url: string, text: string) =>
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    icon: FacebookIcon,
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "twitter",
    name: "X",
    color: "#000000",
    icon: XIcon,
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#000000",
    icon: TikTokIcon,
    getUrl: null, // Copy link only
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    icon: InstagramIcon,
    getUrl: null, // Copy link only
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    icon: WhatsAppIcon,
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
  },
];

export default function QRCodePage() {
  const t = useTranslations("qrCode");
  const [url, setUrl] = useState("https://stou-smart-tour.ac.th");
  const [qrSize, setQrSize] = useState("300");
  const [copied, setCopied] = useState(false);

  // Generate QR Code URL using Google Charts API (mockup)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(t("copiedUrl"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  const handleDownload = () => {
    // Create a link and trigger download
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(t("downloaded"));
  };

  const handleShare = (platform: (typeof platforms)[0]) => {
    const message = `${t("scanMessage")} ${url}`;

    if (platform.getUrl) {
      const shareUrl = platform.getUrl(url, message);
      window.open(shareUrl, "_blank", "width=600,height=400");
    } else {
      // Copy link for TikTok/Instagram
      navigator.clipboard.writeText(url);
      toast.success(t("copiedLink", { name: platform.name }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <QrCode className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("createQR")}</CardTitle>
            <CardDescription>
              {t("createDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Size Select */}
            <div className="space-y-2">
              <Label htmlFor="size">{t("qrSize")}</Label>
              <Select value={qrSize} onValueChange={setQrSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder={t("selectSize")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">200 x 200 px</SelectItem>
                  <SelectItem value="300">300 x 300 px</SelectItem>
                  <SelectItem value="400">400 x 400 px</SelectItem>
                  <SelectItem value="500">500 x 500 px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Info */}
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-sm text-foreground">
                <strong>{t("tip")}</strong> {t("tipDesc")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{t("preview")}</CardTitle>
            <CardDescription>
              {t("previewDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Display */}
            <div className="flex justify-center p-6 bg-muted rounded-lg">
              {url ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="border-4 border-white shadow-lg rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-2" />
                    <p>{t("enterUrl")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {url && (
              <div className="space-y-4">
                <Button
                  onClick={handleDownload}
                  className="w-full"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("download")}
                </Button>

                {/* Share Icons */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">{t("shareTo")}</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <button
                          key={platform.id}
                          onClick={() => handleShare(platform)}
                          className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                          style={{ backgroundColor: platform.color }}
                          title={t("shareToName", { name: platform.name })}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>{t("usageExamples")}</CardTitle>
          <CardDescription>
            {t("usageDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["attraction", "promotion", "itinerary", "profile"] as const).map((key) => (
              <div key={key} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{t(`examples.${key}.title`)}</h4>
                <p className="text-sm text-muted-foreground">
                  {t(`examples.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
