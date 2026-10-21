import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { AuditActionType } from '../../types';
import {
  ShieldCheck,
  Search,
  Trash2,
  Clock,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  FileCode,
  ArrowUpDown,
} from 'lucide-react';

interface AuditLogModuleProps {
  onBackToSettings?: () => void;
}

export const AuditLogModule: React.FC<AuditLogModuleProps> = ({ onBackToSettings }) => {
  const { auditLogs, currentUser, clearAuditLogs, logAuditAction } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filtered & Sorted Audit Logs
  const filteredLogs = useMemo(() => {
    return auditLogs
      .filter((entry) => {
        // Search Filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchActor = entry.actorName.toLowerCase().includes(q);
          const matchTarget = entry.targetEntity.toLowerCase().includes(q);
          const matchDetails = entry.details.toLowerCase().includes(q);
          const matchAction = entry.action.toLowerCase().includes(q);
          if (!matchActor && !matchTarget && !matchDetails && !matchAction) {
            return false;
          }
        }

        // Action Type Filter
        if (selectedAction !== 'ALL' && entry.action !== selectedAction) {
          return false;
        }

        // Status Filter
        if (selectedStatus !== 'ALL' && entry.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [auditLogs, searchTerm, selectedAction, selectedStatus, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const successCount = auditLogs.filter((l) => l.status === 'SUCCESS').length;
    const warningCount = auditLogs.filter((l) => l.status === 'WARNING').length;
    const failedCount = auditLogs.filter((l) => l.status === 'FAILED').length;
    const adminActions = auditLogs.filter((l) => l.actorRole === 'admin').length;
    return { total, successCount, warningCount, failedCount, adminActions };
  }, [auditLogs]);

  // Security Guard: Audit Log is strictly restricted to Admin users
  const isAdmin = currentUser.role === 'admin';

  // If unauthorized user tries to view audit logs, render enterprise security denial
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
            Log Audit Sistem dan Rekam Jejak Aktivitas berisi rekam kepatuhan integritas data tingkat institusi dan hanya dapat diakses oleh akun dengan peran <strong>Administrator Sistem (Admin)</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 font-mono">
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>ID Pengguna:</span>
            <span className="font-bold text-slate-800">{currentUser.id}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Nama Pengguna:</span>
            <span className="font-bold text-slate-800">{currentUser.name}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Peran Pengguna:</span>
            <span className="font-bold text-red-700 uppercase">{currentUser.role}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Status Kepatuhan:</span>
            <span className="font-bold text-amber-700">403 UNAUTHORIZED ATTEMPT LOGGED</span>
          </div>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          {onBackToSettings && (
            <button
              onClick={onBackToSettings}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              Kembali ke Menu Pengaturan
            </button>
          )}
        </div>
      </div>
    );
  }

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['ID Log', 'Waktu (ISO)', 'Aksi', 'Aktor', 'Peran', 'Target Entitas', 'Detail', 'Status', 'IP'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.action,
      `"${l.actorName.replace(/"/g, '""')}"`,
      l.actorRole,
      `"${l.targetEntity.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.status,
      l.ipAddress || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `buana_school_audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    logAuditAction(
      'DATA_EXPORT',
      'Log Audit CSV',
      `Ekspor ${filteredLogs.length} rekaman audit log ke format CSV oleh Administrator.`,
      'SUCCESS'
    );
  };

  // Export to JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `buana_school_audit_log_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    logAuditAction(
      'DATA_EXPORT',
      'Log Audit JSON',
      `Ekspor ${filteredLogs.length} rekaman audit log ke format JSON oleh Administrator.`,
      'SUCCESS'
    );
  };

  const getActionBadgeColor = (action: AuditActionType) => {
    if (action.startsWith('AUTH_')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.startsWith('USER_')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (action.startsWith('STUDENT_')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.startsWith('GRADE_') || action.startsWith('RAPOR_')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (action.startsWith('MUTATION_')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (action.startsWith('MODULE_') || action.startsWith('MENU_')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    if (action === 'SECURITY_ALERT') return 'bg-red-50 text-red-700 border-red-200 font-bold';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-5">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-700/50">
                  Modul Kepatuhan & Audit
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">
                  Strict Admin Only
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1 tracking-tight">
                Log Audit Keamanan & Rekam Aktivitas Sistem
              </h2>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Pencatatan tamper-evident untuk setiap mutasi siswa, input nilai, perubahan konfigurasi menu, dan login pengguna.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all"
              title="Ekspor ke CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all"
              title="Ekspor ke JSON"
            >
              <FileCode className="w-4 h-4 text-cyan-300" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold text-xs border border-red-400/30 transition-all"
              title="Arsipkan dan bersihkan log audit"
            >
              <Trash2 className="w-4 h-4" />
              <span>Bersihkan</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-indigo-300 font-bold uppercase block">Total Catatan</span>
            <span className="text-xl font-black">{stats.total}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold uppercase block">Berhasil (Success)</span>
            <span className="text-xl font-black text-emerald-400">{stats.successCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-amber-300 font-bold uppercase block">Peringatan (Warning)</span>
            <span className="text-xl font-black text-amber-400">{stats.warningCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-red-300 font-bold uppercase block">Peringatan Keamanan</span>
            <span className="text-xl font-black text-red-400">{stats.failedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-indigo-300 font-bold uppercase block">Aksi Administrator</span>
            <span className="text-xl font-black text-indigo-200">{stats.adminActions}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama pengguna, target entitas, aksi, atau detail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/60"
            />
          </div>

          {/* Action Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-700"
            >
              <option value="ALL">Semua Jenis Aksi</option>
              <option value="AUTH_LOGIN">AUTH: Login</option>
              <option value="AUTH_SWITCH_USER">AUTH: Ganti Sesi</option>
              <option value="USER_CREATE">USER: Tambah Pengguna</option>
              <option value="USER_UPDATE">USER: Update Pengguna</option>
              <option value="USER_DELETE">USER: Hapus Pengguna</option>
              <option value="STUDENT_CREATE">STUDENT: Siswa Baru</option>
              <option value="STUDENT_UPDATE">STUDENT: Update Siswa</option>
              <option value="GRADE_UPDATE">RAPOR: Update Nilai</option>
              <option value="RAPOR_GENERATE">RAPOR: Terbitkan Rapor</option>
              <option value="MUTATION_CREATE">MUTASI: Catat Mutasi</option>
              <option value="MODULE_CONFIG_UPDATE">MODUL: Konfigurasi Modul</option>
              <option value="MENU_CONFIG_UPDATE">MENU: Susun Menu</option>
              <option value="SYSTEM_SETTINGS_UPDATE">SISTEM: Pengaturan</option>
              <option value="DATA_EXPORT">DATA: Ekspor</option>
              <option value="DATA_IMPORT">DATA: Impor</option>
              <option value="SECURITY_ALERT">ALERT: Keamanan</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-700"
            >
              <option value="ALL">Semua Status</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="WARNING">WARNING</option>
              <option value="FAILED">FAILED</option>
            </select>

            {/* Sort Direction */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              title="Urutkan Waktu"
            >
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <span>{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
            </button>
          </div>
        </div>

        {/* Quick summary of filtered count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Menampilkan <strong>{filteredLogs.length}</strong> dari {auditLogs.length} entri audit
          </span>
          {(searchTerm || selectedAction !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedAction('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3 w-36">Waktu Kejadian</th>
                <th className="py-3 px-3 w-40">Aksi Sistem</th>
                <th className="py-3 px-3 w-44">Aktor / Pengguna</th>
                <th className="py-3 px-3 w-48">Target Entitas</th>
                <th className="py-3 px-3">Rincian Perubahan</th>
                <th className="py-3 px-3 w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">Tidak ada catatan audit yang cocok dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const dateObj = new Date(log.timestamp);
                  const formattedDate = dateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const formattedTime = dateObj.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono ml-5 block">
                          {formattedTime} WIB
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 truncate">{log.actorName}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span className="uppercase font-semibold text-indigo-600 bg-indigo-50 px-1.5 rounded">
                            {log.actorRole}
                          </span>
                          {log.ipAddress && (
                            <span className="font-mono text-slate-400">• {log.ipAddress}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block">{log.targetEntity}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 leading-relaxed max-w-md">
                        {log.details}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {log.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            SUCCESS
                          </span>
                        ) : log.status === 'WARNING' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            WARN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                            <XCircle className="w-3 h-3" />
                            FAILED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Logs */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-slate-900 text-base">Arsipkan & Bersihkan Log Audit?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tindakan ini akan mengarsipkan seluruh riwayat aktivitas yang ada saat ini. Catatan awal baru akan dibuat untuk merekam tindakan pembersihan ini.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  clearAuditLogs();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Ya, Bersihkan Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
