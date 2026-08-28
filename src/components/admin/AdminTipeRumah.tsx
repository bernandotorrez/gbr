import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatRupiah } from '../../data/tipeRumah';
import ImageDropzone from './ImageDropzone';
import MultiImageDropzone from './MultiImageDropzone';
import {
  Home,
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
  Wrench,
  Zap,
  Droplet,
  Car,
  Layers,
  Maximize2,
  Bed,
  Bath,
  Store
} from 'lucide-react';

export default function AdminTipeRumah() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const defaultSpesifikasi = {
    kategori: 'rumah',
    dimensi: '',
    pondasi: 'Batu Kali',
    struktur: 'Beton Bertulang',
    dinding: 'Bata Ringan (Hebel) Plester Aci + Cat Weatherproof',
    lantai: 'Granit Tile 60x60 cm',
    atap: 'Rangka Baja Ringan + Genteng Beton Flat',
    kusen_pintu: 'Kusen Aluminium & Pintu Solid Engineering',
    sanitair: 'Kloset Duduk Standar + Hand Shower',
    listrik_air: '1.300 VA / Sumur Bor + Pompa Listrik'
  };

  const defaultFitur = [
    'Sertifikat Hak Milik (SHM) & IMB/PBG Sudah Pecah',
    'Row Jalan Perumahan Lebar 6-7 Meter Paving Block',
    'One Gate System dengan Keamanan CCTV 24 Jam',
    'Taman Terbuka Hijau & Area Bermain Ramah Anak',
    'Lokasi Strategis Bebas Banjir di Pusat Kota Depok'
  ];

  const initialForm = {
    id: '',
    nama_tipe: '',
    slug: '',
    tagline: '',
    kategori: 'rumah',
    dimensi: '',
    ukuran_tanah: 72,
    ukuran_bangunan: 36,
    jumlah_kamar_tidur: 2,
    jumlah_kamar_mandi: 1,
    jumlah_carport: 1,
    jumlah_lantai: 1,
    daya_listrik: '1.300 VA',
    sumber_air: 'Sumur Bor + Pompa Listrik',
    harga: 544000000,
    cicilan_mulai: 'Rp 3,4 Juta / bulan',
    deskripsi: '',
    deskripsi_lengkap_text: '',
    foto_url: '',
    galeri: [] as string[],
    denah_url: '',
    fitur_text: defaultFitur.join('\n'),
    spesifikasi: defaultSpesifikasi,
    urutan_tampil: 1,
    is_active: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('tipe_rumah')
        .select('*')
        .order('urutan_tampil', { ascending: true });

      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching house types:', err);
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
    const isCommercial = 
      item.kategori === 'ruko' || 
      item.kategori === 'kios' || 
      item.spesifikasi?.kategori === 'ruko' || 
      item.spesifikasi?.kategori === 'kios' || 
      item.slug.includes('ruko') || 
      item.slug.includes('kios') || 
      item.nama_tipe.toLowerCase().includes('ruko') || 
      item.nama_tipe.toLowerCase().includes('kios');

    const itemKategori = item.kategori || item.spesifikasi?.kategori || (isCommercial ? 'kios' : 'rumah');
    const itemDimensi = item.dimensi || item.spesifikasi?.dimensi || (isCommercial ? '4m x 6.2m' : '');

    const itemFitur = Array.isArray(item.fitur) && item.fitur.length > 0 ? item.fitur : defaultFitur;
    const itemDeskripsiLengkap = Array.isArray(item.deskripsi_lengkap) && item.deskripsi_lengkap.length > 0
      ? item.deskripsi_lengkap.join('\n\n')
      : item.deskripsi || '';

    const itemSpesifikasi = {
      kategori: itemKategori,
      dimensi: itemDimensi,
      pondasi: item.spesifikasi?.pondasi || defaultSpesifikasi.pondasi,
      struktur: item.spesifikasi?.struktur || defaultSpesifikasi.struktur,
      dinding: item.spesifikasi?.dinding || defaultSpesifikasi.dinding,
      lantai: item.spesifikasi?.lantai || defaultSpesifikasi.lantai,
      atap: item.spesifikasi?.atap || defaultSpesifikasi.atap,
      kusen_pintu: item.spesifikasi?.kusen_pintu || defaultSpesifikasi.kusen_pintu,
      sanitair: item.spesifikasi?.sanitair || defaultSpesifikasi.sanitair,
      listrik_air: item.spesifikasi?.listrik_air || `${item.daya_listrik || '1.300 VA'} / ${item.sumber_air || 'Sumur Bor + Pompa Listrik'}`
    };

    setFormData({
      id: item.id,
      nama_tipe: item.nama_tipe,
      slug: item.slug,
      tagline: item.tagline || '',
      kategori: itemKategori,
      dimensi: itemDimensi,
      ukuran_tanah: Number(item.ukuran_tanah),
      ukuran_bangunan: Number(item.ukuran_bangunan),
      jumlah_kamar_tidur: item.jumlah_kamar_tidur,
      jumlah_kamar_mandi: item.jumlah_kamar_mandi,
      jumlah_carport: item.jumlah_carport,
      jumlah_lantai: item.jumlah_lantai,
      daya_listrik: item.daya_listrik || '1.300 VA',
      sumber_air: item.sumber_air || 'Sumur Bor + Pompa Listrik',
      harga: Number(item.harga),
      cicilan_mulai: item.cicilan_mulai || '',
      deskripsi: item.deskripsi,
      deskripsi_lengkap_text: itemDeskripsiLengkap,
      foto_url: item.foto_url,
      galeri: Array.isArray(item.galeri) ? item.galeri : [],
      denah_url: item.denah_url || '',
      fitur_text: itemFitur.join('\n'),
      spesifikasi: itemSpesifikasi,
      urutan_tampil: item.urutan_tampil,
      is_active: item.is_active
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
      const fiturArray = formData.fitur_text
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const deskripsiLengkapArray = formData.deskripsi_lengkap_text
        .split('\n\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedSpesifikasi = {
        ...formData.spesifikasi,
        kategori: formData.kategori,
        dimensi: formData.dimensi
      };

      const payload: any = {
        nama_tipe: formData.nama_tipe.trim(),
        slug: formData.slug.trim(),
        tagline: formData.tagline?.trim() || null,
        ukuran_tanah: Number(formData.ukuran_tanah),
        ukuran_bangunan: Number(formData.ukuran_bangunan),
        jumlah_kamar_tidur: Number(formData.jumlah_kamar_tidur),
        jumlah_kamar_mandi: Number(formData.jumlah_kamar_mandi),
        jumlah_carport: Number(formData.jumlah_carport),
        jumlah_lantai: Number(formData.jumlah_lantai),
        daya_listrik: formData.daya_listrik,
        sumber_air: formData.sumber_air,
        harga: Number(formData.harga),
        cicilan_mulai: formData.cicilan_mulai,
        deskripsi: formData.deskripsi.trim(),
        deskripsi_lengkap: deskripsiLengkapArray.length > 0 ? deskripsiLengkapArray : [formData.deskripsi.trim()],
        foto_url: formData.foto_url.trim(),
        galeri: formData.galeri || [],
        denah_url: formData.denah_url?.trim() || null,
        fitur: fiturArray.length > 0 ? fiturArray : defaultFitur,
        spesifikasi: updatedSpesifikasi,
        urutan_tampil: Number(formData.urutan_tampil),
        is_active: formData.is_active
      };

      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('tipe_rumah')
          .update(payload)
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('tipe_rumah')
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
        .from('tipe_rumah')
        .delete()
        .eq('id', deleteModalId);

      if (error) {
        console.error('Delete error:', error);
        alert(`Gagal menghapus: ${error.message}`);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== deleteModalId));
      setDeleteModalId(null);
      await fetchItems();
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/70 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#17201C] font-serif">Katalog Unit Tipe Rumah</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola tipe rumah yang ditampilkan pada landing page dan halaman detail.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#0E3B2E] hover:bg-[#07241C] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tipe Rumah</span>
        </button>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0E3B2E] animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-500">Memuat data tipe rumah...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            Belum ada data tipe rumah di database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Foto & Nama Tipe</th>
                  <th className="px-6 py-4">Spesifikasi Unit</th>
                  <th className="px-6 py-4">Harga & Cicilan</th>
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
                          src={item.foto_url}
                          alt={item.nama_tipe}
                          className="w-14 h-11 object-cover rounded-xl border border-gray-200 bg-gray-100"
                        />
                        <div>
                          <p className="font-bold text-[#17201C]">{item.nama_tipe}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-gray-400 font-mono">/{item.slug}</span>
                            {Array.isArray(item.galeri) && item.galeri.length > 0 && (
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                {item.galeri.length} Foto
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 space-y-0.5">
                      <p>Tanah: <span className="font-bold text-[#17201C]">{item.ukuran_tanah} m²</span> | Bangunan: <span className="font-bold text-[#17201C]">{item.ukuran_bangunan} m²</span></p>
                      <p>{item.jumlah_kamar_tidur} KT &middot; {item.jumlah_kamar_mandi} KM &middot; {item.jumlah_carport} Carport</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#0E3B2E]">{formatRupiah(item.harga)}</p>
                      <p className="text-xs text-gray-400">{item.cicilan_mulai}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-xs">{item.urutan_tampil}</td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <XCircle className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/tipe-rumah/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-[#0E3B2E] hover:bg-emerald-50 rounded-xl transition-all"
                          title="Lihat Preview"
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-[#0B2E24] text-white">
              <h3 className="font-bold font-serif text-lg">
                {formData.id ? 'Edit Tipe Rumah' : 'Tambah Tipe Rumah Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:text-[#E5C695]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              {/* Jenis Unit Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Jenis / Kategori Unit *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, kategori: 'rumah' })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      formData.kategori === 'rumah'
                        ? 'bg-[#0E3B2E] text-white border-[#0E3B2E] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Rumah Tinggal (Hunian)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, kategori: 'kios', dimensi: formData.dimensi || '4m x 6.2m' })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      formData.kategori === 'kios' || formData.kategori === 'ruko'
                        ? 'bg-[#B4833E] text-white border-[#B4833E] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Kios / Ruko (Komersial)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Tipe *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_tipe}
                    onChange={(e) => {
                      setFormData({ ...formData, nama_tipe: e.target.value });
                      if (!formData.id) handleSlugGenerate(e.target.value);
                    }}
                    placeholder={formData.kategori === 'kios' ? 'Contoh: Kios Tipe 4 x 6.2' : 'Contoh: Tipe 36/72'}
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
                    placeholder={formData.kategori === 'kios' ? 'kios' : 'tipe-36-72'}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tagline Singkat</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder={formData.kategori === 'kios' ? 'Kios Usaha Strategis di Depan Kawasan' : 'Hunian Modern Kompak & Efisien'}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {formData.kategori === 'kios' ? 'Dimensi Kios (Panjang x Lebar) *' : 'Dimensi Tambahan (Opsional)'}
                  </label>
                  <input
                    type="text"
                    value={formData.dimensi}
                    onChange={(e) => setFormData({ ...formData, dimensi: e.target.value })}
                    placeholder="Contoh: 4m x 6.2m"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
              </div>

              {/* Dimensi & Ruangan Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {formData.kategori === 'kios' ? 'Luas Tanah / Kios (m²) *' : 'Luas Tanah (m²) *'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.ukuran_tanah}
                    onChange={(e) => setFormData({ ...formData, ukuran_tanah: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {formData.kategori === 'kios' ? 'Luas Bangunan (m²) *' : 'Luas Bangunan (m²) *'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.ukuran_bangunan}
                    onChange={(e) => setFormData({ ...formData, ukuran_bangunan: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {formData.kategori === 'kios' ? 'K. Tidur (0 = Ruang Usaha)' : 'Kamar Tidur'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.jumlah_kamar_tidur}
                    onChange={(e) => setFormData({ ...formData, jumlah_kamar_tidur: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {formData.kategori === 'kios' ? 'Toilet / K. Mandi' : 'Kamar Mandi'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.jumlah_kamar_mandi}
                    onChange={(e) => setFormData({ ...formData, jumlah_kamar_mandi: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {formData.kategori === 'kios' ? 'Carport / Parkir (Mobil)' : 'Carport (Mobil)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.jumlah_carport}
                    onChange={(e) => setFormData({ ...formData, jumlah_carport: Number(e.target.value) })}
                    placeholder="1"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Isi 0 jika tidak ada carport</p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Jumlah Lantai</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.jumlah_lantai}
                    onChange={(e) => setFormData({ ...formData, jumlah_lantai: Number(e.target.value) })}
                    placeholder="1"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
              </div>

              {/* Utilitas: Daya Listrik & Sumber Air */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-3">
                <h4 className="text-xs font-bold text-[#0E3B2E] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#0E3B2E]" />
                  <span>Utilitas Daya Listrik &amp; Sumber Air</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Daya Listrik (VA / Watt) *</label>
                    <input
                      type="text"
                      required
                      value={formData.daya_listrik}
                      onChange={(e) => setFormData({ ...formData, daya_listrik: e.target.value })}
                      placeholder="Contoh: 1.300 VA"
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E] font-medium"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {['900 VA', '1.300 VA', '2.200 VA', '3.500 VA', '4.400 VA'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({ ...formData, daya_listrik: val })}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                            formData.daya_listrik === val
                              ? 'bg-[#0E3B2E] text-white border-[#0E3B2E]'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Sumber Air Bersih *</label>
                    <input
                      type="text"
                      required
                      value={formData.sumber_air}
                      onChange={(e) => setFormData({ ...formData, sumber_air: e.target.value })}
                      placeholder="Contoh: Sumur Bor + Pompa Listrik"
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E] font-medium"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {['Sumur Bor + Pompa Listrik', 'Sumur Bor + Jetpump', 'PDAM'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({ ...formData, sumber_air: val })}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                            formData.sumber_air === val
                              ? 'bg-[#0E3B2E] text-white border-[#0E3B2E]'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Est. Cicilan Bulanan</label>
                  <input
                    type="text"
                    value={formData.cicilan_mulai}
                    onChange={(e) => setFormData({ ...formData, cicilan_mulai: e.target.value })}
                    placeholder="Rp 3,4 Juta / bulan"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                  />
                </div>
              </div>

              <ImageDropzone
                label="Foto Utama Rumah"
                required
                value={formData.foto_url}
                onChange={(url) => setFormData({ ...formData, foto_url: url })}
                folder="tipe-rumah"
                helpText="Tarik & lepas foto tampak depan rumah (WebP/JPG/PNG, Maks. 5 MB)"
              />

              <MultiImageDropzone
                label="Galeri Foto Rumah (Interior, Kamar, Kamar Mandi, Carport)"
                values={formData.galeri}
                onChange={(urls) => setFormData({ ...formData, galeri: urls })}
                folder="tipe-rumah/galeri"
                helpText="Pilih satu atau beberapa foto sekaligus (WebP/JPG/PNG, Maks. 5 MB per foto)"
              />

              <ImageDropzone
                label="Denah 2D Unit"
                value={formData.denah_url}
                onChange={(url) => setFormData({ ...formData, denah_url: url })}
                folder="tipe-rumah/denah"
                helpText="Tarik & lepas denah tata ruang unit (WebP/JPG/PNG/SVG, Maks. 5 MB)"
              />

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Deskripsi Ringkas (Untuk Kartu Landing Page) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Deskripsi ringkas tipe unit..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Deskripsi Lengkap Halaman Detail (Pisahkan per paragraf dengan 2x Enter)
                </label>
                <textarea
                  rows={3}
                  value={formData.deskripsi_lengkap_text}
                  onChange={(e) => setFormData({ ...formData, deskripsi_lengkap_text: e.target.value })}
                  placeholder="Paragraf 1 tentang keunggulan unit...&#10;&#10;Paragraf 2 tentang tata ruang..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E] text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Keunggulan & Fitur Unit (Tulis 1 Poin per Baris)
                </label>
                <textarea
                  rows={4}
                  value={formData.fitur_text}
                  onChange={(e) => setFormData({ ...formData, fitur_text: e.target.value })}
                  placeholder="Sertifikat Hak Milik (SHM) & IMB/PBG Sudah Pecah&#10;Row Jalan Perumahan Lebar 6-7 Meter Paving Block&#10;One Gate System dengan Keamanan CCTV 24 Jam"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0E3B2E] text-xs font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">Setiap baris baru akan otomatis ditampilkan sebagai satu poin centang hijau.</p>
              </div>

              {/* Spesifikasi Teknis Material Section */}
              <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
                <h4 className="text-xs font-bold text-[#0E3B2E] uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Spesifikasi Teknis Material Bangunan</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Pondasi</label>
                    <input
                      type="text"
                      value={formData.spesifikasi.pondasi}
                      onChange={(e) => setFormData({ ...formData, spesifikasi: { ...formData.spesifikasi, pondasi: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Struktur</label>
                    <input
                      type="text"
                      value={formData.spesifikasi.struktur}
                      onChange={(e) => setFormData({ ...formData, spesifikasi: { ...formData.spesifikasi, struktur: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Dinding</label>
                    <input
                      type="text"
                      value={formData.spesifikasi.dinding}
                      onChange={(e) => setFormData({ ...formData, spesifikasi: { ...formData.spesifikasi, dinding: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Lantai</label>
                    <input
                      type="text"
                      value={formData.spesifikasi.lantai}
                      onChange={(e) => setFormData({ ...formData, spesifikasi: { ...formData.spesifikasi, lantai: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Atap & Rangka</label>
                    <input
                      type="text"
                      value={formData.spesifikasi.atap}
                      onChange={(e) => setFormData({ ...formData, spesifikasi: { ...formData.spesifikasi, atap: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Kusen & Pintu</label>
                    <input
                      type="text"
                      value={formData.spesifikasi.kusen_pintu}
                      onChange={(e) => setFormData({ ...formData, spesifikasi: { ...formData.spesifikasi, kusen_pintu: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Sanitair</label>
                    <input
                      type="text"
                      value={formData.spesifikasi.sanitair}
                      onChange={(e) => setFormData({ ...formData, spesifikasi: { ...formData.spesifikasi, sanitair: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Instalasi Listrik & Air</label>
                    <input
                      type="text"
                      value={formData.spesifikasi.listrik_air}
                      onChange={(e) => setFormData({ ...formData, spesifikasi: { ...formData.spesifikasi, listrik_air: e.target.value } })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0E3B2E]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#0E3B2E] rounded"
                  />
                  <span className="text-xs font-bold text-gray-700">Tampilkan di Website (Aktif)</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-700">Urutan:</label>
                  <input
                    type="number"
                    value={formData.urutan_tampil}
                    onChange={(e) => setFormData({ ...formData, urutan_tampil: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-center"
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
                  <span>Simpan Perubahan</span>
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
            <h3 className="text-lg font-bold text-[#17201C] font-serif">Hapus Tipe Rumah?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Tindakan ini permanen dan akan menghapus unit tipe rumah ini dari database Supabase serta halaman website.
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
                Ya, Hapus Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
