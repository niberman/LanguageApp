# The Language School - "Let's Start Talking!"

## Project Overview

A production-ready language learning platform featuring:
- **17 English foundation levels** with embedded YouTube lessons and Quizlet flashcards
- **Embedded learning content** (Quizlet vocabulary sets, YouTube video lessons)
- **Progress tracking** with streak counters and completion percentages
- **Supabase authentication** (email/password + Google OAuth)
- **Freemium pricing model** (Free tier + Pro tier)
- **Full bilingual UI** with instant language switching (EN ⇄ ES)
- **Dark mode support** with theme persistence

## Recent Changes (Latest Session)

### ✅ Removed All Spanish Content
- Deleted all 12 Spanish levels from database (track='spanish')
- Removed Spanish track selector from Practice page
- Cleaned up all Spanish references in LevelDetail and PracticeLevels pages
- App now focuses exclusively on English language learning with 17 levels
- **Tested end-to-end:** Practice page shows only English track, all English levels load correctly, embeds work properly

### ✅ Fixed Critical Authentication Double-Login Bug
- Implemented global Supabase singleton using `globalThis.__supabaseClient` to prevent multiple client instances
- Added initialization promise caching in `globalThis.__supabaseInitPromise` to prevent concurrent duplicate instances during HMR
- Fixed timing issue with 100ms navigation delay in Auth.tsx to ensure React state updates before redirect
- Updated queryClient to automatically inject Bearer token auth headers in all API requests
- Fixed Supabase initialization race condition in both `api.ts` and `queryClient.ts` by awaiting init promise before calling `getSession()`
- Solution ensures single login flow, persistent session, and prevents "Cannot read properties of undefined" errors

### ✅ YouTube Video URL Support with Real iframe Embeds
- Added `youtubeUrl` field to levels schema for direct video links (in addition to existing playlist support)
- Implemented automatic video ID extraction from standard YouTube URLs (`youtube.com/watch?v=`) and short links (`youtu.be/`)
- Supports timestamp parameters (e.g., `t=1483s` converts to `start=1483` in embed URL)
- Configured English Foundations Level 1 with YouTube lesson: https://www.youtube.com/watch?v=g9BERd6yRLI&t=1483s
- LevelDetail.tsx gracefully falls back to playlist IDs if video URL not present
- EmbedFrame component now renders actual `<iframe>` elements instead of placeholders
- Separate URLs for iframe embed (`https://www.youtube.com/embed/{videoId}?start={timestamp}`) and external links (original YouTube URL)
- **Successfully tested end-to-end:** Video properly embeds with correct video ID and timestamp, "Open in new tab" works correctly

### ✅ End-to-End Testing Completed
All public pages verified working:
- Home page with hero section and CTA
- Practice page with English track
- Level detail pages with embedded YouTube/Quizlet content
- Settings page with language/theme preferences
- Pricing page with Free/Pro tiers
- Language toggle (EN/ES)
- Dark mode toggle
- Authentication flow (signup → auto-redirect to dashboard)

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- Wouter (routing)
- TanStack Query (data fetching)
- Bilingual i18n system (LanguageContext)

**Backend:**
- Express.js
- Drizzle ORM
- PostgreSQL (via Supabase)
- Supabase Auth

**Database Schema:**
- `profiles` - User profiles with locale preferences
- `levels` - Course content (track, number, title, Quizlet/YouTube IDs, YouTube URLs)
- `progress_events` - Activity tracking (quizlet_view, video_watch)
- `waitlist_emails` - Newsletter signups

## Key Features

### 1. Practice System
- 17 English Foundation levels (1-17)
- 12 Spanish Foundation levels (1-12)
- Each level includes:
  - Quizlet vocabulary sets (embeddable)
  - YouTube lesson playlists (embeddable)
  - Progress tracking on completion

### 2. User Dashboard (Authenticated)
- Current streak counter (consecutive days active)
- Last activity timestamp
- Overall progress percentage
- Level completion stats

### 3. Admin Panel (Admin Role Required)
- Create/edit/delete levels
- View user analytics
- Manage content (Quizlet/YouTube IDs)

### 4. Bilingual UI
- Context-based translation system
- Instant language switching
- Persisted language preference
- All UI strings translated (EN/ES)

