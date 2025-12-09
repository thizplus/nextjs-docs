# STOU Smart Tour - Frontend Development Plan

## Overview
Frontend สำหรับระบบค้นหาข้อมูลท่องเที่ยว ใช้ Next.js 15 + TypeScript + shadcn/ui
**Architecture:** Feature-based structure
**Data Strategy:** Mockup data ก่อน จากนั้นค่อยเชื่อม API

---

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** React Context / Zustand
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios / Fetch API
- **Icons:** Lucide React (มากับ shadcn/ui)

---

## Project Structure (Feature-based)

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                   # Main layout group
│   │   ├── page.tsx              # Home page
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── place/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── my-folder/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── features/                     # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── mocks/
│   │       └── auth.mock.ts
│   │
│   ├── search/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterTabs.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── ResultList.tsx
│   │   │   └── MapView.tsx
│   │   ├── hooks/
│   │   │   └── useSearch.ts
│   │   ├── types/
│   │   │   └── search.types.ts
│   │   └── mocks/
│   │       └── search.mock.ts
│   │
│   ├── ai-mode/
│   │   ├── components/
│   │   │   ├── AIContent.tsx
│   │   │   ├── AIChat.tsx
│   │   │   ├── RelatedVideos.tsx
│   │   │   ├── SourceLinks.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── hooks/
│   │   │   └── useAIChat.ts
│   │   ├── types/
│   │   │   └── ai.types.ts
│   │   └── mocks/
│   │       └── ai.mock.ts
│   │
│   ├── folder/
│   │   ├── components/
│   │   │   ├── FolderList.tsx
│   │   │   ├── FolderCard.tsx
│   │   │   ├── FolderDetail.tsx
│   │   │   ├── CreateFolderDialog.tsx
│   │   │   └── SaveToFolderDialog.tsx
│   │   ├── hooks/
│   │   │   └── useFolder.ts
│   │   ├── types/
│   │   │   └── folder.types.ts
│   │   └── mocks/
│   │       └── folder.mock.ts
│   │
│   ├── place/
│   │   ├── components/
│   │   │   ├── PlaceCard.tsx
│   │   │   ├── PlaceDetail.tsx
│   │   │   ├── PlaceGallery.tsx
│   │   │   ├── NearbyPlaces.tsx
│   │   │   └── NearbyRestaurants.tsx
│   │   ├── hooks/
│   │   │   └── usePlace.ts
│   │   ├── types/
│   │   │   └── place.types.ts
│   │   └── mocks/
│   │       └── place.mock.ts
│   │
│   └── profile/
│       ├── components/
│       │   ├── ProfileInfo.tsx
│       │   ├── EditProfileForm.tsx
│       │   └── SearchHistory.tsx
│       ├── hooks/
│       │   └── useProfile.ts
│       ├── types/
│       │   └── profile.types.ts
│       └── mocks/
│           └── profile.mock.ts
│
├── components/                   # Shared components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   ├── common/
│   │   ├── FavoriteButton.tsx
│   │   ├── ShareButton.tsx
│   │   ├── Rating.tsx
│   │   └── LanguageSwitcher.tsx
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       ├── dropdown-menu.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── separator.tsx
│       └── ... (other shadcn components)
│
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── api.ts                    # API client
│   └── constants.ts              # Constants
│
├── hooks/                        # Global hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
│
└── types/
    └── global.types.ts           # Global types
```

---

## shadcn/ui Components Setup

### Installation
```bash
npx shadcn@latest init
```

### Components to Install
```bash
# Essential Components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add separator

# Form Components
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add textarea

# Navigation
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb

# Feedback
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add skeleton
npx shadcn@latest add progress

# Overlay
npx shadcn@latest add sheet
npx shadcn@latest add popover
npx shadcn@latest add tooltip
npx shadcn@latest add hover-card

# Data Display
npx shadcn@latest add table
npx shadcn@latest add scroll-area
npx shadcn@latest add aspect-ratio
```

---

## Mockup Data Structure

### 1. User Mock Data
```typescript
// features/auth/mocks/auth.mock.ts
export const mockUsers = [
  {
    id: "1",
    studentId: "001234567",
    email: "student@stou.ac.th",
    name: "สมชาย ใจดี",
    password: "password123", // For demo only
    createdAt: "2024-01-15T10:00:00Z",
  },
  // ... more users
];

