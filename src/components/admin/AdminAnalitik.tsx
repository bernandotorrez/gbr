import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  PhoneCall,
  Calculator,
  TrendingUp,
  Calendar,
  Download,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Search,
  Camera,
  MessageCircle,
  Video,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface ChartPoint {
  dateStr: string;
  label: string;
  views: number;
  visitors: number;
  whatsapp: number;
  kpr: number;
}

interface AnalyticsData {
  summary: {
    totalViews: number;
    totalVisitors: number;
    totalWaClicks: number;
    totalKprRuns: number;
    avgDuration: string;
    conversionRate: string;
  };
  chartData: ChartPoint[];
  devices: { name: string; percentage: number; count: number; color: string }[];
  sources: { source: string; percentage: number; count: number; icon: string }[];
  topPages: { path: string; title: string; views: number; percentage: number }[];
  recentActivities: {
    path: string;
    title: string;
    device: string;
    time: string;
    location: string;
    event: string;
    eventText: string;
  }[];
}

export default function AdminAnalitik() {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [chartMetric, setChartMetric] = useState<'views' | 'whatsapp' | 'kpr'>('views');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  const fetchStats = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?range=${selectedRange}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching analytics stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  const handleExportCSV = () => {
    if (!data) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Tanggal,Total Kunjungan (Pageviews),Pengunjung Unik,Klik WhatsApp,Simulasi KPR\n';
    data.chartData.forEach((row) => {
      csvContent += `${row.dateStr},${row.views},${row.visitors},${row.whatsapp},${row.kpr}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan-analitik-gbr-${range}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) {
    return (
      <div className="py-24 flex flex-col items-center justify-center font-sans">
        <RefreshCw className="w-8 h-8 text-[#0E3B2E] animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-500">Memuat data analitik dan statistik...</p>
      </div>
    );
  }

  const summary = data?.summary || {
    totalViews: 0,
    totalVisitors: 0,
    totalWaClicks: 0,
    totalKprRuns: 0,
    avgDuration: '0m',
    conversionRate: '0%'
  };

  const chartData = data?.chartData || [];
  const maxVal = Math.max(...chartData.map((d) => (chartMetric === 'views' ? d.views : chartMetric === 'whatsapp' ? d.whatsapp : d.kpr)), 10);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0E3B2E] text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
            <Activity className="w-3.5 h-3.5 text-[#047857]" />
            <span>Real-time Traffic & Visitor Insights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17201C] font-serif">
            Statistik & Analitik Pengunjung
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pantau pertumbuhan trafik, interaksi prospek rumah, dan performa konversi website Grand Bedahan Residence
          </p>
        </div>

        {/* Timeframe Selector & Export Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <div className="bg-[#FAF9F6] p-1 rounded-2xl border border-gray-200 flex items-center gap-1">
            {(
              [
                { id: 'today', label: 'Hari Ini' },
                { id: '7d', label: '7 Hari' },
                { id: '30d', label: '30 Hari' },
                { id: 'all', label: 'Semua' }
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setRange(item.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  range === item.id
                    ? 'bg-[#0E3B2E] text-white shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-[#0E3B2E] border border-gray-200 rounded-2xl text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Total Pageviews */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Kunjungan</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0E3B2E] border border-emerald-100 flex items-center justify-center">
              <Eye className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#17201C] font-sans">
              {summary.totalViews.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% dari periode lalu</span>
            </p>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pengunjung Unik</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#17201C] font-sans">
              {summary.totalVisitors.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>~72% visitor baru</span>
            </p>
          </div>
        </div>

        {/* WhatsApp Inquiries */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Klik WhatsApp</span>
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 border border-green-100 flex items-center justify-center">
              <PhoneCall className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3B2E] font-sans">
              {summary.totalWaClicks.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-green-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Calon pembeli prospek</span>
            </p>
          </div>
        </div>

        {/* KPR Simulations */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Simulasi KPR</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
              <Calculator className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#17201C] font-sans">
              {summary.totalKprRuns.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Interaksi kalkulator unit</span>
            </p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-[#07241C] to-[#0E3B2E] text-white p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Konversi Leads</span>
            <div className="w-9 h-9 rounded-xl bg-white/10 text-[#E5C695] border border-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E5C695] font-sans">
              {summary.conversionRate}
            </div>
            <p className="text-[11px] text-emerald-100/80 mt-1">
              Rata-rata durasi: {summary.avgDuration}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-[#17201C] font-serif">Tren Aktivitas & Kunjungan Harian</h3>
            <p className="text-xs text-gray-500 mt-0.5">Grafik dinamika volume pengunjung dan aksi konversi</p>
          </div>

          {/* Metric Tab Selector */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] p-1 rounded-2xl border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setChartMetric('views')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                chartMetric === 'views'
                  ? 'bg-[#0E3B2E] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              👀 Kunjungan &amp; Visitor
            </button>
            <button
              onClick={() => setChartMetric('whatsapp')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                chartMetric === 'whatsapp'
                  ? 'bg-[#0E3B2E] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              💬 Klik WhatsApp
            </button>
            <button
              onClick={() => setChartMetric('kpr')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                chartMetric === 'kpr'
                  ? 'bg-[#0E3B2E] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              🧮 Simulasi KPR
            </button>
          </div>
        </div>

        {/* Visual Bar / Area Chart */}
        <div className="pt-2">
          <div className="h-64 sm:h-72 w-full flex items-end gap-2 sm:gap-4 relative pb-6 border-b border-gray-100">
            {chartData.map((item, idx) => {
              const currentVal =
                chartMetric === 'views' ? item.views : chartMetric === 'whatsapp' ? item.whatsapp : item.kpr;
              const heightPercent = Math.max(8, Math.round((currentVal / (maxVal || 1)) * 100));
              const secondaryVal = chartMetric === 'views' ? item.visitors : 0;
              const secondaryHeight = Math.max(6, Math.round((secondaryVal / (maxVal || 1)) * 100));

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(item)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Floating Value Tag on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none bg-[#07241C] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                    {item.label}: {currentVal} {chartMetric === 'views' ? `(Unik: ${item.visitors})` : ''}
                  </div>

                  {/* Dual Bar or Single Bar */}
                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                    {/* Primary Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                        chartMetric === 'views'
                          ? 'bg-[#0E3B2E]'
                          : chartMetric === 'whatsapp'
                          ? 'bg-emerald-600'
                          : 'bg-[#E5C695]'
                      }`}
                    ></div>

                    {/* Secondary Bar for Unique Visitors when viewing 'views' */}
                    {chartMetric === 'views' && (
                      <div
                        style={{ height: `${secondaryHeight}%` }}
                        className="w-full bg-[#E5C695] rounded-t-xl transition-all duration-500 opacity-90 hidden sm:block group-hover:brightness-110"
                      ></div>
                    )}
                  </div>

                  {/* Date Label */}
                  <span className="absolute -bottom-5 text-[10px] sm:text-xs text-gray-500 font-medium truncate w-full text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-gray-600">
            {chartMetric === 'views' ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-[#0E3B2E]"></div>
                  <span>Total Kunjungan (Pageviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-[#E5C695]"></div>
                  <span>Pengunjung Unik (Unique)</span>
                </div>
              </>
            ) : chartMetric === 'whatsapp' ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-emerald-600"></div>
                <span>Total Klik Hubungi WhatsApp Marketing</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-md bg-[#E5C695]"></div>
                <span>Frekuensi Penggunaan Simulasi Cicilan KPR</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Device Breakdown & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Device Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#17201C] font-serif">Perangkat Pengunjung</h3>
            <span className="text-xs text-gray-400 font-medium">Device Distribution</span>
          </div>

          <div className="space-y-4">
            {data?.devices.map((device, idx) => {
              const Icon = idx === 0 ? Smartphone : idx === 1 ? Monitor : Tablet;
              return (
                <div key={device.name} className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-gray-100/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: device.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-[#17201C]">{device.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#0E3B2E]">{device.percentage}%</span>
                      <span className="text-[11px] text-gray-400 block">{device.count.toLocaleString()} sesi</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${device.percentage}%`, backgroundColor: device.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#17201C] font-serif">Sumber Trafik & Referrer</h3>
            <span className="text-xs text-gray-400 font-medium">Traffic Inflow Channels</span>
          </div>

          <div className="space-y-3">
            {data?.sources.map((src, idx) => {
              const Icon =
                idx === 0
                  ? Globe
                  : idx === 1
                  ? Search
                  : idx === 2
                  ? Camera
                  : idx === 3
                  ? MessageCircle
                  : Video;

              return (
                <div
                  key={src.source}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0E3B2E] border border-emerald-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#17201C]">{src.source}</p>
                      <p className="text-[11px] text-gray-400">{src.count.toLocaleString()} pengunjung</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0E3B2E] text-xs font-bold border border-emerald-200/60">
                      {src.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Top Pages & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Pages Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#17201C] font-serif">Halaman Paling Sering Dikunjungi</h3>
            <span className="text-xs text-gray-400 font-medium">Top Pages by Hits</span>
          </div>

          <div className="space-y-3">
            {data?.topPages.map((page, idx) => (
              <div
                key={page.path}
                className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-gray-100 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0E3B2E] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#17201C]">{page.title}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{page.path}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-[#0E3B2E]">{page.views.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 block">{page.percentage}%</span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0E3B2E]"
                    style={{ width: `${page.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Stream (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-lg font-bold text-[#17201C] font-serif">Aktivitas Pengunjung Terkini</h3>
            </div>
            <span className="text-xs text-gray-400 font-medium">Live Feed</span>
          </div>

          <div className="space-y-3">
            {data?.recentActivities.map((act, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#FAF9F6] border border-gray-100 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0E3B2E]">{act.title}</span>
                  <span className="text-gray-400 text-[10px] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {act.time}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-gray-700 bg-white p-1.5 rounded-lg border border-gray-100">
                  ⚡ {act.eventText}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                  <span>{act.device}</span>
                  <span>📍 {act.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
