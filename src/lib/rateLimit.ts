/**
 * Client-Side Sliding-Window Rate Limiter
 * Limits form submissions to prevent spam floods and bot abuse
 */

const STORAGE_KEY = 'gbr_lead_submissions';
const MAX_SUBMISSIONS = 3; // Maximum 3 submissions
const WINDOW_MS = 10 * 60 * 1000; // per 10 minutes
const COOLDOWN_AFTER_SUCCESS_MS = 30 * 1000; // Minimum 30s between consecutive submissions

interface SubmissionRecord {
  timestamps: number[];
  lastSubmit: number;
}

function getRecord(): SubmissionRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { timestamps: [], lastSubmit: 0 };
    return JSON.parse(raw);
  } catch {
    return { timestamps: [], lastSubmit: 0 };
  }
}

function saveRecord(record: SubmissionRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {}
}

export interface RateLimitStatus {
  allowed: boolean;
  reason?: string;
  cooldownSeconds?: number;
}

/**
 * Checks if the current client is allowed to submit a new lead
 */
export function checkRateLimit(): RateLimitStatus {
  const now = Date.now();
  const record = getRecord();

  // Check minimum cooldown between consecutive submissions
  if (record.lastSubmit && now - record.lastSubmit < COOLDOWN_AFTER_SUCCESS_MS) {
    const remaining = Math.ceil((COOLDOWN_AFTER_SUCCESS_MS - (now - record.lastSubmit)) / 1000);
    return {
      allowed: false,
      reason: `Mohon tunggu ${remaining} detik sebelum mengirim pesan berikutnya.`,
      cooldownSeconds: remaining
    };
  }

  // Filter timestamps within the sliding window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (validTimestamps.length >= MAX_SUBMISSIONS) {
    const oldest = validTimestamps[0];
    const remaining = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    const remainingMin = Math.ceil(remaining / 60);
    return {
      allowed: false,
      reason: `Batas pengiriman pesan tercapai (maksimal ${MAX_SUBMISSIONS} pesan per 10 menit). Mohon tunggu ${remainingMin} menit.`,
      cooldownSeconds: remaining
    };
  }

  return { allowed: true };
}

/**
 * Records a successful submission
 */
export function recordSubmission(): void {
  const now = Date.now();
  const record = getRecord();
  const validTimestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);
  validTimestamps.push(now);

  saveRecord({
    timestamps: validTimestamps,
    lastSubmit: now
  });
}
