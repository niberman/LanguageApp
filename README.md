# The Language School - "Let's Start Talking!"
Test comment add
A production-ready bilingual (EN/ES) language learning platform with progress tracking, embedded content, and Supabase authentication.

## 🚀 Features

- **Bilingual Support**: Full EN/ES internationalization with instant language switching
- **Authentication**: Email/password and Google OAuth via Supabase Auth
- **Practice System**: 29 foundation levels (17 English + 12 Spanish)
- **Progress Tracking**: Automatic streak calculation and completion tracking
- **Embedded Content**: Quizlet vocabulary sets and YouTube lesson playlists
- **Dashboard**: Personal stats including streak, last activity, and progress percentage
- **Admin Panel**: Content management for levels and user analytics
- **Dark Mode**: Full light/dark theme support with persistence

## 📋 Prerequisites

- Node.js 20+
- Supabase account
- Replit account (for deployment)

## 🔧 Setup Instructions

### 1. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your credentials from **Settings → API**:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

### 2. Environment Variables

Add these secrets in Replit:

```
DATABASE_URL=<your-supabase-connection-string>
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SESSION_SECRET=<random-string>
```

**⚠️ Important**: Make sure `NEXT_PUBLIC_SUPABASE_URL` contains your project URL (not a JWT token). The app will auto-detect and fix swapped values, but it's best to set them correctly.

### 3. Database Setup

Run migrations and seed initial data:

```bash
npm run db:migrate
npm run db:seed
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:5000` to see the app.

## 🗄️ Database Schema

### Tables

- **profiles**: User profiles with locale preferences
- **levels**: Course content (track, number, title, Quizlet/YouTube IDs)
- **progress_events**: User activity tracking (quizlet_view, video_watch)
- **waitlist_emails**: Newsletter signups

### RLS Policies

All tables have Row Level Security enabled:
- Users can only access their own progress and profile data
- Levels are publicly readable
- Admin role required for level management

## 📚 API Routes

### Public
- `GET /api/config` - Client configuration
- `GET /api/levels` - List all levels
- `GET /api/levels?track=english` - Filter by track
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

## 🎨 Internationalization

The app supports English and Spanish with the following structure:

```
client/src/contexts/LanguageContext.tsx  # Translation logic
```

All UI strings are translated. To add a new string:

1. Add key to both `en` and `es` objects in LanguageContext
2. Use `t('your.key')` in components

## 🔐 Admin Access

To make a user an admin:

1. Sign up through the app
2. In Supabase dashboard, go to **Authentication → Users**
3. Find the user and update their `raw_app_meta_data`:
   ```json
   {
     "provider": "email",
     "providers": ["email"],
     "role": "admin"
   }
   ```

## 📝 Adding Content

### Add a New Level

Via Admin Panel:
1. Sign in as admin
2. Go to `/admin`
3. Use "Add New Level" form

Via API:
```bash
curl -X POST http://localhost:5000/api/levels \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "track": "english",
    "number": 18,
    "title": "Advanced Grammar",
    "quizletSetIds": ["your-quizlet-id"],
    "youtubePlaylistIds": ["your-playlist-id"]
  }'
```

### Update Quizlet/YouTube IDs

1. Get Quizlet set ID from URL: `quizlet.com/[ID]/...`
2. Get YouTube playlist ID from URL: `youtube.com/playlist?list=[ID]`
3. Update in admin panel or via API

## 🚀 Deployment

### Replit Deployment

1. Click "Deploy" in Replit
2. App will be available at `https://your-repl.replit.app`
3. Configure custom domain in deployment settings (optional)

### Environment Setup

Ensure all secrets are set in Replit deployment environment.

## 🧪 Testing

The app includes comprehensive test coverage for:
- Authentication flows
- Progress tracking
- Level navigation
- Dashboard stats calculation
- Streak counter logic

## 🔄 Future Enhancements (Phase 2)

Placeholder routes are included for:

- **/chat** - AI Conversation Partner (Pro tier)
- **/events** - Community language exchange meetups
- **/work** - Job opportunities and Uber referral

## 📊 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, Drizzle ORM
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **State**: TanStack Query (React Query)
- **Validation**: Zod
- **Icons**: Lucide React

## 🔑 Password Reset Configuration

### Supabase Redirect URL Setup

For password reset emails to work correctly, configure these in **Supabase Dashboard → Authentication → URL Configuration**:

**Development Site URL:**
```
https://your-replit-dev-url.replit.dev
```

**Production Site URL (after deploying):**
```
https://your-repl-name.replit.app
```

**Redirect URLs (add all):**
```
https://your-replit-dev-url.replit.dev/auth*
https://your-repl-name.replit.app/auth*
http://localhost:5000/auth*
```

**Why this is needed:**
- Supabase sends password reset links that redirect users back to your app
- Without proper configuration, links redirect to `localhost:3000` (Supabase's default)
- The app automatically detects password recovery tokens in the URL and shows the password update form

### Optional: Customize Email Template (Spanish)

In **Authentication → Email Templates → Reset Password**, use:

```html
<h2>Restablece tu contraseña</h2>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer contraseña</a></p>
```

## 🗄️ Database Architecture

**Important:** This app uses a hybrid database approach:

- **Supabase**: Authentication ONLY (users, sessions, password reset)
- **Replit PostgreSQL**: All application data (courses, lessons, activities, progress)

When you check your Supabase dashboard, you'll only see authentication-related tables, not your course content. This is by design!

## 🐛 Troubleshooting

### Supabase client not initialized

If you see this error, check that environment variables are set correctly:

```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Database connection errors

Verify DATABASE_URL is correct and includes `?pgbouncer=true` for connection pooling.

### Auth not working / Password Reset Links Broken

**Configure Supabase Redirect URLs** (Required for password reset and OAuth):

1. Go to Supabase dashboard → **Authentication** → **URL Configuration**
2. Update **Site URL** to your deployment URL:
   - Development: `http://localhost:5000`
   - Production: `https://your-repl-name.replit.app` (or your custom domain)
3. Add to **Redirect URLs** (add ALL of these):
   ```
   http://localhost:5000/auth*
   https://your-repl-name.replit.app/auth*
   ```
   Replace `your-repl-name` with your actual Replit username and repl name.

4. Verify Google OAuth is configured if using Google sign-in

**How password reset works:**
1. User requests password reset via "¿Olvidaste tu contraseña?" link
2. Supabase sends email with recovery link containing `#access_token=...&type=recovery`
3. App detects the `type=recovery` in the URL hash and shows password update form
4. After successful update, user is redirected to dashboard

**Why this matters**: When users click password reset links in their email, Supabase redirects them to the URL you configure. If this is set to `localhost:3000`, deployed users will see a broken page.

## 📄 License

MIT

## 🤝 Contributing

This is a production MVP. For feature requests or bugs, please open an issue.

---

**Built with ❤️ for language learners worldwide**