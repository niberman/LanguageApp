# La Escuela de Idiomas - "¡Empecemos a hablar!"

## Overview
"La Escuela de Idiomas" is a production-ready, Spanish-only language learning platform designed to facilitate language acquisition through structured content and interactive activities. Its core purpose is to provide an engaging and effective learning experience, leveraging embedded external resources and a clear, hierarchical content model. The platform supports a freemium model with a focus on user progress tracking and a streamlined, intuitive user interface. The project aims to become a leading platform for Spanish speakers to learn new languages, starting with English.

## Recent Changes

### ✅ Mobile Navigation & Clickable Feature Cards (October 31, 2025)
**Improved mobile accessibility and home page interactivity:**

- **Mobile Menu Navigation**:
  - Added hamburger menu button for mobile screens (Sheet drawer)
  - Desktop navigation items (Inicio, Cursos, Panel) now accessible on iPhone and small screens
  - Menu opens from right side with clear navigation options
  - Auto-closes after selecting a navigation item
  - Respects authentication state (Panel only shown to logged-in users)

- **Clickable Feature Cards**:
  - Home page feature cards now clickable and navigate to their pages
  - "Cursos" card → /courses page
  - "Panel" card → /dashboard page
  - "Chat IA" card → Not clickable (coming soon badge)
  - Keyboard-accessible using semantic Link components
  - Visual cursor pointer indicates clickability

- **Files Modified**:
  - `client/src/components/Navbar.tsx` - Added Sheet-based mobile menu
  - `client/src/components/FeatureCard.tsx` - Made cards clickable with href prop
  - `client/src/pages/Home.tsx` - Added navigation hrefs to feature cards

### ✅ Smart Resume & Back Navigation (October 31, 2025)
**Implemented intelligent navigation for new and returning users:**

- **New User Flow** ("Empezar Ahora"):
  - Dashboard button takes new users directly to first video of first topic
  - No manual navigation needed - instant start
  - Clear onboarding path

- **Returning User Flow** ("Continuar Aprendiendo"):
  - Smart resume: Backend determines exact next activity
  - If video incomplete → resumes at video page
  - If video complete, flashcards incomplete → resumes at flashcards page
  - If topic complete → resumes at next incomplete topic
  - Seamless continuation of learning journey

- **Back Navigation Buttons**:
  - Video page: "Anterior: [topic]" → Previous topic's flashcards (or "Volver a la lección" if first topic)
  - Flashcards page: "Volver al video" → Current topic's video
  - Allows reviewing previous content while maintaining forward progress

- **Edge Case Handling**:
  - Topics without flashcards: Video completion navigates to next topic directly
  - Last topic completion: Returns to lesson overview
  - Prevents dead-end navigation

- **Backend Intelligence** (`/api/dashboard/next-topic`):
  - Returns `navigationPath` with exact URL to navigate to
  - Checks user completions to determine resume point
  - Saves `currentTopicId` in user profile for consistency

- **Files Modified**:
  - `server/routes.ts` - Smart navigation path calculation
  - `client/src/pages/Dashboard.tsx` - Use navigationPath from backend
  - `client/src/pages/TopicDetail.tsx` - Previous topic back button, smart forward navigation
  - `client/src/pages/TopicFlashcards.tsx` - Already had back button

### ✅ Simplified Progressive Learning Flow (October 31, 2025)
**Completely redesigned UI for maximum simplicity and progressive learning:**

- **Dramatic UI Simplification**:
  - Removed: OnboardingCoach popups, ActivitySteps indicators, bottom progress cards, duplicate navigation elements
  - Result: Clean, distraction-free interface with just title + activity + one button
  - Each page now has ONE clear call-to-action

- **True Progressive Flow** (Video → Flashcards → Next Topic):
  - Old flow: Video → Flashcards → Back to same topic → Stuck
  - New flow: Video → Flashcards → **Next Topic Video** → Continues...
  - Flashcards now navigate to NEXT topic instead of back to current topic
  - Creates seamless learning progression through all topics

- **Async/Await Race Condition Fix**:
  - Changed from `completeActivity.mutate()` (fire-and-forget) to `await completeActivity.mutateAsync()`
  - Navigation only happens AFTER database save succeeds
  - Added error handling - if save fails, user stays on page with error toast
  - Prevents progress loss and ensures UI consistency

- **Smart Button Behavior**:
  - Not completed: "Completar y continuar" → Await mutation + Navigate
  - Already completed: "Continuar" (or "Siguiente: [next topic]") → Navigate immediately
  - Single `onComplete` handler checks completion state internally
  - No separate navigation callbacks that could bypass async/await

- **Barrier-Free Access**:
  - Removed video completion gate from flashcards page
  - Users can access any activity without forced prerequisites
  - Aligns with "treat users like 5 year olds" - maximum simplicity

- **E2E Testing**: Progressive flow confirmed
  - Video → Click button → Navigate to flashcards ✅
  - Flashcards → Click button → Navigate to NEXT topic ✅
  - No race conditions or stale data ✅
  - No popups or redundant UI ✅

- **Files Modified**:
  - `client/src/components/EmbedFrame.tsx` - Removed `onNavigateNext` prop, simplified button logic
  - `client/src/pages/TopicDetail.tsx` - Removed popups/progress/steps, async/await pattern
  - `client/src/pages/TopicFlashcards.tsx` - Removed popups/steps/gate, navigate to next topic, async/await

### ✅ Enhanced Learning Experience - Auth Gates, Step Prompts & Progress (October 29, 2025)
**Implemented three user-requested features to maximize simplicity and learning continuity:**

