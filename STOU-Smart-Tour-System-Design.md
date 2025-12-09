# STOU Smart Tour - System Design Document

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              STOU Smart Tour                                     │
│                         System Architecture Diagram                              │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │    Client    │
                                    │   Browser    │
                                    └──────┬───────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Frontend (Next.js)                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Pages     │  │ Components  │  │   Hooks     │  │   Store     │            │
│  │  (App Dir)  │  │  (Reusable) │  │  (Custom)   │  │  (Zustand)  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                  │
│  Port: 3000 | Framework: Next.js 14+ (App Router) | TypeScript                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           │ HTTP/REST API
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Backend (Go Fiber)                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Handlers   │  │  Services   │  │ Repository  │  │ Middleware  │            │
│  │   (API)     │  │  (Business) │  │   (Data)    │  │  (Auth,Log) │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                  │
│  Port: 8080 | Framework: Go Fiber v2 | JWT Auth                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
           ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
           │  PostgreSQL  │       │    Redis     │       │ External APIs│
           │   Database   │       │    Cache     │       │   (Google)   │
           │  Port: 5432  │       │  Port: 6379  │       │              │
           └──────────────┘       └──────────────┘       └──────────────┘
```

---

## 2. Frontend Architecture (Next.js)

### 2.1 Project Structure

```
frontend/
├── app/                          # App Router (Next.js 14+)
│   ├── (auth)/                   # Auth Group Routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (main)/                   # Main App Group Routes
│   │   ├── page.tsx              # Home Page (/)
│   │   ├── search/
│   │   │   └── page.tsx          # Search Results (/search)
│   │   ├── place/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Place Detail (/place/[id])
│   │   ├── my-folder/
│   │   │   ├── page.tsx          # Folder List (/my-folder)
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Folder Detail (/my-folder/[id])
│   │   ├── profile/
│   │   │   └── page.tsx          # Profile (/profile)
│   │   └── layout.tsx
│   │
│   ├── api/                      # API Routes (Optional BFF)
│   │   └── [...]/
│   │
│   ├── globals.css
│   ├── layout.tsx                # Root Layout
│   └── not-found.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchBarHome.tsx     # Large version for home
│   │   ├── SearchBarNav.tsx      # Compact version for nav
│   │   ├── FilterTabs.tsx
│   │   ├── SearchResults.tsx
│   │   ├── ResultCard.tsx
│   │   ├── ResultCardGrid.tsx
│   │   ├── ResultCardList.tsx
│   │   ├── ResultSkeleton.tsx
│   │   ├── MapView.tsx
│   │   ├── Pagination.tsx
│   │   └── NoResults.tsx
│   │
│   ├── ai/
│   │   ├── AIContent.tsx
│   │   ├── AIChat.tsx
│   │   ├── AIChatInput.tsx
│   │   ├── AIChatMessage.tsx
│   │   ├── AISourceCard.tsx
│   │   ├── RelatedVideos.tsx
│   │   ├── VideoCard.tsx
│   │   └── VoiceInput.tsx
│   │
│   ├── folder/
│   │   ├── FolderList.tsx
│   │   ├── FolderCard.tsx
│   │   ├── FolderDetail.tsx
│   │   ├── FolderItemCard.tsx
│   │   ├── CreateFolderModal.tsx
│   │   ├── SaveToFolderModal.tsx
│   │   └── FolderShareModal.tsx
│   │
│   ├── place/
│   │   ├── PlaceCard.tsx
│   │   ├── PlaceDetail.tsx
│   │   ├── PlaceGallery.tsx
│   │   ├── PlaceInfo.tsx
│   │   ├── PlaceReviews.tsx
│   │   ├── PlaceMap.tsx
│   │   ├── NearbyPlaces.tsx
│   │   └── NearbyRestaurants.tsx
│   │
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Toast.tsx
│   │   ├── Rating.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── ShareButton.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── QRCodeGenerator.tsx
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── AuthGuard.tsx
│   │   └── SocialLoginButtons.tsx
│   │
│   └── home/
│       ├── HeroSection.tsx
│       ├── FeaturedDestinations.tsx
│       ├── QuickLinks.tsx
│       └── PopularSearches.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useSearch.ts
│   ├── useDebounce.ts
│   ├── useFolders.ts
│   ├── useFavorites.ts
│   ├── useGeolocation.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── useInfiniteScroll.ts
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # Axios/Fetch instance
│   │   ├── auth.ts               # Auth API calls
│   │   ├── search.ts             # Search API calls
│   │   ├── folders.ts            # Folders API calls
│   │   ├── favorites.ts          # Favorites API calls
│   │   └── utilities.ts          # QR, Translate API calls
│   │
│   ├── utils/
│   │   ├── formatters.ts         # Date, number formatting
│   │   ├── validators.ts         # Form validation
│   │   ├── constants.ts          # App constants
│   │   └── helpers.ts            # Utility functions
│   │
│   └── config/
│       ├── env.ts                # Environment variables
│       └── routes.ts             # Route constants
│
├── store/
│   ├── useAuthStore.ts           # Zustand auth store
│   ├── useSearchStore.ts         # Search state
│   ├── useUIStore.ts             # UI state (modals, etc.)
│   └── index.ts
│
├── types/
│   ├── auth.ts
│   ├── search.ts
│   ├── folder.ts
│   ├── place.ts
│   ├── api.ts
│   └── index.ts
│
├── styles/
│   └── components/               # Component-specific styles
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 2.2 State Management Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    State Management Layers                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   Server State      │  ──▶  TanStack Query (React Query)
│   (API Data)        │       - Caching
├─────────────────────┤       - Background refetching
│   - Search Results  │       - Optimistic updates
│   - Folders         │       - Infinite queries
│   - Favorites       │
│   - User Data       │
└─────────────────────┘

