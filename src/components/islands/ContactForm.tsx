import { useState } from 'react';

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
    pesan: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'nama':
        if (!value.trim()) return 'Nama wajib diisi';
        if (value.trim().length < 3) return 'Nama minimal 3 karakter';
        if (value.trim().length > 100) return 'Nama maksimal 100 karakter';
        return undefined;
      case 'no_hp':
        if (!value.trim()) return 'Nomor WhatsApp wajib diisi';
        if (!/^[0-9]+$/.test(value.replace(/\s/g, ''))) return 'Nomor hanya boleh angka';
        if (value.replace(/\s/g, '').length < 10) return 'Nomor minimal 10 digit';
        if (value.replace(/\s/g, '').length > 15) return 'Nomor maksimal 15 digit';
        return undefined;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format email tidak valid';
        }
        return undefined;
      case 'pesan':
        if (!value.trim()) return 'Pesan wajib diisi';
        if (value.trim().length < 10) return 'Pesan minimal 10 karakter';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const getInputBorder = (name: keyof FormErrors) => {
    if (errors[name]) return 'border-red-400 focus:ring-red-400 focus:border-red-400';
    if (touched[name] && !errors[name] && formData[name].trim()) return 'border-emerald-400 focus:ring-emerald-400 focus:border-emerald-400';
    return 'border-gray-300 focus:ring-[#0E3B2E] focus:border-[#0E3B2E]';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ nama: '', no_hp: '', email: '', pesan: '' });
      setErrors({});
      setTouched({});
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1200);
  };

  const fieldBase = 'w-full px-4 py-3.5 border rounded-xl text-base outline-none transition-colors bg-[#FAF9F6]/50 placeholder-gray-400 text-[#17201C]';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 relative">
      <h3 className="text-xl sm:text-2xl font-bold text-[#17201C] font-serif mb-6">
        Tinggalkan Pesan
      </h3>

      {isSuccess && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-[#0E3B2E] px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm">
          <svg className="w-5 h-5 text-[#0E3B2E] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="font-medium">Terima kasih! Pesan Anda telah terkirim. Tim sales kami akan segera menghubungi WhatsApp Anda.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0E3B2E] hover:bg-[#07241C] active:scale-[0.99]'
          }`}
        >
          {isSubmitting ? (
            <span>Mengirim Pesan...</span>
          ) : (
            <>
              <span>Kirim Pesan</span>
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
