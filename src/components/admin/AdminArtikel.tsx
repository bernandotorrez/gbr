import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ImageDropzone from './ImageDropzone';
import RichArticleEditor from './RichArticleEditor';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Save,
  Loader2,
  Eye,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export default function AdminArtikel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const initialForm = {
    id: '',
    judul: '',
    slug: '',
    excerpt: '',
    isi_konten: '',
    gambar_utama_url: '',
    kata_kunci_seo: '',
    status: 'publish' as 'draft' | 'publish',
    tanggal_publish: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .order('tanggal_publish', { ascending: false });

      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setFormData({
      id: item.id,
      judul: item.judul,
      slug: item.slug,
      excerpt: item.excerpt || '',
      isi_konten: item.isi_konten,
      gambar_utama_url: item.gambar_utama_url,
      kata_kunci_seo: item.kata_kunci_seo || '',
      status: item.status,
      tanggal_publish: item.tanggal_publish ? item.tanggal_publish.split('T')[0] : ''
    });
    setModalOpen(true);
  };

  const handleSlugGenerate = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: any = {
        judul: formData.judul.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt?.trim() || null,
        isi_konten: formData.isi_konten.trim(),
        gambar_utama_url: formData.gambar_utama_url.trim(),
        kata_kunci_seo: formData.kata_kunci_seo?.trim() || null,
        status: formData.status,
        tanggal_publish: formData.tanggal_publish ? new Date(formData.tanggal_publish).toISOString() : new Date().toISOString()
      };

      if (formData.id) {
        const { error } = await supabase
          .from('artikel')
          .update(payload)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('artikel')
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
        .from('artikel')
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
          <h2 className="text-xl font-bold text-[#17201C] font-serif">Katalog Artikel & Tips Properti</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola artikel edukasi, berita kawasan Sawangan Depok, dan panduan KPR.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#0E3B2E] hover:bg-[#07241C] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0E3B2E] animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-500">Memuat data artikel...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            Belum ada artikel di database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Foto & Judul Artikel</th>
                  <th className="px-6 py-4">Ringkasan / Excerpt</th>
                  <th className="px-6 py-4">Tanggal Publish</th>
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
                          src={item.gambar_utama_url}
                          alt={item.judul}
                          className="w-16 h-11 object-cover rounded-xl border border-gray-200 bg-gray-100"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-[#17201C] leading-snug">{item.judul}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">/artikel/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                      {item.excerpt || '-'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(item.tanggal_publish)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'publish' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Publish</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <XCircle className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/artikel/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-[#0E3B2E] hover:bg-emerald-50 rounded-xl transition-all"
                          title="Lihat Halaman"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-[#0B2E24] text-white">
              <h3 className="font-bold font-serif text-lg">
                {formData.id ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:text-[#E5C695]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Judul Artikel *</label>
                  <input
                    type="text"
                    required
                    value={formData.judul}
                    onChange={(e) => {
                      setFormData({ ...formData, judul: e.target.value });
                      if (!formData.id) handleSlugGenerate(e.target.value);
                    }}
                    placeholder="Contoh: 5 Tips Memilih Rumah Pertama"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="tips-memilih-rumah-pertama"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
              </div>

              <ImageDropzone
                label="Gambar Utama Artikel"
                required
                value={formData.gambar_utama_url}
                onChange={(url) => setFormData({ ...formData, gambar_utama_url: url })}
                folder="artikel"
                helpText="Tarik & lepas gambar banner artikel (WebP/JPG/PNG, Maks. 5 MB)"
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Ringkasan (Excerpt)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat 1-2 kalimat untuk meta description dan kartu blog..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Konten Artikel (Rich Text / Markdown / HTML) *
                </label>
                <RichArticleEditor
                  value={formData.isi_konten}
                  onChange={(val) => setFormData({ ...formData, isi_konten: val })}
                  placeholder="Tulis konten artikel di sini. Gunakan toolbar untuk memformat judul H2/H3, teks tebal, daftar poin, kutipan, gambar, atau beralih ke tab Pratinjau..."
                  minHeight="340px"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Kata Kunci SEO</label>
                  <input
                    type="text"
                    value={formData.kata_kunci_seo}
                    onChange={(e) => setFormData({ ...formData, kata_kunci_seo: e.target.value })}
                    placeholder="tips rumah, kpr depok"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tanggal Publish</label>
                  <input
                    type="date"
                    value={formData.tanggal_publish}
                    onChange={(e) => setFormData({ ...formData, tanggal_publish: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  >
                    <option value="publish">Publish (Tayang)</option>
                    <option value="draft">Draft (Simpan Sementara)</option>
                  </select>
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
                  <span>Simpan Artikel</span>
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
            <h3 className="text-lg font-bold text-[#17201C] font-serif">Hapus Artikel Ini?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Tindakan ini permanen dan artikel ini tidak akan lagi dapat diakses di blog website.
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
