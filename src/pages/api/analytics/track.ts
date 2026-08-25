import type { APIRoute } from 'astro';
import { recordAnalyticsEvent } from '../../../lib/analyticsStorage';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      path = '/',
      referrer = '',
      device_type = 'desktop',
      browser = 'Unknown',
      os = 'Unknown',
      event_type = 'pageview',
      event_data = {},
      session_id = ''
    } = body;

    // Ignore admin pages from visitor tracking
    if (typeof path === 'string' && path.startsWith('/admin')) {
      return new Response(JSON.stringify({ success: true, ignored: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const saved = await recordAnalyticsEvent({
      path,
      referrer: referrer || null,
      device_type: (device_type === 'mobile' || device_type === 'tablet' ? device_type : 'desktop'),
      browser,
      os,
      event_type,
      event_data,
      session_id
    });

    return new Response(JSON.stringify({ success: true, data: saved }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error?.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
