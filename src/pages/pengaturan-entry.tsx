import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { BottomNav } from '../components/common/BottomNav';
import { UserManagementModal } from '../components/users/UserManagementModal';
import { SchoolSettingsModal } from '../components/settings/SchoolSettingsModal';
import {
  Users,
  Settings,
  Database,
  ArrowRight,
  School,
  Wifi,
  Share2,
  Trophy,
} from 'lucide-react';
import { getStudentUrl } from '../utils/routing';
import '../index.css';

const PengaturanPage: React.FC = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    if (tab === 'dashboard') window.location.href = 'index.html';
    else if (tab === 'mutasi') window.location.href = 'mutasi.html';
    else if (tab === 'buku-induk') window.location.href = 'buku-induk.html';
    else if (tab === 'rapor') window.location.href = 'rapor.html';
    else if (tab === 'kegiatan') window.location.href = 'kegiatan.html';
    else if (tab === 'cetak-buku') window.location.href = 'cetak-buku.html';
    else if (tab === 'pengaturan') window.location.href = 'pengaturan.html';
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col">
      <Header
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenPrintModal={() => { window.location.href = 'cetak-buku.html'; }}
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
          <div className="max-w-2xl mx-auto space-y-4 pb-20 md:pb-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Menu Pengaturan & Administrasi Sekolah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kelola guru wali kelas, identitas buku, dan sinkronisasi data antar guru
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Manajemen Guru & Wali Kelas</p>
                      <p className="text-[11px] text-slate-500">
                        Ganti pengguna aktif atau atur tanda tangan digital Kepala Sekolah
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
                      <p className="text-xs font-bold text-slate-900">Identitas Sekolah & Dokumen</p>
                      <p className="text-[11px] text-slate-500">
                        Ubah Nama Sekolah, NPSN, NSS, Alamat, dan Tahun Pelajaran
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => { window.location.href = 'kegiatan.html'; }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ekstrakurikuler & Keahlian Wajib</p>
                      <p className="text-[11px] text-slate-500">
                        Kelola ekskul dinamis (Robotic, Jiujitsu, Drawing, Cooking, Futsal, Silat) & 4 Keahlian Wajib
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Cadangkan & Pulihkan (JSON)</p>
                      <p className="text-[11px] text-slate-500">
                        Unduh cadangan data untuk keamanan atau impor dari perangkat guru lain
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Multi-Teacher Simultaneous Consistency Notice */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Arsitektur Multi-Page Application (MPA) & Multi-Teacher
                </span>
              </div>
              <h4 className="font-bold text-sm">
                Konsistensi Basis Data Antar Halaman & Antar Guru
              </h4>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Setiap modul (Buku Mutasi, Buku Induk, Cetak Buku, Profil Siswa) berjalan sebagai halaman mandiri (*Multi-Page Application*) dengan URL unik yang stabil. Hal ini mencegah konflik basis kode ketika diakses banyak guru secara simultan di gawai masing-masing.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <a
                  href={getStudentUrl('2425010009')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Buka Live Rekam Siswa Hall</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNav currentTab="pengaturan" onChangeTab={handleNavigate} />

      <UserManagementModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <SchoolSettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AppProvider>
        <PengaturanPage />
      </AppProvider>
    </React.StrictMode>
  );
}
