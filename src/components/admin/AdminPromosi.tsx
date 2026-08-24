import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ImageDropzone from './ImageDropzone';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Save,
  Loader2,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export default function AdminPromosi() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const defaultBenefits = [
    {
      title: "Subsidi Cicilan KPR selama 2 TAHUN",
      desc: "Meringankan cicilan bulanan Anda (promo sebelumnya hanya 1 tahun).",
      highlight: true,
    },
    {
      title: "Free Exhaust Fan",
      desc: "Sirkulasi udara dapur & ruangan tetap bersih, nyaman, dan sejuk.",
      highlight: false,
    },
    {
      title: "Free Lampu Taman",
      desc: "Pencahayaan luar rumah yang asri, estetik, dan elegan.",
      highlight: false,
    },
    {
      title: "Free Mesin Air & Toren 500 Liter",
      desc: "Suplai air bersih siap pakai langsung dari hari pertama Anda menempati rumah.",
      highlight: false,
    },
    {
      title: "Free Instalasi AC di 2 Kamar Tidur",
      desc: "Jalur instalasi pipa & kelistrikan AC siap pasang tanpa perlu membobok dinding.",
      highlight: false,
    },
  ];

  const initialForm = {
    id: '',
    judul: '',
    sub_judul: 'Paket Berkah Hunian Idaman',
    tagline_badge: 'PERIODE TERBATAS',
    deskripsi: '',
    gambar_url: '',
    rincian_keuntungan: defaultBenefits,
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'aktif' as 'aktif' | 'nonaktif',
    urutan_tampil: 1
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('promosi')
        .select('*')
        .order('urutan_tampil', { ascending: true });

      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching promos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setFormData({
      ...initialForm,
      urutan_tampil: items.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    let benefits = defaultBenefits;
    if (Array.isArray(item.rincian_keuntungan) && item.rincian_keuntungan.length > 0) {
      benefits = item.rincian_keuntungan;
    } else if (typeof item.rincian_keuntungan === 'string') {
      try {
        const parsed = JSON.parse(item.rincian_keuntungan);
        if (Array.isArray(parsed) && parsed.length > 0) benefits = parsed;
      } catch {}
    }

    setFormData({
      id: item.id,
      judul: item.judul,
      sub_judul: item.sub_judul || 'Paket Berkah Hunian Idaman',
      tagline_badge: item.tagline_badge || 'PERIODE TERBATAS',
      deskripsi: item.deskripsi,
      gambar_url: item.gambar_url,
      rincian_keuntungan: benefits,
      tanggal_mulai: item.tanggal_mulai || '',
      tanggal_selesai: item.tanggal_selesai || '',
      status: item.status,
      urutan_tampil: item.urutan_tampil
    });
    setModalOpen(true);
  };

  const handleBenefitChange = (index: number, field: 'title' | 'desc' | 'highlight', value: any) => {
    const updated = [...formData.rincian_keuntungan];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, rincian_keuntungan: updated });
  };

  const addBenefitItem = () => {
    setFormData({
      ...formData,
      rincian_keuntungan: [
        ...formData.rincian_keuntungan,
        { title: '', desc: '', highlight: false }
      ]
    });
  };

  const removeBenefitItem = (index: number) => {
    const updated = formData.rincian_keuntungan.filter((_, i) => i !== index);
    setFormData({ ...formData, rincian_keuntungan: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: any = {
        judul: formData.judul.trim(),
        sub_judul: formData.sub_judul.trim() || 'Paket Berkah Hunian Idaman',
        tagline_badge: formData.tagline_badge.trim() || 'PERIODE TERBATAS',
        deskripsi: formData.deskripsi.trim(),
        rincian_keuntungan: formData.rincian_keuntungan.filter((b) => b.title.trim()),
        gambar_url: formData.gambar_url.trim(),
        tanggal_mulai: formData.tanggal_mulai || null,
        tanggal_selesai: formData.tanggal_selesai || null,
        status: formData.status,
        urutan_tampil: Number(formData.urutan_tampil)
      };

      if (formData.id) {
        const { error } = await supabase
          .from('promosi')
          .update(payload)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('promosi')
          .insert([payload]);
        if (error) throw error;
      }

      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      const { error } = await supabase
        .from('promosi')
        .delete()
        .eq('id', deleteModalId);
      if (error) throw error;
      setDeleteModalId(null);
      fetchItems();
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/70 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#17201C] font-serif">Daftar Promosi & Diskon</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola banner promo subsidi KPR, hadiah langsung, dan diskon booking fee.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#0E3B2E] hover:bg-[#07241C] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Promo Baru</span>
        </button>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0E3B2E] animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-500">Memuat data promosi...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            Belum ada promosi di database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Banner & Judul Promo</th>
                  <th className="px-6 py-4">Periode Promo</th>
                  <th className="px-6 py-4">Urutan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.gambar_url}
                          alt={item.judul}
                          className="w-16 h-11 object-cover rounded-xl border border-gray-200 bg-gray-100"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-[#17201C] truncate">{item.judul}</p>
                          <p className="text-xs text-gray-400 truncate">{item.deskripsi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(item.tanggal_mulai)} s/d {formatDate(item.tanggal_selesai)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-xs">{item.urutan_tampil}</td>
                    <td className="px-6 py-4">
                      {item.status === 'aktif' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <XCircle className="w-3 h-3" />
                          <span>Nonaktif</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModalId(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-[#0B2E24] text-white">
              <h3 className="font-bold font-serif text-lg">
                {formData.id ? 'Edit Promosi' : 'Buat Promosi Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:text-[#E5C695]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Judul Promosi *</label>
                  <input
                    type="text"
                    required
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    placeholder="Contoh: Promo Eksklusif Grand Bedahan"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Program (Sub-Judul)</label>
                  <input
                    type="text"
                    value={formData.sub_judul}
                    onChange={(e) => setFormData({ ...formData, sub_judul: e.target.value })}
                    placeholder="Contoh: Paket Berkah Hunian Idaman"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Badge Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline_badge}
                    onChange={(e) => setFormData({ ...formData, tagline_badge: e.target.value })}
                    placeholder="Contoh: PERIODE TERBATAS"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
              </div>

              <ImageDropzone
                label="Banner Visual Promosi (Kiri)"
                required
                value={formData.gambar_url}
                onChange={(url) => setFormData({ ...formData, gambar_url: url })}
                folder="promosi"
                helpText="Tarik & lepas banner promo landscape (WebP/JPG/PNG, Maks. 5 MB)"
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Deskripsi Ringkas Promosi *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Dapatkan paket penawaran terbatas dan berbagai bonus istimewa..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                />
              </div>

              {/* Rincian Keuntungan Promo Builder */}
              <div className="p-5 bg-gray-50/90 rounded-2xl border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#0E3B2E] uppercase tracking-wider">
                      🎁 Rincian Keuntungan & Bonus Promo (Tampil di Kolom Kanan)
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Kelola daftar poin bonus yang didapatkan pembeli saat booking unit.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addBenefitItem}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0E3B2E] text-white text-xs font-bold rounded-lg hover:bg-[#07241C] transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Keuntungan</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {formData.rincian_keuntungan.map((benefit, index) => (
                    <div
                      key={index}
                      className={`p-3.5 rounded-xl border transition-all ${
                        benefit.highlight
                          ? 'bg-emerald-50/80 border-emerald-300'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0E3B2E] text-white text-[10px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            required
                            value={benefit.title}
                            onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                            placeholder="Judul Bonus (Contoh: Free Exhaust Fan)"
                            className="font-bold text-xs text-gray-800 bg-transparent border-b border-gray-300 focus:border-[#0E3B2E] outline-none px-1 py-0.5 w-64 sm:w-80"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-emerald-800 font-bold">
                            <input
                              type="checkbox"
                              checked={benefit.highlight}
                              onChange={(e) => handleBenefitChange(index, 'highlight', e.target.checked)}
                              className="rounded text-[#0E3B2E]"
                            />
                            <span>Highlight</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeBenefitItem(index)}
                            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Hapus Keuntungan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={benefit.desc}
                        onChange={(e) => handleBenefitChange(index, 'desc', e.target.value)}
                        placeholder="Penjelasan ringkas bonus (Contoh: Sirkulasi udara dapur tetap bersih dan sejuk)..."
                        className="w-full text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-[#0E3B2E]"
                      />
                    </div>
                  ))}

                  {formData.rincian_keuntungan.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400 border border-dashed border-gray-300 rounded-xl">
                      Belum ada poin keuntungan. Klik <strong>+ Tambah Keuntungan</strong> di atas.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  >
                    <option value="aktif">Aktif (Tampil di Website)</option>
                    <option value="nonaktif">Nonaktif (Draft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Urutan Tampil</label>
                  <input
                    type="number"
                    value={formData.urutan_tampil}
                    onChange={(e) => setFormData({ ...formData, urutan_tampil: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0E3B2E] hover:bg-[#07241C] text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan Promo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17201C] font-serif">Hapus Promosi Ini?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Tindakan ini permanen dan banner promo ini tidak akan lagi tampil di halaman website.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
