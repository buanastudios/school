import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider, useApp } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { BottomNav } from '../components/common/BottomNav';
import { UserManagementModal } from '../components/users/UserManagementModal';
import { SchoolSettingsModal } from '../components/settings/SchoolSettingsModal';
import { AuditLogModule } from '../components/audit/AuditLogModule';
import { ModuleManagementModule } from '../components/modules/ModuleManagementModule';
import { UserManagementModule } from '../components/users/UserManagementModule';
import {
  Users,
  Settings,
  Database,
  ArrowRight,
  School,
  ShieldCheck,
  Blocks,
  Trophy,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';
import '../index.css';

type SettingsTab = 'umum' | 'users' | 'modules' | 'audit';

const PengaturanContent: React.FC = () => {
  const { schoolProfile, exportDataAsJson, importDataFromJson } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'users' || tabParam === 'modules' || tabParam === 'audit') {
        return tabParam;
      }
    }
    return 'umum';
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync tab with URL search parameter
  const handleSelectTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'umum') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'dashboard') window.location.href = 'index.html';
    else if (tab === 'mutasi') window.location.href = 'mutasi.html';
    else if (tab === 'buku-induk') window.location.href = 'buku-induk.html';
    else if (tab === 'rapor') window.location.href = 'rapor.html';
    else if (tab === 'kegiatan') window.location.href = 'kegiatan.html';
    else if (tab === 'cetak-buku') window.location.href = 'cetak-buku.html';
    else if (tab === 'users') handleSelectTab('users');
    else if (tab === 'modules') handleSelectTab('modules');
    else if (tab === 'audit-log') handleSelectTab('audit');
    else if (tab === 'pengaturan') handleSelectTab('umum');
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `buana_school_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJson(content);
        if (success) {
          alert('Basis data sekolah berhasil dipulihkan!');
        } else {
          alert('Gagal memulihkan data. Format file JSON tidak valid.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col">
      <Header
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenPrintModal={() => {
          window.location.href = 'cetak-buku.html';
        }}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentTab="pengaturan"
          onChangeTab={handleNavigate}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />

        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-5 pb-24 md:pb-12">
            {/* Top Sub-Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleSelectTab('umum')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'umum'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Umum & Sekolah</span>
              </button>

              <button
                onClick={() => handleSelectTab('users')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'users'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Pengguna & Guru</span>
              </button>

              <button
                onClick={() => handleSelectTab('modules')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'modules'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Blocks className="w-4 h-4" />
                <span>Manajemen Modul</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold border border-amber-300">
                  Admin
                </span>
              </button>

              <button
                onClick={() => handleSelectTab('audit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'audit'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Log Audit Keamanan</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-100 text-red-800 font-extrabold border border-red-300">
                  Admin
                </span>
              </button>
            </div>

            {/* TAB CONTENT 1: UMUM & SEKOLAH */}
            {activeTab === 'umum' && (
              <div className="space-y-4 max-w-3xl">
                {/* General Settings Hub Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        Menu Pengaturan & Administrasi Sekolah
                      </h3>
                      <p className="text-xs text-slate-500">
                        Konfigurasi identitas lembaga, profil pimpinan, dan cadangan basis data lokal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={() => handleSelectTab('users')}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Direktori Pengguna & Hak Akses Guru
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Kelola akun wali kelas, staf tata usaha, NIP/NUPTK, dan tanda tangan digital
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                          <School className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Identitas Lembaga & Profil Sekolah
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {schoolProfile.namaSekolah} • NPSN: {schoolProfile.npsn} • NSS: {schoolProfile.nss}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        window.location.href = 'kegiatan.html';
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Ekstrakurikuler & 4 Keahlian Wajib
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Kelola ekskul bakat siswa & 4 keahlian wajib (Berenang, Berkuda, Berkemah, Rappelling)
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Backup & Restore Dedicated Box */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        Cadangkan & Pulihkan Basis Data Sekolah (JSON)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Amankan seluruh data siswa, mutasi bulanan, capaian rapor, dan konfigurasi modul
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleDownloadBackup}
                      className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Berkas Cadangan JSON</span>
                    </button>

                    <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Pulihkan dari Berkas JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleRestoreBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* BUANA STUDIOS Enterprise Quality Notice */}
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                      BUANA STUDIOS • Enterprise Engine
                    </span>
                  </div>
                  <h4 className="font-bold text-sm">
                    Platform Tata Kelola Sekolah Dasar Terpadu
                  </h4>
                  <p className="text-xs text-indigo-200/90 leading-relaxed">
                    Aplikasi ini dirancang dengan standar operasional tingkat institusi pendidikan. Seluruh rekaman tersimpan terenkripsi pada basis data lokal dan diawasi oleh subsistem audit log keamanan terpadu.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: PENGGUNA & GURU */}
            {activeTab === 'users' && (
              <UserManagementModule onBackToSettings={() => handleSelectTab('umum')} />
            )}

            {/* TAB CONTENT 3: MANAJEMEN MODUL */}
            {activeTab === 'modules' && (
              <ModuleManagementModule onBackToSettings={() => handleSelectTab('umum')} />
            )}

            {/* TAB CONTENT 4: LOG AUDIT KEAMANAN */}
            {activeTab === 'audit' && (
              <AuditLogModule onBackToSettings={() => handleSelectTab('umum')} />
            )}
          </div>
        </main>
      </div>

      <BottomNav currentTab="pengaturan" onChangeTab={handleNavigate} />

      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
      <SchoolSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

const PengaturanPage: React.FC = () => {
  return (
    <AppProvider>
      <PengaturanContent />
    </AppProvider>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<PengaturanPage />);
}
export default PengaturanPage;
