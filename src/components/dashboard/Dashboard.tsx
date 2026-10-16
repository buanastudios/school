import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getStudentUrl } from '../../utils/routing';
import {
  Users,
  UserPlus,
  UserMinus,
  Printer,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar,
  ExternalLink,
  Trophy,
  FileSpreadsheet,
} from 'lucide-react';
import type { NavTab } from '../common/BottomNav';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: (type: 'masuk' | 'keluar') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenAddModal }) => {
  const { currentUser, schoolProfile, mutations, students, getMonthlyRekap } = useApp();

  // Current selected month for preview (Default to Oktober 2023 / current active period)
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const selectedYear = 2023;

  const rekap = getMonthlyRekap(selectedMonth, selectedYear, schoolProfile.tahunPelajaran);

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

  const recentMutations = [...mutations].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  ).slice(0, 5);

  const isTeacher = currentUser.role === 'wali_kelas';
  const teacherClass = currentUser.assignedClass;

  return (
    <div className="space-y-5 sm:space-y-6 pb-20 md:pb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 p-5 sm:p-6 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-indigo-100">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Pengelolaan Sekolah Digital
            </span>
            <span className="text-xs text-indigo-200">
              TP {schoolProfile.tahunPelajaran}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser.name}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-indigo-100 max-w-xl">
            {isTeacher
              ? `Anda login sebagai Wali Kelas ${teacherClass}. Anda dapat mencatat mutasi murid masuk/keluar, memverifikasi rekapitulasi, dan melengkapi Buku Induk kelas Anda.`
              : currentUser.role === 'kepala_sekolah'
              ? 'Anda login sebagai Kepala Sekolah. Anda dapat memantau seluruh mutasi kelas 1–6, mengesahkan dengan tanda tangan digital resmi, dan mencetak buku mutasi on-demand.'
              : 'Anda login sebagai Tata Usaha / Admin. Kelola master data siswa, mutasi sekolah, dan profil sekolah.'}
          </p>

          {/* Quick CTA row */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenAddModal('masuk')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Siswa Masuk</span>
            </button>
            <button
              onClick={() => onOpenAddModal('keluar')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <UserMinus className="w-4 h-4" />
              <span>+ Siswa Keluar</span>
            </button>
            <button
              onClick={() => onNavigate('cetak-buku')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-xs backdrop-blur-sm transition-all"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak Buku Mutasi</span>
            </button>
            <a
              href="rapor.html"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-300" />
              <span>Rapor Siswa</span>
            </a>
            <a
              href="kegiatan.html"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Trophy className="w-4 h-4 text-slate-950" />
              <span>Ekskul & 4 Keahlian Wajib</span>
            </a>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-2 w-24 h-24 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
      </div>

      {/* Month Filter Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              Rekapitulasi Bulanan Murid
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Oktober 2023 (Sesuai Buku Fisik)
          </span>
        </div>

        {/* Scrollable Month Pills on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {months.map((m) => {
            const isSelected = selectedMonth === m.num;
            return (
              <button
                key={m.num}
                onClick={() => setSelectedMonth(m.num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Murid Akhir Bulan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Murid</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{rekap.totalAkhir}</span>
            <span className="text-[11px] text-slate-400 font-medium">Siswa</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>L: <strong className="text-slate-800">{rekap.totalAkhirL}</strong></span>
            <span>P: <strong className="text-slate-800">{rekap.totalAkhirP}</strong></span>
          </div>
        </div>

        {/* Mutasi Masuk Bulan Ini */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Mutasi Masuk</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">+{rekap.totalMasuk}</span>
            <span className="text-[11px] text-emerald-700 font-medium">Siswa Baru</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>L: <strong className="text-slate-800">{rekap.totalMasukL}</strong></span>
            <span>P: <strong className="text-slate-800">{rekap.totalMasukP}</strong></span>
          </div>
        </div>

        {/* Mutasi Keluar Bulan Ini */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Mutasi Keluar</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">-{rekap.totalKeluar}</span>
            <span className="text-[11px] text-rose-700 font-medium">Siswa Pindah</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>L: <strong className="text-slate-800">{rekap.totalKeluarL}</strong></span>
            <span>P: <strong className="text-slate-800">{rekap.totalKeluarP}</strong></span>
          </div>
        </div>

        {/* Buku Induk Master Registered */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Buku Induk</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-700">{students.length}</span>
            <span className="text-[11px] text-blue-600 font-medium">Terdigitalisasi</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Kurikulum</span>
            <strong className="text-slate-800 font-semibold">Merdeka</strong>
          </div>
        </div>
      </div>

      {/* Class by Class Breakdown (Classes 1 - 6) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Rincian Per Kelas (Kelas 1 s/d 6)
            </h3>
            <p className="text-xs text-slate-500">
              Sesuai format tabel Rekapitulasi Buku Mutasi
            </p>
          </div>
          <button
            onClick={() => onNavigate('mutasi')}
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-bold"
          >
            <span>Lihat Buku Mutasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Responsive Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <th className="py-2.5 px-3">KELAS</th>
                <th className="py-2.5 px-3 text-center" colSpan={3}>AWAL BULAN</th>
                <th className="py-2.5 px-3 text-center bg-emerald-50/60" colSpan={3}>MASUK</th>
                <th className="py-2.5 px-3 text-center bg-rose-50/60" colSpan={3}>KELUAR</th>
                <th className="py-2.5 px-3 text-center" colSpan={3}>AKHIR BULAN</th>
              </tr>
              <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase font-semibold">
                <th className="py-1 px-3">Tingkat</th>
                <th className="py-1 px-2 text-center">L</th>
                <th className="py-1 px-2 text-center">P</th>
                <th className="py-1 px-2 text-center font-bold text-slate-700">Jml</th>
                <th className="py-1 px-2 text-center bg-emerald-50/40">L</th>
                <th className="py-1 px-2 text-center bg-emerald-50/40">P</th>
                <th className="py-1 px-2 text-center bg-emerald-50/40 font-bold text-emerald-700">Jml</th>
                <th className="py-1 px-2 text-center bg-rose-50/40">L</th>
                <th className="py-1 px-2 text-center bg-rose-50/40">P</th>
                <th className="py-1 px-2 text-center bg-rose-50/40 font-bold text-rose-700">Jml</th>
                <th className="py-1 px-2 text-center">L</th>
                <th className="py-1 px-2 text-center">P</th>
                <th className="py-1 px-2 text-center font-bold text-indigo-700">Jml</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rekap.items.map((item) => {
                const isUserClass = isTeacher && teacherClass === item.kelas;
                return (
                  <tr
                    key={item.kelas}
                    className={`hover:bg-slate-50 transition-colors ${
                      isUserClass ? 'bg-indigo-50/50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Kelas {item.kelas}</span>
                      {isUserClass && (
                        <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">
                          Kelas Anda
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">{item.awalL}</td>
                    <td className="py-2.5 px-2 text-center">{item.awalP}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900">{item.awalTotal}</td>

                    <td className="py-2.5 px-2 text-center bg-emerald-50/30 text-emerald-700">
                      {item.masukL || '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center bg-emerald-50/30 text-emerald-700">
                      {item.masukP || '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center bg-emerald-50/30 font-bold text-emerald-800">
                      {item.masukTotal || '-'}
                    </td>

                    <td className="py-2.5 px-2 text-center bg-rose-50/30 text-rose-700">
                      {item.keluarL || '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center bg-rose-50/30 text-rose-700">
                      {item.keluarP || '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center bg-rose-50/30 font-bold text-rose-800">
                      {item.keluarTotal || '-'}
                    </td>

                    <td className="py-2.5 px-2 text-center text-indigo-900">{item.akhirL}</td>
                    <td className="py-2.5 px-2 text-center text-indigo-900">{item.akhirP}</td>
                    <td className="py-2.5 px-2 text-center font-extrabold text-indigo-700 bg-indigo-50/40">
                      {item.akhirTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
                <td className="py-2.5 px-3">JUMLAH</td>
                <td className="py-2.5 px-2 text-center">{rekap.totalAwalL}</td>
                <td className="py-2.5 px-2 text-center">{rekap.totalAwalP}</td>
                <td className="py-2.5 px-2 text-center">{rekap.totalAwal}</td>

                <td className="py-2.5 px-2 text-center text-emerald-700">{rekap.totalMasukL || '-'}</td>
                <td className="py-2.5 px-2 text-center text-emerald-700">{rekap.totalMasukP || '-'}</td>
                <td className="py-2.5 px-2 text-center text-emerald-800">{rekap.totalMasuk || '-'}</td>

                <td className="py-2.5 px-2 text-center text-rose-700">{rekap.totalKeluarL || '-'}</td>
                <td className="py-2.5 px-2 text-center text-rose-700">{rekap.totalKeluarP || '-'}</td>
                <td className="py-2.5 px-2 text-center text-rose-800">{rekap.totalKeluar || '-'}</td>

                <td className="py-2.5 px-2 text-center text-indigo-900">{rekap.totalAkhirL}</td>
                <td className="py-2.5 px-2 text-center text-indigo-900">{rekap.totalAkhirP}</td>
                <td className="py-2.5 px-2 text-center text-indigo-700 bg-indigo-100/60 font-black">
                  {rekap.totalAkhir}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Recent Mutation Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Aktivitas Mutasi Terakhir
            </h3>
            <p className="text-xs text-slate-500">
              Riwayat siswa masuk dan keluar yang tercatat
            </p>
          </div>
          <button
            onClick={() => onNavigate('mutasi')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
          >
            Semua Data ({mutations.length})
          </button>
        </div>

        <div className="space-y-2">
          {recentMutations.map((mut) => {
            const isMasuk = mut.type === 'masuk';
            return (
              <div
                key={mut.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isMasuk
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {isMasuk ? <UserPlus className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <a
                        href={getStudentUrl(mut.noInduk)}
                        className="text-xs font-bold text-slate-900 hover:text-indigo-600 hover:underline truncate inline-flex items-center gap-1 group"
                        title="Buka Rekam Jejak Siswa"
                      >
                        <span>{mut.namaSiswa}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-indigo-600" />
                      </a>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                        {mut.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                        Kelas {mut.kelas}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {isMasuk
                        ? `Asal: ${mut.asalSekolah || 'Sekolah Lain'}`
                        : `Tujuan: ${mut.keteranganPindah || 'Pindah Sekolah'}`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isMasuk
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isMasuk ? 'Masuk' : 'Keluar'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {mut.tanggal}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
