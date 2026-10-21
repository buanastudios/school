import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { renderModuleIcon } from '../../modules/moduleRegistry';
import {
  Blocks,
  ArrowUp,
  ArrowDown,
  Shield,
  Lock,
  Check,
  Eye,
  EyeOff,
  Users,
} from 'lucide-react';

interface ModuleManagementModuleProps {
  onBackToSettings?: () => void;
}

export const ModuleManagementModule: React.FC<ModuleManagementModuleProps> = ({
  onBackToSettings,
}) => {
  const { modules, toggleModule, reorderModules, updateModuleRoles, currentUser } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [editingRolesForModuleId, setEditingRolesForModuleId] = useState<string | null>(null);

  // Security Guard: Module management is strictly Admin only
  const isAdmin = currentUser.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-red-600 uppercase bg-red-100/60 px-3 py-1 rounded-full border border-red-200">
            Akses Keamanan Dibatasi • Admin Only
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-2">
            Hak Akses Administrator Diperlukan
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Manajemen Modul & Tata Susunan Menu mengubah struktur arsitektur navigasi sistem dan hak otorisasi peran. Fitur ini hanya dapat dikonfigurasi oleh <strong>Administrator Sistem (Admin)</strong>.
          </p>
        </div>

        {onBackToSettings && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={onBackToSettings}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              Kembali ke Menu Pengaturan
            </button>
          </div>
        )}
      </div>
    );
  }

  // Sorted modules according to order
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  // Filtered by category
  const filteredModules =
    filterCategory === 'ALL'
      ? sortedModules
      : sortedModules.filter((m) => m.category === filterCategory);

  const categories = ['ALL', 'Utama', 'Kesiswaan', 'Akademik', 'Administrasi', 'Sistem & Keamanan'];

  const availableRoles: { id: UserRole; label: string }[] = [
    { id: 'admin', label: 'Administrator' },
    { id: 'kepala_sekolah', label: 'Kepala Sekolah' },
    { id: 'wali_kelas', label: 'Wali Kelas' },
    { id: 'tata_usaha', label: 'Tata Usaha' },
  ];

  // Move Module Up in Order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const currentList = [...sortedModules];
    const temp = currentList[index - 1];
    currentList[index - 1] = currentList[index];
    currentList[index] = temp;
    reorderModules(currentList.map((m) => m.id));
  };

  // Move Module Down in Order
  const handleMoveDown = (index: number) => {
    if (index === sortedModules.length - 1) return;
    const currentList = [...sortedModules];
    const temp = currentList[index + 1];
    currentList[index + 1] = currentList[index];
    currentList[index] = temp;
    reorderModules(currentList.map((m) => m.id));
  };

  // Toggle Role for a Module
  const handleToggleRole = (moduleId: string, role: UserRole) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;

    let updatedRoles: UserRole[];
    if (mod.allowedRoles.includes(role)) {
      // Must retain at least 'admin' if it's a security/admin module
      if (role === 'admin' && (mod.id === 'modules' || mod.id === 'audit-log')) {
        return;
      }
      updatedRoles = mod.allowedRoles.filter((r) => r !== role);
      if (updatedRoles.length === 0) updatedRoles = ['admin']; // At least 1 role
    } else {
      updatedRoles = [...mod.allowedRoles, role];
    }

    updateModuleRoles(moduleId, updatedRoles);
  };

  const handleApplyRolePreset = (moduleId: string, preset: 'ALL' | 'MANAGEMENT' | 'ADMIN') => {
    let roles: UserRole[] = [];
    if (preset === 'ALL') {
      roles = ['admin', 'kepala_sekolah', 'wali_kelas', 'tata_usaha'];
    } else if (preset === 'MANAGEMENT') {
      roles = ['admin', 'kepala_sekolah', 'tata_usaha'];
    } else if (preset === 'ADMIN') {
      roles = ['admin'];
    }
    updateModuleRoles(moduleId, roles);
  };

  return (
    <div className="space-y-5">
      {/* Module Management Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
              <Blocks className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-700/50">
                  Arsitektur Modular Plug-and-Play
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/50">
                  Zero-Downtime Hot Swapping
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1 tracking-tight">
                Manajemen Modul & Tata Menu Navigasi
              </h2>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Aktifkan, nonaktifkan, susun urutan, dan kelola otorisasi hak akses modul secara dinamis tanpa mengganggu proses kerja sekolah yang sedang berjalan di produksi.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Proteksi Modul Inti</span>
              <p className="text-[11px] text-indigo-200/70">
                Modul kritis (Dasbor, Modul Manager, Pengaturan) dilindungi dari penonaktifan tidak sengaja.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Eye className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Sinkronisasi Real-Time</span>
              <p className="text-[11px] text-indigo-200/70">
                Perubahan status modul langsung memperbarui bilah navigasi Sidebar & Mobile Nav instan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <Users className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Role-Based Access Control</span>
              <p className="text-[11px] text-indigo-200/70">
                Atur granularitas peran guru, wali kelas, tata usaha, dan pimpinan secara spesifik per modul.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 mr-1">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Modul' : cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total: <strong>{modules.length}</strong> Modul • <strong>{modules.filter((m) => m.isEnabled).length}</strong> Aktif
        </div>
      </div>

      {/* Modules List Grid */}
      <div className="space-y-3">
        {filteredModules.map((moduleDef) => {
          const globalIndex = sortedModules.findIndex((m) => m.id === moduleDef.id);
          const isFirst = globalIndex === 0;
          const isLast = globalIndex === sortedModules.length - 1;
          const isEditingRole = editingRolesForModuleId === moduleDef.id;

          return (
            <div
              key={moduleDef.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                moduleDef.isEnabled
                  ? 'border-slate-200 hover:border-indigo-300'
                  : 'border-slate-200 bg-slate-50/70 opacity-80'
              }`}
            >
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Icon, Name, Category, Order */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Order Rank Badge */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono font-bold text-slate-400">#</span>
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono font-black text-xs flex items-center justify-center border border-slate-200">
                      {moduleDef.order}
                    </span>
                  </div>

                  {/* Module Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      moduleDef.isEnabled
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {renderModuleIcon(moduleDef.iconName, 'w-5 h-5')}
                  </div>

                  {/* Title & Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {moduleDef.name}
                      </h3>

                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                        {moduleDef.code}
                      </span>

                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        {moduleDef.category}
                      </span>

                      {moduleDef.isCore && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300">
                          <Lock className="w-2.5 h-2.5" />
                          Modul Inti Dilindungi
                        </span>
                      )}

                      {moduleDef.badge && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {moduleDef.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {moduleDef.description}
                    </p>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span>Rute: <code className="text-slate-600 font-semibold">{moduleDef.path}</code></span>
                      <span>Versi: <strong className="text-slate-600">{moduleDef.version}</strong></span>
                      <span>Pengembang: <strong className="text-slate-600">{moduleDef.author || 'BUANA STUDIOS'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Controls (Move Up/Down, Edit Roles, Toggle Status) */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 self-end md:self-center">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      onClick={() => handleMoveUp(globalIndex)}
                      disabled={isFirst}
                      className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                      title="Geser Urutan ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200" />
                    <button
                      onClick={() => handleMoveDown(globalIndex)}
                      disabled={isLast}
                      className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                      title="Geser Urutan ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Roles Configuration Trigger */}
                  <button
                    onClick={() =>
                      setEditingRolesForModuleId(isEditingRole ? null : moduleDef.id)
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isEditingRole
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Akses ({moduleDef.allowedRoles.length} Peran)</span>
                  </button>

                  {/* Toggle On/Off Switch */}
                  <button
                    onClick={() => toggleModule(moduleDef.id)}
                    disabled={moduleDef.isCore}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-xs ${
                      moduleDef.isCore
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : moduleDef.isEnabled
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-800 text-white'
                    }`}
                    title={
                      moduleDef.isCore
                        ? 'Modul inti tidak dapat dinonaktifkan demi keselamatan operasional sistem'
                        : moduleDef.isEnabled
                        ? 'Klik untuk menonaktifkan modul (sembunyikan dari menu)'
                        : 'Klik untuk mengaktifkan modul'
                    }
                  >
                    {moduleDef.isEnabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Aktif (Tampil)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Nonaktif (Sembunyi)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Role Configuration Panel */}
              {isEditingRole && (
                <div className="p-4 bg-indigo-50/50 border-t border-indigo-100 animate-in fade-in duration-150 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Pengaturan Otorisasi Peran: {moduleDef.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Tentukan peran pengguna yang diizinkan mengakses modul ini pada menu navigasi.
                      </p>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-slate-400 font-bold">Preset:</span>
                      <button
                        onClick={() => handleApplyRolePreset(moduleDef.id, 'ALL')}
                        className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-slate-700"
                      >
                        Semua Peran
                      </button>
                      <button
                        onClick={() => handleApplyRolePreset(moduleDef.id, 'MANAGEMENT')}
                        className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-slate-700"
                      >
                        Pimpinan & TU
                      </button>
                      <button
                        onClick={() => handleApplyRolePreset(moduleDef.id, 'ADMIN')}
                        className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 font-bold text-slate-700"
                      >
                        Admin Saja
                      </button>
                    </div>
                  </div>

                  {/* Role Checkboxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {availableRoles.map((role) => {
                      const isChecked = moduleDef.allowedRoles.includes(role.id);
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleToggleRole(moduleDef.id, role.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                            isChecked
                              ? 'bg-white border-indigo-500 text-indigo-900 shadow-xs'
                              : 'bg-white/60 border-slate-200 text-slate-500 hover:bg-white'
                          }`}
                        >
                          <span>{role.label}</span>
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                              isChecked
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
