import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import { CampusSwitcherBar } from './CampusSwitcherBar';
import { Pillar1SisModule } from './Pillar1SisModule';
import { Pillar2AcademicsModule } from './Pillar2AcademicsModule';
import { Pillar3GradingModule } from './Pillar3GradingModule';
import { Pillar4FinanceModule } from './Pillar4FinanceModule';
import { Pillar5CommunicationModule } from './Pillar5CommunicationModule';
import { Pillar6AddonsModule } from './Pillar6AddonsModule';
import { V3ApiExplorerModule } from './V3ApiExplorerModule';
import {
  Users,
  Calendar,
  Award,
  DollarSign,
  MessageSquare,
  Package,
  Code2,
  } from 'lucide-react';

export type V3PillarTab =
  | 'sis'
  | 'academics'
  | 'assessment'
  | 'finance'
  | 'communication'
  | 'addons'
  | 'api_explorer';

interface UniversalV3SuiteHubProps {
  initialTab?: V3PillarTab;
}

export const UniversalV3SuiteHub: React.FC<UniversalV3SuiteHubProps> = ({
  initialTab = 'sis',
}) => {
  const { terminology } = useV3App();
  const [activeTab, setActiveTab] = useState<V3PillarTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('v3tab');
      if (
        tabParam === 'sis' ||
        tabParam === 'academics' ||
        tabParam === 'assessment' ||
        tabParam === 'finance' ||
        tabParam === 'communication' ||
        tabParam === 'addons' ||
        tabParam === 'api_explorer'
      ) {
        return tabParam as V3PillarTab;
      }
    }
    return initialTab;
  });

  const pillarTabs = [
    { id: 'sis', label: `Pillar 1: SIS (${terminology.labelStudent})`, icon: Users, badge: 'Lifecycle' },
    { id: 'academics', label: 'Pillar 2: Academics & Jadwal', icon: Calendar, badge: 'Conflict Engine' },
    { id: 'assessment', label: `Pillar 3: Penilaian & ${terminology.labelReportCard}`, icon: Award, badge: 'Multi-Skala' },
    { id: 'finance', label: 'Pillar 4: Keuangan & Payroll', icon: DollarSign, badge: 'Gateways' },
    { id: 'communication', label: 'Pillar 5: Komunikasi & Pengumuman', icon: MessageSquare, badge: 'Omnichannel' },
    { id: 'addons', label: 'Pillar 6: PPDB CRM & Aset/Perpus', icon: Package, badge: 'Value-Adds' },
    { id: 'api_explorer', label: 'NFR: API Documentation Explorer', icon: Code2, badge: 'REST/GraphQL' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Campus & Role Simulation Bar */}
      <CampusSwitcherBar />

      {/* Primary Pillar Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {pillarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as V3PillarTab);
                  if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.set('v3tab', tab.id);
                    window.history.replaceState({}, '', url.toString());
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs scale-[1.01]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'sis' && <Pillar1SisModule />}
        {activeTab === 'academics' && <Pillar2AcademicsModule />}
        {activeTab === 'assessment' && <Pillar3GradingModule />}
        {activeTab === 'finance' && <Pillar4FinanceModule />}
        {activeTab === 'communication' && <Pillar5CommunicationModule />}
        {activeTab === 'addons' && <Pillar6AddonsModule />}
        {activeTab === 'api_explorer' && <V3ApiExplorerModule />}
      </div>
    </div>
  );
};
