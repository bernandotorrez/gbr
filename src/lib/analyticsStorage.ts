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

export interface ActivityItem {
  path: string;
  title: string;
  device: string;
  time: string;
  location: string;
  event: string;
  eventText: string;
}

export const pageTitleMap: Record<string, string> = {
  '/': 'Beranda (Landing Page)',
  '/tipe-rumah': 'Katalog Semua Tipe Rumah',
  '/tipe-rumah/tipe-36-72': 'Detail Unit Tipe 36/72',
  '/tipe-rumah/tipe-45-72': 'Detail Unit Tipe 45/72',
  '/artikel': 'Pusat Artikel & Berita Properti'
};

export const formatActivityEvent = (ev: AnalyticsEvent): ActivityItem => {
  let eventText = 'Membuka Halaman';
  if (ev.event_type === 'whatsapp_click') {
    eventText = `Klik WhatsApp (${ev.event_data?.button_text || 'Konsultasi'})`;
  } else if (ev.event_type === 'kpr_simulasi') {
    eventText = `Simulasi KPR (${ev.event_data?.tipe_rumah || 'Unit'}, DP: ${ev.event_data?.dp_persen || 0}%)`;
  } else if (ev.event_type === 'maps_click') {
    eventText = 'Membuka Petunjuk Arah Google Maps';
  } else if (ev.event_type === 'session_duration') {
    eventText = `Sesi Aktif (${ev.event_data?.duration_seconds || 0} detik)`;
  }

  const diffSec = Math.max(1, Math.round((Date.now() - new Date(ev.created_at).getTime()) / 1000));
  let timeStr = 'Baru saja';
  if (diffSec >= 3600) timeStr = `${Math.floor(diffSec / 3600)} jam lalu`;
  else if (diffSec >= 60) timeStr = `${Math.floor(diffSec / 60)} menit lalu`;
  else timeStr = `${diffSec} detik lalu`;

  return {
    path: ev.path,
    title: pageTitleMap[ev.path] || ev.path,
    device: `${ev.device_type === 'mobile' ? 'Mobile' : ev.device_type === 'tablet' ? 'Tablet' : 'Desktop'} (${ev.os || 'OS'} ${ev.browser || 'Browser'})`,
    time: timeStr,
    location: 'Pengunjung Web',
    event: ev.event_type,
    eventText
  };
};

export const getPaginatedActivities = async (
  daysLimit: number = 30,
  page: number = 1,
  limit: number = 20
): Promise<{
  activities: ActivityItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysLimit);
  const startIso = startDate.toISOString();
  const offset = (page - 1) * limit;

  // Try reading from Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { data, count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact' })
        .gte('created_at', startIso)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (!error && data) {
        const total = count ?? data.length;
        return {
          activities: data.map(formatActivityEvent),
          total,
          page,
          limit,
          hasMore: offset + limit < total
        };
      }
    } catch (err) {
      // Fallback to local memory events
    }
  }

  // Fallback to local memory events
  const filtered = inMemoryEvents.filter((e) => e.created_at >= startIso);
  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit);

  return {
    activities: sliced.map(formatActivityEvent),
    total,
    page,
    limit,
    hasMore: offset + limit < total
  };
};
