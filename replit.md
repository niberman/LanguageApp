# La Escuela de Idiomas - "¡Empecemos a hablar!"

## Overview

"La Escuela de Idiomas" is a production-ready, Spanish-only language learning platform designed to facilitate language acquisition through structured content and interactive activities. Its core purpose is to provide an engaging and effective learning experience, leveraging embedded external resources and a clear, hierarchical content model. The platform supports a freemium model with a focus on user progress tracking and a streamlined, intuitive user interface. The project aims to become a leading platform for Spanish speakers to learn new languages, starting with English.

## Recent Changes

### ✅ Password Reset Persistence Fix (October 28, 2025)
**Fixed password reset page redirecting to login:**

- **Problem**: Password reset link from email would briefly show the password update form, then immediately redirect to login page
- **Root Cause**: Supabase clears URL hash after processing recovery token, causing the app to lose track of the password reset flow
- **Solution**: Password reset state now persists once detected, preventing unwanted redirects
- **Result**: Users can now reliably update their password after clicking the reset link

### ✅ User-Friendly Dashboard & Real Admin Analytics (October 28, 2025)
**Enhanced for maximum simplicity and added real SQL-based admin reporting:**

- **Dashboard Redesign - Ultra User-Friendly**:
  - Huge, prominent CTA card "¿Listo para aprender?" with obvious button
  - Motivational messages based on streak level
  - Visual progress bar showing completion percentage
  - Three large stat cards: Racha (streak), Última Actividad, Actividades Completadas
  - Each card includes encouraging, motivational text
  - Quick access buttons for courses and settings
  - All text in simple, clear Spanish
  - All icons from Lucide React (no emojis per design guidelines)

- **Removed Pricing**:
  - Removed pricing link from navigation
  - Simplified navigation to focus on learning

- **Admin Analytics (Real SQL Data)**:
  - Added `/api/admin/analytics` endpoint with authentication & admin protection
  - Platform-wide stats: total users, active users, completions, average per user
  - User table showing: name, streak, activities, last activity, registration date
  - All data pulled from PostgreSQL in real-time
  - Removed all mock/placeholder data
  - Frontend sends Authorization header with session token

- **Files Modified**:
  - `client/src/components/Navbar.tsx` - Removed pricing link
  - `client/src/pages/Dashboard.tsx` - Complete redesign for user-friendliness
  - `client/src/pages/Admin.tsx` - Real analytics display with auth headers
  - `server/routes.ts` - Added protected admin analytics endpoint
  - `client/src/pages/Auth.tsx` - Fixed password reset persistence

### ✅ UX Improvements: Activity Ordering, Next Topic Navigation & Password Reset Fix (October 28, 2025)
**Enhanced user experience with better content flow and reliable authentication:**

- **Activity Ordering**:
  - Activities now automatically sorted by type: Videos first, then Quizlet flashcards, then AI chat
  - Ensures consistent viewing experience across all topics
  - Users see instructional videos before practice exercises

- **Next Topic Navigation**:
  - Added "¿Listo para continuar?" Card at bottom of each topic page
  - One-click button to advance to next topic in the lesson
  - Only shows when next topic is available
  - Improves learning flow by reducing navigation friction

- **Password Reset Reliability**:
  - Fixed inconsistent password reset flow detection
  - Now correctly identifies Supabase recovery flows using `type=recovery` hash check
  - Prevents false positives from signup/magic link confirmations
  - Users reliably see password update form after clicking email reset link

- **Files Modified**:
  - `client/src/pages/TopicDetail.tsx` - Activity sorting + next topic CTA
  - `client/src/pages/Auth.tsx` - Improved password reset detection

### ✅ Updated Course Content with Real Videos & Flashcards (October 28, 2025)
**Replaced placeholder content with actual educational materials:**

- **Old Topics Removed**: Cognados, Despedidas, Números, Preguntas Comunes, Presentaciones, Pronunciación
- **New Topics Added** (7 topics total):
  1. **About** - Introduction video (video only, no flashcards)
  2. **What is your name?** - Name introductions (video + Quizlet flashcards)
  3. **Cómo decir "Soy de…" en inglés** - Where you're from (video + Quizlet flashcards)
  4. **Do you like to travel?** - Travel preferences (video + Quizlet flashcards)
  5. **Do you work?** - Job and work conversations (video + Quizlet flashcards)
  6. **Do you like?** - Likes and dislikes (video + Quizlet flashcards)
  7. **Greetings** - Common greetings (video + Quizlet flashcards)

- **Content Statistics**:
  - 7 YouTube video lessons
  - 6 Quizlet flashcard sets
  - All Quizlet embeds configured with Spanish locale (`&locale=es`)
  - All videos use YouTube embed format for consistent playback

### ✅ Password Reset Flow Implementation (October 28, 2025)
**Fixed broken password reset email links and added complete password update UI:**

