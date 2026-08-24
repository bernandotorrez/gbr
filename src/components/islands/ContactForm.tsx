import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    email: '',
    pesan: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for MVP phase
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        nama: '',
        no_hp: '',
        email: '',
        pesan: ''
      });
      
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 relative">
      <h3 className="text-xl sm:text-2xl font-bold text-[#17201C] font-serif mb-6">
        Tinggalkan Pesan
      </h3>
      
      {isSuccess && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-[#0E3B2E] px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 text-[#0E3B2E] flex-shrink-0 mt-0.5" />
          <p className="font-medium">Terima kasih! Pesan Anda telah terkirim. Tim sales kami akan segera menghubungi WhatsApp Anda.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nama" className="block text-sm font-bold text-[#17201C] mb-2">Nama Lengkap</label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#0E3B2E] focus:border-[#0E3B2E] outline-none transition-colors bg-[#FAF9F6]/50 placeholder-gray-400 text-[#17201C]"
            placeholder="Masukkan Nama Lengkap Anda"
          />
        </div>
        
        <div>
          <label htmlFor="no_hp" className="block text-sm font-bold text-[#17201C] mb-2">Nomor WhatsApp</label>
          <input
            type="tel"
            id="no_hp"
            name="no_hp"
            value={formData.no_hp}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#0E3B2E] focus:border-[#0E3B2E] outline-none transition-colors bg-[#FAF9F6]/50 placeholder-gray-400 text-[#17201C]"
            placeholder="Contoh: 081215776218"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-[#17201C] mb-2">Email (Opsional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#0E3B2E] focus:border-[#0E3B2E] outline-none transition-colors bg-[#FAF9F6]/50 placeholder-gray-400 text-[#17201C]"
            placeholder="Alamat Email Anda"
          />
        </div>
        
        <div>
          <label htmlFor="pesan" className="block text-sm font-bold text-[#17201C] mb-2">Pesan Anda</label>
          <textarea
            id="pesan"
            name="pesan"
            rows={3}
            value={formData.pesan}
            onChange={handleChange}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#0E3B2E] focus:border-[#0E3B2E] outline-none transition-colors resize-none bg-[#FAF9F6]/50 placeholder-gray-400 text-[#17201C]"
            placeholder="Ada pertanyaan seputar tipe rumah atau jadwal survei?"
          ></textarea>
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
              <Send className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
