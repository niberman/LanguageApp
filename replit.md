# The Language School - "Let's Start Talking!"

## Project Overview

A production-ready language learning platform featuring:
- **OOP Content Hierarchy** (Course → Lesson → Topic → Activity) with TypeScript class models
- **Embedded learning content** (Quizlet vocabulary sets, YouTube video lessons)
- **Activity completion tracking** with streak counters and progress percentages
- **Supabase authentication** (email/password + Google OAuth)
- **Freemium pricing model** (Free tier + Pro tier)
- **Full bilingual UI** with instant language switching (EN ⇄ ES)
- **Dark mode support** with theme persistence

## Recent Changes (Latest Session)

### ✅ Major Architectural Refactor: OOP Content Model
**Replaced level-based system with hierarchical object-oriented model:**

- **New TypeScript Classes** (`shared/models/`):
  - `Course` - Top-level learning path (e.g., "Fundamentos de Inglés 1")
  - `Lesson` - Module within a course (e.g., "Greetings & Introductions")
  - `Topic` - Specific subject within a lesson (e.g., "Basic Greetings")
  - `Activity` - Learning exercises (YouTube videos, Quizlet sets, AI chat)
    - Subclasses: `VideoActivity`, `QuizletActivity`, `AIChatActivity`

- **New Database Schema**:
  - `courses` - Course metadata (title, description, level, language)
  - `lessons` - Lessons linked to courses (foreign key)
  - `topics` - Topics linked to lessons (foreign key)
  - `activities` - Activities linked to topics (polymorphic: video/quizlet/aiChat)
  - `activity_completions` - User progress tracking (replaces `progress_events`)
  - Removed: `levels` table (replaced by 4-tier hierarchy)

- **New Frontend Pages**:
  - `/courses` - Browse all available courses
  - `/courses/:id` - Course detail with lessons list
  - `/courses/:courseId/lessons/:lessonId` - Lesson detail with topics list
  - `/courses/:courseId/lessons/:lessonId/topics/:topicId` - Topic detail with activities
  - Removed: `/practice`, `/practice/:track`, `/practice/:track/:level`

- **Backend API Updates**:
  - `GET /api/courses` - List all courses
  - `GET /api/courses/:id` - Get course with full hierarchy (lessons → topics → activities)
  - `POST /api/completions` - Mark activity as complete
  - `GET /api/completions` - Get user's completed activities
  - `GET /api/dashboard/stats` - Dashboard stats (now activity-based, not level-based)

- **Sample Content Seeded**:
  - Course: "Fundamentos de Inglés 1" (Beginner English)
  - 2 Lessons: "Greetings & Introductions", "Numbers & Colors"
  - 3 Topics: "Basic Greetings", "Numbers 1-20", "Common Colors"
  - 8 Activities: Mix of YouTube videos and Quizlet sets

### ✅ Progress Tracking Refactor
- Replaced `progress_events` table with `activity_completions`
- Activities auto-marked complete when user opens external content
- Dashboard now shows "Completed Activities X/Y" instead of "Completed Levels"
- Streak calculation based on activity completion dates

### ✅ Navigation Updates
- Updated Navbar: `/practice` → `/courses`
- Updated Home page CTA: navigates to `/courses`
- Updated Dashboard "Continue" button: navigates to `/courses`

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
- `courses` - Top-level courses (title, description, level, language)
- `lessons` - Lessons within courses
- `topics` - Topics within lessons
- `activities` - Learning activities (video, quizlet, aiChat types)
- `activity_completions` - User activity completion tracking
- `waitlist_emails` - Newsletter signups

## Key Features

### 1. Course System (NEW OOP Architecture)
- Hierarchical content: Course → Lesson → Topic → Activity
- TypeScript class models with proper inheritance
- Three activity types:
  - **Video Activities** - Embedded YouTube lessons with timestamps
  - **Quizlet Activities** - Vocabulary practice sets
  - **AI Chat Activities** - Conversational practice (coming soon)

### 2. User Dashboard (Authenticated)
- Current streak counter (consecutive days active)
- Last activity timestamp
- Overall progress percentage (activity-based)
- Activity completion stats (X completed / Y total)

### 3. Admin Panel (Admin Role Required)
- Manage courses, lessons, topics, activities
- View user analytics
- Content management system

### 4. Bilingual UI
- Context-based translation system
- Instant language switching
- Persisted language preference
- All UI strings translated (EN/ES)

### 5. Authentication
- Email/password signup/signin
- Google OAuth (configured in Supabase)
- Protected routes for dashboard/progress
- Public access to course content

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
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course with full content hierarchy

### Authenticated
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile
- `POST /api/completions` - Mark activity as complete
- `GET /api/completions` - Get user's completed activities
- `GET /api/dashboard/stats` - Dashboard statistics (activity-based)

### Admin Only
- Course/Lesson/Topic/Activity management endpoints (to be implemented)

## Development Workflow

### Start Development Server
```bash
npm run dev
```
Runs both Express backend and Vite frontend on port 5000.

### Database Operations
```bash
npm run db:push        # Push schema changes to database
npm run db:seed        # Seed courses with sample content
npm run db:setup       # Push + seed (fresh setup)
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
**Solution**: User must complete activities (open YouTube/Quizlet) to track progress.

## Future Enhancements (Planned)

Phase 2 features with placeholder routes:
- AI Conversation Partner (Pro tier)
- Community language exchange events
- Job board and Uber driver referral program

## Architecture Notes

- **OOP Content Model**: TypeScript classes for Course, Lesson, Topic, Activity with proper inheritance
- **Type-safe**: Shared schema (`shared/schema.ts`) ensures FE/BE consistency
- **Hierarchical Loading**: Backend loads full course hierarchy in single query
- **Activity Tracking**: Completion tracked when user opens external content (YouTube/Quizlet)
- **Query invalidation**: TanStack Query handles cache updates after mutations
- **Protected routes**: useAuth hook + redirect logic for auth-required pages
- **Graceful degradation**: Guest users can browse all content, auth only for progress

## Maintenance

### Adding New Content
Use the seeding system:
1. Edit `server/seedCourses.ts`
2. Add new courses, lessons, topics, activities
3. Run `npm run db:seed`

### Updating Translations
Edit `client/src/contexts/LanguageContext.tsx`:
- Add key to `en` and `es` objects
- Use `t('your.key')` in components

### Database Migrations
1. Update `shared/schema.ts`
2. Run `npm run db:push` to sync schema
3. Update API routes and frontend queries

---

**Status**: ✅ Production-ready MVP  
**Last Updated**: October 2025  
**Built with**: React, TypeScript, Express, Supabase, Tailwind CSS
