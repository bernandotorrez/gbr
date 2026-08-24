/**
 * Brute-Force & Credential Stuffing Protection for Admin Login
 */

const STORAGE_KEY = 'gbr_admin_login_security';
const MAX_FAILED_ATTEMPTS = 5; // Max 5 failed attempts before lockout
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout

interface AuthSecurityRecord {
  failedCount: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

function getRecord(): AuthSecurityRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { failedCount: 0, lockedUntil: null, lastAttempt: 0 };
    return JSON.parse(raw);
  } catch {
    return { failedCount: 0, lockedUntil: null, lastAttempt: 0 };
  }
}

function saveRecord(rec: AuthSecurityRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
  } catch {}
}

export interface AuthLockStatus {
  isLocked: boolean;
  remainingSeconds: number;
  failedCount: number;
}

/**
 * Check if admin login is currently locked due to too many failed attempts
 */
export function getLoginLockStatus(): AuthLockStatus {
  const now = Date.now();
  const rec = getRecord();

  if (rec.lockedUntil && now < rec.lockedUntil) {
    const remainingSeconds = Math.ceil((rec.lockedUntil - now) / 1000);
    return {
      isLocked: true,
      remainingSeconds,
      failedCount: rec.failedCount
    };
  }

  // If lockout expired, reset failed count
  if (rec.lockedUntil && now >= rec.lockedUntil) {
    saveRecord({ failedCount: 0, lockedUntil: null, lastAttempt: now });
    return { isLocked: false, remainingSeconds: 0, failedCount: 0 };
  }

  return {
    isLocked: false,
    remainingSeconds: 0,
    failedCount: rec.failedCount
  };
}

/**
 * Record a failed login attempt
 */
export function recordFailedLogin(): AuthLockStatus {
  const now = Date.now();
  const rec = getRecord();
  const newFailedCount = rec.failedCount + 1;

  let lockedUntil: number | null = null;
  if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
    lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  const updated: AuthSecurityRecord = {
    failedCount: newFailedCount,
    lockedUntil,
    lastAttempt: now
  };

  saveRecord(updated);

  return {
    isLocked: Boolean(lockedUntil),
    remainingSeconds: lockedUntil ? Math.ceil(LOCKOUT_DURATION_MS / 1000) : 0,
    failedCount: newFailedCount
  };
}

/**
 * Clear failed attempts upon successful login
 */
export function clearFailedLoginAttempts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