export const mockCurrentUser = {
  id: "1",
  studentId: "001234567",
  email: "student@stou.ac.th",
  name: "สมชาย ใจดี",
};
```

### 2. Search Results Mock Data
```typescript
// features/search/mocks/search.mock.ts
export const mockSearchResults = {
  query: "ตลาดจตุจักร",
  totalResults: 125,
  results: [
    {
      id: "place-1",
      type: "place",
      title: "ตลาดนัดจตุจักร",
      description: "ตลาดนัดขนาดใหญ่ที่มีสินค้าหลากหลายในกรุงเทพฯ",
      url: "https://example.com/chatuchak",
      thumbnail: "/images/chatuchak.jpg",
      rating: 4.5,
      reviewCount: 12500,
      distance: 2.5,
      category: "ตลาด",
      location: {
        lat: 13.7991,
        lng: 100.5498,
      },
    },
    // ... more results
  ],
};

export const mockImageResults = [
  {
    id: "img-1",
    url: "/images/chatuchak-1.jpg",
    thumbnail: "/images/chatuchak-1-thumb.jpg",
    title: "ตลาดจตุจักร มุมมองทางเข้า",
    source: "example.com",
  },
  // ... more images
];

export const mockVideoResults = [
  {
    id: "video-1",
    url: "https://youtube.com/watch?v=example",
    thumbnail: "/images/video-thumb-1.jpg",
    title: "เที่ยวตลาดจตุจักร ครั้งแรก",
    channel: "Travel Thailand",
    duration: "15:30",
    views: "1.2M",
  },
  // ... more videos
];
```

### 3. Places Mock Data
```typescript
// features/place/mocks/place.mock.ts
export const mockPlaceDetail = {
  id: "place-1",
  name: "ตลาดนัดจตุจักร",
  description: "ตลาดนัดขนาดใหญ่ที่มีสินค้าหลากหลาย...",
  category: "ตลาด",
  rating: 4.5,
  reviewCount: 12500,
  address: "เขตจตุจักร กรุงเทพมหานคร 10900",
  phone: "02-123-4567",
  website: "https://chatuchak.org",
  openingHours: [
    { day: "จันทร์-ศุกร์", hours: "9:00 - 18:00" },
    { day: "เสาร์-อาทิตย์", hours: "8:00 - 20:00" },
  ],
  images: [
    "/images/chatuchak-1.jpg",
    "/images/chatuchak-2.jpg",
    "/images/chatuchak-3.jpg",
  ],
  location: {
    lat: 13.7991,
    lng: 100.5498,
  },
  reviews: [
    {
      id: "review-1",
      userName: "สมหญิง ชอบเที่ยว",
      rating: 5,
      comment: "สนุกมาก ของเยอะ ราคาดี",
      date: "2024-11-15",
      avatar: "/avatars/user1.jpg",
    },
    // ... more reviews
  ],
};

export const mockNearbyPlaces = [
  {
    id: "place-2",
    name: "สวนจตุจักร",
    distance: 0.5,
    rating: 4.3,
    thumbnail: "/images/jatujak-park.jpg",
  },
  // ... more nearby places
];
```

### 4. Folder Mock Data
```typescript
// features/folder/mocks/folder.mock.ts
export const mockFolders = [
  {
    id: "folder-1",
    userId: "1",
    name: "กรุงเทพฯ",
    description: "สถานที่ท่องเที่ยวในกรุงเทพฯ",
    isPublic: false,
    itemCount: 12,
    thumbnail: "/images/bangkok-folder.jpg",
    createdAt: "2024-10-01T10:00:00Z",
    updatedAt: "2024-11-20T15:30:00Z",
  },
  {
    id: "folder-2",
    userId: "1",
    name: "เชียงใหม่",
    description: "แผนเที่ยวเชียงใหม่",
    isPublic: true,
    itemCount: 8,
    thumbnail: "/images/chiangmai-folder.jpg",
    createdAt: "2024-10-15T14:00:00Z",
    updatedAt: "2024-11-18T09:20:00Z",
  },
];

