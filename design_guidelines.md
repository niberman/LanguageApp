# Design Guidelines: The Language School Web App

## Design Approach

**Selected Framework**: Material Design principles with inspiration from successful language learning platforms (Duolingo, Babbel) for gamification and motivation elements.

**Rationale**: Education technology requires clear information hierarchy and accessibility while maintaining engagement through warm, encouraging visual design. The bilingual nature demands exceptional clarity in typography and layout.

## Core Design Principles

1. **Encouraging & Approachable**: Visual design should motivate daily practice, never intimidate
2. **Crystal Clear Hierarchy**: Bilingual support requires exceptional typography and spacing clarity
3. **Progress First**: Every view should communicate user advancement prominently
4. **Accessible by Default**: Large touch targets, high contrast, semantic structure

## Color Palette

### Primary Colors
- **Primary Brand**: 217 91% 60% (warm blue - trust and learning)
- **Primary Dark**: 217 91% 45% (for dark mode)

### Accent & Semantic
- **Success/Progress**: 142 76% 45% (vibrant green for achievements)
- **Warning/Streak**: 38 92% 50% (warm amber for streaks)
- **Error**: 0 84% 60% (clear red for alerts)

### Neutrals
- **Light Mode**: slate-50 backgrounds, slate-900 text
- **Dark Mode**: slate-950 backgrounds, slate-50 text
- **Borders**: slate-200 (light) / slate-800 (dark)

## Typography

**Font Stack**: System fonts via Tailwind defaults for optimal performance and readability
- Primary: `font-sans` (Inter-like system stack)
- All text: `antialiased` for crisp rendering

**Type Scale**:
- Hero/H1: `text-4xl md:text-5xl font-bold` (48-60px)
- H2: `text-3xl md:text-4xl font-semibold` (36-48px)
- H3: `text-2xl font-semibold` (24px)
- Body: `text-base md:text-lg` (16-18px)
- Small: `text-sm` (14px)

**Bilingual Considerations**:
- Use `font-medium` minimum for headings to support Spanish accents clearly
- Generous `leading-relaxed` (1.625) for body text in both languages
- Cards with mixed language content get `space-y-2` minimum between elements

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16** (e.g., `p-4`, `gap-8`, `mb-12`)

**Container Strategy**:
- Max content width: `max-w-7xl mx-auto px-4 md:px-6`
- Card containers: `max-w-md` for focused content
- Dashboard stats: `max-w-6xl` for optimal scanning

**Grid Patterns**:
- Level cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Stats dashboard: `grid grid-cols-2 lg:grid-cols-4 gap-4`
- Embedded content: Full width with `aspect-video` ratio

## Component Library

### Cards & Surfaces
- **Base Card**: `rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow`
- **Level Card**: Includes progress ring (top-right), level number badge, title, and completion status
- **Stat Card**: Icon + large number + label in vertical stack, colored border-l-4 accent

### Navigation
- **Navbar**: Sticky top, glass morphism effect (`backdrop-blur-md bg-white/90 dark:bg-slate-950/90`), logo left, language switcher right
- **Language Toggle**: Pill-style toggle `rounded-full p-1 bg-slate-100 dark:bg-slate-800` with active state having primary background

### Progress Indicators
- **Progress Ring**: SVG circular progress (size-20 for cards, size-32 for detail views) with primary stroke
- **Streak Counter**: Flame icon + number in amber gradient badge `bg-gradient-to-br from-amber-400 to-orange-500`
- **Completion Bar**: `h-2 rounded-full bg-slate-200 dark:bg-slate-700` with `bg-green-500` fill

### Buttons & CTAs
- **Primary CTA**: `bg-primary text-white rounded-xl px-8 py-4 text-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl`
- **Secondary**: `border-2 border-primary text-primary rounded-xl px-6 py-3 font-semibold hover:bg-primary/5`
- **Outline on Images**: `backdrop-blur-md bg-white/20 border-2 border-white text-white` (NO hover states specified - Button handles its own)

### Embeds
- **Quizlet/YouTube Frame**: `rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 aspect-video w-full shadow-lg`
- **Embed Container**: `space-y-4` with header showing platform icon, "Open in new tab" link

## Page-Specific Layouts

### Home Page
- **Hero**: Full-width gradient background (217 91% 97% to white), centered content, large heading + bilingual tagline, primary CTA button, hero image showing diverse students studying (right side on desktop, below on mobile)
- **Features Grid**: 3-column cards (Practice, Dashboard, Coming Soon) with icons, titles, descriptions
- **Social Proof**: Centered testimonial or stat (e.g., "Join 1,000+ daily learners")

### Practice Pages
- **Track Selector**: Two large cards side-by-side (English/Spanish) with flag icons, level count badges
- **Level List**: Numbered cards in grid, progress rings top-right, "Continue" or "Start" badge
- **Level Detail**: Sticky header with back button + level title, embedded content in tabs or accordion, progress toggle buttons

### Dashboard
- **Stats Row**: 4-column grid of stat cards (Streak, Last Activity, Progress %, Next Action)
- **Recent Activity**: Timeline list with icons showing recent quizlet/video completions
- **Next Recommendation**: Highlighted card with "Continue Level X" CTA

### Admin Panel
- **Table View**: Clean data table with alternating row backgrounds, action buttons right-aligned
- **Forms**: Vertical stack, label above input, helper text below, generous `space-y-6`

## Accessibility Standards

- Minimum touch target: `min-h-12 min-w-12` (48px)
- Focus rings: `focus:ring-4 focus:ring-primary/20 focus:outline-none`
- Color contrast: All text meets WCAG AA (4.5:1 minimum)
- Semantic HTML: `<main>`, `<nav>`, `<article>` for screen readers
- Dark mode: Consistent implementation across all components including form inputs

## Images

### Hero Image (Home Page)
- **Description**: Diverse group of students (2-3 people) engaged in language learning - one person smiling while using a laptop, another with headphones, warm and welcoming atmosphere
- **Placement**: Right side of hero section on desktop (40% width), full width below heading on mobile
- **Treatment**: Rounded-2xl corners, subtle shadow, slight diagonal tilt (+2deg) for dynamic feel

### Empty States
- **Illustration Style**: Simple, friendly line art illustrations for "no progress yet" states
- **Color**: Primary blue with slate accents

## Animation Guidelines

**Use Sparingly**:
- Card hover: `transition-shadow duration-200` only
- Progress fill: `transition-all duration-500 ease-out` for number changes
- Page transitions: Simple fade, no elaborate animations
- Success celebrations: Confetti burst on streak milestones (day 7, 30, 100) - lightweight canvas animation

**NO Animations**:
- Background movements
- Continuous looping effects
- Parallax scrolling