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
import { HelpCircle, Mail, MessageCircle, Search } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "การเริ่มต้นใช้งาน",
    items: [
      {
        question: "วิธีสร้างบัญชีผู้ใช้?",
        answer: "คุณสามารถสร้างบัญชีได้โดยคลิกปุ่ม 'ลงทะเบียน' บนหน้าแรก จากนั้นกรอกรหัสนักศึกษา ชื่อ-นามสกุล อีเมล และรหัสผ่านของคุณ ระบบจะส่งอีเมลยืนยันไปที่อีเมลที่คุณระบุ",
      },
      {
        question: "ฉันลืมรหัสผ่าน จะทำอย่างไร?",
        answer: "คลิกที่ลิงก์ 'ลืมรหัสผ่าน' บนหน้า Login แล้วกรอกอีเมลของคุณ ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้คุณทางอีเมล",
      },
      {
        question: "ใช้บัญชีของมหาวิทยาลัยอื่นได้ไหม?",
        answer: "ขณะนี้ระบบรองรับเฉพาะนักศึกษามหาวิทยาลัยสุโขทัยธรรมาธิราช (มสธ.) เท่านั้น",
      },
    ],
  },
  {
    category: "การค้นหา",
    items: [
      {
        question: "วิธีค้นหาสถานที่ท่องเที่ยว?",
        answer: "พิมพ์ชื่อจังหวัด สถานที่ หรือสิ่งที่คุณสนใจในช่องค้นหา คุณสามารถกรองผลการค้นหาด้วย Filter Tabs (ทั้งหมด, เว็บไซต์, รูปภาพ, วิดีโอ, AI Mode)",
      },
      {
        question: "AI Mode คืออะไร?",
        answer: "AI Mode เป็นฟีเจอร์ที่ใช้ AI สรุปข้อมูลและตอบคำถามเกี่ยวกับสถานที่ท่องเที่ยว คุณสามารถถามคำถามได้โดยตรงและ AI จะให้คำตอบพร้อมแหล่งอ้างอิง",
      },
      {
        question: "สามารถค้นหาด้วยรูปภาพได้ไหม?",
        answer: "ได้ครับ คลิกที่ไอคอนรูปภาพในช่องค้นหา แล้วอัปโหลดรูปที่คุณต้องการค้นหา ระบบจะหาสถานที่ที่คล้ายกันให้",
      },
      {
        question: "ค้นหาด้วยเสียงได้ไหม?",
        answer: "ได้ครับ คลิกที่ไอคอนไมโครโฟนในช่องค้นหา แล้วพูดสิ่งที่คุณต้องการค้นหา",
      },
    ],
  },
  {
    category: "My Folders",
    items: [
      {
        question: "Folder คืออะไร?",
        answer: "Folder เป็นที่เก็บสถานที่ท่องเที่ยวที่คุณสนใจ คุณสามารถสร้าง folder หลายๆ อัน เช่น 'กรุงเทพฯ', 'เชียงใหม่' เพื่อจัดระเบียบสถานที่ที่คุณต้องการไป",
      },
      {
        question: "วิธีสร้าง Folder?",
        answer: "ไปที่หน้า My Folders แล้วคลิกปุ่ม 'สร้าง Folder ใหม่' ตั้งชื่อและคำอธิบาย แล้วเลือกว่าจะเป็น Folder สาธารณะหรือส่วนตัว",
      },
      {
        question: "วิธีบันทึกสถานที่ลง Folder?",
        answer: "คลิกปุ่ม 'Save to Folder' ที่แต่ละสถานที่ แล้วเลือก Folder ที่คุณต้องการบันทึก หรือสร้าง Folder ใหม่",
      },
      {
        question: "แชร์ Folder ได้ไหม?",
        answer: "ได้ครับ ถ้าคุณตั้งค่า Folder เป็น 'สาธารณะ' คุณสามารถแชร์ลิงก์ให้เพื่อนดูได้",
      },
    ],
  },
  {
    category: "รายการโปรด",
    items: [
      {
        question: "รายการโปรดคืออะไร?",
        answer: "รายการโปรดเป็นที่เก็บสถานที่ที่คุณกดหัวใจ คุณสามารถเข้าถึงได้ง่ายจากหน้าโปรไฟล์",
      },
      {
        question: "ต่างจาก Folder อย่างไร?",
        answer: "รายการโปรดเป็นการบันทึกแบบรวดเร็ว ไม่ต้องจัดหมวดหมู่ ส่วน Folder ใช้สำหรับจัดระเบียบแบบละเอียด",
      },
    ],
  },
  {
    category: "ความเป็นส่วนตัว",
    items: [
      {
        question: "ข้อมูลของฉันปลอดภัยไหม?",
        answer: "เรามีมาตรการรักษาความปลอดภัยข้อมูลตามมาตรฐาน ข้อมูลส่วนตัวของคุณจะไม่ถูกแชร์ให้บุคคลที่สาม",
      },
      {
        question: "ลบบัญชีได้ไหม?",
        answer: "ได้ครับ ไปที่หน้าโปรไฟล์ > ตั้งค่า > ลบบัญชี ข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวร",
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
          <h1 className="text-2xl font-bold">ศูนย์ช่วยเหลือ</h1>
          <p className="text-sm text-muted-foreground">
            ค้นหาคำตอบสำหรับคำถามที่พบบ่อย
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาคำถาม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </CardTitle>
            <CardDescription>
              พูดคุยกับทีมสนับสนุนแบบ real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">เริ่มแชท</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5" />
              ติดต่ออีเมล
            </CardTitle>
            <CardDescription>
              ส่งคำถามของคุณผ่านอีเมล
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              support@stou-tour.ac.th
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>คำถามที่พบบ่อย (FAQ)</CardTitle>
          <CardDescription>
            {searchQuery ? `พบ ${filteredFaqs.reduce((acc, cat) => acc + cat.items.length, 0)} คำตอบ` : "รวมคำถามและคำตอบที่พบบ่อย"}
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
                ไม่พบคำตอบสำหรับ &ldquo;{searchQuery}&rdquo;
              </p>
              <Button variant="link" onClick={() => setSearchQuery("")}>
                ล้างการค้นหา
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
