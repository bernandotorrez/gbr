import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  LayoutDashboard,
  Home,
  Tag,
  FileText,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Loader2
} from 'lucide-react';

interface AdminLayoutProps {
  currentPath: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AdminLayout({
  currentPath,
  title,
  subtitle,
  children
}: AdminLayoutProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/admin/login';
      } else {
        setSession(session);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        window.location.href = '/admin/login';
      } else {
        setSession(session);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Tipe Rumah', href: '/admin/tipe-rumah', icon: Home },
    { label: 'Promosi', href: '/admin/promosi', icon: Tag },
    { label: 'Artikel & Berita', href: '/admin/artikel', icon: FileText },
    { label: 'Data Leads (Calon)', href: '/admin/leads', icon: Users }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0E3B2E] animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Memeriksa sesi administrator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0B2E24] text-white px-4 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E5C695] text-[#0B2E24] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-lg">GBR Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white hover:text-[#E5C695]"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0B2E24] text-white flex flex-col justify-between p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 pb-8 border-b border-emerald-900/50">
            <div className="w-11 h-11 rounded-2xl bg-[#E5C695] text-[#0B2E24] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl leading-none text-white">Grand Bedahan</h2>
              <p className="text-[11px] font-bold text-[#E5C695] tracking-widest uppercase mt-1">Admin Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E5C695] text-[#0B2E24] shadow-md'
                      : 'text-emerald-100/70 hover:bg-[#0E3B2E] hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#0B2E24]' : 'text-emerald-300'}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="pt-6 border-t border-emerald-900/50 space-y-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-100 bg-[#0E3B2E] hover:bg-[#144739] transition-colors border border-emerald-800"
          >
            <span>Buka Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-between">
            <div className="truncate mr-2">
              <p className="text-xs font-bold text-white truncate">{session?.user?.email}</p>
              <p className="text-[10px] text-emerald-400 font-medium">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-emerald-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Title Bar */}
        <div className="bg-white border-b border-gray-200/80 px-6 sm:px-10 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17201C] font-serif">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
