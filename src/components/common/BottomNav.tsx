import React from 'react';
import { useApp } from '../../context/AppContext';
import { renderModuleIcon } from '../../modules/moduleRegistry';

export type NavTab =
  | 'dashboard'
  | 'mutasi'
  | 'buku-induk'
  | 'kegiatan'
  | 'rapor'
  | 'cetak-buku'
  | 'users'
  | 'audit-log'
  | 'modules'
  | 'pengaturan'
  | 'universal-v3';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const { modules, currentUser } = useApp();

  // Top 5 enabled modules for mobile bottom bar
  const mobileModules = modules
    .filter((m) => m.isEnabled && m.allowedRoles.includes(currentUser.role))
    .sort((a, b) => a.order - b.order)
    .slice(0, 6);

  const handleMobileClick = (m: (typeof mobileModules)[0]) => {
    if (m.path.includes('?')) {
      window.location.href = m.path;
    } else {
      onChangeTab(m.id as NavTab);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {mobileModules.map((tab) => {
          const isActive =
            currentTab === tab.id ||
            (typeof window !== 'undefined' &&
              window.location.pathname.endsWith(tab.path.split('?')[0]) &&
              tab.id !== 'dashboard');

          return (
            <button
              key={tab.id}
              onClick={() => handleMobileClick(tab)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-600 scale-105' : ''
                }`}
              >
                {renderModuleIcon(tab.iconName, 'w-5 h-5')}
              </div>
              <span className="text-[10px] leading-tight mt-0.5 truncate max-w-[56px] text-center">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