┌─────────────────────┐
│   Client State      │  ──▶  Zustand
│   (UI State)        │       - Lightweight
├─────────────────────┤       - TypeScript support
│   - Auth State      │       - Persist middleware
│   - Modal State     │
│   - Filter State    │
│   - Theme           │
└─────────────────────┘

┌─────────────────────┐
│   Form State        │  ──▶  React Hook Form
│                     │       - Validation (Zod)
├─────────────────────┤       - Performance
│   - Login Form      │
│   - Register Form   │
│   - Search Form     │
└─────────────────────┘

┌─────────────────────┐
│   URL State         │  ──▶  nuqs (URL Search Params)
│                     │       - Shareable URLs
├─────────────────────┤       - Browser history
│   - Search Query    │
│   - Filters         │
│   - View Mode       │
│   - Page Number     │
└─────────────────────┘
```

### 2.3 Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",

    // State Management
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "nuqs": "^1.0.0",

    // Forms & Validation
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",

    // UI Components
    "tailwindcss": "^3.3.0",
    "@headlessui/react": "^1.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.292.0",

    // Maps & Location
    "@react-google-maps/api": "^2.19.0",

    // Utilities
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "qrcode.react": "^3.1.0",

    // Animation
    "framer-motion": "^10.16.0"
  }
}
```

---

## 3. Backend Architecture (Go Fiber)

### 3.1 Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go               # Application entry point
│
├── internal/
│   ├── config/
│   │   ├── config.go             # Configuration struct
│   │   └── env.go                # Environment loader
│   │
│   ├── handlers/                 # HTTP Handlers (Controllers)
│   │   ├── auth_handler.go
│   │   ├── search_handler.go
│   │   ├── folder_handler.go
│   │   ├── favorite_handler.go
│   │   ├── utility_handler.go
│   │   └── health_handler.go
│   │
│   ├── services/                 # Business Logic
│   │   ├── auth_service.go
│   │   ├── search_service.go
│   │   ├── ai_service.go
│   │   ├── folder_service.go
│   │   ├── favorite_service.go
│   │   ├── translate_service.go
│   │   └── qrcode_service.go
│   │
│   ├── repository/               # Data Access Layer
│   │   ├── user_repository.go
│   │   ├── folder_repository.go
│   │   ├── folder_item_repository.go
│   │   ├── favorite_repository.go
│   │   ├── search_history_repository.go
│   │   └── base_repository.go
│   │
│   ├── models/                   # Database Models
│   │   ├── user.go
│   │   ├── folder.go
│   │   ├── folder_item.go
│   │   ├── favorite.go
│   │   └── search_history.go
│   │
│   ├── dto/                      # Data Transfer Objects
│   │   ├── request/
│   │   │   ├── auth_request.go
│   │   │   ├── search_request.go
│   │   │   ├── folder_request.go
│   │   │   └── favorite_request.go
│   │   │
│   │   └── response/
│   │       ├── auth_response.go
│   │       ├── search_response.go
│   │       ├── folder_response.go
│   │       ├── error_response.go
│   │       └── pagination_response.go
│   │
│   ├── middleware/
│   │   ├── auth_middleware.go    # JWT validation
│   │   ├── cors_middleware.go
│   │   ├── logger_middleware.go
│   │   ├── rate_limit_middleware.go
│   │   └── recover_middleware.go
│   │
│   ├── router/
│   │   ├── router.go             # Main router setup
│   │   ├── auth_routes.go
│   │   ├── search_routes.go
│   │   ├── folder_routes.go
│   │   └── utility_routes.go
│   │
│   ├── external/                 # External API Clients
│   │   ├── google/
│   │   │   ├── search_client.go
│   │   │   ├── places_client.go
│   │   │   ├── maps_client.go
│   │   │   └── translate_client.go
│   │   │
│   │   ├── openai/
│   │   │   └── ai_client.go
│   │   │
│   │   └── youtube/
│   │       └── youtube_client.go
│   │
│   ├── cache/
│   │   ├── redis_client.go
│   │   └── cache_keys.go
│   │
│   └── utils/
│       ├── jwt.go
│       ├── hash.go
│       ├── validator.go
│       ├── response.go
│       └── errors.go
│
├── pkg/                          # Shared packages
│   └── logger/
│       └── logger.go
│
├── migrations/                   # Database migrations
│   ├── 000001_create_users.up.sql
│   ├── 000001_create_users.down.sql
│   ├── 000002_create_folders.up.sql
│   ├── 000002_create_folders.down.sql
│   └── ...
│
├── scripts/
│   └── seed.go                   # Database seeding
│
├── docs/
│   └── swagger/                  # API documentation
│       └── swagger.yaml
│
├── .env.example
├── go.mod
├── go.sum
├── Dockerfile
└── Makefile
```

### 3.2 Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Request Flow                                │
└─────────────────────────────────────────────────────────────────┘

  HTTP Request
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Middleware Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  CORS    │→│  Logger  │→│   Auth   │→│ RateLimit│           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Handler Layer                               │
│  - Parse request                                                 │
│  - Validate input (DTO)                                         │
│  - Call service                                                  │
│  - Format response                                               │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                               │
│  - Business logic                                                │
│  - Orchestrate operations                                        │
│  - Call external APIs                                            │
│  - Transaction management                                        │
└─────────────────────────────────────────────────────────────────┘
       │
       ├──────────────────────────────┐
       ▼                              ▼
┌──────────────────┐        ┌──────────────────┐
│  Repository      │        │  External APIs   │
│  Layer           │        │  Layer           │
│  - PostgreSQL    │        │  - Google API    │
│  - Redis Cache   │        │  - OpenAI API    │
└──────────────────┘        │  - YouTube API   │
                            └──────────────────┘
```

