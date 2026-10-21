import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { User, UserRole } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  Shield,
  GraduationCap,
  PenTool,
  X,
} from 'lucide-react';
import { SignaturePad } from '../common/SignaturePad';

interface UserManagementModuleProps {
  onBackToSettings?: () => void;
}

export const UserManagementModule: React.FC<UserManagementModuleProps> = ({
  onBackToSettings,
}) => {
  const {
    users,
    currentUser,
    setCurrentUser,
    addUser,
    updateUser,
    deleteUser,
    updateSchoolProfile,
    logAuditAction,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureTargetUser, setSignatureTargetUser] = useState<User | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('wali_kelas');
  const [assignedClass, setAssignedClass] = useState<number>(1);
  const [nip, setNip] = useState('');
  const [nuptk, setNuptk] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchNip = (u.nip || '').toLowerCase().includes(q);
        const matchNuptk = (u.nuptk || '').toLowerCase().includes(q);
        const matchEmail = (u.email || '').toLowerCase().includes(q);
        if (!matchName && !matchNip && !matchNuptk && !matchEmail) {
          return false;
        }
      }
      if (filterRole !== 'ALL' && u.role !== filterRole) return false;
      if (filterStatus !== 'ALL') {
        const userStatus = u.status || 'active';
        if (userStatus !== filterStatus) return false;
      }
      return true;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setRole('wali_kelas');
    setAssignedClass(1);
    setNip('');
    setNuptk('');
    setEmail('');
    setPhone('');
    setStatus('active');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setRole(u.role);
    setAssignedClass(u.assignedClass || 1);
    setNip(u.nip || '');
    setNuptk(u.nuptk || '');
    setEmail(u.email || '');
    setPhone(u.phone || '');
    setStatus(u.status || 'active');
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        role,
        assignedClass: role === 'wali_kelas' ? assignedClass : undefined,
        nip,
        nuptk,
        email,
        phone,
        status,
      });

      // Synchronize with school profile if headmaster
      if (role === 'kepala_sekolah') {
        updateSchoolProfile({
          kepalaSekolahNama: name,
          kepalaSekolahNip: nip,
        });
      }
    } else {
      addUser({
        name,
        role,
        assignedClass: role === 'wali_kelas' ? assignedClass : undefined,
        nip,
        nuptk,
        email,
        phone,
        status,
      });
    }

    setIsFormOpen(false);
  };

  const handleToggleStatus = (u: User) => {
    const nextStatus = u.status === 'inactive' ? 'active' : 'inactive';
    updateUser(u.id, { status: nextStatus });
  };

  const handleOpenSignature = (u: User) => {
    setSignatureTargetUser(u);
    setIsSignatureModalOpen(true);
  };

  const handleSaveSignature = (dataUrl: string) => {
    if (!signatureTargetUser) return;
    updateUser(signatureTargetUser.id, { signatureUrl: dataUrl });

    if (signatureTargetUser.role === 'kepala_sekolah') {
      updateSchoolProfile({
        kepalaSekolahTtd: dataUrl,
      });
    }

    logAuditAction(
      'USER_UPDATE',
      `Tanda Tangan Digital: ${signatureTargetUser.name}`,
      'Pembaruan spesimen tanda tangan digital resmi pejabat sekolah.',
      'SUCCESS'
    );
    setIsSignatureModalOpen(false);
  };

  const getRoleBadge = (r: UserRole, cls?: number) => {
    switch (r) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
            <Shield className="w-2.5 h-2.5" />
            Administrator
          </span>
        );
      case 'kepala_sekolah':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            <GraduationCap className="w-2.5 h-2.5" />
            Kepala Sekolah
          </span>
        );
      case 'wali_kelas':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
            Wali Kelas {cls || 1}
          </span>
        );
      case 'tata_usaha':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
            Tata Usaha
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-700/50">
                  Manajemen Hak Akses & Kredensial
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">
                  Enterprise Ready
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1 tracking-tight">
                Direktori Guru, Wali Kelas & Staf Sekolah
              </h2>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                Kelola akun pengajar, NIP/NUPTK, penugasan kelas, stempel spesimen tanda tangan resmi, dan sesi kerja aktif.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onBackToSettings && (
              <button
                onClick={onBackToSettings}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all"
              >
                Kembali
              </button>
            )}
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pengguna Baru</span>
            </button>
          </div>
        </div>

        {/* Current Session Indicator */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-indigo-300 font-bold uppercase text-[10px]">
              Sesi Login Aktif Saat Ini:
            </span>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <strong className="text-white">{currentUser.name}</strong>
              <span className="text-indigo-200 text-[11px]">({currentUser.role})</span>
            </div>
          </div>

          <div className="text-indigo-300/80 text-[11px]">
            Total: <strong>{users.length}</strong> Pengguna Terdaftar •{' '}
            <strong>{users.filter((u) => (u.status || 'active') === 'active').length}</strong> Aktif
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama guru, NIP, NUPTK, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/60"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-700"
          >
            <option value="ALL">Semua Peran</option>
            <option value="admin">Administrator</option>
            <option value="kepala_sekolah">Kepala Sekolah</option>
            <option value="wali_kelas">Wali Kelas</option>
            <option value="tata_usaha">Tata Usaha</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-700"
          >
            <option value="ALL">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isCurrent = currentUser.id === user.id;
          const userStatus = user.status || 'active';

          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                isCurrent
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              } ${userStatus === 'inactive' ? 'opacity-60 bg-slate-50' : ''}`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs ${
                        user.role === 'admin'
                          ? 'bg-red-600'
                          : user.role === 'kepala_sekolah'
                          ? 'bg-blue-600'
                          : user.role === 'wali_kelas'
                          ? 'bg-indigo-600'
                          : 'bg-purple-600'
                      }`}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate">
                        {user.name}
                      </h4>
                      <div className="mt-0.5">
                        {getRoleBadge(user.role, user.assignedClass)}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(user)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 hover:scale-105 transition-all ${
                      userStatus === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Klik untuk mengubah status akun (Aktif / Nonaktif)"
                  >
                    {userStatus === 'active' ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>

                {/* Details list */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">NIP:</span>
                    <span className="font-mono font-medium text-slate-800">
                      {user.nip || '-'}
                    </span>
                  </div>
                  {user.nuptk && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">NUPTK:</span>
                      <span className="font-mono font-medium text-slate-800">
                        {user.nuptk}
                      </span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Email:</span>
                      <span className="truncate max-w-[170px] text-slate-700">{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Kontak:</span>
                      <span className="font-mono text-slate-700">{user.phone}</span>
                    </div>
                  )}
                </div>

                {/* Signature Preview */}
                <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <PenTool className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tanda Tangan Digital:</span>
                  </div>
                  {user.signatureUrl ? (
                    <img
                      src={user.signatureUrl}
                      alt="TTD"
                      className="h-6 max-w-[90px] object-contain border border-slate-200 rounded px-1 bg-white"
                    />
                  ) : (
                    <button
                      onClick={() => handleOpenSignature(user)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      + Tambah TTD
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setCurrentUser(user)}
                  disabled={isCurrent}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isCurrent ? 'Sesi Aktif' : 'Ganti ke Akun Ini'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenSignature(user)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                    title="Ubah Tanda Tangan"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(user)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                    title="Ubah Profil Pengguna"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteUser(user.id)}
                    disabled={isCurrent || users.length <= 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                    title="Hapus Pengguna"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit User Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {editingUser ? 'Perbarui Profil Pengguna' : 'Tambah Pengguna Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Kredensial dan hak otorisasi staf pengajar SD
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Syamsul Bahri, S.Pd.I., Gr."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Peran / Jabatan *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                  >
                    <option value="wali_kelas">Wali Kelas</option>
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="tata_usaha">Tata Usaha</option>
                    <option value="admin">Administrator Sistem</option>
                  </select>
                </div>

                {role === 'wali_kelas' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Wali Rombel Kelas *
                    </label>
                    <select
                      value={assignedClass}
                      onChange={(e) => setAssignedClass(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map((k) => (
                        <option key={k} value={k}>
                          Kelas {k}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {role !== 'wali_kelas' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Status Akun
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Nonaktif</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    NIP (Nomor Induk Pegawai)
                  </label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 198503152010011008"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    NUPTK
                  </label>
                  <input
                    type="text"
                    value={nuptk}
                    onChange={(e) => setNuptk(e.target.value)}
                    placeholder="16 digit NUPTK"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Email Pengguna
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guru@sekolah.sch.id"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nomor Telepon / WA
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signature Capture Modal */}
      {isSignatureModalOpen && signatureTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Spesimen Tanda Tangan Digital
                </h4>
                <p className="text-[11px] text-slate-500">
                  Untuk: <strong>{signatureTargetUser.name}</strong> ({signatureTargetUser.role})
                </p>
              </div>
              <button
                onClick={() => setIsSignatureModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <SignaturePad
              initialSignature={signatureTargetUser.signatureUrl}
              onSave={handleSaveSignature}
            />
          </div>
        </div>
      )}
    </div>
  );
};
