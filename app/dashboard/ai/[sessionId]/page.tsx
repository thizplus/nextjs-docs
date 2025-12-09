"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Send,
  Sparkles,
  Loader2,
  Plus,
  SkipForward,
  History,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";
import { MarkdownRenderer } from "@/shared/components/common";
import { useTypewriter } from "@/shared/hooks";
import { aiService } from "@/services";
import {
  useChatSessions,
  useChatSession,
  useDeleteChat,
  useClearAllChats,
} from "@/features/ai";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isNew?: boolean;
}

// Component for typing effect on AI messages (without auto-scroll)
function TypewriterMessage({
  content,
  onComplete,
  onSkip,
}: {
  content: string;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const { displayedText, isTyping, skip } = useTypewriter(content, true, {
    speed: 10,
    onComplete,
  });

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

// Conversation List Component
function ConversationList({
  onSelectSession,
  currentSessionId,
  onClose,
}: {
  onSelectSession: (sessionId: string) => void;
  currentSessionId: string | null;
  onClose?: () => void;
}) {
  const { data: sessionsData, isLoading } = useChatSessions();
  const deleteChat = useDeleteChat();
  const clearAllChats = useClearAllChats();
  const router = useRouter();

  const sessions = sessionsData?.sessions || [];

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await deleteChat.mutateAsync(sessionId);
      // If deleting current session, redirect to main AI page
      if (sessionId === currentSessionId) {
        router.push("/dashboard/ai");
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllChats.mutateAsync();
      router.push("/dashboard/ai");
    } catch (error) {
      console.error("Failed to clear sessions:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">ยังไม่มีประวัติการสนทนา</p>
        <p className="text-sm text-muted-foreground mt-1">
          เริ่มสนทนาใหม่เพื่อบันทึกประวัติ
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-sm text-muted-foreground">
          {sessions.length} บทสนทนา
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              ลบทั้งหมด
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ลบประวัติทั้งหมด?</AlertDialogTitle>
              <AlertDialogDescription>
                การดำเนินการนี้จะลบบทสนทนาทั้งหมดและไม่สามารถกู้คืนได้
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                ลบทั้งหมด
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => {
                onSelectSession(session.id);
                onClose?.();
              }}
              className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                currentSessionId === session.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">
                  {session.title || "บทสนทนาใหม่"}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {session.initialQuery}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(session.updatedAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={(e) => handleDelete(e, session.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function AISessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session detail
  const { data: sessionDetail, isLoading: isLoadingSession } = useChatSession(
    sessionId,
    !!sessionId
  );

  // Load messages from session detail
  useEffect(() => {
    if (sessionDetail && sessionDetail.messages) {
      const loadedMessages: ChatMessage[] = sessionDetail.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
        isNew: false,
      }));
      setMessages(loadedMessages);
    }
  }, [sessionDetail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectSession = (selectedSessionId: string) => {
    router.push(`/dashboard/ai/${selectedSessionId}`);
  };

  const handleSendWithQuery = async (queryText: string) => {
    if (!queryText.trim() || !sessionId) return;

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
      const response = await aiService.sendMessage(sessionId, {
        message: queryText,
      });

      if (response.success && response.data) {
        const messageId = `msg-${Date.now() + 1}`;
        const aiMessage: ChatMessage = {
          id: messageId,
          role: "assistant",
          content: response.data.content,
          timestamp: new Date().toISOString(),
          isNew: true,
        };
        setTypingMessageId(messageId);
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.message || "API Error");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const messageId = `msg-${Date.now() + 1}`;
      const aiMessage: ChatMessage = {
        id: messageId,
        role: "assistant",
        content: "ขออภัย เกิดข้อผิดพลาดในการตอบกลับ กรุณาลองใหม่อีกครั้ง",
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    router.push("/dashboard/ai");
  };

  // Show loading state
  if (isLoadingSession) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 pb-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Separator />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">กำลังโหลดบทสนทนา...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {sessionDetail?.title || "AI Assistant"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {sessionDetail?.initialQuery || "ถามอะไรก็ได้เกี่ยวกับการท่องเที่ยว"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* History Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                ประวัติ
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  ประวัติการสนทนา
                </SheetTitle>
              </SheetHeader>
              <ConversationList
                onSelectSession={handleSelectSession}
                currentSessionId={sessionId}
                onClose={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            สนทนาใหม่
          </Button>
        </div>
      </div>

      <Separator />

      {/* Chat Area */}
      <ScrollArea className="flex-1 pr-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
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
                </CardContent>
              </Card>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

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
        <p className="text-xs text-muted-foreground mt-2">กด Enter เพื่อส่ง</p>
      </div>
    </div>
  );
}