### 3.3 Key Dependencies

```go
// go.mod
module github.com/stou/smart-tour-backend

go 1.21

require (
    // Web Framework
    github.com/gofiber/fiber/v2 v2.51.0
    github.com/gofiber/contrib/jwt v1.0.0

    // Database
    github.com/jackc/pgx/v5 v5.5.0
    github.com/jmoiron/sqlx v1.3.5

    // Cache
    github.com/redis/go-redis/v9 v9.3.0

    // Authentication
    github.com/golang-jwt/jwt/v5 v5.2.0
    golang.org/x/crypto v0.16.0

    // Validation
    github.com/go-playground/validator/v10 v10.16.0

    // Configuration
    github.com/spf13/viper v1.18.0

    // Migration
    github.com/golang-migrate/migrate/v4 v4.17.0

    // Logging
    go.uber.org/zap v1.26.0

    // UUID
    github.com/google/uuid v1.5.0

    // QR Code
    github.com/skip2/go-qrcode v0.0.0-20200617195104-da1b6568686e
)
```

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Entity Relationship Diagram                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│      users       │         │  search_history  │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │────┐    │ id (PK)          │
│ student_id       │    │    │ user_id (FK)     │───┐
│ email            │    │    │ query            │   │
│ password_hash    │    │    │ search_type      │   │
│ name             │    │    │ created_at       │   │
│ avatar_url       │    └────│──────────────────│───┘
│ created_at       │         └──────────────────┘
│ updated_at       │
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐         ┌──────────────────┐
│     folders      │         │   folder_items   │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │────┐    │ id (PK)          │
│ user_id (FK)     │    │    │ folder_id (FK)   │───┐
│ name             │    │    │ type             │   │
│ description      │    │    │ title            │   │
│ cover_image_url  │    │    │ url              │   │
│ is_public        │    │    │ thumbnail_url    │   │
│ created_at       │    └────│ metadata (JSONB) │───┘
│ updated_at       │         │ created_at       │
└──────────────────┘         └──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│    favorites     │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ type             │
│ external_id      │
│ title            │
│ url              │
│ thumbnail_url    │
│ rating           │
│ metadata (JSONB) │
│ created_at       │
└──────────────────┘
```

### 4.2 Complete SQL Schema

```sql
-- ============================================
-- STOU Smart Tour Database Schema
-- PostgreSQL 15+
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);

-- ============================================
-- 2. REFRESH TOKENS TABLE (for JWT refresh)
-- ============================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================
-- 3. FOLDERS TABLE
-- ============================================
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    item_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_is_public ON folders(is_public);

-- ============================================
-- 4. FOLDER ITEMS TABLE
-- ============================================
CREATE TYPE item_type AS ENUM ('place', 'website', 'image', 'video', 'link');

CREATE TABLE folder_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    type item_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_folder_items_folder_id ON folder_items(folder_id);
CREATE INDEX idx_folder_items_type ON folder_items(type);

-- ============================================
-- 5. FAVORITES TABLE
-- ============================================
CREATE TYPE favorite_type AS ENUM ('place', 'website', 'image', 'video');

CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type favorite_type NOT NULL,
    external_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    rating DECIMAL(2,1),
    review_count INTEGER,
    address TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Prevent duplicate favorites
    UNIQUE(user_id, type, external_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_type ON favorites(type);

-- ============================================
-- 6. SEARCH HISTORY TABLE
-- ============================================
CREATE TYPE search_type AS ENUM ('all', 'website', 'image', 'video', 'map', 'ai');

CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query VARCHAR(500) NOT NULL,
    search_type search_type NOT NULL DEFAULT 'all',
    result_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);

-- ============================================
-- 7. AI CHAT SESSIONS TABLE
-- ============================================
CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    initial_query VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);

-- ============================================
-- 8. AI CHAT MESSAGES TABLE
-- ============================================
CREATE TYPE message_role AS ENUM ('user', 'assistant');

CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at
    BEFORE UPDATE ON ai_chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update folder item_count
CREATE OR REPLACE FUNCTION update_folder_item_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE folders SET item_count = item_count + 1 WHERE id = NEW.folder_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE folders SET item_count = item_count - 1 WHERE id = OLD.folder_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_folder_item_count_trigger
    AFTER INSERT OR DELETE ON folder_items
    FOR EACH ROW
    EXECUTE FUNCTION update_folder_item_count();
```

---

## 5. API Specification

### 5.1 API Response Format

```json
// Success Response
{
    "success": true,
    "data": { ... },
    "meta": {
        "page": 1,
        "per_page": 20,
        "total": 100,
        "total_pages": 5
    }
}

// Error Response
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "email",
                "message": "Invalid email format"
            }
        ]
    }
}
```

### 5.2 Authentication APIs

```yaml
# ============================================
# Authentication Endpoints
# ============================================

POST /api/auth/register:
  description: Register new user
  body:
    student_id: string (required)
    email: string (required)
    password: string (required, min 8 chars)
    name: string (required)
  response:
    success: true
    data:
      user:
        id: uuid
        student_id: string
        email: string
        name: string
      tokens:
        access_token: string
        refresh_token: string
        expires_in: 3600

POST /api/auth/login:
  description: User login
  body:
    email: string (required)
    password: string (required)
  response:
    success: true
    data:
      user: { ... }
      tokens:
        access_token: string
        refresh_token: string
        expires_in: 3600

