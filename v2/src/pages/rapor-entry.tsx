import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { BottomNav } from '../components/common/BottomNav';
import { RaporModule } from '../components/rapor/RaporModule';
import { UserManagementModal } from '../components/users/UserManagementModal';
import { SchoolSettingsModal } from '../components/settings/SchoolSettingsModal';
import '../index.css';

const RaporPage: React.FC = () => {
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
      <div className="no-print">
        <Header
          onOpenUserModal={() => setIsUserModalOpen(true)}
          onOpenPrintModal={() => {
            window.location.href = 'cetak-buku.html';
          }}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <div className="no-print">
          <Sidebar
            currentTab="rapor"
            onChangeTab={handleNavigate}
            onOpenUserModal={() => setIsUserModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          />
        </div>

        <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8">
          <RaporModule />
        </main>
      </div>

      <div className="no-print">
        <BottomNav currentTab="rapor" onChangeTab={handleNavigate} />
        <UserManagementModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
        <SchoolSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AppProvider>
        <RaporPage />
      </AppProvider>
    </React.StrictMode>
  );
}
