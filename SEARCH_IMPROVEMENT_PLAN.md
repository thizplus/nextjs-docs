# แผนการปรับปรุง Search Page

## สรุปปัญหาที่พบ

### 1. AI Mode Tab ไม่ทำงาน
- **ปัญหา**: เมื่อคลิก "AI Mode" และพิมพ์ค้นหา ควร redirect ไปหน้า `/dashboard/ai?q=คำค้นหา`
- **สาเหตุ**: ยังไม่มี logic สำหรับ redirect เมื่อเลือก AI Mode

### 2. Tab "ทั้งหมด" ไม่ทำงาน
- **ปัญหา**: Tab "ทั้งหมด" ควรค้นหาทุกประเภท (website, image, video, place) พร้อมกัน
- **สาเหตุ**: ยังไม่มี hook/logic สำหรับ General Search (`useSearch`)

### 3. รูปภาพไม่แสดง (Image Search)
- **ปัญหา**: ค้นหารูปภาพได้ แต่ภาพไม่แสดง
- **สาเหตุ**:
  - อาจใช้ field ผิด (`thumbnailUrl` vs `url`)
  - ไม่มี fallback เมื่อ image load ไม่สำเร็จ
  - CORS หรือ referrer policy อาจบล็อกรูป

### 4. Video Preview ไม่แสดง
- **ปัญหา**: ค้นหาวิดีโอได้ แต่ thumbnail ไม่แสดง
- **สาเหตุ**: เหมือนกับปัญหารูปภาพ

### 5. ไม่มี Pagination
- **ปัญหา**: ไม่สามารถเปลี่ยนหน้าได้
- **สาเหตุ**: ยังไม่มี UI และ logic สำหรับ pagination

### 6. Tab "แผนที่" ไม่ทำงาน
- **ปัญหา**: ยังไม่มี implementation สำหรับแผนที่
- **สาเหตุ**: ยังไม่ได้สร้าง Map component

---

## แผนการแก้ไข

### Phase 1: แก้ไข AI Mode Redirect
**ไฟล์ที่ต้องแก้:**
- `app/dashboard/search/page.tsx`
- `src/features/search/components/SearchBar.tsx`

**รายละเอียด:**
1. เมื่อเลือก tab "AI Mode" และกดค้นหา → redirect ไป `/dashboard/ai?q=คำค้นหา`
2. แก้ไขหน้า AI ให้รับ query parameter และเริ่มค้นหาอัตโนมัติ

```tsx
// ใน search/page.tsx
const handleSearch = (newQuery: string) => {
  if (searchType === "ai") {
    router.push(`/dashboard/ai?q=${encodeURIComponent(newQuery)}`);
    return;
  }
  setQuery(newQuery);
};

// ใน handleTypeChange
const handleTypeChange = (type: SearchType) => {
  if (type === "ai" && query) {
    router.push(`/dashboard/ai?q=${encodeURIComponent(query)}`);
    return;
  }
  setSearchType(type);
};
```

---

### Phase 2: แก้ไข Tab "ทั้งหมด" (General Search)
**ไฟล์ที่ต้องแก้:**
- `app/dashboard/search/page.tsx`
- `src/features/search/hooks/useSearch.ts`

**รายละเอียด:**
1. ใช้ `useSearch` hook สำหรับ General Search
2. แสดงผลลัพธ์แบบรวม (websites, images, videos, places)
3. แสดงแยก section หรือ mixed results

```tsx
// เพิ่ม hook
const generalQuery = useSearch(
  { q: query, page, pageSize: 20 },
  searchType === "all" && !!query
);

// แสดงผลลัพธ์
{searchType === "all" && (
  <div className="space-y-8">
    {/* Website Results Section */}
    <section>
      <h3>เว็บไซต์</h3>
      {/* render websites */}
    </section>

    {/* Image Results Section */}
    <section>
      <h3>รูปภาพ</h3>
      {/* render images */}
    </section>

    {/* Video Results Section */}
    <section>
      <h3>วิดีโอ</h3>
      {/* render videos */}
    </section>
  </div>
)}
```

---

### Phase 3: แก้ไขปัญหารูปภาพไม่แสดง
**ไฟล์ที่ต้องแก้:**
- `app/dashboard/search/page.tsx`

