import { useState, useEffect } from 'react';
import { submitLead } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { checkRateLimit, recordSubmission } from '../../lib/rateLimit';
import { getRecaptchaToken, isRecaptchaConfigured, loadRecaptchaScript } from '../../lib/recaptcha';
import { sanitizeText } from '../../lib/sanitize';
import { ChevronDown, Send, AlertTriangle, Check, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FormErrors {
  nama?: string;
  no_hp?: string;
  email?: string;
  pesan?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    email: '',
    tipe_rumah_diminati: '',
    pesan: ''
  });

  const [houseTypes, setHouseTypes] = useState<string[]>([
    'Tipe 36/72',
    'Tipe 45/72',
    'Tipe 36/60'
  ]);

  // Anti-bot Security State
  const [honeypot, setHoneypot] = useState('');
  const [formMountedAt] = useState<number>(Date.now());
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Preload reCAPTCHA v3 script in background if configured
    if (isRecaptchaConfigured()) {
      loadRecaptchaScript();
    }

    const fetchTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('tipe_rumah')
          .select('nama_tipe')
          .eq('is_active', true)
          .order('urutan_tampil', { ascending: true });

        if (!error && data && data.length > 0) {
          setHouseTypes(data.map(d => d.nama_tipe));
        }
      } catch {}
    };
    fetchTypes();
  }, []);

  const validate = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'nama':
        if (!value.trim()) return 'Nama wajib diisi';
        if (value.trim().length < 3) return 'Nama minimal 3 karakter';
        if (value.trim().length > 100) return 'Nama maksimal 100 karakter';
        return undefined;
      case 'no_hp':
        if (!value.trim()) return 'Nomor WhatsApp wajib diisi';
        if (!/^[0-9+]+$/.test(value.replace(/[\s-]/g, ''))) return 'Nomor hanya boleh angka';
        if (value.replace(/[\s-]/g, '').length < 10) return 'Nomor minimal 10 digit';
        if (value.replace(/[\s-]/g, '').length > 20) return 'Nomor maksimal 20 digit';
        return undefined;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format email tidak valid';
        }
        return undefined;
      case 'pesan':
        if (!value.trim()) return 'Pesan wajib diisi';
        if (value.trim().length < 5) return 'Pesan minimal 5 karakter';
        if (value.trim().length > 500) return 'Pesan maksimal 500 karakter';
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    let valid = true;
    for (const key of ['nama', 'no_hp', 'pesan'] as const) {
      const err = validate(key, formData[key]);
      if (err) { newErrors[key] = err; valid = false; }
    }
    if (formData.email.trim()) {
      const err = validate('email', formData.email);
      if (err) { newErrors.email = err; valid = false; }
    }
    setErrors(newErrors);
    setTouched({ nama: true, no_hp: true, email: true, pesan: true });
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Clear rate limit message upon user typing
    if (rateLimitError) setRateLimitError(null);

    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const getInputBorder = (name: keyof FormErrors) => {
    if (errors[name]) return 'border-red-400 focus:ring-red-400 focus:border-red-400';
    if (touched[name] && !errors[name] && formData[name].trim()) return 'border-emerald-400 focus:ring-emerald-400 focus:border-emerald-400';
    return 'border-gray-300 focus:ring-[#0E3B2E] focus:border-[#0E3B2E]';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);

    // 1. Anti-bot Honeypot Trap: If filled by automated crawler, silently discard
    if (honeypot.trim().length > 0) {
      setIsSuccess(true);
      return;
    }

    // 2. Anti-bot Speed Trap: Humans take at least 1.5 seconds to fill the form
    const duration = Date.now() - formMountedAt;
    if (duration < 1500) {
      console.warn('Spam trap triggered: Submission too fast');
      setIsSuccess(true);
      return;
    }

    // 3. Client-side Rate Limit Check
    const rateStatus = checkRateLimit();
    if (!rateStatus.allowed) {
      setRateLimitError(rateStatus.reason || 'Terlalu banyak percobaan. Silakan coba lagi nanti.');
      return;
    }

    // 4. Form Validation
    if (!validateAll()) return;

    setIsSubmitting(true);

    try {
      // 5. Invisible reCAPTCHA v3 Token
      let token: string | null = null;
      if (isRecaptchaConfigured()) {
        token = await getRecaptchaToken('submit_lead');
      }

      // 6. Submit with sanitized payload & verification token
      const res = await submitLead({
        nama: formData.nama,
        no_hp: formData.no_hp,
        email: formData.email || undefined,
        tipe_rumah_diminati: formData.tipe_rumah_diminati || undefined,
        pesan: formData.pesan,
        recaptcha_token: token
      });

      if (res.success) {
        // Record successful submission in rate limiter
        recordSubmission();

        setIsSuccess(true);
        setFormData({ nama: '', no_hp: '', email: '', tipe_rumah_diminati: '', pesan: '' });
        setErrors({});
        setTouched({});
        setTimeout(() => setIsSuccess(false), 7000);
      } else {
        alert(res.error || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kendala jaringan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldBase = 'w-full px-4 py-3.5 border rounded-xl text-base outline-none transition-colors bg-[#FAF9F6]/50 placeholder-gray-400 text-[#17201C]';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 relative">
      <h3 className="text-xl sm:text-2xl font-bold text-[#17201C] font-serif mb-6">
        Tinggalkan Pesan
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Anti-spam Bot Honeypot Field (Hidden from real users) */}
        <div className="hidden" aria-hidden="true" tabIndex={-1}>
          <label htmlFor="website_url">Website</label>
          <input
            type="text"
            id="website_url"
            name="website_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {/* Nama */}
        <div>
          <label htmlFor="nama" className="block text-sm font-bold text-[#17201C] mb-2">Nama Lengkap</label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            onBlur={handleBlur}
            minLength={3}
            maxLength={100}
            required
            className={`${fieldBase} ${getInputBorder('nama')}`}
            placeholder="Masukkan Nama Lengkap Anda"
          />
          {errors.nama && (
            <span className="mt-1.5 block text-xs text-red-500 font-medium">{errors.nama}</span>
          )}
        </div>

        {/* No HP */}
        <div>
          <label htmlFor="no_hp" className="block text-sm font-bold text-[#17201C] mb-2">Nomor WhatsApp</label>
          <input
            type="tel"
            id="no_hp"
            name="no_hp"
            value={formData.no_hp}
            onChange={handleChange}
            onBlur={handleBlur}
            minLength={10}
            maxLength={15}
            pattern="[0-9\s]+"
            required
            className={`${fieldBase} ${getInputBorder('no_hp')}`}
            placeholder="Contoh: 081215776218"
          />
          {errors.no_hp && (
            <span className="mt-1.5 block text-xs text-red-500 font-medium">{errors.no_hp}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-[#17201C] mb-2">Email (Opsional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={150}
            className={`${fieldBase} ${getInputBorder('email')}`}
            placeholder="Alamat Email Anda"
          />
          {errors.email && (
            <span className="mt-1.5 block text-xs text-red-500 font-medium">{errors.email}</span>
          )}
        </div>

        {/* Minat Tipe Rumah */}
        <div>
          <label htmlFor="tipe_rumah_diminati" className="block text-sm font-bold text-[#17201C] mb-2">
            Minat Tipe Rumah (Opsional)
          </label>
          <div className="relative">
            <select
              id="tipe_rumah_diminati"
              name="tipe_rumah_diminati"
              value={formData.tipe_rumah_diminati}
              onChange={handleChange}
              className={`${fieldBase} appearance-none cursor-pointer pr-10`}
            >
              <option value="">Pilih Tipe Rumah yang Diminati (Bisa Konsultasi Dulu)</option>
              {houseTypes.map((tipe, idx) => (
                <option key={idx} value={tipe}>{tipe}</option>
              ))}
              <option value="Belum Menentukan / Tanya-tanya Dulu">Belum Menentukan / Tanya-tanya Dulu</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Pesan */}
        <div>
          <label htmlFor="pesan" className="block text-sm font-bold text-[#17201C] mb-2">Pesan Anda</label>
          <textarea
            id="pesan"
            name="pesan"
            rows={3}
            value={formData.pesan}
            onChange={handleChange}
            onBlur={handleBlur}
            minLength={10}
            maxLength={500}
            required
            className={`${fieldBase} resize-none ${getInputBorder('pesan')}`}
            placeholder="Ada pertanyaan seputar tipe rumah atau jadwal survei?"
          />
          <div className="flex justify-between items-center mt-1">
            {errors.pesan ? (
              <span className="text-xs text-red-500 font-medium">{errors.pesan}</span>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">{formData.pesan.length}/500</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 flex justify-center items-center gap-2 rounded-xl text-white font-bold text-base shadow-md hover:shadow-lg transition-all ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0E3B2E] hover:bg-[#07241C] active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            <span>Mengirim Pesan...</span>
          ) : (
            <>
              <span>Kirim Pesan</span>
              <Send className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        {/* Rate Limit Alert Banner Under Button */}
        {rateLimitError && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-2xl flex items-start gap-3.5 shadow-sm animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-amber-900">Perhatian Pengiriman Pesan</p>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                {rateLimitError}
              </p>
            </div>
          </div>
        )}

        {/* Success Alert Banner Under Button */}
        {isSuccess && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-[#0E3B2E] rounded-2xl flex items-start gap-3.5 shadow-sm animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#0E3B2E] flex items-center gap-1.5">
                <span>Pesan Berhasil Terkirim!</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </p>
              <p className="text-xs text-emerald-900/90 mt-1 leading-relaxed">
                Terima kasih telah menghubungi Grand Bedahan Residence. Tim sales kami akan segera merespon dan menghubungi nomor WhatsApp Anda.
              </p>
            </div>
          </div>
        )}

        {/* Security & Privacy Assurance */}
        <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Data privasi Anda terenkripsi aman & terlindungi dari spam.</span>
        </div>
      </form>
    </div>
  );
}
