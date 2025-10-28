# 🔧 Supabase Password Reset - Setup Guide

## ⚠️ Current Issue
Password reset emails redirect to `localhost:3000` instead of your actual app URL.

## ✅ Solution: Configure Redirect URLs

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**

### Step 2: Configure URLs

#### Site URL
Set this to your production URL:
```
https://workspace.david2792.repl.co
```

#### Redirect URLs
Add **ALL** of these (click "+ Add URL" for each):
```
https://workspace.david2792.repl.co/auth*
https://workspace.david2792.repl.co/auth?reset=true
http://localhost:5000/auth*
http://localhost:5000/auth?reset=true
```

**Note:** The wildcard `*` allows any query parameters. The specific `?reset=true` URL is required for the password update flow.

### Step 3: Save Changes
Click **Save** at the bottom of the page.

---

## 🇪🇸 Optional: Spanish Email Template

Make password reset emails match your Spanish-first UI:

1. Go to: **Authentication** → **Email Templates**
2. Select **"Reset Password"**
3. Replace the HTML with:

```html
<h2>Restablece tu contraseña</h2>
<p>Hola,</p>
<p>Has solicitado restablecer tu contraseña para La Escuela de Idiomas.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer contraseña</a></p>
<p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
<p>¡Gracias!</p>
<p>El equipo de La Escuela de Idiomas</p>
```

4. Click **Save**

---

## 🧪 Testing the Password Reset Flow

After configuration:

1. Visit: `https://workspace.david2792.repl.co`
2. Click **"¿Olvidaste tu contraseña?"**
3. Enter your email address
4. Click **"Enviar enlace de restablecimiento"**
5. Check your email inbox
6. Click the reset link in the email
7. ✅ You should see: **"Actualizar Contraseña"** form (in Spanish)
8. Enter your new password twice
9. Click **"Actualizar Contraseña"**
10. ✅ Success! You'll be redirected to the dashboard

---

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

### View Your Actual Data

To see your course content and user data:

1. In this Repl, go to the **Database** tab (left sidebar)
2. Or run SQL queries via the admin panel: `/admin` → "Base de Datos" tab
3. Or use the shell:
   ```bash
   npm run db:push  # Sync schema
   npm run db:seed  # Add sample data
   ```

---

## ✅ Verification Checklist

- [ ] Supabase Site URL set to `https://workspace.david2792.repl.co`
- [ ] All 4 Redirect URLs added to Supabase
- [ ] Changes saved in Supabase dashboard
- [ ] (Optional) Spanish email template configured
- [ ] Password reset email received and link clicked
- [ ] "Actualizar Contraseña" form appears
- [ ] New password accepted and dashboard loads

---

## 🆘 Still Not Working?

If the reset link still redirects incorrectly:

1. **Clear browser cache** and try again
2. **Check spam folder** for the reset email
3. **Verify email sent from**: `noreply@mail.app.supabase.io`
4. **Copy the link** from email and paste in browser (don't just click)
5. **Check the link format**: Should contain `https://workspace.david2792.repl.co/auth?reset=true&access_token=...`

If the link still shows `localhost:3000`:
- Double-check Supabase URL Configuration was saved
- Wait 2-3 minutes for Supabase changes to propagate
- Request a new password reset email (old links cache old redirect URLs)