POST /api/auth/refresh:
  description: Refresh access token
  body:
    refresh_token: string (required)
  response:
    success: true
    data:
      access_token: string
      expires_in: 3600

POST /api/auth/logout:
  description: Logout user
  headers:
    Authorization: Bearer {access_token}
  response:
    success: true
    data:
      message: "Logged out successfully"

GET /api/auth/me:
  description: Get current user info
  headers:
    Authorization: Bearer {access_token}
  response:
    success: true
    data:
      user:
        id: uuid
        student_id: string
        email: string
        name: string
        avatar_url: string
        created_at: datetime

PUT /api/auth/me:
  description: Update user profile
  headers:
    Authorization: Bearer {access_token}
  body:
    name: string
    avatar_url: string
  response:
    success: true
    data:
      user: { ... }

POST /api/auth/change-password:
  description: Change password
  headers:
    Authorization: Bearer {access_token}
  body:
    current_password: string
    new_password: string
  response:
    success: true
    data:
      message: "Password changed successfully"
```

### 5.3 Search APIs

```yaml
# ============================================
# Search Endpoints
# ============================================

GET /api/search:
  description: Search with Google Custom Search
  query_params:
    q: string (required) - search query
    type: enum (all, website, image, video) - default: all
    page: number - default: 1
    per_page: number - default: 20
    location: string - lat,lng
    language: string - th, en (default: th)
  response:
    success: true
    data:
      results:
        - id: string
          type: string
          title: string
          url: string
          snippet: string
          thumbnail_url: string
          image:
            width: number
            height: number
          video:
            duration: string
            channel: string
      meta:
        page: 1
        per_page: 20
        total: 100
        query: string
        search_type: string

GET /api/search/ai:
  description: AI-enhanced search with summary
  query_params:
    q: string (required)
    session_id: uuid (optional) - for follow-up questions
  response:
    success: true
    data:
      summary:
        content: string (markdown)
        sections:
          - title: string
            content: string
        sources:
          - title: string
            url: string
            snippet: string
      related_videos:
        - id: string
          title: string
          thumbnail: string
          channel: string
          duration: string
          url: string
      session_id: uuid
      follow_up_suggestions:
        - "ค่าใช้จ่ายในการเดินทาง?"
        - "ที่พักแนะนำ?"

POST /api/search/ai/chat:
  description: Continue AI chat conversation
  headers:
    Authorization: Bearer {access_token}
  body:
    session_id: uuid (required)
    message: string (required)
    image_url: string (optional)
  response:
    success: true
    data:
      message:
        role: assistant
        content: string
        sources: []
      session_id: uuid

GET /api/search/places:
  description: Search nearby places
  query_params:
    lat: number (required)
    lng: number (required)
    radius: number - in meters (default: 5000)
    type: string - restaurant, tourist_attraction, etc.
    keyword: string
  response:
    success: true
    data:
      places:
        - place_id: string
          name: string
          address: string
          lat: number
          lng: number
          rating: number
          review_count: number
          types: []
          photo_url: string
          is_open: boolean
          distance: number (meters)

GET /api/search/places/{place_id}:
  description: Get place details
  response:
    success: true
    data:
      place:
        place_id: string
        name: string
        address: string
        phone: string
        website: string
        rating: number
        review_count: number
        price_level: number
        opening_hours:
          weekday_text: []
          is_open_now: boolean
        photos:
          - url: string
            attribution: string
        reviews:
          - author: string
            rating: number
            text: string
            time: datetime
        lat: number
        lng: number
        types: []

GET /api/search/history:
  description: Get user's search history
  headers:
    Authorization: Bearer {access_token}
  query_params:
    page: number
    per_page: number
  response:
    success: true
    data:
      history:
        - id: uuid
          query: string
          search_type: string
          created_at: datetime
```

### 5.4 Folder APIs

```yaml
# ============================================
# Folder Endpoints
# ============================================

GET /api/folders:
  description: Get user's folders
  headers:
    Authorization: Bearer {access_token}
  query_params:
    page: number
    per_page: number
  response:
    success: true
    data:
      folders:
        - id: uuid
          name: string
          description: string
          cover_image_url: string
          is_public: boolean
          item_count: number
          created_at: datetime
          updated_at: datetime

POST /api/folders:
  description: Create new folder
  headers:
    Authorization: Bearer {access_token}
  body:
    name: string (required)
    description: string
    is_public: boolean (default: false)
  response:
    success: true
    data:
      folder:
        id: uuid
        name: string
        ...

GET /api/folders/{id}:
  description: Get folder detail with items
  headers:
    Authorization: Bearer {access_token}
  query_params:
    page: number
    per_page: number
  response:
    success: true
    data:
      folder:
        id: uuid
        name: string
        description: string
        ...
      items:
        - id: uuid
          type: string
          title: string
          url: string
          thumbnail_url: string
          metadata: {}
          created_at: datetime

PUT /api/folders/{id}:
  description: Update folder
  headers:
    Authorization: Bearer {access_token}
  body:
    name: string
    description: string
    is_public: boolean
  response:
    success: true
    data:
      folder: { ... }

DELETE /api/folders/{id}:
  description: Delete folder
  headers:
    Authorization: Bearer {access_token}
  response:
    success: true
    data:
      message: "Folder deleted successfully"

POST /api/folders/{id}/items:
  description: Add item to folder
  headers:
    Authorization: Bearer {access_token}
  body:
    type: enum (place, website, image, video, link)
    title: string (required)
    url: string (required)
    thumbnail_url: string
    description: string
    metadata: object
  response:
    success: true
    data:
      item:
        id: uuid
        ...

