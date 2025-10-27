import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabaseAdmin, getSupabaseClient } from "./lib/supabase";
import { insertWaitlistEmailSchema } from "@shared/schema";
import { z } from "zod";

interface AuthRequest extends Request {
  user?: any;
}

// Middleware to verify Supabase auth token
async function authenticateUser(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
}

// Middleware to check admin role
async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const { data: { user } } = await supabaseAdmin.auth.getUser(req.headers.authorization?.substring(7));
  
  if (!user?.app_metadata?.role || user.app_metadata.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Config endpoint for client
  app.get("/api/config", (req, res) => {
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    // Auto-detect and fix swapped values
    if (supabaseUrl.startsWith('eyJ') && supabaseAnonKey.startsWith('http')) {
      [supabaseUrl, supabaseAnonKey] = [supabaseAnonKey, supabaseUrl];
    }
    
    res.json({
      supabaseUrl,
      supabaseAnonKey,
    });
  });

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (error) throw error;

      // Create profile
      await storage.createProfile({
        id: data.user.id,
        displayName: email.split('@')[0],
        locale: 'en',
      });

      res.json({ user: data.user });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      res.json({ session: data.session, user: data.user });
    } catch (error: any) {
      console.error('Signin error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/signout", authenticateUser, async (req, res) => {
    try {
      const supabase = getSupabaseClient(req.headers.authorization?.substring(7));
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error('Signout error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Profile routes
  app.post("/api/profile", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { id, displayName, locale } = req.body;
      const profile = await storage.createProfile({
        id: id || req.user!.id,
        displayName: displayName || req.user!.email?.split('@')[0] || 'User',
        locale: locale || 'en',
      });
      res.json(profile);
    } catch (error: any) {
      console.error('Create profile error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/profile", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const profile = await storage.getProfile(req.user!.id);
      res.json(profile);
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/profile", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const profile = await storage.updateProfile(req.user!.id, req.body);
      res.json(profile);
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Course routes (NEW OOP MODEL)
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error: any) {
      console.error('Get courses error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourseWithContent(req.params.id);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      res.json(course);
    } catch (error: any) {
      console.error('Get course error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Activity completion routes (replaces progress)
  app.post("/api/activities/:id/complete", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const completion = await storage.completeActivity(req.user!.id, req.params.id);
      res.json(completion);
    } catch (error: any) {
      console.error('Complete activity error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/completions", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const completions = await storage.getUserCompletions(req.user!.id);
      res.json(completions);
    } catch (error: any) {
      console.error('Get completions error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Waitlist routes
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validated = insertWaitlistEmailSchema.parse(req.body);
      await storage.addToWaitlist(validated.email);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Waitlist error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Dashboard stats (updated for new model)
  app.get("/api/dashboard/stats", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const completions = await storage.getUserCompletions(req.user!.id);
      const courses = await storage.getAllCourses();
      
      // Calculate streak based on completions
      const streak = await storage.getUserStreak(req.user!.id);
      
      const lastActivity = completions.length > 0 
        ? completions[completions.length - 1].completedAt 
        : null;

      // Count total activities across all courses
      let totalActivities = 0;
      for (const course of courses) {
        const fullCourse = await storage.getCourseWithContent(course.id);
        if (fullCourse) {
          for (const lesson of fullCourse.lessons) {
            for (const topic of lesson.topics) {
              totalActivities += topic.activities.length;
            }
          }
        }
      }

      const progressPercentage = totalActivities > 0 
        ? Math.round((completions.length / totalActivities) * 100)
        : 0;

      res.json({
        streak,
        lastActivity,
        progressPercentage,
        totalActivities,
        completedActivities: completions.length,
      });
    } catch (error: any) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin seed endpoint - PUBLIC for easy database seeding
  app.post("/api/admin/seed", async (req, res) => {
    try {
      console.log("🌱 Starting database seed...");
      
      // Check if courses already exist
      const existingCourses = await storage.getAllCourses();
      if (existingCourses.length > 0) {
        return res.json({ 
          success: true, 
          message: `Base de datos ya tiene ${existingCourses.length} curso(s). No se requiere sembrar.`,
          courses: existingCourses.length
        });
      }

      // Import and run seed
      const { seedDatabase } = await import("../drizzle/seedCourses");
      await seedDatabase();
      
      const courses = await storage.getAllCourses();
      
      res.json({ 
        success: true, 
        message: "✅ Base de datos sembrada exitosamente",
        courses: courses.length
      });
    } catch (error: any) {
      console.error('Seed error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
