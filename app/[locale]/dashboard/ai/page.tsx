"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
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
  History,
  MessageSquare,
  Trash2,
  X,
  SkipForward,
} from "lucide-react";
import { MarkdownRenderer } from "@/shared/components/common";
import { useTypewriter } from "@/shared/hooks";
import { aiService } from "@/services";
import {
  useChatSessions,
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
  skipLabel,
}: {
  content: string;
  onComplete: () => void;
  onSkip: () => void;
  skipLabel: string;
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
            {skipLabel}
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
  t,
  locale,
}: {
  onSelectSession: (sessionId: string) => void;
  currentSessionId: string | null;
  onClose?: () => void;
  t: ReturnType<typeof useTranslations>;
  locale: string;
}) {
  const { data: sessionsData, isLoading } = useChatSessions();
  const deleteChat = useDeleteChat();
  const clearAllChats = useClearAllChats();

  const sessions = sessionsData?.sessions || [];

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await deleteChat.mutateAsync(sessionId);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllChats.mutateAsync();
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
        <p className="text-muted-foreground">{t("noHistory")}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t("startNewChat")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-sm text-muted-foreground">
          {t("conversations", { count: sessions.length })}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t("deleteAll")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteAllTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteAllDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("deleteAll")}
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
                  {session.title || t("newConversation")}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {session.initialQuery}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(session.updatedAt).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
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

function AIChatContent() {
  const t = useTranslations("ai");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSearched = useRef(false);

  // Scroll to bottom only when new message is added (not during typing)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-search when coming from search page with query
  useEffect(() => {
    if (initialQuery && !hasAutoSearched.current && messages.length === 0) {
      hasAutoSearched.current = true;
      setInput(initialQuery);
      setTimeout(() => {
        handleSendWithQuery(initialQuery);
      }, 100);
    }
  }, [initialQuery]);

  const handleSelectSession = (selectedSessionId: string) => {
    router.push(`/dashboard/ai/${selectedSessionId}`);
  };

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

    // Scroll when user sends message
    setTimeout(scrollToBottom, 100);

    try {
      // Create new session
      const response = await aiService.createChat({ query: queryText });
      if (response.success && response.data) {
        const newSessionId = response.data.id;
        const assistantMsg = response.data.messages?.find(
          (m: { role: string }) => m.role === "assistant"
        );
        const aiContent = assistantMsg?.content || t("noDataFound");

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

        // Scroll when AI response arrives
        setTimeout(scrollToBottom, 100);

        // Redirect to session URL after response is shown
        setTimeout(() => {
          router.push(`/dashboard/ai/${newSessionId}`);
        }, 500);
      } else {
        throw new Error(response.message || "API Error");
      }
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
      setTimeout(scrollToBottom, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    await handleSendWithQuery(input);
  };

  // Local response generator (fallback when API is not available)
  const generateLocalResponse = (userInput: string): string => {
    // Just return error message - let the AI handle actual responses
    return tCommon("error");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("askAnything")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* History Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                {t("history")}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  {t("chatHistory")}
                </SheetTitle>
              </SheetHeader>
              <ConversationList
                onSelectSession={handleSelectSession}
                currentSessionId={null}
                onClose={() => setSheetOpen(false)}
                t={t}
                locale={locale}
              />
            </SheetContent>
          </Sheet>
        </div>
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
                {t("greeting")}
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {t("greetingDesc")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {(["bangkok", "restaurant", "chiangmai", "phuket"] as const).map((key) => {
                  const suggestion = t(`suggestions.${key}`);
                  return (
                    <Button
                      key={key}
                      variant="outline"
                      className="text-left justify-start h-auto py-3 px-4"
                      onClick={() => {
                        setInput(suggestion);
                        handleSendWithQuery(suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  );
                })}
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
                          skipLabel={t("skip")}
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
                      {t("thinking")}
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
            placeholder={t("placeholder")}
            className="flex-1 min-h-[48px]"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-12 px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            {t("send")}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{t("pressEnterToSend")}</p>
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
