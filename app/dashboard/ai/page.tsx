"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Send,
  Sparkles,
  Loader2,
  Plus,
  SkipForward,
} from "lucide-react";
import { MarkdownRenderer } from "@/shared/components/common";
import { useTypewriter } from "@/shared/hooks";
import { aiService } from "@/services";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  image?: string;
  isNew?: boolean; // Flag to identify new messages that should animate
}

// Component for typing effect on AI messages
function TypewriterMessage({
  content,
  onComplete,
  onSkip,
  onTextChange,
}: {
  content: string;
  onComplete: () => void;
  onSkip: () => void;
  onTextChange?: () => void;
}) {
  const { displayedText, isTyping, skip } = useTypewriter(content, true, {
    speed: 10,
    onComplete,
  });

  // Scroll when text changes
  useEffect(() => {
    if (isTyping && onTextChange) {
      onTextChange();
    }
  }, [displayedText, isTyping, onTextChange]);

  const handleSkip = () => {
    skip();
    onSkip();
  };

  return (
    <div className="relative">
      <MarkdownRenderer content={displayedText} className="text-sm" />
      {isTyping && (
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="h-3 w-3 mr-1" />
            ข้าม
          </Button>
        </div>
      )}
    </div>
  );
}

function AIChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSearched = useRef(false);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-search when coming from search page with query
  useEffect(() => {
    if (initialQuery && !hasAutoSearched.current && messages.length === 0) {
      hasAutoSearched.current = true;
      setInput(initialQuery);
      // Trigger search after a small delay to ensure state is set
      setTimeout(() => {
        handleSendWithQuery(initialQuery);
      }, 100);
    }
  }, [initialQuery]);

  const handleSendWithQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: queryText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let aiContent: string;

      if (!sessionId) {
        // First message - create new session with context
        const response = await aiService.createChat({ query: queryText });
        if (response.success && response.data) {
          setSessionId(response.data.id);
          // Find assistant message from response
          const assistantMsg = response.data.messages?.find(
            (m: { role: string }) => m.role === "assistant"
          );
          aiContent = assistantMsg?.content || "ไม่พบข้อมูลสำหรับคำถามนี้";
        } else {
          throw new Error(response.message || "API Error");
        }
      } else {
        // Follow-up message - use existing session (with context)
        const response = await aiService.sendMessage(sessionId, {
          message: queryText,
        });
        if (response.success && response.data) {
          aiContent = response.data.content;
        } else {
          throw new Error(response.message || "API Error");
        }
      }

      const messageId = `msg-${Date.now() + 1}`;
      const aiMessage: ChatMessage = {
        id: messageId,
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toISOString(),
        isNew: true,
      };
      setTypingMessageId(messageId);
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      // Fallback to local AI response if API fails
      const aiResponse = generateLocalResponse(queryText);
      const messageId = `msg-${Date.now() + 1}`;
      const aiMessage: ChatMessage = {
        id: messageId,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
        isNew: true,
      };
      setTypingMessageId(messageId);
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    await handleSendWithQuery(input);
  };

  // Local response generator (fallback when API is not available)
  const generateLocalResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("กรุงเทพ") || lowerInput.includes("bangkok")) {
      return `จากคำถามของคุณเกี่ยวกับกรุงเทพฯ ผมขอแนะนำสถานที่ท่องเที่ยวยอดนิยม:

1. **วัดพระแก้ว** - วัดที่สำคัญที่สุดในประเทศไทย ตั้งอยู่ในพระบรมมหาราชวัง
2. **วัดอรุณราชวราราม** - วัดแห่งรุ่งอรุณ ริมแม่น้ำเจ้าพระยา
3. **ตลาดจตุจักร** - ตลาดนัดสุดสัปดาห์ที่ใหญ่ที่สุดในโลก
4. **เยาวราช** - ย่านไชน่าทาวน์ มีอาหารอร่อยมากมาย
5. **ไอคอนสยาม** - ห้างสรรพสินค้าริมแม่น้ำเจ้าพระยา

คุณสนใจสถานที่ไหนเป็นพิเศษไหมครับ?`;
    } else if (lowerInput.includes("เชียงใหม่") || lowerInput.includes("chiang mai")) {
      return `เชียงใหม่เป็นเมืองท่องเที่ยวที่น่าสนใจมากครับ! แนะนำสถานที่เหล่านี้:

1. **วัดพระธาตุดอยสุเทพ** - วัดบนดอยที่มีวิวเมืองเชียงใหม่สวยงาม
2. **ถนนคนเดินวันอาทิตย์** - ตลาดนัดที่มีของฝากมากมาย
3. **หมู่บ้านช้างแม่สา** - สถานที่ดูแลช้างอย่างมีจริยธรรม
4. **ดอยอินทนนท์** - ยอดเขาที่สูงที่สุดในประเทศไทย
5. **นิมมานเหมินทร์** - ย่านฮิปๆ มีคาเฟ่และร้านอาหารเก๋ๆ

คุณวางแผนไปกี่วันครับ?`;
    } else if (lowerInput.includes("ภูเก็ต") || lowerInput.includes("phuket")) {
      return `ภูเก็ตเป็นเกาะสวรรค์สำหรับคนรักทะเลครับ:

1. **หาดป่าตอง** - หาดที่มีชื่อเสียงที่สุด มีกิจกรรมน้ำมากมาย
2. **เกาะพีพี** - เกาะสวยงาม น้ำทะเลใส เหมาะสำหรับดำน้ำ
3. **วัดฉลอง** - วัดที่สำคัญที่สุดในภูเก็ต
4. **หาดกะตะ** - หาดที่เหมาะสำหรับครอบครัว
5. **ตลาดโต้รุ่งภูเก็ต** - ตลาดนัดที่มีของถูกและดี

คุณชอบกิจกรรมแบบไหนครับ?`;
    } else if (lowerInput.includes("ร้านอาหาร") || lowerInput.includes("อาหาร") || lowerInput.includes("กิน")) {
      return `สำหรับร้านอาหารที่แนะนำ:

**ร้านอาหารไทยต้นตำรับ:**
- เรือนแม่ (ข้าวแช่)
- บ้านขนิษฐา (อาหารไทยโบราณ)
- เจ๊ไฝ ผัดไทยประตูผี

**ร้านอาหารทะเล:**
- สมบูรณ์โภชนา (อาหารทะเลสด)
- ลาบอีสาน เจ้าดัง

**ร้านคาเฟ่:**
- Rocket Coffeebar
- After You Dessert Cafe

คุณอยากทานอาหารประเภทไหนครับ?`;
    } else if (lowerInput.includes("ที่พัก") || lowerInput.includes("โรงแรม") || lowerInput.includes("resort")) {
      return `แนะนำที่พักตามงบประมาณ:

**ระดับหรู (3,000+ บาท/คืน):**
- Mandarin Oriental Bangkok
- The Peninsula Bangkok
- Anantara Siam Bangkok Hotel

**ระดับกลาง (1,000-3,000 บาท/คืน):**
- Novotel Bangkok Sukhumvit
- Ibis Bangkok Riverside
- Hotel Muse Bangkok

**ระดับประหยัด (ต่ำกว่า 1,000 บาท/คืน):**
- NapPark Hostel
- Lub d Bangkok Siam
- The Yard Hostel

คุณต้องการระดับราคาไหนครับ?`;
    } else if (lowerInput.includes("เส้นทาง") || lowerInput.includes("แผน") || lowerInput.includes("วัน")) {
      return `ผมขอแนะนำเส้นทางท่องเที่ยว 3 วัน 2 คืน ในกรุงเทพฯ:

**วันที่ 1:**
- เช้า: วัดพระแก้ว และพระบรมมหาราชวัง
- กลางวัน: ร้านอาหารริมเจ้าพระยา
- บ่าย: วัดโพธิ์
- เย็น: ล่องเรือเจ้าพระยา

**วันที่ 2:**
- เช้า: ตลาดจตุจักร
- กลางวัน: อาหารในตลาด
- บ่าย: ช้อปปิ้งสยามพารากอน
- เย็น: ชมวิวที่ Mahanakhon Skywalk

**วันที่ 3:**
- เช้า: ตลาดน้ำดำเนินสะดวก
- กลางวัน: แวะชิมอาหารท้องถิ่น
- บ่าย: ไอคอนสยาม

คุณต้องการปรับแผนส่วนไหนไหมครับ?`;
    } else if (lowerInput.includes("ที่เที่ยว") || lowerInput.includes("สถานที่") || lowerInput.includes("ท่องเที่ยว")) {
      return `ผมขอแนะนำสถานที่ท่องเที่ยวยอดนิยมในประเทศไทย:

**ภาคกลาง:**
- กรุงเทพฯ - วัดพระแก้ว, ตลาดจตุจักร
- อยุธยา - โบราณสถานมรดกโลก
- กาญจนบุรี - สะพานข้ามแม่น้ำแคว

**ภาคเหนือ:**
- เชียงใหม่ - ดอยสุเทพ, ถนนคนเดิน
- เชียงราย - วัดร่องขุ่น, ไร่ชา

**ภาคใต้:**
- ภูเก็ต - หาดป่าตอง, เกาะพีพี
- กระบี่ - ทะเลแหวก, หาดไร่เลย์

คุณสนใจภูมิภาคไหนเป็นพิเศษครับ?`;
    } else {
      return `ขอบคุณสำหรับคำถามครับ! เกี่ยวกับ "${userInput}"

ผมเป็น AI Assistant ที่พร้อมช่วยเหลือคุณเกี่ยวกับ:
- แนะนำสถานที่ท่องเที่ยวทั่วประเทศไทย
- แนะนำร้านอาหารและที่พัก
- วางแผนเส้นทางการท่องเที่ยว
- ตอบคำถามเกี่ยวกับการเดินทาง

คุณต้องการทราบข้อมูลเพิ่มเติมเกี่ยวกับอะไรครับ? เช่น:
- สถานที่ท่องเที่ยวในจังหวัดต่างๆ
- ร้านอาหารแนะนำ
- วิธีการเดินทาง
- แผนการท่องเที่ยว`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setSessionId(null);
    setTypingMessageId(null);
    hasAutoSearched.current = false;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              ถามอะไรก็ได้เกี่ยวกับการท่องเที่ยว
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleNewChat} className="gap-2">
            <Plus className="h-4 w-4" />
            สนทนาใหม่
          </Button>
        )}
      </div>

      <Separator />

      {/* Chat Area */}
      <ScrollArea className="flex-1 pr-4 py-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                สวัสดี! ฉันคือ AI Assistant
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                ถามฉันเกี่ยวกับสถานที่ท่องเที่ยว แนะนำเส้นทาง
                หรืออะไรก็ได้เกี่ยวกับการเดินทาง
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  "แนะนำสถานที่ท่องเที่ยวในกรุงเทพฯ",
                  "ร้านอาหารอร่อยๆ ใกล้ตลาดจตุจักร",
                  "เส้นทางท่องเที่ยวเชียงใหม่ 3 วัน 2 คืน",
                  "ที่พักราคาประหยัดในภูเก็ต",
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start h-auto py-3 px-4"
                    onClick={() => {
                      setInput(suggestion);
                      handleSendWithQuery(suggestion);
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <Card
                  className={`max-w-[80%] py-0 gap-0 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  <CardContent className="p-3">
                    {message.role === "assistant" ? (
                      message.isNew && typingMessageId === message.id ? (
                        <TypewriterMessage
                          content={message.content}
                          onComplete={() => {
                            setTypingMessageId(null);
                            // Mark message as no longer new
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === message.id ? { ...m, isNew: false } : m
                              )
                            );
                          }}
                          onSkip={() => {
                            setTypingMessageId(null);
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === message.id ? { ...m, isNew: false } : m
                              )
                            );
                          }}
                          onTextChange={scrollToBottom}
                        />
                      ) : (
                        <MarkdownRenderer
                          content={message.content}
                          className="text-sm"
                        />
                      )
                    ) : (
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    )}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="mt-2 rounded-lg max-h-48"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </CardContent>
                </Card>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="py-0 gap-0">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      กำลังคิด...
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t pt-4 pb-4 bg-background sticky bottom-0">
        <div className="flex items-end gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="พิมพ์คำถามของคุณ..."
            className="flex-1 min-h-[48px]"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-12 px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            ส่ง
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          กด Enter เพื่อส่ง
        </p>
      </div>
    </div>
  );
}

export default function AIChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 pb-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Separator />
          <div className="flex-1 py-8">
            <div className="flex flex-col items-center justify-center">
              <Skeleton className="h-20 w-20 rounded-full mb-4" />
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      }
    >
      <AIChatContent />
    </Suspense>
  );
}