DELETE /api/folders/{folder_id}/items/{item_id}:
  description: Remove item from folder
  headers:
    Authorization: Bearer {access_token}
  response:
    success: true
    data:
      message: "Item removed successfully"

POST /api/folders/{id}/share:
  description: Generate share link for folder
  headers:
    Authorization: Bearer {access_token}
  response:
    success: true
    data:
      share_url: string
      qr_code: string (base64)
```

### 5.5 Favorites APIs

```yaml
# ============================================
# Favorites Endpoints
# ============================================

GET /api/favorites:
  description: Get user's favorites
  headers:
    Authorization: Bearer {access_token}
  query_params:
    type: enum (place, website, image, video) - optional filter
    page: number
    per_page: number
  response:
    success: true
    data:
      favorites:
        - id: uuid
          type: string
          external_id: string
          title: string
          url: string
          thumbnail_url: string
          rating: number
          address: string
          created_at: datetime

POST /api/favorites:
  description: Add to favorites
  headers:
    Authorization: Bearer {access_token}
  body:
    type: enum (place, website, image, video)
    external_id: string
    title: string (required)
    url: string (required)
    thumbnail_url: string
    rating: number
    address: string
    metadata: object
  response:
    success: true
    data:
      favorite:
        id: uuid
        ...

DELETE /api/favorites/{id}:
  description: Remove from favorites
  headers:
    Authorization: Bearer {access_token}
  response:
    success: true
    data:
      message: "Removed from favorites"

GET /api/favorites/check:
  description: Check if item is favorited
  headers:
    Authorization: Bearer {access_token}
  query_params:
    type: string
    external_id: string
  response:
    success: true
    data:
      is_favorited: boolean
      favorite_id: uuid (if favorited)
```

### 5.6 Utility APIs

```yaml
# ============================================
# Utility Endpoints
# ============================================

POST /api/translate:
  description: Translate text
  body:
    text: string (required)
    source_language: string (auto-detect if empty)
    target_language: string (required)
  response:
    success: true
    data:
      translated_text: string
      source_language: string
      target_language: string

POST /api/qrcode:
  description: Generate QR Code
  body:
    content: string (required) - URL or text
    size: number (default: 256)
    format: enum (png, svg) - default: png
  response:
    success: true
    data:
      qr_code: string (base64)
      content: string

GET /api/health:
  description: Health check
  response:
    success: true
    data:
      status: "healthy"
      version: "1.0.0"
      timestamp: datetime
```

---

## 6. External API Integration

### 6.1 Google APIs Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Google APIs Architecture                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        Go Fiber Backend                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  External API Layer                      │    │
│  │                                                          │    │
│  │  ┌────────────────┐    ┌────────────────┐               │    │
│  │  │ Google Search  │    │ Google Places  │               │    │
│  │  │    Client      │    │    Client      │               │    │
│  │  └───────┬────────┘    └───────┬────────┘               │    │
│  │          │                     │                         │    │
│  │  ┌───────▼─────────────────────▼────────┐               │    │
│  │  │         Rate Limiter                  │               │    │
│  │  │    (Token Bucket Algorithm)           │               │    │
│  │  └───────┬───────────────────────────────┘               │    │
│  │          │                                               │    │
│  │  ┌───────▼───────────────────────────────┐               │    │
│  │  │         Redis Cache Layer             │               │    │
│  │  │   - Search Results: 1 hour            │               │    │
│  │  │   - Place Details: 24 hours           │               │    │
│  │  │   - Images: 7 days                    │               │    │
│  │  └───────────────────────────────────────┘               │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Google Cloud Platform                        │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ Custom Search│ │   Places     │ │   Maps JS    │             │
│  │     API      │ │     API      │ │     API      │             │
│  │              │ │              │ │              │             │
│  │ $5/1K queries│ │$17/1K queries│ │  $7/1K loads │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐                              │
│  │  YouTube     │ │  Translate   │                              │
│  │  Data API    │ │     API      │                              │
│  │              │ │              │                              │
│  │ 10K free/day │ │$20/1M chars  │                              │
│  └──────────────┘ └──────────────┘                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 AI Integration (OpenAI/Anthropic)

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Mode Architecture                          │
└─────────────────────────────────────────────────────────────────┘

User Query: "ที่เที่ยวเชียงใหม่"
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│                     AI Service                                    │
│                                                                  │
│  Step 1: Search Google for relevant content                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Google Custom Search API                                │    │
│  │  Query: "ที่เที่ยวเชียงใหม่ สถานที่ท่องเที่ยว"              │    │
│  │  Results: Top 10 websites, snippets, URLs                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  Step 2: Fetch content from top results                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Web Scraper (Optional)                                  │    │
│  │  - Extract main content from top 3-5 URLs               │    │
│  │  - Clean and structure the text                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  Step 3: Generate AI Summary                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  OpenAI API / Anthropic API                              │    │
│  │                                                          │    │
│  │  System Prompt:                                          │    │
│  │  "คุณเป็นผู้ช่วยค้นหาข้อมูลท่องเที่ยว สรุปข้อมูลจาก          │    │
│  │   sources ที่ได้รับ ตอบเป็นภาษาไทย เป็น bullet points     │    │
│  │   พร้อมระบุ source"                                       │    │
│  │                                                          │    │
│  │  User Prompt:                                            │    │
│  │  "สรุปข้อมูลสถานที่ท่องเที่ยวเชียงใหม่จาก sources ต่อไปนี้: │    │
│  │   [search results content]"                              │    │
│  │                                                          │    │
│  │  Model: gpt-4-turbo / claude-3-sonnet                   │    │
│  │  Max Tokens: 2000                                        │    │
│  │  Temperature: 0.7                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  Step 4: Fetch Related Videos                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  YouTube Data API                                        │    │
│  │  Query: "เที่ยวเชียงใหม่"                                  │    │
│  │  Results: Top 5 videos with thumbnails                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Response to Frontend                         │
│                                                                  │
│  {                                                               │
│    "summary": {                                                  │
│      "content": "## สถานที่ท่องเที่ยวยอดนิยมในเชียงใหม่\n\n        │
│                  - **ดอยสุเทพ** - วัดพระธาตุดอยสุเทพ...\n         │
│                  - **ถนนคนเดิน** - ตลาดวันอาทิตย์...",            │
│      "sources": [                                                │
│        {"title": "TAT", "url": "https://..."}                   │
│      ]                                                           │
│    },                                                            │
│    "related_videos": [                                           │
│      {"title": "เที่ยวเชียงใหม่ 3 วัน 2 คืน", ...}                 │
│    ],                                                            │
│    "follow_up_suggestions": [                                    │
│      "ค่าใช้จ่ายเที่ยวเชียงใหม่?",                                 │
│      "ที่พักแนะนำเชียงใหม่?"                                       │
│    ]                                                             │
│  }                                                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Caching Strategy

### 7.1 Cache Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      Caching Architecture                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Layer 1: Browser Cache                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - Static assets (images, JS, CSS): 1 year              │    │
│  │  - API responses: based on Cache-Control headers        │    │
│  │  - Service Worker (optional): offline support           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 2: CDN Cache (Vercel/Cloudflare)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - Static pages: ISR (Incremental Static Regeneration)  │    │
│  │  - Images: automatic optimization                       │    │
│  │  - API routes: edge caching                             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: Application Cache (React Query)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - Search results: staleTime 5 min, cacheTime 30 min    │    │
│  │  - User data: staleTime 1 min                           │    │
│  │  - Folders: staleTime 5 min                             │    │
│  │  - Place details: staleTime 1 hour                      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: Redis Cache (Backend)                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Key Patterns:                                           │    │
│  │  - search:{hash(query,type)}      -> 1 hour             │    │
│  │  - search:ai:{hash(query)}        -> 6 hours            │    │
│  │  - place:{place_id}               -> 24 hours           │    │
│  │  - places:nearby:{hash(lat,lng)}  -> 1 hour             │    │
│  │  - translate:{hash(text,lang)}    -> 7 days             │    │
│  │  - user:session:{user_id}         -> 24 hours           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Cache Key Design

```go
// cache/cache_keys.go

