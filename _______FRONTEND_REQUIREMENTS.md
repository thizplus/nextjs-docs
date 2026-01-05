# Frontend Requirements - STOU Smart Tour

## สถานะปัจจุบัน (Current State)

### โครงสร้าง Project
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI Library:** shadcn/ui + Radix UI (53+ components)
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand + React Query
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

### หน้าที่มีอยู่แล้ว
| หน้า | URL | สถานะ |
|------|-----|-------|
| Login | `/login` | ✅ ใช้งานได้ |
| Register | `/register` | ✅ ใช้งานได้ |
| Dashboard Home | `/dashboard` | ✅ ใช้งานได้ |
| Search | `/dashboard/search` | ✅ ใช้งานได้ |
| Place Detail | `/dashboard/place/[id]` | ✅ ใช้งานได้ |
| AI Chat | `/dashboard/ai` | ✅ ใช้งานได้ |
| AI Session | `/dashboard/ai/[sessionId]` | ✅ ใช้งานได้ |
| Map | `/dashboard/map` | ✅ ใช้งานได้ |
| My Folder | `/dashboard/my-folder` | ✅ ใช้งานได้ |
| Folder Detail | `/dashboard/my-folder/[id]` | ✅ ใช้งานได้ |
| Profile | `/dashboard/profile` | ✅ ใช้งานได้ |
| Settings | `/dashboard/settings` | ✅ ใช้งานได้ |
| QR Code | `/dashboard/qr-code` | ✅ ใช้งานได้ |
| Help | `/dashboard/help` | ✅ ใช้งานได้ |

### ฟีเจอร์ที่มีอยู่แล้ว
- ✅ Authentication (Email/Password login & register)
- ✅ Multi-type Search (places, videos, websites, images)
- ✅ Place Details (photos, reviews, hours, contact info)
- ✅ AI Chat with session context
- ✅ Favorites & Folders management
- ✅ Search History
- ✅ Dark/Light Theme
- ✅ Responsive Design (Mobile & Desktop)
- ✅ QR Code Generator
- ✅ Share functionality (basic)

---

## งานที่ต้องทำ (Requirements from requirement.txt)

### 1. การออกแบบหน้าจอ Non-Login State
**Priority: HIGH**

**สิ่งที่ต้องทำ:**
- [ ] แก้ไขหน้า `/` (root) ให้แสดงหน้า Search พื้นฐานโดยไม่ต้อง Login
- [ ] สร้าง Public Search UI ที่ไม่ต้อง Login
- [ ] ให้ผู้ใช้ค้นหาพื้นฐานได้ (places, websites) โดยไม่ต้องลงทะเบียน
- [ ] แสดง prompt ให้ Login เมื่อต้องการใช้ฟีเจอร์ AI หรือ Favorites
- [ ] ปรับ AuthGuard ให้รองรับ public routes

**ไฟล์ที่ต้องแก้ไข:**
- `app/page.tsx` - สร้างหน้า landing/search แบบ public
- `app/layout.tsx` - ปรับ layout สำหรับ non-auth users
- `src/features/auth/components/AuthGuard.tsx` - ปรับ logic
- `src/shared/components/navigation/` - เพิ่ม navigation สำหรับ guest

---

### 2. พัฒนาหน้ารายละเอียดสถานที่ (Place Detail Enhancement)
**Priority: HIGH**

**สิ่งที่ต้องเพิ่ม:**
- [ ] **ประวัติ/ที่มา:** แสดงข้อมูลความเป็นมาของสถานที่
- [ ] **สถานที่ตั้ง:** ข้อมูลตำแหน่งที่ชัดเจน (แผนที่ embedded)
- [ ] **AI สรุปภาพรวม:** ปุ่มให้ AI สรุปข้อมูลสถานที่
- [ ] **วิดีโอที่เกี่ยวข้อง:** แสดง YouTube videos เกี่ยวกับสถานที่
- [ ] **UI ที่อ่านง่าย:** ออกแบบให้มัคคุเทศก์อ่านและทำความเข้าใจได้รวดเร็ว

**ไฟล์ที่ต้องแก้ไข:**
- `app/dashboard/place/[id]/page.tsx` - เพิ่ม sections ใหม่
- สร้าง component `PlaceHistory.tsx` - แสดงประวัติ
- สร้าง component `PlaceAISummary.tsx` - AI summary
- สร้าง component `RelatedVideos.tsx` - วิดีโอที่เกี่ยวข้อง
- สร้าง component `PlaceMapEmbed.tsx` - แผนที่ embedded