export const mockFolderItems = [
  {
    id: "item-1",
    folderId: "folder-1",
    type: "place",
    title: "ตลาดนัดจตุจักร",
    url: "/place/place-1",
    thumbnail: "/images/chatuchak.jpg",
    metadata: {
      rating: 4.5,
      category: "ตลาด",
    },
    createdAt: "2024-11-01T10:00:00Z",
  },
  // ... more items
];
```

### 5. AI Mode Mock Data
```typescript
// features/ai-mode/mocks/ai.mock.ts
export const mockAIResponse = {
  query: "ตลาดจตุจักรมีอะไรน่าเที่ยวบ้าง",
  summary: {
    title: "ตลาดนัดจตุจักร - สถานที่ท่องเที่ยวยอดนิยม",
    sections: [
      {
        heading: "ภาพรวม",
        content: "ตลาดนัดจตุจักรเป็นตลาดนัดขนาดใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้...",
        bullets: [
          "พื้นที่กว่า 27 เอเคอร์",
          "ร้านค้ามากกว่า 15,000 ร้าน",
          "เปิดทำการวันเสาร์-อาทิตย์",
        ],
      },
      {
        heading: "สิ่งที่น่าสนใจ",
        content: "",
        bullets: [
          "เสื้อผ้าแฟชั่นราคาถูก",
          "ของตกแต่งบ้าน",
          "พืชและสัตว์เลี้ยง",
          "อาหารและเครื่องดื่ม",
          "ของโบราณและของสะสม",
        ],
      },
    ],
    sources: [
      {
        title: "Chatuchak Market Official",
        url: "https://chatuchak.org",
        favicon: "/favicons/chatuchak.ico",
      },
      {
        title: "TAT - การท่องเที่ยวแห่งประเทศไทย",
        url: "https://www.tourismthailand.org",
        favicon: "/favicons/tat.ico",
      },
    ],
  },
  relatedVideos: [
    {
      id: "video-1",
      title: "เที่ยวตลาดจตุจักรให้ครบ ภายใน 1 วัน",
      url: "https://youtube.com/watch?v=example1",
      thumbnail: "/images/video-1.jpg",
      channel: "Travel Thailand",
      duration: "15:30",
    },
    // ... more videos
  ],
};

export const mockChatHistory = [
  {
    id: "msg-1",
    role: "user",
    content: "ตลาดจตุจักรมีอะไรน่าเที่ยวบ้าง",
    timestamp: "2024-11-25T10:00:00Z",
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "ตลาดจตุจักรมีสิ่งน่าสนใจมากมาย เช่น...",
    timestamp: "2024-11-25T10:00:05Z",
  },
];
```

### 6. Favorites Mock Data
```typescript
// features/profile/mocks/profile.mock.ts
export const mockFavorites = [
  {
    id: "fav-1",
    userId: "1",
    type: "place",
    externalId: "place-1",
    title: "ตลาดนัดจตุจักร",
    url: "/place/place-1",
    thumbnail: "/images/chatuchak.jpg",
    rating: 4.5,
    createdAt: "2024-11-01T10:00:00Z",
  },
  // ... more favorites
];

