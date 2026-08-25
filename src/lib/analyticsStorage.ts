import fs from 'node:fs';
import path from 'node:path';
import { supabase, isSupabaseConfigured } from './supabase';

export interface AnalyticsEvent {
  id?: string;
  path: string;
  referrer: string | null;
  device_type: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os?: string;
  event_type: string;
  event_data: Record<string, any>;
  session_id: string;
  created_at: string;
}

const STORAGE_FILE = path.resolve(process.cwd(), '.analytics_events.json');

// In-memory cache for speed
let inMemoryEvents: AnalyticsEvent[] = [];

// Initialize memory from local storage file on server start
try {
  if (fs.existsSync(STORAGE_FILE)) {
    const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
    inMemoryEvents = JSON.parse(raw);
  }
} catch {
  inMemoryEvents = [];
}

const saveToFile = () => {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(inMemoryEvents.slice(0, 2000), null, 2), 'utf-8');
  } catch (err) {
    // Ignore file write errors on read-only environments (e.g. Vercel serverless)
  }
};

export const recordAnalyticsEvent = async (event: Omit<AnalyticsEvent, 'created_at'>) => {
  const fullEvent: AnalyticsEvent = {
    ...event,
    created_at: new Date().toISOString()
  };

  // Add to memory buffer & file
  inMemoryEvents.unshift(fullEvent);
  if (inMemoryEvents.length > 2000) {
    inMemoryEvents.pop();
  }
  saveToFile();

  // Also write to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('page_views').insert([fullEvent]);
    } catch (err) {
      console.warn('Supabase page_views insert error:', err);
    }
  }

  return fullEvent;
};

export const getRealAnalyticsEvents = async (daysLimit: number = 30): Promise<AnalyticsEvent[]> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysLimit);
  const startIso = startDate.toISOString();

  // Try reading from Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .limit(2000);

      if (!error && data && data.length > 0) {
        return data as AnalyticsEvent[];
      }
    } catch (err) {
      // Fallback to local memory events
    }
  }

  // Fallback to local memory events filtered by date
  return inMemoryEvents.filter((e) => e.created_at >= startIso);
};
