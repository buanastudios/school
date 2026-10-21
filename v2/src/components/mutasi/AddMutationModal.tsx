import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { StudentMutation, MutationType, Gender } from '../../types';
import { X, UserPlus, UserMinus, Check } from 'lucide-react';

interface AddMutationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: MutationType;
  editingMutation?: StudentMutation | null;
}

export const AddMutationModal: React.FC<AddMutationModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'masuk',
  editingMutation,
}) => {
  const { addMutation, updateMutation, currentUser, schoolProfile } = useApp();

  const [type, setType] = useState<MutationType>(defaultType);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [namaSiswa, setNamaSiswa] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<Gender>('L');
  const [noInduk, setNoInduk] = useState('');
  const [nisn, setNisn] = useState('');
  const [kelas, setKelas] = useState<number>(
    currentUser.role === 'wali_kelas' && currentUser.assignedClass ? currentUser.assignedClass : 1
  );

  // For Keluar
  const [noSuratPindah, setNoSuratPindah] = useState('');
  const [keteranganPindah, setKeteranganPindah] = useState('');

  // For Masuk
  const [asalSekolah, setAsalSekolah] = useState('');
  const [noIndukAsal, setNoIndukAsal] = useState('');
  const [kelasAsal, setKelasAsal] = useState('');
  const [persetujuanKanwilTgl, setPersetujuanKanwilTgl] = useState('');
  const [persetujuanKanwilNomor, setPersetujuanKanwilNomor] = useState('');

  useEffect(() => {
    if (editingMutation) {
      setType(editingMutation.type);
      setTanggal(editingMutation.tanggal);
      setNamaSiswa(editingMutation.namaSiswa);
      setJenisKelamin(editingMutation.jenisKelamin);
      setNoInduk(editingMutation.noInduk);
      setNisn(editingMutation.nisn);
      setKelas(editingMutation.kelas);
      setNoSuratPindah(editingMutation.noSuratPindah || '');
      setKeteranganPindah(editingMutation.keteranganPindah || '');
      setAsalSekolah(editingMutation.asalSekolah || '');
      setNoIndukAsal(editingMutation.noIndukAsal || '');
      setKelasAsal(editingMutation.kelasAsal || '');
      setPersetujuanKanwilTgl(editingMutation.persetujuanKanwilTgl || '');
      setPersetujuanKanwilNomor(editingMutation.persetujuanKanwilNomor || '');
    } else {
      setType(defaultType);
      setTanggal(new Date().toISOString().split('T')[0]);
      setNamaSiswa('');
      setJenisKelamin('L');
      setNoInduk('');
      setNisn('');
      if (currentUser.role === 'wali_kelas' && currentUser.assignedClass) {
        setKelas(currentUser.assignedClass);
      }
      setNoSuratPindah(`421.2/${Math.floor(Math.random() * 900 + 100)}/SDM-2/${new Date().getFullYear()}`);
      setKeteranganPindah('');
      setAsalSekolah('');
      setNoIndukAsal('');
      setKelasAsal('');
      setPersetujuanKanwilTgl('');
      setPersetujuanKanwilNomor('');
    }
  }, [editingMutation, defaultType, isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim()) return;

    const dateObj = new Date(tanggal);
    const bulan = dateObj.getMonth() + 1; // 1-12
    const tahun = dateObj.getFullYear();

    if (editingMutation) {
      updateMutation(editingMutation.id, {
        type,
        tanggal,
        namaSiswa,
        jenisKelamin,
        noInduk,
        nisn,
        kelas,
        noSuratPindah: type === 'keluar' ? noSuratPindah : undefined,
        keteranganPindah: type === 'keluar' ? keteranganPindah : undefined,
        asalSekolah: type === 'masuk' ? asalSekolah : undefined,
        noIndukAsal: type === 'masuk' ? noIndukAsal : undefined,
        kelasAsal: type === 'masuk' ? kelasAsal : undefined,
        persetujuanKanwilTgl: type === 'masuk' ? persetujuanKanwilTgl : undefined,
        persetujuanKanwilNomor: type === 'masuk' ? persetujuanKanwilNomor : undefined,
        bulan,
        tahun,
      });
    } else {
      addMutation({
        type,
        tanggal,
        namaSiswa,
        jenisKelamin,
        noInduk: noInduk || `${tahun.toString().slice(-2)}${(kelas * 1000 + Math.floor(Math.random() * 900))}`,
        nisn: nisn || `01${Math.floor(Math.random() * 90000000 + 10000000)}`,
        kelas,
        noSuratPindah: type === 'keluar' ? noSuratPindah : undefined,
        keteranganPindah: type === 'keluar' ? keteranganPindah : undefined,
        asalSekolah: type === 'masuk' ? asalSekolah : undefined,
        noIndukAsal: type === 'masuk' ? noIndukAsal : undefined,
        kelasAsal: type === 'masuk' ? kelasAsal : undefined,
        persetujuanKanwilTgl: type === 'masuk' ? persetujuanKanwilTgl : undefined,
        persetujuanKanwilNomor: type === 'masuk' ? persetujuanKanwilNomor : undefined,
        bulan,
        tahun,
        tahunPelajaran: schoolProfile.tahunPelajaran,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                type === 'masuk' ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            >
              {type === 'masuk' ? <UserPlus className="w-5 h-5" /> : <UserMinus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {editingMutation ? 'Edit Data Mutasi' : type === 'masuk' ? 'Input Murid Masuk' : 'Input Murid Keluar'}
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan resmi ke dalam Buku Mutasi Murid
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Toggle Type if not editing */}
          {!editingMutation && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setType('masuk')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  type === 'masuk'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Mutasi Masuk</span>
              </button>
              <button
                type="button"
                onClick={() => setType('keluar')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  type === 'keluar'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserMinus className="w-4 h-4" />
                <span>Mutasi Keluar</span>
              </button>
            </div>
          )}

          {/* Tanggal & Kelas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal {type === 'masuk' ? 'Masuk' : 'Keluar'} *
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat Kelas *
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(Number(e.target.value))}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nama Siswa & Jenis Kelamin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Muhammad Fhadil"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenis Kelamin *
              </label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value as Gender)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="L">L (Laki-laki)</option>
                <option value="P">P (Perempuan)</option>
              </select>
            </div>
          </div>

          {/* No Induk & NISN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. Induk Siswa (NIS)
              </label>
              <input
                type="text"
                placeholder="Contoh: 2425010001"
                value={noInduk}
                onChange={(e) => setNoInduk(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NISN (Nasional)
              </label>
              <input
                type="text"
                placeholder="Contoh: 3173495404"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* Specific Fields for Mutasi Keluar */}
          {type === 'keluar' && (
            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-3">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                Rincian Surat Pindah (Keluar)
              </h4>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. Surat Pindah Sekolah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 421.2/084/SDM-2/X/2023"
                  value={noSuratPindah}
                  onChange={(e) => setNoSuratPindah(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Pindah ke (Sekolah / Alasan)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Pindah ke SDN 1 Garut mengikuti perpindahan tugas orang tua"
                  value={keteranganPindah}
                  onChange={(e) => setKeteranganPindah(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Specific Fields for Mutasi Masuk */}
          {type === 'masuk' && (
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Berasal Dari Sekolah & Persetujuan
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Asal Sekolah / TK
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: TK Aisyiyah 1 Bandung / SD Lain"
                    value={asalSekolah}
                    onChange={(e) => setAsalSekolah(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas Asal
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: B / 1"
                    value={kelasAsal}
                    onChange={(e) => setKelasAsal(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. Induk Asal
                </label>
                <input
                  type="text"
                  placeholder="Contoh: TK-019"
                  value={noIndukAsal}
                  onChange={(e) => setNoIndukAsal(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tgl Surat Persetujuan Kanwil/Kanko
                  </label>
                  <input
                    type="date"
                    value={persetujuanKanwilTgl}
                    onChange={(e) => setPersetujuanKanwilTgl(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Surat Persetujuan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 421.1/102-Disdik/2023"
                    value={persetujuanKanwilNomor}
                    onChange={(e) => setPersetujuanKanwilNomor(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 ${
                type === 'masuk'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{editingMutation ? 'Simpan Perubahan' : 'Simpan Data Mutasi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