package cache

import (
    "crypto/md5"
    "encoding/hex"
    "fmt"
)

const (
    // Prefixes
    PrefixSearch       = "search"
    PrefixSearchAI     = "search:ai"
    PrefixPlace        = "place"
    PrefixNearbyPlaces = "places:nearby"
    PrefixTranslate    = "translate"
    PrefixUserSession  = "user:session"

    // TTLs
    TTLSearch       = 1 * time.Hour
    TTLSearchAI     = 6 * time.Hour
    TTLPlace        = 24 * time.Hour
    TTLNearbyPlaces = 1 * time.Hour
    TTLTranslate    = 7 * 24 * time.Hour
    TTLUserSession  = 24 * time.Hour
)

func hashString(s string) string {
    hash := md5.Sum([]byte(s))
    return hex.EncodeToString(hash[:])
}

func SearchKey(query, searchType string) string {
    return fmt.Sprintf("%s:%s", PrefixSearch, hashString(query+":"+searchType))
}

func SearchAIKey(query string) string {
    return fmt.Sprintf("%s:%s", PrefixSearchAI, hashString(query))
}

func PlaceKey(placeID string) string {
    return fmt.Sprintf("%s:%s", PrefixPlace, placeID)
}

func NearbyPlacesKey(lat, lng float64, radius int, placeType string) string {
    key := fmt.Sprintf("%f:%f:%d:%s", lat, lng, radius, placeType)
    return fmt.Sprintf("%s:%s", PrefixNearbyPlaces, hashString(key))
}