**API ที่ต้องใช้:**
- `POST /api/v1/ai/chat` - สำหรับ AI summary (ต้องรอ Backend)
- `GET /api/v1/search/videos?q={placeName}` - วิดีโอที่เกี่ยวข้อง

---

### 3. Social Share Icons
**Priority: MEDIUM**

**สิ่งที่ต้องทำ:**
- [ ] เพิ่มไอคอนแชร์สำหรับ: TikTok, LINE, Facebook, X (Twitter), Instagram
- [ ] แสดงเป็นไอคอนเท่านั้น (icon-only buttons)
- [ ] รองรับ deep linking สำหรับแต่ละ platform

**ไฟล์ที่ต้องแก้ไข:**
- `src/shared/components/common/ShareButton.tsx` - เพิ่ม platform icons
- เพิ่ม dependencies: `react-icons` หรือใช้ SVG icons

**Share URLs:**
```typescript
const shareUrls = {
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
  line: `https://social-plugins.line.me/lineit/share?url=${url}`,
  tiktok: `https://www.tiktok.com/share?url=${url}`,
  instagram: // Instagram ไม่รองรับ web share โดยตรง - อาจต้องแสดง copy link
}
```

---

### 4. แก้ไขโปรไฟล์ (Edit Profile)
**Priority: HIGH**

**สิ่งที่ต้องทำ:**
- [ ] สร้าง Edit Profile form
- [ ] รองรับแก้ไข: FirstName, LastName, Avatar
- [ ] Upload/เปลี่ยน Avatar image
- [ ] Validation ด้วย Zod schema

**ไฟล์ที่ต้องแก้ไข:**
- `app/dashboard/profile/page.tsx` - เพิ่มปุ่ม Edit และ Modal
- สร้าง component `EditProfileForm.tsx`
- สร้าง hook `useUpdateProfile.ts`
- `src/services/backend/user.service.ts` - เพิ่ม updateProfile function

**API ที่ใช้:**
- `PUT /api/v1/users/profile` - มีอยู่แล้ว

---

### 5. User Uploads (Images, PDF, Video Clips)
**Priority: MEDIUM**

**สิ่งที่ต้องทำ:**
- [ ] สร้าง Upload component สำหรับ images, PDF, video
- [ ] แสดง progress bar ขณะ upload
- [ ] Preview files ก่อน upload
- [ ] รองรับ drag & drop
- [ ] จัดการไฟล์ที่ upload แล้ว (view, delete)

**ไฟล์ที่ต้องสร้าง:**
- สร้าง component `FileUploader.tsx`
- สร้าง component `FilePreview.tsx`
- สร้าง component `UserFilesGallery.tsx`
- สร้าง hook `useFileUpload.ts`
- `src/services/backend/file.service.ts` - file upload service

**API ที่ใช้:**
- `POST /api/v1/files/upload` - มีอยู่แล้ว
- `GET /api/v1/files/my` - มีอยู่แล้ว
- `DELETE /api/v1/files/:id` - มีอยู่แล้ว

**หมายเหตุ:** Backend ใช้ Bunny Storage อยู่แล้ว แต่ถ้าต้องเปลี่ยนไป Cloudflare R2 ต้องแก้ Backend

---

### 6. แนะนำ Keywords ในการค้นหา
**Priority: MEDIUM**

**สิ่งที่ต้องทำ:**
- [ ] Autocomplete/Suggestions ขณะพิมพ์ค้นหา
- [ ] แสดง popular keywords
- [ ] แสดง recent searches (มีอยู่แล้วบางส่วน)
- [ ] Category-based suggestions

**ไฟล์ที่ต้องแก้ไข:**
- `src/features/search/components/SearchBar.tsx` - เพิ่ม autocomplete
- สร้าง component `SearchSuggestions.tsx`
- สร้าง hook `useSearchSuggestions.ts`

**API ที่ต้องการ (ต้องรอ Backend):**
- `GET /api/v1/search/suggestions?q={query}` - ยังไม่มี

---

### 7. OAuth Login (Gmail, LINE, Facebook)
**Priority: HIGH**

**สิ่งที่ต้องทำ:**
- [ ] เพิ่มปุ่ม "Login with Google"
- [ ] เพิ่มปุ่ม "Login with LINE"
- [ ] เพิ่มปุ่ม "Login with Facebook"
- [ ] Handle OAuth callback
- [ ] Link existing account กับ OAuth

**ไฟล์ที่ต้องแก้ไข:**
- `app/(auth)/login/page.tsx` - เพิ่ม OAuth buttons
- `app/(auth)/register/page.tsx` - เพิ่ม OAuth buttons
- สร้าง `app/api/auth/callback/[provider]/route.ts` - OAuth callback
- สร้าง hook `useOAuthLogin.ts`
- `src/services/auth/auth.service.ts` - เพิ่ม OAuth functions

**Dependencies ที่ต้องเพิ่ม:**
```bash
npm install next-auth # หรือ implement OAuth manually
```

**API ที่ต้องการ (ต้องรอ Backend):**
- `POST /api/v1/auth/google` - ยังไม่มี
- `POST /api/v1/auth/line` - ยังไม่มี
- `POST /api/v1/auth/facebook` - ยังไม่มี

---

### 8. ระบบแปลภาษา
**Priority: MEDIUM**

**สิ่งที่ต้องทำ:**
- [ ] เพิ่ม Language Selector ที่ชัดเจน (มี component อยู่แล้ว)
- [ ] แปลข้อมูลสถานที่แบบ real-time
- [ ] แปล AI responses
- [ ] รองรับภาษา: ไทย, อังกฤษ, จีน, ญี่ปุ่น, เกาหลี, อื่นๆ
- [ ] บันทึก language preference

**ไฟล์ที่ต้องแก้ไข:**
- `src/shared/components/common/LanguageSwitcher.tsx` - ปรับปรุง UI
- สร้าง hook `useTranslation.ts`
- สร้าง context `TranslationContext.tsx`
- ปรับ Place detail page ให้รองรับการแปล

**API ที่ใช้:**
- `POST /api/v1/utils/translate` - มีอยู่แล้ว
- `POST /api/v1/utils/detect-language` - มีอยู่แล้ว

---

## สรุป Priority

| Priority | งาน | ความยาก |
|----------|-----|---------|
| **HIGH** | 1. Non-Login State | Medium |
| **HIGH** | 2. Place Detail Enhancement | Medium |
| **HIGH** | 4. Edit Profile | Easy |
| **HIGH** | 7. OAuth Login | Hard (ต้องรอ Backend) |
| **MEDIUM** | 3. Social Share Icons | Easy |
| **MEDIUM** | 5. User Uploads | Medium |
| **MEDIUM** | 6. Search Suggestions | Medium (ต้องรอ Backend) |
| **MEDIUM** | 8. Translation System | Medium |

---

## Dependencies ที่อาจต้องเพิ่ม

```bash
# Social Share
npm install react-share

