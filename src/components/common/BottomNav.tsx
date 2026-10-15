import React from 'react';
import { LayoutDashboard, ArrowLeftRight, BookOpen, Trophy, Printer, Settings } from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'mutasi'
  | 'buku-induk'
  | 'kegiatan'
  | 'cetak-buku'
  | 'pengaturan';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Beranda', icon: LayoutDashboard },
    { id: 'mutasi' as NavTab, label: 'Mutasi', icon: ArrowLeftRight },
    { id: 'buku-induk' as NavTab, label: 'Buku Induk', icon: BookOpen },
    { id: 'kegiatan' as NavTab, label: 'Ekskul', icon: Trophy },
    { id: 'cetak-buku' as NavTab, label: 'Cetak', icon: Printer },
    { id: 'pengaturan' as NavTab, label: 'Menu', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
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
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">{tab.label}</span>
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
