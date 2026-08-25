import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    // Do not track admin portal
    if (pathname.startsWith('/admin')) return;

    // 1. Session Management
    let sessionId = sessionStorage.getItem('gbr_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem('gbr_session_id', sessionId);
    }

    // 2. Device & Platform Detection
    const width = window.innerWidth;
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || width < 768;
    const isTablet = /iPad|Tablet/i.test(ua) || (width >= 768 && width < 1024);
    const device_type = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    let browser = 'Chrome';
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Edge|Edg/i.test(ua)) browser = 'Edge';

    let os = 'Windows';
    if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/Linux/i.test(ua)) os = 'Linux';

    const sendEvent = (eventType: string, eventData: Record<string, any> = {}) => {
      try {
        const payload = {
          path: pathname,
          referrer: document.referrer || '',
          device_type,
          browser,
          os,
          event_type: eventType,
          event_data: {
            ...eventData,
            screen_size: `${window.innerWidth}x${window.innerHeight}`,
            page_title: document.title || 'Grand Bedahan Residence'
          },
          session_id: sessionId
        };

        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/track', blob);
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
          }).catch(() => {});
        }
      } catch {
        // Silent fallback
      }
    };

    // 3. Send initial pageview event
    sendEvent('pageview');

    // 4. Track dwell time / duration on page
    const startTime = Date.now();
    const sendDuration = () => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      if (durationSeconds > 2) {
        sendEvent('session_duration', { duration_seconds: durationSeconds });
      }
    };

    window.addEventListener('beforeunload', sendDuration);

    // 5. Global conversion click listener (WhatsApp & Maps)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const text = target.innerText?.trim() || '';

      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        sendEvent('whatsapp_click', {
          href,
          button_text: text,
          location: pathname
        });
      } else if (href.includes('maps.google') || href.includes('google.com/maps')) {
        sendEvent('maps_click', {
          href,
          button_text: text,
          location: pathname
        });
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    // 6. Custom Event listener for KPR simulations and form submissions
    const handleCustomAnalytics = (e: any) => {
      if (e.detail?.eventType) {
        sendEvent(e.detail.eventType, e.detail.data || {});
      }
    };

    window.addEventListener('gbr:analytics', handleCustomAnalytics);

    return () => {
      window.removeEventListener('beforeunload', sendDuration);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      window.removeEventListener('gbr:analytics', handleCustomAnalytics);
    };
  }, []);

  return null;
}
