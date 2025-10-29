# La Escuela de Idiomas - "¡Empecemos a hablar!"

## Overview
"La Escuela de Idiomas" is a production-ready, Spanish-only language learning platform designed to facilitate language acquisition through structured content and interactive activities. Its core purpose is to provide an engaging and effective learning experience, leveraging embedded external resources and a clear, hierarchical content model. The platform supports a freemium model with a focus on user progress tracking and a streamlined, intuitive user interface. The project aims to become a leading platform for Spanish speakers to learn new languages, starting with English.

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