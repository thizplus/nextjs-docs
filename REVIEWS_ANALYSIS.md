# Place Reviews Analysis - STOU Smart Tour

## สรุปปัญหา

Google Places API มีข้อจำกัดเรื่อง Reviews:
- **คืน reviews สูงสุดเพียง 5 รายการ** ต่อ 1 request
- **ไม่สามารถกรองตาม rating** (1-5 ดาว) ได้
- **ไม่สามารถ pagination** เพื่อดึง reviews เพิ่มได้

---

## 1. Google Places API Limitation

จากเอกสาร Google Places API:

```
The reviews array contains up to five reviews.
```

**ไฟล์:** `gofiber-docs/infrastructure/external/google/places_client.go:119`

```go
type PlaceDetails struct {
    // ...
    Reviews []Review `json:"reviews,omitempty"` // Max 5 reviews from Google
    // ...
}
```

### Parameters ที่ Google รองรับ:

| Parameter | รองรับ | หมายเหตุ |
|-----------|--------|----------|
| `reviews_sort` | ✅ | `most_relevant` (default) หรือ `newest` |
| `reviews_no_translations` | ✅ | ไม่แปลภาษา |
| Filter by rating | ❌ | ไม่รองรับ |
| Pagination | ❌ | ไม่รองรับ |
| More than 5 reviews | ❌ | ไม่รองรับ |

---

## 2. ทางเลือกในการแก้ไข

### Option A: ใช้ Google Places API (New) - แนะนำ ⭐

Google มี Places API เวอร์ชันใหม่ที่รองรับ reviews มากขึ้น:

```
POST https://places.googleapis.com/v1/places/{placeId}
```

**ข้อดี:**
- รองรับ reviews มากกว่า 5 รายการ (ผ่าน field mask)
- มี pagination
- ราคาเท่าเดิม

**ข้อเสีย:**
- ต้องแก้ไข backend ให้ใช้ API ใหม่
- Format response ต่างจากเดิม

---

### Option B: ใช้ Sort Parameter (ง่ายที่สุด)

เพิ่ม parameter `reviews_sort` เพื่อเรียงลำดับ reviews:

**Backend แก้ไข:**

```go
// gofiber-docs/infrastructure/external/google/places_client.go

type PlaceDetailsRequest struct {
    PlaceID     string
    Fields      []string
    Language    string
    ReviewsSort string // "most_relevant" or "newest"
}

func (c *PlacesClient) GetPlaceDetails(ctx context.Context, req *PlaceDetailsRequest) (*PlaceDetailsResponse, error) {
    params := url.Values{}
    // ...existing code...

    // Add reviews_sort parameter
    if req.ReviewsSort != "" {
        params.Set("reviews_sort", req.ReviewsSort)
    }
    // ...
}
```

**ข้อจำกัด:** ยังคงได้แค่ 5 reviews

---

### Option C: เก็บ Reviews ในฐานข้อมูลเอง

สร้างระบบ reviews ของตัวเอง:

**Database Schema:**

```sql
CREATE TABLE place_reviews (
    id UUID PRIMARY KEY,
    place_id VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_place_reviews_place_id ON place_reviews(place_id);
CREATE INDEX idx_place_reviews_rating ON place_reviews(rating);
```

**API Endpoints:**

```
GET  /api/v1/places/{placeId}/reviews?rating=5&page=1&pageSize=10
POST /api/v1/places/{placeId}/reviews
```

**ข้อดี:**
- กรองตาม rating ได้
- Pagination ได้
- ไม่จำกัดจำนวน reviews

**ข้อเสีย:**
- ต้องสร้างระบบใหม่ทั้งหมด
- ต้องให้ผู้ใช้เขียน review เอง (ไม่ใช่ Google reviews)

---

### Option D: Web Scraping (ไม่แนะนำ)

ดึง reviews จาก Google Maps โดยตรง

**ข้อเสีย:**
- ผิด Terms of Service ของ Google
- ไม่เสถียร (อาจโดน block)
- ไม่แนะนำสำหรับ production

---

## 3. แนะนำ: Option B + C (Hybrid)

### Phase 1: เพิ่ม Sort Parameter (ทำได้เลย)

แก้ไข backend เพื่อรองรับ `reviews_sort`:

```go
// Request
GET /api/v1/places/{placeId}?reviews_sort=newest
```

Frontend เพิ่ม tabs:
- "รีวิวเด่น" (most_relevant)
- "รีวิวล่าสุด" (newest)

### Phase 2: สร้างระบบ Reviews ของตัวเอง (อนาคต)

- ให้ผู้ใช้เขียน review ได้
- กรองตาม rating ได้
- แสดงทั้ง Google reviews และ User reviews

---

## 4. สรุป

| คำถาม | คำตอบ |
|-------|-------|
| ต้องมี API เพิ่มไหม? | **ใช่** ถ้าต้องการ filter by rating หรือ pagination |
| Google API รองรับไหม? | **ไม่** (แค่ 5 reviews, ไม่ filter ได้) |
| วิธีที่แนะนำ? | สร้างระบบ reviews ของตัวเอง + รวมกับ Google reviews |

---

## 5. Quick Implementation (Phase 1)

ถ้าต้องการทำเร็ว สามารถเพิ่ม sort option ใน frontend ได้เลย:

**Frontend เพิ่ม Tabs:**
```tsx
// app/dashboard/place/[id]/page.tsx
const [reviewSort, setReviewSort] = useState<'most_relevant' | 'newest'>('most_relevant');

<Tabs value={reviewSort} onValueChange={setReviewSort}>
  <TabsList>
    <TabsTrigger value="most_relevant">รีวิวเด่น</TabsTrigger>
    <TabsTrigger value="newest">รีวิวล่าสุด</TabsTrigger>
  </TabsList>
</Tabs>
```

แต่ยังคงได้แค่ 5 reviews เหมือนเดิม เพราะ Google API จำกัด
