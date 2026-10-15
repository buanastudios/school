import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import type { NavTab } from './components/common/BottomNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { MutasiModule } from './components/mutasi/MutasiModule';
import { BukuIndukModule } from './components/buku-induk/BukuIndukModule';
import { BookPrintView } from './components/print/BookPrintView';
import { AddMutationModal } from './components/mutasi/AddMutationModal';
import { UserManagementModal } from './components/users/UserManagementModal';
import { SchoolSettingsModal } from './components/settings/SchoolSettingsModal';
import type { StudentMutation, MutationType } from './types';
import {
  Users,
  Settings,
  Database,
  ArrowRight,
  School,
  Sparkles,
} from 'lucide-react';

const MainAppContent: React.FC = () => {

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Modals
  const [isAddMutationOpen, setIsAddMutationOpen] = useState(false);
  const [mutationDefaultType, setMutationDefaultType] = useState<MutationType>('masuk');
  const [editingMutation, setEditingMutation] = useState<StudentMutation | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleOpenAddMutation = (type: MutationType, mutation?: StudentMutation) => {
    setMutationDefaultType(type);
    setEditingMutation(mutation || null);
    setIsAddMutationOpen(true);
  };

  // If in Book Print view mode
  if (currentTab === 'cetak-buku') {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 p-2 sm:p-6">
        <BookPrintView onBack={() => setCurrentTab('mutasi')} />
      </div>
    );
  }

  const handleNavigate = (tab: NavTab) => {
    if (tab === 'dashboard') {
      setCurrentTab('dashboard');
    } else {
      window.location.href = `${tab}.html`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col">
      {/* Top Header */}
      <Header
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenPrintModal={() => { window.location.href = 'cetak-buku.html'; }}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop / Tablet Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onChangeTab={handleNavigate}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8">
          {currentTab === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onOpenAddModal={(type) => handleOpenAddMutation(type)}
            />
          )}

          {currentTab === 'mutasi' && (
            <MutasiModule
              onOpenAddModal={(type, m) => handleOpenAddMutation(type, m)}
              onOpenPrint={() => setCurrentTab('cetak-buku')}
            />
          )}

          {currentTab === 'buku-induk' && (
            <BukuIndukModule onOpenPrint={() => setCurrentTab('cetak-buku')} />
          )}

          {currentTab === 'pengaturan' && (
            <div className="max-w-2xl mx-auto space-y-4 pb-20 md:pb-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Menu Pengaturan & Administrasi
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kelola guru wali kelas, identitas buku, dan cadangan data
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
                          Unduh cadangan data untuk keamanan atau impor dari perangkat lain
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Hosting on GitHub Pages Notice */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                    Dukungan Hosting GitHub Pages (github.io)
                  </span>
                </div>
                <h4 className="font-bold text-sm">
                  100% Client-Side & Siap Dipublikasikan Gratis
                </h4>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  Aplikasi ini dibangun menggunakan arsitektur web statis mandiri (React + TypeScript + Tailwind) tanpa memerlukan server berbayar. Seluruh data tersimpan aman secara lokal pada peramban (browser) guru masing-masing dan dapat dicadangkan kapan saja.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} onChangeTab={handleNavigate} />

      {/* Modals */}
      <AddMutationModal
        isOpen={isAddMutationOpen}
        onClose={() => {
          setIsAddMutationOpen(false);
          setEditingMutation(null);
        }}
        defaultType={mutationDefaultType}
        editingMutation={editingMutation}
      />

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

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
