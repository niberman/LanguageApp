# 🔐 Supabase Configuration Guide

## ⚠️ Common Issues & Solutions

### Issue 1: Password Reset Redirects to Home Page

**Problem:** Clicking the password reset link in your email takes you to the home page instead of showing the password update form.

**Root Cause:** Supabase's redirect URLs are not configured correctly in your Supabase dashboard.

**Solution:**

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Select your project

2. **Navigate to URL Configuration**
   - Click **Authentication** in the left sidebar
   - Click **URL Configuration**

3. **Update Site URL**
   
   For development (while testing on Replit):
   ```
   https://YOUR-REPL-NAME.replit.dev
   ```
   
   For production (after deployment):
   ```
   https://YOUR-REPL-NAME.replit.app
   ```
   
   **How to find your URL:**
   - In Replit, look at the top of the Webview panel
   - Copy the full URL (e.g., `https://abcd-1234.replit.dev`)

4. **Add Redirect URLs**
   
   Click **Add URL** and add EACH of these (replace with your actual URLs):
   ```
   https://YOUR-REPL-NAME.replit.dev/auth
   https://YOUR-REPL-NAME.replit.dev/auth*
   https://YOUR-REPL-NAME.replit.app/auth
   https://YOUR-REPL-NAME.replit.app/auth*
   ```
   
   **Important:** 
   - You need BOTH the exact `/auth` path AND the wildcard `/auth*` version
   - Add entries for both `.replit.dev` (development) and `.replit.app` (production)
   - The app will automatically detect the `type=recovery` in the URL hash

5. **Save Changes**
   - Scroll to the bottom and click **Save**

### Issue 2: Password Reset Emails Not Being Sent

**Possible Causes & Solutions:**

#### A. Rate Limiting (Most Common)
Supabase limits emails in development mode to prevent spam.

**Solution:**
- Wait 60 seconds between password reset requests
- Check your Supabase dashboard → **Authentication** → **Rate Limits**
- For production, rate limits are higher

#### B. Email in Spam Folder
Supabase development emails often go to spam.

**Solution:**
- Check your spam/junk folder
- Mark Supabase emails as "Not Spam"
- Add `noreply@mail.supabase.io` to your contacts

#### C. Email Provider Blocking
Some email providers block automated emails.

**Solution:**
- Try a different email address (Gmail works best)
- Use a personal email, not a work/school email

#### D. Email Confirmation Disabled
If you recently created your Supabase project, email confirmation might be disabled.

**Solution:**
1. Go to **Authentication** → **Email Templates**
2. Verify **Confirm signup** is enabled
3. Verify **Reset Password** template exists

#### E. SMTP Not Configured
For production, you may want to use a custom SMTP provider.

**Solution:**
1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Enable custom SMTP (optional for production)
3. Use services like SendGrid, Mailgun, or AWS SES

### Issue 3: "Development Preview" Banner

**What is it?**
The banner saying "Development Preview" appears at the top of your app while running in development mode on Replit.

**Why does it appear?**
This is normal behavior from Replit's development tooling. It helps you distinguish between:
- **Development** (`.replit.dev` URL) - Shows banner
- **Production** (`.replit.app` URL) - No banner

**How to remove it:**

The banner **automatically disappears** when you deploy to production:

1. Click the **Deploy** button in Replit
2. Follow the deployment wizard
3. Your production URL (`.replit.app`) will not show the banner

**For development:** The banner is intentional and cannot be removed. It reminds you that you're in a development environment, which is useful!

## ✅ Testing Password Reset

Once you've configured Supabase correctly, test the flow:

1. **Request Reset**
   - Go to your app's `/auth` page
   - Click "¿Olvidaste tu contraseña?"
   - Enter your email
   - Click "Enviar enlace de restablecimiento"

2. **Check Email**
   - Wait up to 60 seconds
   - Check spam folder if not in inbox
   - Look for email from `noreply@mail.supabase.io`

3. **Click Reset Link**
   - Click the link in the email
   - You should see "Actualizar Contraseña" form
   - **NOT** the home page or login page

4. **Update Password**
   - Enter new password (minimum 6 characters)
   - Confirm password
   - Click "Actualizar Contraseña"
   - You should be redirected to the dashboard

## 🔍 Debugging Tips

### Check Current Configuration

1. **Verify Environment Variables** (in Replit Secrets):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

2. **Test in Browser Console**:
   ```javascript
   // Open browser console (F12)
   // Check if Supabase is configured
   console.log(import.meta.env.NEXT_PUBLIC_SUPABASE_URL)
   ```

3. **Check Supabase Logs**:
   - Go to your Supabase project
   - Click **Logs** → **Auth Logs**
   - Look for password reset events

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Email not sent" | Rate limit hit | Wait 60 seconds, try again |
| "Invalid redirect URL" | URL not in allowlist | Add URL to Supabase redirect URLs |
| "Auth session missing" | Token expired | Request new reset link |
| Shows login page instead of reset form | Redirect URL wrong | Update Site URL in Supabase |

## 📧 Email Template Customization (Optional)

To make emails more user-friendly in Spanish:

1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Update the subject and body:

**Subject:**
```
Restablece tu contraseña - La Escuela de Idiomas
```

**Body:**
```html
<h2>Restablece tu contraseña</h2>
<p>Hola,</p>
<p>Recibimos una solicitud para restablecer tu contraseña.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer contraseña</a></p>
<p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
<p>Saludos,<br>El equipo de La Escuela de Idiomas</p>
```

4. Click **Save**

## 🚀 Production Checklist

Before deploying to production:

- [ ] Site URL points to production domain (`.replit.app` or custom domain)
- [ ] Redirect URLs include production domain
- [ ] Test password reset with production URL
- [ ] Verify emails arrive in inbox (not spam)
- [ ] Confirm dev banner doesn't appear on production URL
- [ ] Test Google OAuth if using it

## 📊 Database Setup - Important Info

### Why You Don't See Tables in Supabase

This app uses a **hybrid architecture**:

| Service | Purpose | What's Stored |
|---------|---------|---------------|
| **Supabase** | Authentication ONLY | Users, sessions, email verification |
| **Replit PostgreSQL** | Application Data | Courses, lessons, topics, activities, progress |

**This is by design!** When you view your Supabase dashboard:
- ✅ You WILL see: Users, authentication logs
- ❌ You WON'T see: Course content, lessons, user progress

All application data lives in Replit's PostgreSQL database (accessible via `DATABASE_URL` environment variable).

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Clear browser cache and cookies**
2. **Try incognito/private browsing mode**
3. **Test with a different email address**
4. **Check Supabase service status**: https://status.supabase.com
5. **Wait 2-3 minutes** after changing Supabase settings for changes to propagate
6. **Request a NEW reset email** (old links may have cached old redirect URLs)

---

**Need more help?** Check the main README.md for additional troubleshooting steps.