- **Problem Fixed**:
  - Password reset emails redirected to broken `localhost:3000` URLs
  - No UI to complete password reset after clicking email link

- **Implementation**:
  - Added `updatePassword` function to AuthContext for secure password updates
  - Auth page now detects `reset=true` query parameter + active session
  - Shows dedicated password update form (Spanish-first with i18n support)
  - Validates password matching and minimum length (6 chars)
  - Automatically redirects to dashboard after successful update

- **Documentation**:
  - Added comprehensive Supabase redirect URL configuration guide to README
  - Instructions for both development and production environments
  - Explains why proper configuration is critical for password reset flow

- **Files Modified**:
  - `client/src/contexts/AuthContext.tsx` - Added updatePassword method
  - `client/src/pages/Auth.tsx` - Password reset detection and UI
  - `client/src/contexts/LanguageContext.tsx` - New i18n strings
  - `README.md` - Supabase configuration documentation

### ✅ Quizlet Spanish UI & Better Card Fitting (October 28, 2025)
**Improved Quizlet embed experience with Spanish interface and better card sizing:**

- **Spanish Locale**:
  - Added `&locale=es` parameter to all Quizlet embed URLs
  - Quizlet UI now displays in Spanish (buttons, labels, navigation)
  - Updated all 6 Quizlet activities in seed data

- **Better Card Fitting**:
  - Changed aspect ratio from 16:9 (video) to 4:3 for Quizlet embeds
  - Added minimum height of 600px for Quizlet frames
  - Cards now fit better within the iframe without excessive scrolling
  - Updated EmbedFrame component to handle different aspect ratios per type

- **Updated URLs**:
  - Format: `https://quizlet.com/{id}/flashcards/embed?i=nd4dc&x=1jj1&locale=es`
  - All existing activities updated via database re-seed

### ✅ Database Setup & Production Fixes (October 28, 2025)
**Fixed production database connectivity and added seeding capability:**

- **Database Migration**:
  - Created Replit PostgreSQL database (replaced external Neon DB)
  - Fixed "getaddrinfo EAI_AGAIN helium" error on deployed site
  - Applied schema using `npm run db:push`
  - Successfully seeded with 1 course, 6 topics, 12 activities

- **Production Seeding**:
  - Access `/admin` → "Base de Datos" tab to seed production database
  - One-click button: "🌱 Sembrar Base de Datos"
  - Prevents duplicate courses automatically

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

**Important**: Supabase is used ONLY for authentication. All course content and user progress data is stored in Replit's PostgreSQL database, not in Supabase's database. This is why you won't see application tables when viewing the Supabase dashboard - it only shows auth-related data (users, sessions).

### UI/UX Decisions
The UI is exclusively in Spanish, with a dark mode option and theme persistence. It features a clean, responsive design based on shadcn/ui components with custom theming, adhering to a Material Design-inspired aesthetic with a warm color palette.

### Technical Implementations
- **OOP Content Hierarchy**: A robust, object-oriented content model (`Course` → `Lesson` → `Topic` → `Activity`) is implemented using TypeScript classes, providing a clear and scalable structure for learning content.
- **Activity Types**: Supports `VideoActivity` (embedded YouTube), `QuizletActivity` (embedded Quizlet flashcards), and `AIChatActivity` (planned for conversational practice).
- **Authentication**: Utilizes Supabase for email/password and Google OAuth, managing user sessions and protected routes.
- **Progress Tracking**: Activity completion is tracked via the `activity_completions` table, enabling streak counters and overall progress percentages on the user dashboard.
- **Localization**: Full Spanish localization for all UI elements and content.
- **Database Seeding**: An `/api/admin/seed` endpoint allows for one-click production database seeding with sample Spanish content.
- **Password Reset**: Full password reset functionality is integrated with Supabase and a localized UI.

### Feature Specifications
- **Course System**: Hierarchical content organization allows for clear learning paths.
- **User Dashboard**: Displays personalized learning statistics including streaks and progress.
- **Admin Panel**: Provides tools for content management and user analytics (future implementation).
- **Spanish-Only UI**: All interface and content are presented in Spanish, with no language switching option.

### System Design Choices
- **Type-safe Development**: `shared/schema.ts` ensures consistency between frontend and backend.
- **Hierarchical Data Loading**: The backend efficiently loads complete course hierarchies in single queries.
- **State Management**: TanStack Query manages data fetching and cache invalidation.
- **Environment Configuration**: Utilizes Replit Secrets for secure storage of API keys and database credentials, with an auto-fix feature for common configuration errors.

## External Dependencies

- **Supabase**:
    - PostgreSQL Database
    - Authentication (Email/Password, Google OAuth)
    - Storage (for future media assets)
- **YouTube**: Embedded video lessons within `VideoActivity` components.
- **Quizlet**: Embedded flashcard sets within `QuizletActivity` components.