**รายละเอียด:**
1. เพิ่ม error handling สำหรับ image
2. เพิ่ม fallback placeholder
3. เพิ่ม `referrerPolicy="no-referrer"` สำหรับ external images
4. ใช้ Next.js Image component หรือ proxy

```tsx
// แก้ไข Image rendering
<img
  src={result.thumbnailUrl || result.url}
  alt={result.title}
  className="object-cover w-full h-full"
  referrerPolicy="no-referrer"
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/placeholder-image.svg';
  }}
/>
```

**สร้าง placeholder image:**
- สร้าง `/public/placeholder-image.svg`
- สร้าง `/public/placeholder-video.svg`

---

### Phase 4: เพิ่ม Pagination
**ไฟล์ที่ต้องแก้:**
- `app/dashboard/search/page.tsx`
- `src/features/search/hooks/useSearch.ts`

**รายละเอียด:**
1. เพิ่ม state สำหรับ page
2. เพิ่ม Pagination UI component
3. อัพเดท URL query params เมื่อเปลี่ยนหน้า

```tsx
// State
const [page, setPage] = useState(1);
const pageSize = 20;

// Calculate total pages
const totalCount = websiteQuery.data?.totalCount || 0;
const totalPages = Math.ceil(totalCount / pageSize);

// Pagination UI
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
      />
    </PaginationItem>

    {/* Page numbers */}
    {[...Array(Math.min(5, totalPages))].map((_, i) => (
      <PaginationItem key={i}>
        <PaginationLink
          isActive={page === i + 1}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

### Phase 5: Tab "แผนที่"
**ไฟล์ที่ต้องสร้าง/แก้:**
- `app/dashboard/search/page.tsx`
- `src/features/places/components/PlaceMap.tsx` (ใหม่)

**รายละเอียด:**
1. สร้าง Map component ใช้ Google Maps หรือ Leaflet
2. ค้นหา places และแสดงบนแผนที่
3. แสดง markers และ info windows

**Note:** ต้องมี API Key สำหรับ Google Maps หรือใช้ Leaflet (free)

---

## Priority Order

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 1 | แก้ไขรูปภาพ/วิดีโอไม่แสดง | ต่ำ | สูง |
| 2 | เพิ่ม Pagination | กลาง | สูง |
| 3 | AI Mode Redirect | ต่ำ | กลาง |
| 4 | Tab "ทั้งหมด" | กลาง | กลาง |
| 5 | Tab "แผนที่" | สูง | ต่ำ |

---

## Files to Create/Modify

### New Files
- `/public/placeholder-image.svg`
- `/public/placeholder-video.svg`

### Modified Files
- `app/dashboard/search/page.tsx` - หลักๆ
- `app/dashboard/ai/page.tsx` - รับ query param
- `src/features/search/components/SearchBar.tsx` - minor
- `src/features/search/components/FilterTabs.tsx` - minor

---

## API Response ที่ต้องใช้

### WebsiteSearchResponse
```typescript
{
  query: string;
  results: WebsiteResult[];
  totalCount: number;  // สำหรับ pagination
  page: number;
  pageSize: number;
}
```

### ImageSearchResponse
```typescript
{
  query: string;
  results: ImageResult[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ImageResult
{
  title: string;
  url: string;           // full size image
  thumbnailUrl: string;  // thumbnail
  contextLink: string;   // link to source page
  width: number;
  height: number;
  source: string;
}
```

### VideoSearchResponse
```typescript
{
  query: string;
  results: VideoResult[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// VideoResult
{
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: number;
}
```

---

## Timeline Estimate

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | แก้รูปภาพ/วิดีโอไม่แสดง | Pending |
| Phase 2 | เพิ่ม Pagination | Pending |
| Phase 3 | AI Mode Redirect | Pending |
| Phase 4 | Tab "ทั้งหมด" | Pending |
| Phase 5 | Tab "แผนที่" | Future |

---

## Notes

1. **CORS Issues**: External images อาจถูก block เนื่องจาก CORS policy - ต้องใช้ proxy หรือ `referrerPolicy`

2. **Image Optimization**: พิจารณาใช้ Next.js Image component พร้อม remote patterns config

3. **Infinite Scroll**: อาจพิจารณาใช้ infinite scroll แทน pagination สำหรับ UX ที่ดีขึ้น

4. **URL State**: ควรเก็บ state (query, type, page) ใน URL เพื่อให้ bookmark/share ได้
