import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabaseAdmin, getSupabaseClient } from "./lib/supabase";
import { insertLevelSchema, insertProgressEventSchema, insertWaitlistEmailSchema } from "@shared/schema";
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
  app.get("/api/profile", authenticateUser, async (req, res) => {
    try {
      const profile = await storage.getProfile(req.user.id);
      res.json(profile);
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/profile", authenticateUser, async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.user.id, req.body);
      res.json(profile);
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Level routes
  app.get("/api/levels", async (req, res) => {
    try {
      const { track } = req.query;
      const levels = track 
        ? await storage.getLevelsByTrack(track as string)
        : await storage.getAllLevels();
      res.json(levels);
    } catch (error: any) {
      console.error('Get levels error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/levels/:track/:number", async (req, res) => {
    try {
      const { track, number } = req.params;
      const level = await storage.getLevel(track, parseInt(number));
      
      if (!level) {
        return res.status(404).json({ error: 'Level not found' });
      }
      
      res.json(level);
    } catch (error: any) {
      console.error('Get level error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/levels", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const validated = insertLevelSchema.parse(req.body);
      const level = await storage.createLevel(validated);
      res.json(level);
    } catch (error: any) {
      console.error('Create level error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/levels/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      const level = await storage.updateLevel(req.params.id, req.body);
      res.json(level);
    } catch (error: any) {
      console.error('Update level error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/levels/:id", authenticateUser, requireAdmin, async (req, res) => {
    try {
      await storage.deleteLevel(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete level error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Progress routes
  app.get("/api/progress", authenticateUser, async (req, res) => {
    try {
      const { track } = req.query;
      const progress = track
        ? await storage.getUserProgressByTrack(req.user.id, track as string)
        : await storage.getUserProgress(req.user.id);
      res.json(progress);
    } catch (error: any) {
      console.error('Get progress error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/progress/streak", authenticateUser, async (req, res) => {
    try {
      const streak = await storage.getUserStreak(req.user.id);
      res.json({ streak });
    } catch (error: any) {
      console.error('Get streak error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/progress/:track/:number", authenticateUser, async (req, res) => {
    try {
      const { track, number } = req.params;
      const progress = await storage.getUserLevelProgress(
        req.user.id,
        track,
        parseInt(number)
      );
      res.json(progress);
    } catch (error: any) {
      console.error('Get level progress error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/progress", authenticateUser, async (req, res) => {
    try {
      const validated = insertProgressEventSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const event = await storage.createProgressEvent(validated);
      res.json(event);
    } catch (error: any) {
      console.error('Create progress error:', error);
      res.status(400).json({ error: error.message });
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

  // Dashboard stats
  app.get("/api/dashboard/stats", authenticateUser, async (req, res) => {
    try {
      const streak = await storage.getUserStreak(req.user.id);
      const allProgress = await storage.getUserProgress(req.user.id);
      
      const lastActivity = allProgress.length > 0 
        ? allProgress[0].createdAt 
        : null;

      // Calculate overall progress percentage
      const englishLevels = await storage.getLevelsByTrack('english');
      const spanishLevels = await storage.getLevelsByTrack('spanish');
      const totalLevels = englishLevels.length + spanishLevels.length;
      
      const completedLevels = new Set();
      for (const event of allProgress) {
        const key = `${event.track}-${event.levelNumber}`;
        const levelProgress = await storage.getUserLevelProgress(
          req.user.id,
          event.track,
          event.levelNumber
        );
        if (levelProgress.quizletViewed && levelProgress.videoWatched) {
          completedLevels.add(key);
        }
      }

      const progressPercentage = totalLevels > 0 
        ? Math.round((completedLevels.size / totalLevels) * 100)
        : 0;

      res.json({
        streak,
        lastActivity,
        progressPercentage,
        totalLevels,
        completedLevels: completedLevels.size,
      });
    } catch (error: any) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