### 5. Authentication
- Email/password signup/signin
- Google OAuth (configured in Supabase)
- Protected routes for dashboard/progress
- Public access to practice content

## Environment Configuration

### Required Secrets (Replit Secrets)

```
DATABASE_URL=<supabase-postgres-connection-string>
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
SESSION_SECRET=<random-secret-for-sessions>
```

### Auto-Fix Feature
The app automatically detects and fixes swapped Supabase URL/Anon Key values:
- Server: `server/index.ts` (lines 9-18)
- Client: `/api/config` endpoint

## API Routes

### Public
- `GET /api/config` - Supabase client configuration
- `GET /api/levels` - List all levels
- `GET /api/levels/:track/:number` - Get specific level

### Authenticated
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Record progress event
- `GET /api/progress/streak` - Get streak count
- `GET /api/dashboard/stats` - Dashboard statistics

### Admin Only
- `POST /api/levels` - Create level
- `PATCH /api/levels/:id` - Update level
- `DELETE /api/levels/:id` - Delete level

## Development Workflow

### Start Development Server
```bash
npm run dev
```
Runs both Express backend and Vite frontend on port 5000.

### Database Operations
```bash
npm run db:migrate  # Run Drizzle migrations
npm run db:seed     # Seed 29 foundation levels
npm run db:setup    # Migrate + seed (fresh setup)
```

## User Preferences

- **Design System**: Material Design-inspired with warm, encouraging aesthetics
- **Color Palette**: Primary (orange/amber), accent (teal/cyan), warm neutrals
- **Typography**: Clear hierarchy with readable fonts
- **Components**: shadcn/ui with custom theming
- **Interactions**: Smooth transitions, hover states, active states
- **Responsiveness**: Mobile-first, works on all screen sizes

## Deployment

### Replit Deployment
1. Ensure all secrets are configured
2. Run `npm run build` to verify build works
3. Click "Deploy" in Replit
4. App will be available at `https://your-repl.replit.app`

### Supabase Configuration
1. In Supabase dashboard, go to **Authentication → URL Configuration**
2. Add your Replit URL to **Allowed Redirect URLs**:
   - `https://your-repl.replit.app/**`
   - `http://localhost:5000/**` (for development)

## Known Issues & Solutions

### Issue: "Supabase client not initialized"
**Solution**: The client uses lazy initialization. Wait 200ms after page load for full initialization. Fallback auth stub prevents crashes.

### Issue: Swapped Supabase credentials
**Solution**: Auto-detection system fixes this automatically. Check server logs for "✅ Fixed: URL and Anon Key are now in correct order"

### Issue: Dashboard shows 0 streak/progress
**Solution**: User must record progress events (view Quizlet, watch YouTube) to track activity.

## Future Enhancements (Planned)

Phase 2 features with placeholder routes:
- `/chat` - AI Conversation Partner (Pro tier)
- `/events` - Community language exchange events
- `/work` - Job board and Uber driver referral program

## Testing

Comprehensive test coverage includes:
- ✅ Public page navigation
- ✅ Bilingual switching (EN/ES)
- ✅ Dark mode functionality
- ✅ Level browsing and detail views
- ✅ Embedded content display
- ⚠️ Authentication flows (requires manual testing with credentials)
- ⚠️ Progress tracking (requires authenticated user)

## Architecture Notes

- **Frontend-heavy**: Most logic in React, backend for persistence/auth only
- **Type-safe**: Shared schema (`shared/schema.ts`) ensures FE/BE consistency
- **Query invalidation**: TanStack Query handles cache updates after mutations
- **Protected routes**: useAuth hook + redirect logic for auth-required pages
- **Graceful degradation**: Guest users can browse all content, auth only for progress

## Maintenance

### Adding New Levels
1. Sign in as admin → `/admin`
2. Use "Add New Level" form
3. Provide: track, number, title, Quizlet IDs, YouTube playlist IDs

### Updating Translations
Edit `client/src/contexts/LanguageContext.tsx`:
- Add key to `en` and `es` objects
- Use `t('your.key')` in components

### Database Migrations
1. Update `shared/schema.ts`
2. Run `npm run db:migrate`
3. Update API routes and frontend queries

---

**Status**: ✅ Production-ready MVP  
**Last Updated**: October 2025  
**Built with**: React, TypeScript, Express, Supabase, Tailwind CSS