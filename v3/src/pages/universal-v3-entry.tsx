import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '../context/AppContext';
import { V3AppProvider } from '../context/V3AppContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { BottomNav } from '../components/common/BottomNav';
import { UniversalV3SuiteHub } from '../components/v3/UniversalV3SuiteHub';
import { UserManagementModal } from '../components/users/UserManagementModal';
import { SchoolSettingsModal } from '../components/settings/SchoolSettingsModal';
import '../index.css';

const UniversalV3Page: React.FC = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    if (tab === 'dashboard') window.location.href = 'index.html';
    else if (tab === 'mutasi') window.location.href = 'mutasi.html';
    else if (tab === 'siswa') window.location.href = 'siswa.html';
    else if (tab === 'buku-induk') window.location.href = 'buku-induk.html';
    else if (tab === 'rapor') window.location.href = 'rapor.html';
    else if (tab === 'kegiatan') window.location.href = 'kegiatan.html';
    else if (tab === 'cetak-buku') window.location.href = 'cetak-buku.html';
    else if (tab === 'pengaturan') window.location.href = 'pengaturan.html';
    else if (tab === 'universal-v3') window.location.href = 'universal-v3.html';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenPrintModal={() => { window.location.href = 'cetak-buku.html'; }}
        onOpenSettingsModal={() => setIsSchoolModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 gap-6">
        <Sidebar
          currentTab="universal-v3"
          onChangeTab={handleNavigate}
          onOpenUserModal={() => setIsUserModalOpen(true)}
          onOpenSettingsModal={() => setIsSchoolModalOpen(true)}
        />

        <main className="flex-1 min-w-0 pb-16 md:pb-6">
          <UniversalV3SuiteHub />
        </main>
      </div>

      <BottomNav
        currentTab="universal-v3"
        onChangeTab={handleNavigate}
      />

      <UserManagementModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <SchoolSettingsModal isOpen={isSchoolModalOpen} onClose={() => setIsSchoolModalOpen(false)} />
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <AppProvider>
        <V3AppProvider>
          <UniversalV3Page />
        </V3AppProvider>
      </AppProvider>
    </React.StrictMode>
  );
}
