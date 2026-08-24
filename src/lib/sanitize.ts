/**
 * Input sanitization utility for preventing XSS, HTML/Script Injection, and malicious payloads
 */

/**
 * Strips all HTML tags and dangerous characters from a string
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Remove null bytes and invisible control characters
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
    // Remove script/style tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove any remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Escape essential special characters
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

/**
 * Strict sanitizer for phone numbers (only allows digits, removes spaces and dashes)
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^0-9+]/g, '').trim();
}

/**
 * Strict sanitizer for emails
 */
export function sanitizeEmail(email?: string): string {
  if (!email || typeof email !== 'string') return '';
  const cleaned = email.trim().toLowerCase().slice(0, 150);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleaned) ? cleaned : '';
}
