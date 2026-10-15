import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '../context/AppContext';
import { StudentPublicProfile } from '../components/student-detail/StudentPublicProfile';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/common/BottomNav';
import '../index.css';

const SiswaPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col">
      <Header
        onOpenUserModal={() => { window.location.href = 'pengaturan.html'; }}
        onOpenPrintModal={() => { window.location.href = 'cetak-buku.html'; }}
        onOpenSettingsModal={() => { window.location.href = 'pengaturan.html'; }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8">
        <StudentPublicProfile
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = 'buku-induk.html';
            }
          }}
        />
      </main>

      <BottomNav
        currentTab="buku-induk"
        onChangeTab={(tab) => {
          if (tab === 'dashboard') window.location.href = 'index.html';
          else if (tab === 'mutasi') window.location.href = 'mutasi.html';
          else if (tab === 'buku-induk') window.location.href = 'buku-induk.html';
          else if (tab === 'cetak-buku') window.location.href = 'cetak-buku.html';
          else if (tab === 'pengaturan') window.location.href = 'pengaturan.html';
        }}
      />
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AppProvider>
        <SiswaPage />
      </AppProvider>
    </React.StrictMode>
  );
}
