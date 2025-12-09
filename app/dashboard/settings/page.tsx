"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Settings, Globe, Shield, Palette, Sun, Moon } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">ตั้งค่า</h1>
          <p className="text-sm text-muted-foreground">
            จัดการการตั้งค่าบัญชี
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              รูปลักษณ์
            </CardTitle>
            <CardDescription>
              ปรับแต่งรูปลักษณ์ของแอป
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>ธีม</Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="light"
                    id="light"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Sun className="mb-3 h-6 w-6" />
                    สว่าง
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="dark"
                    id="dark"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Moon className="mb-3 h-6 w-6" />
                    มืด
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-view">มุมมองแบบกระชับ</Label>
                <p className="text-sm text-muted-foreground">
                  แสดงเนื้อหามากขึ้นในหน้าจอ
                </p>
              </div>
              <Switch id="compact-view" />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              ภาษาและภูมิภาค
            </CardTitle>
            <CardDescription>
              เลือกภาษาและการตั้งค่าภูมิภาค
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="thai-language">ภาษาไทย</Label>
                <p className="text-sm text-muted-foreground">
                  แสดงเนื้อหาเป็นภาษาไทย
                </p>
              </div>
              <Switch id="thai-language" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              ความเป็นส่วนตัวและความปลอดภัย
            </CardTitle>
            <CardDescription>
              จัดการการตั้งค่าความเป็นส่วนตัว
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">โปรไฟล์สาธารณะ</Label>
                <p className="text-sm text-muted-foreground">
                  ให้ผู้อื่นเห็นโปรไฟล์และ folder สาธารณะของคุณ
                </p>
              </div>
              <Switch id="public-profile" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="search-history">บันทึกประวัติการค้นหา</Label>
                <p className="text-sm text-muted-foreground">
                  เก็บบันทึกประวัติการค้นหาของคุณ
                </p>
              </div>
              <Switch id="search-history" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">รีเซ็ตการตั้งค่า</Button>
          <Button>บันทึกการเปลี่ยนแปลง</Button>
        </div>
      </div>
    </div>
  );
}