export const mockSearchHistory = [
  {
    id: "history-1",
    userId: "1",
    query: "ตลาดจตุจักร",
    searchType: "all",
    createdAt: "2024-11-25T10:00:00Z",
  },
  {
    id: "history-2",
    userId: "1",
    query: "วัดพระแก้ว",
    searchType: "place",
    createdAt: "2024-11-24T15:30:00Z",
  },
];
```

---

## Development Roadmap

### Phase 1: Setup & Foundation (Week 1)
**Goal:** Setup project และ core components

#### Tasks:
- [ ] สร้าง Next.js project + TypeScript
- [ ] ติดตั้ง Tailwind CSS
- [ ] Setup shadcn/ui (install base components)
- [ ] สร้างโครงสร้าง folder (feature-based)
- [ ] Setup Prettier + ESLint
- [ ] สร้าง Layout components (Header, Footer, MainLayout)
- [ ] สร้าง mockup data files ทั้งหมด

**Deliverables:**
- โครงสร้างโปรเจค
- Layout components พื้นฐาน
- Mockup data พร้อมใช้งาน

---

### Phase 2: Authentication Feature (Week 1-2)
**Goal:** ระบบ Login/Register ใช้งานได้

#### Tasks:
- [ ] สร้าง Login page (`/login`)
  - [ ] LoginForm component (shadcn Form + Input + Button)
  - [ ] Form validation (react-hook-form + zod)
  - [ ] Mock authentication logic
- [ ] สร้าง Register page (`/register`)
  - [ ] RegisterForm component
  - [ ] Form validation
- [ ] สร้าง AuthContext / useAuth hook
- [ ] สร้าง AuthGuard component
- [ ] Protected routes (My Folder, Profile)

**shadcn components:**
- Form, Input, Button, Label, Card

**Deliverables:**
- Login/Register ใช้งานได้ (mock data)
- Protected routes

---

### Phase 3: Home & Search Feature (Week 2-3)
**Goal:** หน้าแรกและระบบค้นหาพื้นฐาน

#### Tasks:
- [ ] สร้าง Home page (`/`)
  - [ ] Hero Section
  - [ ] SearchBar component (shadcn Input)
  - [ ] FilterTabs component (shadcn Tabs)
  - [ ] Featured Destinations (PlaceCard grid)
- [ ] สร้าง Search Results page (`/search`)
  - [ ] SearchBar (แบบ sticky)
  - [ ] FilterTabs (AI Mode | All | Website | Image | Video | Map)
  - [ ] ResultCard component (Card, Badge, Button)
  - [ ] ResultList component
  - [ ] Grid/List toggle
- [ ] สร้าง useSearch hook
- [ ] เชื่อม mockup search data

**shadcn components:**
- Input, Tabs, Card, Badge, Button, Separator

**Deliverables:**
- หน้าแรกสมบูรณ์
- ค้นหาและแสดงผลได้ (mock data)

---

### Phase 4: Place Detail Feature (Week 3-4)
**Goal:** รายละเอียดสถานที่ท่องเที่ยว

#### Tasks:
- [ ] สร้าง Place Detail page (`/place/[id]`)
  - [ ] PlaceGallery component (images carousel)
  - [ ] PlaceDetail component (info, rating, reviews)
  - [ ] Rating component (stars)
  - [ ] Reviews section
  - [ ] NearbyPlaces component
  - [ ] NearbyRestaurants component
- [ ] FavoriteButton component (heart icon)
- [ ] ShareButton component (share dialog)
- [ ] สร้าง usePlace hook
- [ ] เชื่อม mockup place data

**shadcn components:**
- Card, Badge, Dialog, Tabs, Avatar, Separator, ScrollArea

**Deliverables:**
- หน้ารายละเอียดสถานที่สมบูรณ์
- Favorite & Share ใช้งานได้

---

### Phase 5: My Folder Feature (Week 4-5)
**Goal:** ระบบจัดการ Folder

#### Tasks:
- [ ] สร้าง My Folder page (`/my-folder`)
  - [ ] FolderList component (grid of folders)
  - [ ] FolderCard component
  - [ ] CreateFolderDialog component (shadcn Dialog + Form)
- [ ] สร้าง Folder Detail page (`/my-folder/[id]`)
  - [ ] FolderDetail component
  - [ ] Item list (saved places, links, etc.)
  - [ ] Delete/Edit folder
- [ ] SaveToFolderDialog component (ใช้จาก ResultCard)
- [ ] สร้าง useFolder hook
- [ ] เชื่อม mockup folder data

**shadcn components:**
- Dialog, Form, Input, Textarea, Button, Card, DropdownMenu

**Deliverables:**
- สร้าง/ลบ/แก้ไข folder ได้
- เก็บรายการลง folder ได้

---

### Phase 6: AI Mode Feature (Week 5-6)
**Goal:** AI Mode สำหรับสรุปข้อมูล

#### Tasks:
- [ ] สร้าง AI Mode page (`/search?mode=ai`)
  - [ ] AIContent component (แสดง AI summary)
  - [ ] SourceLinks component (clickable sources)
  - [ ] RelatedVideos component
  - [ ] ChatInput component (text + image + voice)
  - [ ] AIChat component (chat history)
- [ ] สร้าง useAIChat hook
- [ ] เชื่อม mockup AI data
- [ ] Image upload preview
- [ ] Voice input button (mock)

**shadcn components:**
- Card, Tabs, Input, Button, Badge, ScrollArea, Textarea

**Deliverables:**
- AI Mode แสดงผลได้
- Chat interface ใช้งานได้

---

### Phase 7: Profile & Utilities (Week 6-7)
**Goal:** โปรไฟล์และฟีเจอร์เสริม

#### Tasks:
- [ ] สร้าง Profile page (`/profile`)
  - [ ] ProfileInfo component
  - [ ] EditProfileForm component (shadcn Form)
  - [ ] SearchHistory component
  - [ ] Favorites list
- [ ] LanguageSwitcher component (TH/EN)
- [ ] QR Code Generator dialog
- [ ] Translation feature (mock)
- [ ] Responsive design (mobile/tablet)

**shadcn components:**
- Form, Input, Avatar, Tabs, Dialog, Select

**Deliverables:**
- โปรไฟล์ดูและแก้ไขได้
- ฟีเจอร์เสริมครบ
- Responsive ทุกหน้า

---

### Phase 8: Polish & Testing (Week 7-8)
**Goal:** ปรับปรุงและทดสอบ

#### Tasks:
- [ ] ปรับแต่ง UI/UX ให้สวยงาม
- [ ] เพิ่ม Loading states (Skeleton components)
- [ ] เพิ่ม Error handling
- [ ] เพิ่ม Toast notifications
- [ ] Performance optimization
- [ ] Accessibility (a11y)
- [ ] SEO optimization
- [ ] Testing (manual/automated)

**shadcn components:**
- Skeleton, Toast, Alert, Progress

**Deliverables:**
- UI/UX สมบูรณ์
- Loading & Error states
- Performance ดี
- Ready สำหรับ API integration

---

## API Integration Plan (After Mockup Phase)

### Step 1: Setup API Client
```typescript
// lib/api.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Step 2: Replace Mock Data
แทนที่ mock data ทีละ feature:
1. Authentication API
2. Search API
3. Folders API
4. Favorites API
5. AI Mode API
6. Places API

