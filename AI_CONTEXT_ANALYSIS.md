# AI Context Analysis - STOU Smart Tour

## สรุปปัญหา

**ปัจจุบัน Frontend ใช้ `/api/v1/ai/search` ซึ่งไม่มี Context**
ทำให้ AI ไม่สามารถจำบทสนทนาก่อนหน้าได้ ทุกคำถามจะถูกตอบอย่างอิสระโดยไม่มีความเชื่อมโยงกัน

---

## 1. Backend API Endpoints ที่มีอยู่

### 1.1 AI Search (ไม่มี Context) ❌
```
GET /api/v1/ai/search?q={query}
```

**ไฟล์:** `gofiber-docs/application/serviceimpl/ai_service_impl.go:50-127`

```go
func (s *AIServiceImpl) AISearch(ctx context.Context, userID uuid.UUID, req *dto.AISearchRequest) (*dto.AISearchResponse, error) {
    // 1. Check cache
    // 2. Search Google
    // 3. Generate AI Summary
    // 4. Return response
    // ❌ ไม่มีการเก็บ history หรือ context ใดๆ
}
```

**ลักษณะการทำงาน:**
- ทุก request เป็นอิสระจากกัน
- ไม่เก็บประวัติการสนทนา
- เหมาะสำหรับคำถามเดี่ยวๆ
- มี caching 6 ชั่วโมง

---

### 1.2 AI Chat (มี Context) ✅

#### สร้าง Session ใหม่
```
POST /api/v1/ai/chat
Body: { "query": "แนะนำที่เที่ยวกรุงเทพ" }
```

**ไฟล์:** `gofiber-docs/application/serviceimpl/ai_service_impl.go:129-214`

```go
func (s *AIServiceImpl) CreateChatSession(ctx context.Context, userID uuid.UUID, req *dto.CreateAIChatRequest) (*dto.AIChatSessionDetailResponse, error) {
    // 1. สร้าง session ใน database
    // 2. สร้าง user message
    // 3. Search Google
    // 4. Generate AI response
    // 5. สร้าง assistant message
    // ✅ บันทึกทั้ง session และ messages
}
```

#### ส่งข้อความต่อเนื่อง (มี Context)
```
POST /api/v1/ai/chat/{sessionId}/messages
Body: { "message": "แล้วมีร้านอาหารแถวนั้นไหม?" }
```

**ไฟล์:** `gofiber-docs/application/serviceimpl/ai_service_impl.go:281-366`

```go
func (s *AIServiceImpl) SendMessage(ctx context.Context, userID uuid.UUID, req *dto.SendAIChatMessageRequest) (*dto.AIChatMessageResponse, error) {
    // ✅ ดึง 10 messages ล่าสุดเป็น context
    recentMessages, err := s.messageRepo.GetRecentBySessionID(ctx, req.SessionID, 10)

    // ✅ สร้าง conversation history
    var chatHistory []openai.ChatMessage
    for _, msg := range recentMessages {
        chatHistory = append(chatHistory, openai.ChatMessage{
            Role:    msg.Role,
            Content: msg.Content,
        })
    }

    // ✅ ส่งไป OpenAI พร้อม history
    aiResponse, err := s.aiClient.ContinueChat(ctx, chatHistory, req.Message)
}
```

---

## 2. Frontend Implementation ปัจจุบัน

**ไฟล์:** `nextjs-doc/app/dashboard/ai/page.tsx:124-134`

