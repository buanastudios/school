import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { StudentMutation, MutationType } from '../../types';
import {
  UserPlus,
  UserMinus,
  Search,
  Printer,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

interface MutasiModuleProps {
  onOpenAddModal: (type: MutationType, mutation?: StudentMutation) => void;
  onOpenPrint: () => void;
}

export const MutasiModule: React.FC<MutasiModuleProps> = ({ onOpenAddModal, onOpenPrint }) => {
  const {
    mutations,
    deleteMutation,
    currentUser,
    schoolProfile,
    getMonthlyRekap,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'masuk' | 'keluar' | 'rekap'>('masuk');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<number | 'all'>(
    currentUser.role === 'wali_kelas' && currentUser.assignedClass ? currentUser.assignedClass : 'all'
  );
  const [filterMonth, setFilterMonth] = useState<number | 'all'>('all');

  const months = [
    { num: 7, name: 'Juli' },
    { num: 8, name: 'Agustus' },
    { num: 9, name: 'September' },
    { num: 10, name: 'Oktober' },
    { num: 11, name: 'November' },
    { num: 12, name: 'Desember' },
    { num: 1, name: 'Januari' },
    { num: 2, name: 'Februari' },
    { num: 3, name: 'Maret' },
    { num: 4, name: 'April' },
    { num: 5, name: 'Mei' },
    { num: 6, name: 'Juni' },
  ];

  // Filter mutations based on search, class, and month
  const filteredMutations = mutations.filter((m) => {
    if (m.type !== (activeTab === 'masuk' ? 'masuk' : 'keluar')) return false;

    if (filterClass !== 'all' && m.kelas !== filterClass) return false;

    if (filterMonth !== 'all' && m.bulan !== filterMonth) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = m.namaSiswa.toLowerCase().includes(q);
      const matchNis = m.noInduk.toLowerCase().includes(q);
      const matchNisn = m.nisn.toLowerCase().includes(q);
      const matchSekolah = (m.asalSekolah || '').toLowerCase().includes(q);
      const matchPindah = (m.keteranganPindah || '').toLowerCase().includes(q);
      return matchName || matchNis || matchNisn || matchSekolah || matchPindah;
    }

    return true;
  });

  // Current rekapitulasi data (default October 2023 or selected month)
  const currentRekapMonth = filterMonth === 'all' ? 10 : filterMonth;
  const currentRekapYear = currentRekapMonth >= 7 ? 2023 : 2024;
  const rekapData = getMonthlyRekap(currentRekapMonth, currentRekapYear, schoolProfile.tahunPelajaran);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus mutasi untuk siswa: ${name}?`)) {
      deleteMutation(id);
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
              Modul Resmi
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Buku Mutasi Siswa Masuk & Keluar
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Buku Mutasi Murid (Siswa / I)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Format resmi sesuai standar Departemen Pendidikan Nasional & Kemendikbudristek
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenAddModal('masuk')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Murid Masuk</span>
          </button>
          <button
            onClick={() => onOpenAddModal('keluar')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <UserMinus className="w-4 h-4" />
            <span>+ Murid Keluar</span>
          </button>
          <button
            onClick={onOpenPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Cetak Buku Mutasi</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center p-1 bg-slate-200/70 rounded-2xl">
        <button
          onClick={() => setActiveTab('masuk')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'masuk'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-4 h-4 text-emerald-600" />
          <span>Mutasi Masuk</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
            {mutations.filter((m) => m.type === 'masuk').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('keluar')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'keluar'
              ? 'bg-white text-rose-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserMinus className="w-4 h-4 text-rose-600" />
          <span>Mutasi Keluar</span>
          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
            {mutations.filter((m) => m.type === 'keluar').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rekap')}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'rekap'
              ? 'bg-white text-indigo-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>Rekapitulasi</span>
        </button>
      </div>

      {/* Filter and Search Bar (Active for Masuk & Keluar) */}
      {activeTab !== 'rekap' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa, NIS, NISN, atau sekolah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/60"
              />
            </div>

            {/* Class Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
                Kelas:
              </span>
              <button
                onClick={() => setFilterClass('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  filterClass === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua
              </button>
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <button
                  key={k}
                  onClick={() => setFilterClass(k)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    filterClass === k
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Kls {k}
                </button>
              ))}
            </div>
          </div>

          {/* Month Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-2.5">
            <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Bulan:
            </span>
            <button
              onClick={() => setFilterMonth('all')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                filterMonth === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Bulan
            </button>
            {months.map((m) => (
              <button
                key={m.num}
                onClick={() => setFilterMonth(m.num)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                  filterMonth === m.num
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: MUTASI MASUK */}
      {activeTab === 'masuk' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Daftar Murid Masuk (Pindahan / Diterima)
              </h3>
              <p className="text-xs text-slate-500">
                Kolom format resmi sesuai halaman kanan Buku Mutasi Murid
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {filteredMutations.length} Siswa Masuk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3 text-center w-12">No.</th>
                  <th className="py-2.5 px-3">Tgl</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-2 text-center">L/P</th>
                  <th className="py-2.5 px-3">No. Induk</th>
                  <th className="py-2.5 px-3">NISN</th>
                  <th className="py-2.5 px-2 text-center">Kelas</th>
                  <th className="py-2.5 px-3">Berasal Dari</th>
                  <th className="py-2.5 px-3">Persetujuan Kanwil/Kanko</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredMutations.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      Tidak ada data mutasi masuk yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredMutations.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {m.tanggal}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {m.namaSiswa}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded font-bold text-[10px] ${
                            m.jenisKelamin === 'L'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {m.jenisKelamin}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {m.noInduk}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {m.nisn}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-indigo-700">
                        {m.kelas}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        <div>
                          <p className="font-semibold text-slate-800">{m.asalSekolah || '-'}</p>
                          {(m.noIndukAsal || m.kelasAsal) && (
                            <p className="text-[10px] text-slate-400">
                              No. Induk: {m.noIndukAsal || '-'} • Kls: {m.kelasAsal || '-'}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {m.persetujuanKanwilNomor ? (
                          <div>
                            <p className="font-semibold">{m.persetujuanKanwilNomor}</p>
                            <p className="text-[10px] text-slate-400">{m.persetujuanKanwilTgl}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenAddModal('masuk', m)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id, m.namaSiswa)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: MUTASI KELUAR */}
      {activeTab === 'keluar' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Daftar Murid Keluar (Pindah Sekolah)
              </h3>
              <p className="text-xs text-slate-500">
                Kolom format resmi sesuai halaman kiri Buku Mutasi Murid
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              {filteredMutations.length} Siswa Keluar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3 text-center w-12">No.</th>
                  <th className="py-2.5 px-3">Tgl</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-2 text-center">L/P</th>
                  <th className="py-2.5 px-3">No. Induk</th>
                  <th className="py-2.5 px-3">NISN</th>
                  <th className="py-2.5 px-2 text-center">Kelas</th>
                  <th className="py-2.5 px-3">No. Surat Pindah</th>
                  <th className="py-2.5 px-3">Keterangan Pindah Ke</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredMutations.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      Tidak ada data mutasi keluar yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredMutations.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {m.tanggal}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {m.namaSiswa}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded font-bold text-[10px] ${
                            m.jenisKelamin === 'L'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {m.jenisKelamin}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {m.noInduk}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {m.nisn}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-indigo-700">
                        {m.kelas}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                        {m.noSuratPindah || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        <p className="font-medium">{m.keteranganPindah || '-'}</p>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenAddModal('keluar', m)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id, m.namaSiswa)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: REKAPITULASI (Matches Photo 1 bottom) */}
      {activeTab === 'rekap' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Tabel Rekapitulasi Mutasi Bulanan
                </h3>
                <p className="text-xs text-slate-500">
                  Perhitungan otomatis jumlah siswa awal bulan, mutasi masuk, mutasi keluar, dan akhir bulan
                </p>
              </div>

              {/* Month Selector for Rekap */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Pilih Bulan:</span>
                <select
                  value={filterMonth === 'all' ? 10 : filterMonth}
                  onChange={(e) => setFilterMonth(Number(e.target.value))}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                >
                  {months.map((m) => (
                    <option key={m.num} value={m.num}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Official Rekapitulasi Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-300 text-center">
                    <th className="py-2 px-3 border-r border-slate-300 w-24" rowSpan={2}>
                      KELAS
                    </th>
                    <th className="py-1 px-3 border-r border-slate-300" colSpan={3}>
                      Awal Bulan
                    </th>
                    <th className="py-1 px-3 border-r border-slate-300 bg-emerald-50 text-emerald-900" colSpan={3}>
                      MASUK
                    </th>
                    <th className="py-1 px-3 border-r border-slate-300 bg-rose-50 text-rose-900" colSpan={3}>
                      KELUAR
                    </th>
                    <th className="py-1 px-3 border-r border-slate-300 bg-indigo-50 text-indigo-900" colSpan={3}>
                      Akhir Bulan
                    </th>
                    <th className="py-2 px-3" rowSpan={2}>
                      Keterangan
                    </th>
                  </tr>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-300 text-center text-[10px]">
                    <th className="py-1 px-2 border-r border-slate-300">L</th>
                    <th className="py-1 px-2 border-r border-slate-300">P</th>
                    <th className="py-1 px-2 border-r border-slate-300 font-extrabold">Jml</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-emerald-50/50">L</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-emerald-50/50">P</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-emerald-50/50 font-extrabold">Jml</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-rose-50/50">L</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-rose-50/50">P</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-rose-50/50 font-extrabold">Jml</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-indigo-50/50">L</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-indigo-50/50">P</th>
                    <th className="py-1 px-2 border-r border-slate-300 bg-indigo-50/50 font-extrabold">Jml</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-center font-medium">
                  {rekapData.items.map((r) => (
                    <tr key={r.kelas} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-800 border-r border-slate-300">
                        {r.kelas}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-300">{r.awalL}</td>
                      <td className="py-2 px-2 border-r border-slate-300">{r.awalP}</td>
                      <td className="py-2 px-2 border-r border-slate-300 font-bold">{r.awalTotal}</td>

                      <td className="py-2 px-2 border-r border-slate-300 bg-emerald-50/30 text-emerald-800">
                        {r.masukL || ''}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-300 bg-emerald-50/30 text-emerald-800">
                        {r.masukP || ''}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-300 bg-emerald-50/30 font-bold text-emerald-800">
                        {r.masukTotal || ''}
                      </td>

                      <td className="py-2 px-2 border-r border-slate-300 bg-rose-50/30 text-rose-800">
                        {r.keluarL || ''}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-300 bg-rose-50/30 text-rose-800">
                        {r.keluarP || ''}
                      </td>
                      <td className="py-2 px-2 border-r border-slate-300 bg-rose-50/30 font-bold text-rose-800">
                        {r.keluarTotal || ''}
                      </td>

                      <td className="py-2 px-2 border-r border-slate-300 bg-indigo-50/30 font-semibold">{r.akhirL}</td>
                      <td className="py-2 px-2 border-r border-slate-300 bg-indigo-50/30 font-semibold">{r.akhirP}</td>
                      <td className="py-2 px-2 border-r border-slate-300 bg-indigo-50/50 font-black text-indigo-900">
                        {r.akhirTotal}
                      </td>
                      <td className="py-2 px-3 text-left text-slate-500 text-[11px]">
                        {r.keluarTotal > 0 ? `${r.keluarTotal} murid pindah` : r.masukTotal > 0 ? `${r.masukTotal} murid baru` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300 text-center">
                    <td className="py-2.5 px-3 border-r border-slate-300">Jumlah</td>
                    <td className="py-2.5 px-2 border-r border-slate-300">{rekapData.totalAwalL}</td>
                    <td className="py-2.5 px-2 border-r border-slate-300">{rekapData.totalAwalP}</td>
                    <td className="py-2.5 px-2 border-r border-slate-300 font-black">{rekapData.totalAwal}</td>

                    <td className="py-2.5 px-2 border-r border-slate-300 bg-emerald-100/50 text-emerald-900">
                      {rekapData.totalMasukL || ''}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-300 bg-emerald-100/50 text-emerald-900">
                      {rekapData.totalMasukP || ''}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-300 bg-emerald-100/60 font-black text-emerald-950">
                      {rekapData.totalMasuk || ''}
                    </td>

                    <td className="py-2.5 px-2 border-r border-slate-300 bg-rose-100/50 text-rose-900">
                      {rekapData.totalKeluarL || ''}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-300 bg-rose-100/50 text-rose-900">
                      {rekapData.totalKeluarP || ''}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-300 bg-rose-100/60 font-black text-rose-950">
                      {rekapData.totalKeluar || ''}
                    </td>

                    <td className="py-2.5 px-2 border-r border-slate-300 bg-indigo-100/50 font-bold">{rekapData.totalAkhirL}</td>
                    <td className="py-2.5 px-2 border-r border-slate-300 bg-indigo-100/50 font-bold">{rekapData.totalAkhirP}</td>
                    <td className="py-2.5 px-2 border-r border-slate-300 bg-indigo-200/60 font-black text-indigo-950">
                      {rekapData.totalAkhir}
                    </td>
                    <td className="py-2.5 px-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signature Block Preview matching Photo 2 & 13 */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Rekapitulasi ini otomatis disematkan pada setiap cetakan buku mutasi resmi.
                </span>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold text-slate-700">KEPALA SEKOLAH,</p>
                {schoolProfile.kepalaSekolahTtd && (
                  <div className="my-1 flex justify-end">
                    <img
                      src={schoolProfile.kepalaSekolahTtd}
                      alt="Tanda Tangan Kepala Sekolah"
                      className="h-10 object-contain"
                    />
                  </div>
                )}
                <p className="text-xs font-bold text-slate-900 mt-1">
                  ( {schoolProfile.kepalaSekolahNama} )
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  NIP. {schoolProfile.kepalaSekolahNip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