- **Authentication-Gated Content** (Security & Freemium Model):
  - All course/lesson/topic content now requires account creation
  - Unauthenticated users automatically redirected to /auth when accessing learning content
  - Protected routes: `/courses`, `/courses/:id`, `/lessons`, `/topics`, `/dashboard`, `/settings`
  - Public routes: `/` (home), `/auth`, `/pricing`
  - Component: `ProtectedRoute.tsx` provides clean auth gate with loading state

- **Step-by-Step Visual Prompts** (User Guidance):
  - New `ActivitySteps` component shows clear progression through each topic
  - Visual indicators: "Paso 1: Ver el video" → "Paso 2: Practicar con tarjetas" → "Paso 3: Conversar con IA"
  - Icons represent activity type (Video, BookOpenCheck, MessageSquare)
  - Active step highlighted with primary color and ring
  - Completed steps show checkmark icon
  - Steps connected with visual progress lines
  - Helps users understand what to do next at a glance

- **Progress Bar & Next Topic Navigation** (Continuity):
  - Real-time progress bar shows "X de Y completadas" at bottom of topic page
  - Completion percentage updates immediately after marking activities complete
  - When topic complete: Shows "¡Excelente trabajo!" message with prominent "Continuar" button
  - Next topic title preview helps users see what's coming
  - When lesson complete: Shows "¡Felicitaciones!" with "Volver al panel" button
  - When incomplete: Clear message "Completa todas las actividades para continuar"
  - Reduces friction and encourages continuous learning

- **Testing**: End-to-end tests passed
  - Auth gates correctly redirect unauthenticated users
  - Step indicators update in real-time as activities are completed
  - Progress bar accurately calculates completion percentage
  - Next topic button appears only when topic is complete

- **Files Created/Modified**:
  - `client/src/components/ProtectedRoute.tsx` - New auth guard component
  - `client/src/components/ActivitySteps.tsx` - New step indicator component
  - `client/src/App.tsx` - Wrapped protected routes with ProtectedRoute
  - `client/src/pages/TopicDetail.tsx` - Integrated step prompts and progress tracking

## User Preferences
- **Design System**: Material Design-inspired with warm, encouraging aesthetics
- **Color Palette**: Primary (orange/amber), accent (teal/cyan), warm neutrals
- **Typography**: Clear hierarchy with readable fonts
- **Components**: shadcn/ui with custom theming
- **Interactions**: Smooth transitions, hover states, active states
- **Responsiveness**: Mobile-first, works on all screen sizes

## System Architecture
The application uses a **hybrid database architecture**:

- **Frontend**: React 18 (TypeScript, Tailwind CSS, shadcn/ui, Wouter, TanStack Query)
- **Backend**: Express.js (Drizzle ORM)
- **Authentication**: Supabase Auth (email/password, Google OAuth, password reset)
- **Database**: Replit PostgreSQL (all application data - courses, lessons, activities, progress)

**Important**: Supabase is used ONLY for authentication. All course content and user progress data is stored in Replit's PostgreSQL database, not in Supabase's database.

### UI/UX Decisions
The UI is exclusively in Spanish, with a dark mode option and theme persistence. It features a clean, responsive design based on shadcn/ui components with custom theming, adhering to a Material Design-inspired aesthetic with a warm color palette.

### Technical Implementations
- **OOP Content Hierarchy**: A robust, object-oriented content model (`Course` → `Lesson` → `Topic` → `Activity`) is implemented using TypeScript classes, providing a clear and scalable structure for learning content.
- **Activity Types**: Supports `VideoActivity` (embedded YouTube), `QuizletActivity` (embedded Quizlet flashcards), and `AIChatActivity` (planned for conversational practice).
- **Authentication**: Utilizes Supabase for email/password and Google OAuth, managing user sessions and protected routes.
- **Progress Tracking**: Activity completion is tracked via the `activity_completions` table, enabling streak counters and overall progress percentages on the user dashboard. Smart topic navigation ensures users resume learning at their exact previous position.
- **Localization**: Full Spanish localization for all UI elements and content.
- **Database Seeding**: An `/api/admin/seed` endpoint allows for one-click production database seeding with sample Spanish content.
- **Password Reset**: Full password reset functionality is integrated with Supabase and a localized UI, including robust handling for race conditions.

### Feature Specifications
- **Course System**: Hierarchical content organization allows for clear learning paths.
- **User Dashboard**: Displays personalized learning statistics including streaks and progress, with a user-friendly design and prominent call-to-actions.
- **Admin Panel**: Provides real SQL-based analytics for total users, active users, completions, and average per user.
- **Spanish-Only UI**: All interface and content are presented in Spanish, with no language switching option.
- **Activity Ordering**: Activities are consistently ordered (Video → Quizlet → AI Chat) for an optimal learning flow.

### System Design Choices
- **Type-safe Development**: `shared/schema.ts` ensures consistency between frontend and backend.
- **Hierarchical Data Loading**: The backend efficiently loads complete course hierarchies in single queries.
- **State Management**: TanStack Query manages data fetching and cache invalidation.
- **Environment Configuration**: Utilizes Replit Secrets for secure storage of API keys and database credentials, with an auto-fix feature for common configuration errors.

## External Dependencies
- **Supabase**:
    - Authentication (Email/Password, Google OAuth)
- **YouTube**: Embedded video lessons within `VideoActivity` components.
- **Quizlet**: Embedded flashcard sets within `QuizletActivity` components.