```typescript
// ❌ ใช้ /ai/search ซึ่งไม่มี context
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/ai/search?q=${encodeURIComponent(queryText)}`,
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  }
);
```

**ปัญหา:**
- มี state `sessionId` แต่ไม่ได้ใช้งาน
- มี hooks `useCreateChat`, `useSendMessage` แต่ไม่ได้เรียกใช้
- ทุกข้อความใช้ `/ai/search` ซึ่งไม่มี context

---

## 3. Services ที่พร้อมใช้งานแล้ว

**ไฟล์:** `nextjs-doc/src/services/backend/ai.service.ts`

```typescript
export const aiService = {
  // ❌ ใช้อยู่ - ไม่มี context
  search: async (params: AISearchRequest) => {...},

  // ✅ พร้อมใช้ - สร้าง session ใหม่
  createChat: async (request: CreateChatRequest) => {...},

  // ✅ พร้อมใช้ - ส่งข้อความต่อเนื่อง (มี context)
  sendMessage: async (sessionId: string, request: SendMessageRequest) => {...},

  // ✅ พร้อมใช้ - ดึงรายการ sessions
  getChatSessions: async (params?: GetChatSessionsRequest) => {...},

  // ✅ พร้อมใช้ - ดึงรายละเอียด session
  getChatDetail: async (sessionId: string) => {...},
};
```

**ไฟล์:** `nextjs-doc/src/features/ai/hooks/useAI.ts`

```typescript
// ✅ พร้อมใช้งาน
export function useCreateChat() {...}
export function useSendMessage(sessionId: string) {...}
export function useChatSessions(params?: GetChatSessionsRequest) {...}
export function useChatSession(sessionId: string, enabled = true) {...}
```

---

## 4. วิธีแก้ไข

### Flow ที่ถูกต้อง:

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Flow                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. ข้อความแรก                                                   │
│     ├─ POST /api/v1/ai/chat                                     │
│     ├─ Body: { "query": "แนะนำที่เที่ยวกรุงเทพ" }                │
│     └─ Response: { sessionId, messages: [...] }                 │
│                                                                  │
│  2. ข้อความที่ 2, 3, ... (ใน session เดียวกัน)                   │
│     ├─ POST /api/v1/ai/chat/{sessionId}/messages                │
│     ├─ Body: { "message": "แล้วร้านอาหารแถวนั้น?" }              │
│     └─ Response: { content, sources }                           │
│                                                                  │
│  3. เริ่มสนทนาใหม่                                               │
│     └─ กลับไปข้อ 1                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### โค้ดที่ต้องแก้ไข:

**ไฟล์:** `nextjs-doc/app/dashboard/ai/page.tsx`

```typescript
const handleSendWithQuery = async (queryText: string) => {
  if (!queryText.trim()) return;

  // Add user message to UI
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
    let newSessionId = sessionId;

    if (!sessionId) {
      // ข้อความแรก - สร้าง session ใหม่
      const response = await aiService.createChat({ query: queryText });
      if (response.success && response.data) {
        newSessionId = response.data.id;
        setSessionId(newSessionId);

        // หา assistant message จาก response
        const assistantMsg = response.data.messages?.find(m => m.role === 'assistant');
        aiContent = assistantMsg?.content || "ไม่พบข้อมูล";
      } else {
        throw new Error(response.message);
      }
    } else {
      // ข้อความต่อไป - ใช้ session เดิม (มี context)
      const response = await aiService.sendMessage(sessionId, { message: queryText });
      if (response.success && response.data) {
        aiContent = response.data.content;
      } else {
        throw new Error(response.message);
      }
    }

    // Add AI response to UI
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

  } catch (error) {
    // Fallback to local response
    const aiResponse = generateLocalResponse(queryText);
    // ... handle error
  } finally {
    setIsLoading(false);
  }
};

// Clear session when starting new chat
const handleNewChat = () => {
  setMessages([]);
  setInput("");
  setSessionId(null);  // ← สำคัญ: reset session
  setTypingMessageId(null);
  hasAutoSearched.current = false;
};
```

---

## 5. สรุปการเปลี่ยนแปลง

| รายการ | ก่อน | หลัง |
|--------|------|------|
| Endpoint ข้อความแรก | `/ai/search` | `/ai/chat` (POST) |
| Endpoint ข้อความต่อไป | `/ai/search` | `/ai/chat/{sessionId}/messages` (POST) |
| Context | ❌ ไม่มี | ✅ 10 messages ล่าสุด |
| Session Management | ❌ ไม่ได้ใช้ | ✅ สร้างและเก็บ sessionId |
| ประวัติสนทนา | ❌ ไม่เก็บ | ✅ เก็บใน database |

---

## 6. ประโยชน์หลังแก้ไข

1. **AI จำบทสนทนาได้** - สามารถถามต่อเนื่องได้ เช่น "แล้วใกล้ๆนั้นมีอะไรอีก?"
2. **ประวัติการสนทนา** - ผู้ใช้สามารถกลับมาดูประวัติสนทนาเก่าได้
3. **Context 10 messages** - AI จะเห็นบริบท 10 ข้อความล่าสุด
4. **Search ใหม่ทุกคำถาม** - ยังคงค้นหา Google เพิ่มเติมในแต่ละคำถาม

---

## 7. ข้อควรระวัง

1. **Session จะถูกสร้างใหม่** เมื่อกด "สนทนาใหม่"
2. **ต้อง login** ถึงจะใช้ `/ai/chat` ได้ (ต้องมี userID)
3. **Context จำกัด 10 messages** - บทสนทนายาวมากๆ อาจสูญเสียบริบทเก่า