func TranslateKey(text, sourceLang, targetLang string) string {
    key := fmt.Sprintf("%s:%s:%s", text, sourceLang, targetLang)
    return fmt.Sprintf("%s:%s", PrefixTranslate, hashString(key))
}
```

---

## 8. Security Design

### 8.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    JWT Authentication Flow                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Login Flow                                │
│                                                                  │
│  1. User submits credentials                                     │
│     POST /api/auth/login                                        │
│     { email, password }                                         │
│                              │                                   │
│                              ▼                                   │
│  2. Server validates credentials                                 │
│     - Check user exists                                         │
│     - Verify password hash (bcrypt)                             │
│                              │                                   │
│                              ▼                                   │
│  3. Generate tokens                                              │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  Access Token (JWT)                                  │     │
│     │  - Expires: 1 hour                                   │     │
│     │  - Claims: user_id, email, iat, exp                  │     │
│     │  - Signed with: HS256 + secret                       │     │
│     └─────────────────────────────────────────────────────┘     │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  Refresh Token                                       │     │
│     │  - Expires: 7 days                                   │     │
│     │  - Stored in DB (hashed)                             │     │
│     │  - Unique per device/session                         │     │
│     └─────────────────────────────────────────────────────┘     │
│                              │                                   │
│                              ▼                                   │
│  4. Return tokens to client                                      │
│     { access_token, refresh_token, expires_in }                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Token Storage (Frontend)                      │
│                                                                  │
│  Access Token:                                                   │
│  - Store in memory (Zustand store)                              │
│  - Attach to API requests via axios interceptor                 │
│  - Never store in localStorage (XSS risk)                       │
│                                                                  │
│  Refresh Token:                                                  │
│  - Store in httpOnly cookie                                     │
│  - Secure flag: true (HTTPS only)                               │
│  - SameSite: Strict                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Token Refresh Flow                            │
│                                                                  │
│  1. Access token expires (client detects 401)                   │
│                              │                                   │
│                              ▼                                   │
│  2. Send refresh request                                        │
│     POST /api/auth/refresh                                      │
│     (refresh_token in httpOnly cookie)                          │
│                              │                                   │
│                              ▼                                   │
│  3. Server validates refresh token                              │
│     - Check token exists in DB                                  │
│     - Check not revoked                                         │
│     - Check not expired                                         │
│                              │                                   │
│                              ▼                                   │
│  4. Issue new access token                                      │
│     (optionally rotate refresh token)                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Security Measures

```
┌─────────────────────────────────────────────────────────────────┐
│                    Security Implementation                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  1. Input Validation                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - All inputs validated with go-playground/validator    │    │
│  │  - SQL injection prevention via parameterized queries   │    │
│  │  - XSS prevention via output encoding                   │    │
│  │  - Request size limits                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  2. Rate Limiting                                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Endpoint              │ Limit                          │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │  /api/auth/login       │ 5 req/min per IP               │    │
│  │  /api/auth/register    │ 3 req/min per IP               │    │
│  │  /api/search           │ 30 req/min per user            │    │
│  │  /api/search/ai        │ 10 req/min per user            │    │
│  │  General               │ 100 req/min per user           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  3. CORS Configuration                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  AllowOrigins: ["https://stou-smart-tour.com"]          │    │
│  │  AllowMethods: ["GET", "POST", "PUT", "DELETE"]         │    │
│  │  AllowHeaders: ["Authorization", "Content-Type"]        │    │
│  │  AllowCredentials: true                                 │    │
│  │  MaxAge: 86400                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  4. Security Headers                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  X-Content-Type-Options: nosniff                        │    │
│  │  X-Frame-Options: DENY                                  │    │
│  │  X-XSS-Protection: 1; mode=block                        │    │
│  │  Strict-Transport-Security: max-age=31536000            │    │
│  │  Content-Security-Policy: default-src 'self'            │    │
│  │  Referrer-Policy: strict-origin-when-cross-origin       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  5. Password Security                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - Minimum 8 characters                                 │    │
│  │  - Bcrypt hashing (cost factor: 12)                     │    │
│  │  - Password strength validation                         │    │
│  │  - No password storage in logs                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Deployment Architecture

### 9.1 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Production Deployment                         │
└─────────────────────────────────────────────────────────────────┘

                         Internet
                            │
                            ▼
              ┌─────────────────────────────┐
              │         Cloudflare          │
              │    (CDN + DDoS Protection)  │
              └──────────────┬──────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
         ▼                                       ▼
┌─────────────────────┐              ┌─────────────────────┐
│      Vercel         │              │   Railway / Render  │
│   (Frontend)        │              │     (Backend)       │
│                     │              │                     │
│  ┌───────────────┐  │              │  ┌───────────────┐  │
│  │   Next.js     │  │    HTTP      │  │   Go Fiber    │  │
│  │   App         │──┼──────────────┼──│   API         │  │
│  └───────────────┘  │              │  └───────────────┘  │
│                     │              │                     │
│  - Edge Functions   │              │  - Auto-scaling     │
│  - ISR              │              │  - Health checks    │
│  - Image Opt        │              │  - Zero-downtime    │
└─────────────────────┘              └──────────┬──────────┘
                                                │
                         ┌──────────────────────┼──────────────────────┐
                         │                      │                      │
                         ▼                      ▼                      ▼
              ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
              │    Neon / Supabase  │ │      Upstash        │ │    Google Cloud     │
              │    (PostgreSQL)     │ │      (Redis)        │ │    (External APIs)  │
              │                     │ │                     │ │                     │
              │  - Connection Pool  │ │  - Serverless       │ │  - Search API       │
              │  - Auto-backup      │ │  - Global           │ │  - Places API       │
              │  - Point-in-time    │ │  - Low latency      │ │  - Maps API         │
              │    recovery         │ │                     │ │                     │
              └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

### 9.2 Environment Configuration

```bash
# ============================================
# Frontend (.env.local)
# ============================================
NEXT_PUBLIC_API_URL=https://api.stou-smart-tour.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
NEXT_PUBLIC_APP_URL=https://stou-smart-tour.com

# ============================================
# Backend (.env)
# ============================================
# Server
APP_ENV=production
APP_PORT=8080
APP_DEBUG=false

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# Redis
REDIS_URL=redis://default:pass@host:6379

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE_HOURS=1
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google APIs
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# CORS
CORS_ALLOWED_ORIGINS=https://stou-smart-tour.com

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MIN=100
```

### 9.3 Docker Configuration

```dockerfile
# Backend Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080

CMD ["./main"]
```

```yaml
# docker-compose.yml (Development)
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/stou_smart_tour?sslmode=disable
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: stou_smart_tour
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 10. Development Workflow

### 10.1 Git Branching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Git Flow Strategy                             │
└─────────────────────────────────────────────────────────────────┘

main (production)
  │
  ├── develop (staging)
  │     │
  │     ├── feature/auth-system
  │     ├── feature/search-api
  │     ├── feature/folder-management
  │     ├── feature/ai-mode
  │     │
  │     ├── bugfix/search-pagination
  │     └── bugfix/login-error
  │
  └── hotfix/critical-security-fix

Branch Naming:
- feature/[feature-name]
- bugfix/[bug-description]
- hotfix/[issue-description]
- release/[version]
```

### 10.2 Development Commands

