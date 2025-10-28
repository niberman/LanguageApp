# La Escuela de Idiomas - "¡Empecemos a hablar!"

## Overview

"La Escuela de Idiomas" is a production-ready, Spanish-only language learning platform designed to facilitate language acquisition through structured content and interactive activities. Its core purpose is to provide an engaging and effective learning experience, leveraging embedded external resources and a clear, hierarchical content model. The platform supports a freemium model with a focus on user progress tracking and a streamlined, intuitive user interface. The project aims to become a leading platform for Spanish speakers to learn new languages, starting with English.

## Recent Changes

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

The application is built with a React 18 frontend (TypeScript, Tailwind CSS, shadcn/ui, Wouter, TanStack Query) and an Express.js backend (Drizzle ORM, PostgreSQL via Supabase).

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