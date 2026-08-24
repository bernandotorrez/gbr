import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Home,
  Tag,
  FileText,
  ArrowUpRight,
  MessageSquare,
  Clock,
  PhoneCall,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    leadsCount: 0,
    houseTypesCount: 0,
    promosCount: 0,
    articlesCount: 0
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // 1. Leads count & recent
      const { data: leadsData, count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      // 2. House types count
      const { count: houseCount } = await supabase
        .from('tipe_rumah')
        .select('*', { count: 'exact', head: true });

      // 3. Promos count
      const { count: promoCount } = await supabase
        .from('promosi')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aktif');

      // 4. Articles count
      const { count: articleCount } = await supabase
        .from('artikel')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'publish');

      setStats({
        leadsCount: leadsCount || 0,
        houseTypesCount: houseCount || 0,
        promosCount: promoCount || 0,
        articlesCount: articleCount || 0
      });

      setRecentLeads(leadsData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
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

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0E3B2E] animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-500">Memuat statistik dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Leads Calon Pembeli',
      value: stats.leadsCount,
      icon: Users,
      color: 'bg-emerald-50 text-[#0E3B2E] border-emerald-100',
      href: '/admin/leads'
    },
    {
      title: 'Tipe Rumah Tersedia',
      value: stats.houseTypesCount,
      icon: Home,
      color: 'bg-blue-50 text-blue-800 border-blue-100',
      href: '/admin/tipe-rumah'
    },
    {
      title: 'Promo Aktif',
      value: stats.promosCount,
      icon: Tag,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
      href: '/admin/promosi'
    },
    {
      title: 'Artikel Published',
      value: stats.articlesCount,
      icon: FileText,
      color: 'bg-purple-50 text-purple-800 border-purple-100',
      href: '/admin/artikel'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <a
              key={idx}
              href={card.href}
              className="bg-white p-6 rounded-3xl border border-gray-200/70 shadow-sm hover:shadow-md hover:border-[#0E3B2E]/30 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#0E3B2E] transition-colors" />
              </div>
              <div className="mt-5">
                <p className="text-3xl font-extrabold text-[#17201C] font-serif tracking-tight">{card.value}</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{card.title}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-gradient-to-r from-[#0B2E24] to-[#0E3B2E] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">Kelola Konten Grand Bedahan Residence</h3>
          <p className="text-sm text-emerald-100/80 mt-1">Perbarui tipe unit, promo subsidi KPR, atau publikasikan artikel edukasi baru.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/tipe-rumah"
            className="px-5 py-2.5 bg-white text-[#0B2E24] hover:bg-[#E5C695] text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Tambah Tipe Rumah
          </a>
          <a
            href="/admin/promosi"
            className="px-5 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all border border-emerald-500/30"
          >
            + Buat Promo
          </a>
          <a
            href="/admin/artikel"
            className="px-5 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all border border-emerald-500/30"
          >
            + Tulis Artikel
          </a>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#0E3B2E]" />
            <h3 className="text-lg font-bold text-[#17201C] font-serif">Leads Calon Pembeli Terbaru</h3>
          </div>
          <a
            href="/admin/leads"
            className="text-xs font-bold text-[#0E3B2E] hover:underline"
          >
            Lihat Semua Leads →
          </a>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            Belum ada leads calon pembeli yang masuk dari formulir kontak.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Nama Calon</th>
                  <th className="px-6 py-3.5">Nomor WhatsApp</th>
                  <th className="px-6 py-3.5">Tipe Diminati</th>
                  <th className="px-6 py-3.5">Pesan</th>
                  <th className="px-6 py-3.5">Tanggal Masuk</th>
                  <th className="px-6 py-3.5 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#17201C]">{lead.nama}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{lead.no_hp}</td>
                    <td className="px-6 py-4 text-xs">
                      {lead.tipe_rumah_diminati ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                          {lead.tipe_rumah_diminati}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{lead.pesan}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`https://wa.me/${lead.no_hp.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(`Halo Bapak/Ibu ${lead.nama}, terima kasih telah menghubungi Grand Bedahan Residence.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white font-bold text-xs transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Hubungi</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
