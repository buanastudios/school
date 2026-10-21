import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import type { SchoolTier, V3UserRole } from '../../types/v3';
import {
  Building2,
  GraduationCap,
  Users,
  Globe,
  Palette,
  Clock,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { WhiteLabelCustomizerModal } from './WhiteLabelCustomizerModal';

export const CampusSwitcherBar: React.FC = () => {
  const {
    campuses,
    activeCampusId,
    setActiveCampusId,
    activeCampus,
    schoolTier,
    setSchoolTier,
    terminology,
    activeRole,
    setActiveRole,
    language,
    setLanguage,
    timezone,
    } = useV3App();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const tierOptions: { tier: SchoolTier; label: string }[] = [
    { tier: 'k12', label: 'Sekolah Dasar / K-12' },
    { tier: 'higher_ed', label: 'Universitas / Institut' },
    { tier: 'pesantren', label: 'Pesantren / Islamic Boarding' },
    { tier: 'vocational', label: 'SMK / Vokasi' },
    { tier: 'adult_learning', label: 'Diklat / Adult Learning' },
  ];

  const roleOptions: { role: V3UserRole; label: string; badgeColor: string }[] = [
    { role: 'super_admin', label: 'Super Admin (Umbrella Master)', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200' },
    { role: 'school_admin', label: 'School Admin (Kepala Sekolah/Ops)', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { role: 'teacher', label: `${terminology.labelTeacher}`, badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { role: 'accountant', label: 'Accountant (Bendahara/Keuangan)', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
    { role: 'parent', label: 'Parent (Orang Tua / Wali Murid)', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
    { role: 'student', label: `${terminology.labelStudent}`, badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  ];

  const activeRoleConfig = roleOptions.find((r) => r.role === activeRole) || roleOptions[0];

  return (
    <>
      <div className="bg-slate-900 text-slate-200 text-xs px-3 py-1.5 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* LEFT: Multi-Campus & Umbrella Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              <Sparkles className="w-3 h-3 text-amber-400" />
              v3.0 Universal Core
            </span>

            {/* Campus Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
                title="Pilih Kampus / Cabang Sekolah (PRD Section 1: Multi-Campus Management)"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="max-w-[170px] sm:max-w-[220px] truncate">{activeCampus.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {showCampusDropdown && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 border-b border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Multi-Campus Umbrella Network
                    </p>
                  </div>
                  {campuses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCampusId(c.id);
                        setShowCampusDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-700/70 transition-colors ${
                        c.id === activeCampusId ? 'bg-blue-600/30 text-blue-300 font-bold' : 'text-slate-200'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{c.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{c.city} • {c.totalStudents} Siswa • {c.totalStaff} Staf</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Educational Tier / Terminology Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/70 text-[11px]">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={schoolTier}
                onChange={(e) => setSchoolTier(e.target.value as SchoolTier)}
                className="bg-transparent text-slate-200 font-medium outline-none cursor-pointer"
                title="Pilih Tingkat Pendidikan untuk Dynamic Terminology Mapping (PRD Section 1)"
              >
                {tierOptions.map((opt) => (
                  <option key={opt.tier} value={opt.tier} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT: Role Simulator, White-Label Customizer & i18n */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {/* 6-Role Granular RBAC Simulator Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium transition-colors"
                title="Simulasi Peran Akses RBAC 6 Peran (PRD Section 1: Granular RBAC)"
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-bold">{activeRoleConfig.label.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-1.5 z-50">
                  <div className="px-3 py-1 border-b border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Uji Hak Akses RBAC (6 Peran)
                    </p>
                  </div>
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        setActiveRole(opt.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700 transition-colors ${
                        opt.role === activeRole ? 'bg-indigo-600/30 font-bold text-indigo-300' : 'text-slate-200'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${opt.badgeColor}`}>
                        {opt.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* White-Label Theme Customizer Modal Trigger */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors text-[11px] shadow-xs"
              title="Kustomisasi White-Label: Logo, Tema Warna, Custom Domain & Signature"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">White-Label Branding</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-colors"
              title="Ganti Bahasa (i18n Localization: ID / EN)"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Timezone pill */}
            <div className="hidden xl:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-700/50">
              <Clock className="w-3 h-3" />
              <span>{timezone.split('/')[1] || timezone} (WIB)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal White-Label Customizer */}
      {isThemeModalOpen && (
        <WhiteLabelCustomizerModal onClose={() => setIsThemeModalOpen(false)} />
      )}
    </>
  );
};
