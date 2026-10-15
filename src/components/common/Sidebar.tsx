import React from 'react';
import type { NavTab } from './BottomNav';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BookOpen,
  Printer,
  Settings,
  Users,
  School,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenUserModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onChangeTab,
  onOpenUserModal,
  onOpenSettingsModal,
}) => {
  const { schoolProfile, currentUser } = useApp();

  const mainNav = [
    {
      id: 'dashboard' as NavTab,
      label: 'Beranda & Statistik',
      icon: LayoutDashboard,
      badge: 'Utama',
    },
    {
      id: 'mutasi' as NavTab,
      label: 'Buku Mutasi Siswa',
      icon: ArrowLeftRight,
      badge: 'Masuk & Keluar',
    },
    {
      id: 'buku-induk' as NavTab,
      label: 'Buku Induk Register',
      icon: BookOpen,
      badge: 'Kurikulum Merdeka',
    },
    {
      id: 'cetak-buku' as NavTab,
      label: 'Cetak Buku On-Demand',
      icon: Printer,
      badge: 'Format Resmi',
    },
    {
      id: 'pengaturan' as NavTab,
      label: 'Pengaturan & Backup',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0">
      {/* Top School Branding */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <School className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-slate-900 text-sm leading-tight truncate">
              {schoolProfile.namaSekolah}
            </h2>
            <p className="text-xs text-indigo-600 font-semibold mt-0.5">
              Sistem Buku Mutasi & Induk
            </p>
          </div>
        </div>

        {/* Current Active User Card */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pengguna Aktif
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Aktif
            </span>
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 truncate">
                {currentUser.role === 'wali_kelas'
                  ? `Wali Kelas ${currentUser.assignedClass}`
                  : currentUser.role === 'kepala_sekolah'
                  ? 'Kepala Sekolah'
                  : 'Tata Usaha / Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
        <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Menu Modul Sekolah
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-5 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Pintasan & Manajemen
        </div>
        <button
          onClick={onOpenUserModal}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Users className="w-4 h-4 text-slate-500" />
          <span>Ganti / Kelola Guru</span>
        </button>
        <button
          onClick={onOpenSettingsModal}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Database className="w-4 h-4 text-slate-500" />
          <span>Identitas & Cadangan JSON</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-400 text-center">
        <p className="font-semibold text-slate-600">SD Muhammadiyah 2 Bandung</p>
        <p>Buku Mutasi & Induk Digital • Kemendikbud</p>
      </div>
    </aside>
  );
};
