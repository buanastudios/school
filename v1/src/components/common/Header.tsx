import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { School, UserCheck, ChevronDown, Printer, LogOut, LogIn } from 'lucide-react';
import type { User } from '../../types';

interface HeaderProps {
  onOpenUserModal: () => void;
  onOpenPrintModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUserModal,
  onOpenPrintModal,
  onOpenSettingsModal,
}) => {
  const { schoolProfile, currentUser, users, setCurrentUser, logout } = useApp();
  const [showQuickSwitch, setShowQuickSwitch] = useState(false);

  const getRoleBadge = (user: User) => {
    switch (user.role) {
      case 'kepala_sekolah':
        return { label: 'Kepala Sekolah', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'wali_kelas':
        return { label: `Wali Kelas ${user.assignedClass}`, bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'tata_usaha':
        return { label: 'Tata Usaha', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      default:
        return { label: 'Admin', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const badge = getRoleBadge(currentUser);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 py-2.5 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* School branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate leading-tight">
                {schoolProfile.namaSekolah}
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                NPSN {schoolProfile.npsn}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <span>{schoolProfile.kecamatan}, {schoolProfile.kabupatenKota}</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-indigo-600">TP {schoolProfile.tahunPelajaran}</span>
            </p>
          </div>
        </div>

        {/* Right side: User Switcher & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Print CTA button */}
          <button
            onClick={onOpenPrintModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs border border-indigo-200 transition-colors shadow-2xs"
            title="Cetak Buku Mutasi / Buku Induk"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Cetak Buku</span>
          </button>

          {/* User badge with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickSwitch(!showQuickSwitch)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 transition-colors text-left"
              title="Ganti Guru / Pengguna"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left max-w-[130px]">
                <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                  {currentUser.name}
                </p>
                <span className={`inline-block text-[9px] px-1 rounded font-semibold border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Quick Switch Dropdown */}
            {showQuickSwitch && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowQuickSwitch(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Pilih Guru / Pengguna
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Login instan sebagai Wali Kelas atau Kepala Sekolah
                    </p>
                  </div>

                  <div className="max-h-64 overflow-y-auto py-1">
                    {users.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      const uBadge = getRoleBadge(u);
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUser(u);
                            setShowQuickSwitch(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-slate-50 transition-colors ${
                            isCurrent ? 'bg-indigo-50/60 font-semibold text-indigo-900' : 'text-slate-700'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate font-medium">{u.name}</p>
                            <span className={`inline-block text-[9px] px-1 rounded font-semibold border ${uBadge.bg}`}>
                              {uBadge.label}
                            </span>
                          </div>
                          {isCurrent && <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 px-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setShowQuickSwitch(false);
                        onOpenUserModal();
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold py-1"
                    >
                      Kelola Pengguna
                    </button>
                    <button
                      onClick={() => {
                        setShowQuickSwitch(false);
                        onOpenSettingsModal();
                      }}
                      className="text-slate-500 hover:text-slate-700 py-1"
                    >
                      Profil Sekolah
                    </button>
                  </div>

                  <div className="pt-2 px-3 border-t border-slate-100 space-y-1">
                    <a
                      href="login.html"
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5 text-blue-600" />
                      <span>Halaman Login & Register</span>
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = 'login.html';
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