### Step 3: Error Handling
- Network errors
- Auth errors (401, 403)
- Validation errors (400)
- Server errors (500)

---

## Best Practices

### 1. TypeScript
- ใช้ strict mode
- Define types ทุก component
- Avoid `any` type
- Use interface สำหรับ props

### 2. Components
- ใช้ Named exports
- ใช้ React Server Components เมื่อเป็นไปได้
- Client Components เมื่อจำเป็น (useState, useEffect)
- Memoize components ที่จำเป็น

### 3. Styling
- ใช้ Tailwind utility classes
- ใช้ shadcn/ui variants
- Consistent spacing (4px grid)
- Responsive design first

### 4. State Management
- Use React Context สำหรับ global state
- Use Zustand ถ้าต้องการ advanced features
- Local state ใน component เมื่อเป็นไปได้

### 5. Performance
- Lazy loading สำหรับ images
- Dynamic imports สำหรับ heavy components
- Debounce search input
- Pagination สำหรับ long lists

---

## Color Scheme (Tailwind Config)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Main primary
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accent: {
          500: '#10b981',  // Green accent
        },
      },
    },
  },
};
```

---

## Next Steps

1. **Setup project** (Week 1 Day 1-2)
2. **Install shadcn/ui** และ components ที่จำเป็น (Week 1 Day 2-3)
3. **สร้าง mockup data** ทั้งหมด (Week 1 Day 3-4)
4. **เริ่ม Phase 1** ตามแผน (Week 1 Day 5)

---

## Notes
- ใช้ mockup data ก่อน เพื่อให้ develop UI/UX ได้เร็ว
- ตรวจสอบ responsive ทุกหน้า
- ใช้ shadcn/ui components อย่างเต็มที่
- Code review ก่อน merge
- Document components ที่สำคัญ