# OAuth (ถ้าใช้ next-auth)
npm install next-auth

# File Upload UI
npm install react-dropzone

# Translation (ถ้าทำ i18n เต็มรูปแบบ)
npm install next-intl
# หรือ
npm install react-i18next i18next
```

---

## หมายเหตุสำคัญ

1. **OAuth Login** - ต้องรอ Backend สร้าง endpoints ก่อน
2. **Search Suggestions** - ต้องรอ Backend สร้าง endpoint ก่อน
3. **Cloudflare R2** - ถ้าต้องการเปลี่ยนจาก Bunny Storage ต้องแก้ Backend
4. **AI Summary** - ใช้ endpoint AI chat ที่มีอยู่ได้ แต่อาจต้องปรับ prompt

---

## Recommended Implementation Order

1. **Phase 1 (ทำได้เลย - ไม่ต้องรอ Backend):**
   - Edit Profile
   - Social Share Icons
   - User File Uploads (ใช้ API ที่มีอยู่)
   - Translation UI (ใช้ API ที่มีอยู่)

2. **Phase 2 (ทำได้เลย - ต้องปรับ Frontend มาก):**
   - Non-Login State
   - Place Detail Enhancement

3. **Phase 3 (ต้องรอ Backend):**
   - OAuth Login (Gmail, LINE, Facebook)
   - Search Suggestions/Keywords