```bash
# ============================================
# Frontend Commands
# ============================================
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint
npm run lint

# Type check
npm run type-check

# ============================================
# Backend Commands
# ============================================
cd backend

# Install dependencies
go mod download

# Run development server (with hot reload)
air

# Build
go build -o main ./cmd/server

# Run tests
go test ./...

# Run specific tests
go test ./internal/handlers/...

# Generate Swagger docs
swag init -g cmd/server/main.go

# Run migrations
migrate -path migrations -database $DATABASE_URL up

# Create new migration
migrate create -ext sql -dir migrations -seq create_users
```

---

## 11. Monitoring & Logging

### 11.1 Logging Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Logging Architecture                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Structured Logging                           │
│                                                                  │
│  Log Format (JSON):                                              │
│  {                                                               │
│    "level": "info",                                              │
│    "timestamp": "2024-01-15T10:30:00Z",                         │
│    "message": "Search request processed",                        │
│    "request_id": "uuid",                                         │
│    "user_id": "uuid",                                            │
│    "query": "เชียงใหม่",                                          │
│    "search_type": "all",                                         │
│    "duration_ms": 150,                                           │
│    "cache_hit": false                                            │
│  }                                                               │
│                                                                  │
│  Log Levels:                                                     │
│  - DEBUG: Development only                                       │
│  - INFO: Normal operations                                       │
│  - WARN: Potential issues                                        │
│  - ERROR: Errors that need attention                             │
│  - FATAL: Critical errors, app crash                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

                              │
                              ▼
              ┌─────────────────────────────┐
              │    Log Aggregation          │
              │    (Railway Logs /          │
              │     Vercel Logs)            │
              └─────────────────────────────┘
```

### 11.2 Metrics & Monitoring

```
┌─────────────────────────────────────────────────────────────────┐
│                    Key Metrics to Track                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Application Metrics                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - Request rate (req/sec)                               │    │
│  │  - Response time (p50, p95, p99)                        │    │
│  │  - Error rate (4xx, 5xx)                                │    │
│  │  - Active users                                         │    │
│  │  - Search queries per minute                            │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Business Metrics                                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - Daily Active Users (DAU)                             │    │
│  │  - Searches per user                                    │    │
│  │  - AI mode usage                                        │    │
│  │  - Folders created                                      │    │
│  │  - Items saved                                          │    │
│  │  - Popular search queries                               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  External API Metrics                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - Google API quota usage                               │    │
│  │  - Google API response time                             │    │
│  │  - OpenAI API token usage                               │    │
│  │  - Cache hit ratio                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Cost Estimation

### 12.1 API Costs

| Service | Free Tier | Cost | Estimated Monthly Usage | Monthly Cost |
|---------|-----------|------|-------------------------|--------------|
| Google Custom Search | 100 queries/day | $5/1K queries | 10K queries | $50 |
| Google Places API | - | $17/1K requests | 5K requests | $85 |
| Google Maps JS | - | $7/1K loads | 10K loads | $70 |
| YouTube Data API | 10K units/day | Free | Within free tier | $0 |
| OpenAI GPT-4 | - | $0.03/1K tokens | 500K tokens | $15 |
| Google Translate | - | $20/1M chars | 100K chars | $2 |

**Estimated API Cost: ~$222/month**

### 12.2 Infrastructure Costs

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Vercel (Frontend) | Hobby tier free | $0-20/month |
| Railway (Backend) | $5 credit/month | $10-30/month |
| Neon (PostgreSQL) | 0.5GB free | $0-25/month |
| Upstash (Redis) | 10K commands/day free | $0-10/month |
| Cloudflare (CDN) | Free tier | $0/month |

**Estimated Infrastructure Cost: ~$10-85/month**

**Total Estimated Cost: ~$232-307/month**

---

## 13. Implementation Phases Summary

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup (Next.js + Go Fiber)
- [ ] Database setup (PostgreSQL)
- [ ] Authentication system (JWT)
- [ ] Basic UI components
- [ ] Basic search (Google Custom Search)

### Phase 2: Core Features (Week 3-4)
- [ ] Search results pages (All, Website, Image, Video)
- [ ] Filter tabs implementation
- [ ] Result cards & list views
- [ ] My Folder feature
- [ ] Favorites system

### Phase 3: Advanced Features (Week 5-6)
- [ ] AI Mode integration (OpenAI)
- [ ] Map view (Google Maps)
- [ ] Nearby places
- [ ] Place detail page
- [ ] Search history

### Phase 4: Polish & Optimization (Week 7-8)
- [ ] QR Code generator
- [ ] Translation feature
- [ ] Share functionality
- [ ] Caching implementation (Redis)
- [ ] Performance optimization
- [ ] Mobile responsive
- [ ] Testing & Bug fixes

---

## 14. Appendix

### A. Color Palette

```css
/* Primary Colors */
--primary-50: #EFF6FF;
--primary-100: #DBEAFE;
--primary-500: #3B82F6;  /* Main blue */
--primary-600: #2563EB;
--primary-700: #1D4ED8;

/* Secondary Colors */
--secondary-500: #10B981; /* Green accent */

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-500: #6B7280;
--gray-900: #111827;

/* Status Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

### B. Typography

```css
/* Font Family */
font-family: 'Inter', 'Noto Sans Thai', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### C. Breakpoints

```css
/* Tailwind Breakpoints */
--sm: 640px;   /* Mobile landscape */
--md: 768px;   /* Tablet */
--lg: 1024px;  /* Desktop */
--xl: 1280px;  /* Large desktop */
--2xl: 1536px; /* Extra large */
```

---

*Document Version: 1.0*
*Last Updated: 2024*
*Author: System Design Team*
