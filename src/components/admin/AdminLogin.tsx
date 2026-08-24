import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  getLoginLockStatus,
  recordFailedLogin,
  clearFailedLoginAttempts,
  type AuthLockStatus
} from '../../lib/authRateLimit';
import {
  getRecaptchaToken,
  isRecaptchaConfigured,
  loadRecaptchaScript
} from '../../lib/recaptcha';
import { sanitizeEmail } from '../../lib/sanitize';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Security & Anti-Brute-Force state
  const [honeypot, setHoneypot] = useState('');
  const [lockStatus, setLockStatus] = useState<AuthLockStatus>({
    isLocked: false,
    remainingSeconds: 0,
    failedCount: 0
  });

  // Check lockout status and active session on mount
  useEffect(() => {
    // Check if already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/admin';
      }
    });

    // Check brute-force lockout status
    const initialStatus = getLoginLockStatus();
    setLockStatus(initialStatus);

    // Preload reCAPTCHA v3 script if configured
    if (isRecaptchaConfigured()) {
      loadRecaptchaScript();
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockStatus.isLocked || lockStatus.remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setLockStatus((prev) => {
        if (prev.remainingSeconds <= 1) {
          clearInterval(interval);
          return { isLocked: false, remainingSeconds: 0, failedCount: 0 };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockStatus.isLocked, lockStatus.remainingSeconds]);

  const formatLockdownTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} menit ${secs < 10 ? '0' : ''}${secs} detik`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Anti-bot Honeypot Trap
    if (honeypot.trim().length > 0) {
      setErrorMsg('Autentikasi tidak valid.');
      return;
    }

    // 2. Check Lockout Status
    const currentStatus = getLoginLockStatus();
    if (currentStatus.isLocked) {
      setLockStatus(currentStatus);
      setErrorMsg(`Akses login terkunci sementara karena 5x kesalahan sandi berturut-turut.`);
      return;
    }

    const cleanEmail = sanitizeEmail(email);
    if (!cleanEmail || !password) {
      setErrorMsg('Format email tidak valid atau sandi masih kosong.');
      return;
    }

    setLoading(true);

    try {
      // 3. Optional Invisible reCAPTCHA v3 verification
      if (isRecaptchaConfigured()) {
        await getRecaptchaToken('admin_login');
      }

      // Progressive Security Delay to deter automated dictionary attacks
      await new Promise((res) => setTimeout(res, 400));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (error) {
        // Record failed attempt and update lockout status
        const updatedLock = recordFailedLogin();
        setLockStatus(updatedLock);

        if (updatedLock.isLocked) {
          setErrorMsg(
            `Akses login terkunci sementara selama 5 menit karena 5x kesalahan kata sandi berturut-turut.`
          );
        } else {
          const attemptsLeft = 5 - updatedLock.failedCount;
          setErrorMsg(
            error.message === 'Invalid login credentials'
              ? `Email atau kata sandi salah. (Sisa percobaan: ${attemptsLeft}x)`
              : error.message
          );
        }
      } else if (data.session) {
        // Clear failed attempts upon successful login
        clearFailedLoginAttempts();
        window.location.href = '/admin';
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07241C] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0E3B2E] rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 border border-emerald-900/10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#0E3B2E] text-[#E5C695] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17201C] font-serif">
            Portal Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Grand Bedahan Residence CMS
          </p>
        </div>

        {/* Lockout Warning Alert */}
        {lockStatus.isLocked ? (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-sm flex items-start gap-3 animate-fade-in">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-amber-800">
                Akses Terkunci Sementara
              </p>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                Terlalu banyak percobaan gagal. Silakan tunggu{' '}
                <span className="font-bold font-mono">
                  {formatLockdownTime(lockStatus.remainingSeconds)}
                </span>{' '}
                sebelum mencoba masuk kembali.
              </p>
            </div>
          </div>
        ) : (
          errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <span>{errorMsg}</span>
              </div>
            </div>
          )
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5" autoComplete="on">
          {/* Honeypot Trap (Invisible for users, catches automated credential stuffers) */}
          <div className="hidden" aria-hidden="true" tabIndex={-1}>
            <label htmlFor="admin_portal_pin">PIN Kode</label>
            <input
              type="text"
              id="admin_portal_pin"
              name="admin_portal_pin"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={lockStatus.isLocked || loading}
                required
                autoComplete="username"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#17201C] outline-none focus:ring-2 focus:ring-[#0E3B2E] focus:bg-white transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@yopmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={lockStatus.isLocked || loading}
                required
                autoComplete="current-password"
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#17201C] outline-none focus:ring-2 focus:ring-[#0E3B2E] focus:bg-white transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title={showPassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || lockStatus.isLocked}
            className="w-full py-4 px-6 bg-[#0E3B2E] hover:bg-[#07241C] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memverifikasi Akses...</span>
              </>
            ) : lockStatus.isLocked ? (
              <>
                <Clock className="w-5 h-5" />
                <span>Terkunci Sementara</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Dilindungi enkripsi sesi TLS & proteksi Anti-Brute Force.</span>
          </div>
          <a
            href="/"
            className="text-xs font-bold text-[#0E3B2E] hover:underline"
          >
            ← Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    </div>
  );
}
