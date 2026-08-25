import type { APIRoute } from 'astro';
import { getPaginatedActivities } from '../../../lib/analyticsStorage';

export const GET: APIRoute = async ({ url }) => {
  try {
    const range = url.searchParams.get('range') || '7d';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '20', 10)));
    const days = range === 'today' ? 1 : range === '30d' ? 30 : range === 'all' ? 90 : 7;

    const result = await getPaginatedActivities(days, page, limit);

    return new Response(
      JSON.stringify({
        success: true,
        ...result
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
