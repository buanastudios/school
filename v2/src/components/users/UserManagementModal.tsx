import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { User, UserRole } from '../../types';
import { X, Users, Check, UserPlus, Trash2, Edit2 } from 'lucide-react';
import { SignaturePad } from '../common/SignaturePad';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, setCurrentUser, addUser, updateUser, deleteUser, schoolProfile, updateSchoolProfile } = useApp();

  const [activeTab, setActiveTab] = useState<'switch' | 'manage' | 'signature'>('switch');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('wali_kelas');
  const [assignedClass, setAssignedClass] = useState<number>(1);
  const [nip, setNip] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingUser(null);
    setName('');
    setRole('wali_kelas');
    setAssignedClass(1);
    setNip('');
    setEmail('');
    setActiveTab('manage');
  };

  const handleStartEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setRole(u.role);
    setAssignedClass(u.assignedClass || 1);
    setNip(u.nip || '');
    setEmail(u.email || '');
    setActiveTab('manage');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        role,
        assignedClass: role === 'wali_kelas' ? assignedClass : undefined,
        nip,
        email,
      });
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
        email,
      });
    }

    setActiveTab('switch');
  };

  const handleSaveHeadmasterSignature = (dataUrl: string) => {
    updateSchoolProfile({
      kepalaSekolahTtd: dataUrl,
    });
    // Also update headmaster user
    const ks = users.find((u) => u.role === 'kepala_sekolah');
    if (ks) {
      updateUser(ks.id, { signatureUrl: dataUrl });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Manajemen Guru & Pengguna
              </h3>
              <p className="text-xs text-slate-500">
                Pilih pengguna aktif atau atur profil Wali Kelas & Kepala Sekolah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-slate-50/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('switch')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'switch'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pilih Pengguna Aktif
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'manage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {editingUser ? 'Edit Pengguna' : 'Tambah Guru'}
          </button>
          <button
            onClick={() => setActiveTab('signature')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'signature'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tanda Tangan Kepsek
          </button>
        </div>

        {/* TAB 1: QUICK SWITCH */}
        {activeTab === 'switch' && (
          <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Daftar Wali Kelas & Pejabat
              </span>
              <button
                onClick={handleStartAdd}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Tambah Guru Baru</span>
              </button>
            </div>

            <div className="space-y-2">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => setCurrentUser(u)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {u.role === 'wali_kelas'
                            ? `Wali Kelas ${u.assignedClass}`
                            : u.role === 'kepala_sekolah'
                            ? 'Kepala Sekolah'
                            : 'Tata Usaha / Admin'}
                          {u.nip ? ` • NIP. ${u.nip}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                          <Check className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Klik untuk aktifkan
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(u);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60"
                        title="Edit data"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE / ADD FORM */}
        {activeTab === 'manage' && (
          <form onSubmit={handleSaveUser} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Neni Rohaeni, S.Pd."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peran / Jabatan *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="wali_kelas">Wali Kelas</option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                  <option value="tata_usaha">Tata Usaha</option>
                  <option value="admin">Admin Operator</option>
                </select>
              </div>

              {role === 'wali_kelas' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas Binaan *
                  </label>
                  <select
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((k) => (
                      <option key={k} value={k}>
                        Kelas {k}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NIP / NUPTK
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 197508202005012003"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {editingUser && editingUser.id !== currentUser.id ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Hapus pengguna ${editingUser.name}?`)) {
                      deleteUser(editingUser.id);
                      setActiveTab('switch');
                    }
                  }}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('switch')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? 'Simpan Perubahan' : 'Tambah Guru'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: DIGITAL SIGNATURE FOR HEADMASTER */}
        {activeTab === 'signature' && (
          <div className="p-5 space-y-4">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900">
              <p className="font-bold">Pengesahan Tanda Tangan Resmi Kepala Sekolah</p>
              <p className="text-[11px] mt-0.5">
                Tanda tangan ini akan otomatis tertera pada cetakan Buku Mutasi Murid dan Buku Induk Register Kurikulum Merdeka.
              </p>
            </div>

            <SignaturePad
              initialSignature={schoolProfile.kepalaSekolahTtd}
              onSave={handleSaveHeadmasterSignature}
              title={`Tanda Tangan: ${schoolProfile.kepalaSekolahNama}`}
              subtitle="Goreskan tanda tangan menggunakan layar sentuh smartphone/tablet atau mouse"
            />
          </div>
        )}
      </div>
    </div>
  );
};
