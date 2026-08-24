/**
 * Google reCAPTCHA v3 invisible verification helper
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY || '';

/**
 * Checks if reCAPTCHA is configured in the environment
 */
export function isRecaptchaConfigured(): boolean {
  return Boolean(RECAPTCHA_SITE_KEY) && !RECAPTCHA_SITE_KEY.includes('placeholder');
}

/**
 * Loads reCAPTCHA script dynamically
 */
export function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve) => {
    if (!isRecaptchaConfigured() || typeof window === 'undefined') {
      return resolve();
    }

    if (document.getElementById('recaptcha-script')) {
      return resolve();
    }

    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Gracefully proceed even if blocked by adblock
    document.head.appendChild(script);
  });
}

/**
 * Executes invisible reCAPTCHA v3 to obtain verification token
 */
export async function getRecaptchaToken(action = 'submit_lead'): Promise<string | null> {
  if (!isRecaptchaConfigured() || typeof window === 'undefined') {
    return null;
  }

  try {
    await loadRecaptchaScript();

    return new Promise((resolve) => {
      if (!window.grecaptcha) {
        return resolve(null);
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action });
          resolve(token);
        } catch (err) {
          console.warn('reCAPTCHA execution error:', err);
          resolve(null);
        }
      });
    });
  } catch (err) {
    console.warn('reCAPTCHA load error:', err);
    return null;
  }
}
