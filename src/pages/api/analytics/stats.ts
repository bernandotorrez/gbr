import type { APIRoute } from 'astro';
import { getRealAnalyticsEvents, type AnalyticsEvent } from '../../../lib/analyticsStorage';

export const GET: APIRoute = async ({ url }) => {
  try {
    const range = url.searchParams.get('range') || '7d';
    const days = range === 'today' ? 1 : range === '30d' ? 30 : range === 'all' ? 90 : 7;

    // Fetch real recorded events
    const allEvents = await getRealAnalyticsEvents(days);

    // 1. Generate date buckets for the selected range
    const dateMap = new Map<string, { label: string; views: number; visitors: Set<string>; whatsapp: number; kpr: number }>();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: days > 14 ? 'numeric' : 'short'
      });

      dateMap.set(dateStr, {
        label,
        views: 0,
        visitors: new Set<string>(),
        whatsapp: 0,
        kpr: 0
      });
    }

    // 2. Aggregate real events into date buckets
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    const referrerMap = new Map<string, number>();
    const pageMap = new Map<string, number>();

    let totalDurationSum = 0;
    let durationCount = 0;

    allEvents.forEach((ev: AnalyticsEvent) => {
      const dateStr = ev.created_at?.split('T')[0];
      if (dateStr && dateMap.has(dateStr)) {
        const bucket = dateMap.get(dateStr)!;

        if (ev.event_type === 'pageview') {
          bucket.views += 1;
          if (ev.session_id) bucket.visitors.add(ev.session_id);
        } else if (ev.event_type === 'whatsapp_click') {
          bucket.whatsapp += 1;
        } else if (ev.event_type === 'kpr_simulasi') {
          bucket.kpr += 1;
        }
      }

      // Device aggregation
      if (ev.device_type === 'mobile') deviceCounts.mobile += 1;
      else if (ev.device_type === 'tablet') deviceCounts.tablet += 1;
      else deviceCounts.desktop += 1;

      // Page aggregation (for pageview events)
      if (ev.event_type === 'pageview' && ev.path) {
        const p = ev.path;
        pageMap.set(p, (pageMap.get(p) || 0) + 1);
      }

      // Referrer aggregation
      if (ev.referrer) {
        let refCategory = 'Lainnya';
        const refLower = ev.referrer.toLowerCase();
        if (refLower.includes('google')) refCategory = 'Google Search';
        else if (refLower.includes('instagram')) refCategory = 'Instagram';
        else if (refLower.includes('whatsapp') || refLower.includes('wa.me')) refCategory = 'WhatsApp Share';
        else if (refLower.includes('facebook') || refLower.includes('fb.com')) refCategory = 'Facebook';
        else if (refLower.includes('tiktok')) refCategory = 'TikTok';
        else refCategory = 'Website Eksternal';

        referrerMap.set(refCategory, (referrerMap.get(refCategory) || 0) + 1);
      } else {
        referrerMap.set('Direct / Akses Langsung', (referrerMap.get('Direct / Akses Langsung') || 0) + 1);
      }

      // Session duration
      if (ev.event_type === 'session_duration' && ev.event_data?.duration_seconds) {
        totalDurationSum += Number(ev.event_data.duration_seconds);
        durationCount += 1;
      }
    });

    // Format chart points
    const chartData = Array.from(dateMap.entries()).map(([dateStr, val]) => ({
      dateStr,
      label: val.label,
      views: val.views,
      visitors: val.visitors.size,
      whatsapp: val.whatsapp,
      kpr: val.kpr
    }));

    const totalViews = chartData.reduce((acc, curr) => acc + curr.views, 0);
    const uniqueSessionSet = new Set<string>();
    allEvents.forEach((e) => {
      if (e.session_id) uniqueSessionSet.add(e.session_id);
    });
    const totalVisitors = uniqueSessionSet.size || (totalViews > 0 ? totalViews : 0);
    const totalWaClicks = chartData.reduce((acc, curr) => acc + curr.whatsapp, 0);
    const totalKprRuns = chartData.reduce((acc, curr) => acc + curr.kpr, 0);

    const avgSeconds = durationCount > 0 ? Math.round(totalDurationSum / durationCount) : 120;
    const avgMin = Math.floor(avgSeconds / 60);
    const avgSec = avgSeconds % 60;
    const avgDuration = `${avgMin}m ${avgSec}s`;

    const conversionRate = totalVisitors > 0
      ? `${(((totalWaClicks + totalKprRuns) / totalVisitors) * 100).toFixed(1)}%`
      : '0.0%';

    // 3. Real Device Breakdown
    const totalDeviceEvents = deviceCounts.mobile + deviceCounts.desktop + deviceCounts.tablet || 1;
    const devices = [
      {
        name: 'Mobile (Smartphone)',
        percentage: Math.round((deviceCounts.mobile / totalDeviceEvents) * 100) || 0,
        count: deviceCounts.mobile,
        color: '#0E3B2E'
      },
      {
        name: 'Desktop / Laptop',
        percentage: Math.round((deviceCounts.desktop / totalDeviceEvents) * 100) || 0,
        count: deviceCounts.desktop,
        color: '#047857'
      },
      {
        name: 'Tablet / iPad',
        percentage: Math.round((deviceCounts.tablet / totalDeviceEvents) * 100) || 0,
        count: deviceCounts.tablet,
        color: '#E5C695'
      }
    ];

    // 4. Real Traffic Sources
    const totalRefEvents = Array.from(referrerMap.values()).reduce((a, b) => a + b, 0) || 1;
    const sources = Array.from(referrerMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([source, count]) => ({
        source,
        percentage: Math.round((count / totalRefEvents) * 100),
        count,
        icon: source.includes('Google') ? 'search' : source.includes('Direct') ? 'globe' : source.includes('Instagram') ? 'camera' : 'message'
      }));

    if (sources.length === 0) {
      sources.push({ source: 'Direct / Akses Langsung', percentage: 100, count: totalViews, icon: 'globe' });
    }

    // 5. Real Top Pages
    const pageTitleMap: Record<string, string> = {
      '/': 'Beranda (Landing Page)',
      '/tipe-rumah': 'Katalog Semua Tipe Rumah',
      '/tipe-rumah/tipe-36-72': 'Detail Unit Tipe 36/72',
      '/tipe-rumah/tipe-45-72': 'Detail Unit Tipe 45/72',
      '/artikel': 'Pusat Artikel & Berita Properti'
    };

    const topPages = Array.from(pageMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([p, views]) => ({
        path: p,
        title: pageTitleMap[p] || `Halaman ${p}`,
        views,
        percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0
      }));

    // 6. Real Recent Live Activities
    const recentActivities = allEvents.slice(0, 10).map((ev) => {
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
    });

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          totalViews,
          totalVisitors,
          totalWaClicks,
          totalKprRuns,
          avgDuration,
          conversionRate
        },
        chartData,
        devices,
        sources,
        topPages,
        recentActivities
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error?.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
