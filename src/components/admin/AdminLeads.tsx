import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Search,
  PhoneCall,
  Mail,
  Calendar,
  Trash2,
  Download,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Home
} from 'lucide-react';

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async () => {
    if (!deleteModalId) return;
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', deleteModalId);

      if (error) {
        console.error('Delete lead error:', error);
        alert(`Gagal menghapus lead: ${error.message}`);
        return;
      }

      setLeads((prev) => prev.filter((item) => item.id !== deleteModalId));
      setDeleteModalId(null);
      await fetchLeads();
    } catch (err: any) {
      console.error('Delete lead error:', err);
      alert(`Gagal menghapus lead: ${err.message}`);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Nama', 'Nomor WhatsApp', 'Email', 'Tipe Diminati', 'Pesan', 'Tanggal Masuk'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.nama.replace(/"/g, '""')}"`,
      `"${l.no_hp}"`,
      `"${l.email || ''}"`,
      `"${l.tipe_rumah_diminati || ''}"`,
      `"${l.pesan.replace(/"/g, '""')}"`,
      `"${l.created_at}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_grand_bedahan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.nama?.toLowerCase().includes(q) ||
      l.no_hp?.includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.pesan?.toLowerCase().includes(q) ||
      l.tipe_rumah_diminati?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/70 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#17201C] font-serif">Data Leads Calon Pembeli</h2>
          <p className="text-xs text-gray-500 mt-0.5">Daftar calon konsumen yang mengirimkan pesan melalui formulir kontak landing page.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLeads}
            className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0E3B2E] hover:bg-[#07241C] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan nama, nomor HP, email, atau isi pesan..."
          className="w-full text-sm outline-none text-[#17201C] placeholder:text-gray-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs font-bold text-gray-400 hover:text-gray-600 mr-2">
            Reset
          </button>
        )}
      </div>

      {/* Table List */}
      <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0E3B2E] animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-500">Memuat data leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            {searchQuery ? 'Tidak ada leads yang cocok dengan pencarian.' : 'Belum ada data leads yang masuk.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama Calon</th>
                  <th className="px-6 py-4">Kontak (WhatsApp / Email)</th>
                  <th className="px-6 py-4">Tipe Diminati</th>
                  <th className="px-6 py-4">Isi Pesan</th>
                  <th className="px-6 py-4">Waktu Masuk</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#17201C]">{lead.nama}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="space-y-1 font-mono">
                        <p className="font-bold text-emerald-800">{lead.no_hp}</p>
                        {lead.email && <p className="text-gray-400">{lead.email}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {lead.tipe_rumah_diminati ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          <Home className="w-3 h-3" />
                          <span>{lead.tipe_rumah_diminati}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 max-w-sm">
                      <p className="line-clamp-2">{lead.pesan}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${lead.no_hp.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(`Halo Bapak/Ibu ${lead.nama}, terima kasih telah menghubungi Grand Bedahan Residence terkait konsultasi hunian.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white font-bold text-xs transition-all"
                          title="Chat via WhatsApp"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </a>
                        <button
                          onClick={() => setDeleteModalId(lead.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Hapus Lead"
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

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17201C] font-serif">Hapus Data Lead?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Tindakan ini permanen dan data calon pembeli ini akan dihapus dari sistem.
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
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
