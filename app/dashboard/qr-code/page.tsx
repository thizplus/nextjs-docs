"use client";

import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { QrCode, Download, Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function QRCodePage() {
  const [url, setUrl] = useState("https://stou-smart-tour.ac.th");
  const [qrSize, setQrSize] = useState("300");
  const [copied, setCopied] = useState(false);

  // Generate QR Code URL using Google Charts API (mockup)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("คัดลอก URL ไปยังคลิปบอร์ดแล้ว");
  };

  const handleDownload = () => {
    // Create a link and trigger download
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("QR Code ถูกดาวน์โหลดแล้ว");
  };

  const handleShare = (platform: string) => {
    const message = `สแกน QR Code นี้: ${url}`;
    let shareUrl = "";

    switch (platform) {
      case "line":
        shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case "instagram":
        toast.info("กรุณาแชร์ QR Code โดยการ screenshot และโพสต์ใน Instagram");
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");

    toast.success(`กำลังแชร์ไปยัง ${platform}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <QrCode className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">QR Code Generator</h1>
          <p className="text-sm text-muted-foreground">
            สร้าง QR Code จาก URL และแชร์ได้ง่าย
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>สร้าง QR Code</CardTitle>
            <CardDescription>
              ใส่ URL ที่ต้องการแปลงเป็น QR Code
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
              <Label htmlFor="size">ขนาด QR Code</Label>
              <Select value={qrSize} onValueChange={setQrSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="เลือกขนาด" />
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>คำแนะนำ:</strong> QR Code จะถูกสร้างอัตโนมัติเมื่อคุณใส่ URL
                คุณสามารถดาวน์โหลดหรือแชร์ได้ทันที
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>ตัวอย่าง QR Code</CardTitle>
            <CardDescription>
              สแกน QR Code เพื่อเข้าถึง URL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Display */}
            <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
              {url ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="border-4 border-white shadow-lg rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-2" />
                    <p>ใส่ URL เพื่อสร้าง QR Code</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {url && (
              <div className="space-y-2">
                <Button
                  onClick={handleDownload}
                  className="w-full"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  ดาวน์โหลด QR Code
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full" size="lg">
                      <Share2 className="h-4 w-4 mr-2" />
                      แชร์ QR Code
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => handleShare("line")}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-[#00B900] rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">L</span>
                        </div>
                        <span>แชร์ไป LINE</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-[#1877F2] rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">f</span>
                        </div>
                        <span>แชร์ไป Facebook</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("x")}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">𝕏</span>
                        </div>
                        <span>แชร์ไป X (Twitter)</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("instagram")}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IG</span>
                        </div>
                        <span>แชร์ไป Instagram</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>ตัวอย่างการใช้งาน</CardTitle>
          <CardDescription>
            QR Code สามารถนำไปใช้ในกรณีต่างๆ เหล่านี้
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">สถานที่ท่องเที่ยว</h4>
              <p className="text-sm text-muted-foreground">
                สร้าง QR Code สำหรับสถานที่ท่องเที่ยว เพื่อให้นักท่องเที่ยวสแกนดูข้อมูล
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">โปรโมชั่น</h4>
              <p className="text-sm text-muted-foreground">
                แชร์โปรโมชั่นพิเศษผ่าน QR Code บน social media
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">แผนการเดินทาง</h4>
              <p className="text-sm text-muted-foreground">
                สร้าง QR Code สำหรับแผนการเดินทางและแชร์ให้เพื่อน
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">โปรไฟล์</h4>
              <p className="text-sm text-muted-foreground">
                แชร์โปรไฟล์หรือรายการโปรดของคุณผ่าน QR Code
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
