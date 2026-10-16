import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RaporEditor } from './RaporEditor';
import { RaporPrintView } from './RaporPrintView';
import type { StudentMasterRecord } from '../../types';
import {
  FileText,
  Printer,
  Edit3,
  Search,
  Sparkles,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { getStudentUrl } from '../../utils/routing';

interface RaporModuleProps {
  initialNis?: string;
  initialSemester?: 1 | 2;
}

export const RaporModule: React.FC<RaporModuleProps> = ({
  initialNis,
  initialSemester = 1,
}) => {
  const { students, schoolProfile, updateStudent, currentUser } = useApp();

  // Mode: 'editor' (teacher input) vs 'print' (official layout preview)
  const [viewMode, setViewMode] = useState<'editor' | 'print'>('editor');

  // Selected Student
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    let targetNis = initialNis;
    if (!targetNis && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      targetNis = params.get('nis') || undefined;
    }
    if (targetNis) {
      const match = students.find((s) => s.noInduk === targetNis || s.nisn === targetNis);
      if (match) return match.id;
    }
    // Default to Syauqi Hafidz Mujahiddin if available, otherwise first student
    const syauqi = students.find((s) => s.id === 'std-syauqi' || s.noInduk === '2526060115');
    return syauqi ? syauqi.id : students[0]?.id || '';
  });

  // Selected Semester (1 or 2)
  const [semester, setSemester] = useState<1 | 2>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSem = params.get('sem');
      if (urlSem === '1' || urlSem === '2') {
        return Number(urlSem) as 1 | 2;
      }
    }
    return initialSemester;
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<number | 'all'>(() => {
    if (currentUser.role === 'wali_kelas' && currentUser.assignedClass) {
      return currentUser.assignedClass;
    }
    return 6; // Default to Grade 6 (Syauqi's grade)
  });

  // Print Settings
  const [printScope, setPrintScope] = useState<'full' | 'rapor_only' | 'identitas_only'>('full');
  const [showWatermark, setShowWatermark] = useState(true);
  const [showSignatures, setShowSignatures] = useState(true);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Filtered student list for selector
  const filteredStudents = students.filter((s) => {
    const matchesClass = classFilter === 'all' || s.kelas === classFilter;
    const matchesSearch =
      !searchQuery ||
      s.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.noInduk.includes(searchQuery) ||
      s.nisn.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const handleSaveStudent = (updatedStudent: StudentMasterRecord) => {
    updateStudent(updatedStudent.id, updatedStudent);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12">
      {/* Screen Controls Header (Hidden in Print) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top Title & View Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Modul Rapor Kurikulum Merdeka
              </span>
              <span className="text-xs text-slate-500 font-medium">
                SD Muhammadiyah 2 Kota Bandung
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              <span>Laporan Hasil Belajar & Rapor Siswa</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
              Kelola input capaian kompetensi guru, nilai akhir, kokurikuler (P5), ekstrakurikuler, absensi, dan cetak buku rapor dengan format resmi berstempel dan bertanda tangan.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'editor'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Input & Keputusan Guru</span>
            </button>

            <button
              onClick={() => setViewMode('print')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'print'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau & Cetak Resmi</span>
            </button>
          </div>
        </div>

        {/* Student & Semester Selector Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Class Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Tingkat Kelas:</label>
            <select
              value={classFilter}
              onChange={(e) =>
                setClassFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white text-slate-800"
            >
              <option value="all">Semua Kelas (1–6)</option>
              <option value={1}>Kelas 1 (Fase A)</option>
              <option value={2}>Kelas 2 (Fase A)</option>
              <option value={3}>Kelas 3 (Fase B)</option>
              <option value={4}>Kelas 4 (Fase B)</option>
              <option value={5}>Kelas 5 (Fase C)</option>
              <option value={6}>Kelas 6 (Fase C) • Syauqi Hafidz</option>
            </select>
          </div>

          {/* Student Picker with Search */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Pilih Peserta Didik:</label>
              <div className="relative w-32">
                <Search className="w-3 h-3 absolute left-2 top-1.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari murid..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 pr-2 py-0.5 rounded-lg text-[10px] border border-slate-300 font-medium"
                />
              </div>
            </div>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-indigo-300 font-bold bg-indigo-50/50 text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {filteredStudents.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.namaLengkap} ({st.noInduk} - Kelas {st.kelas}A)
                </option>
              ))}
            </select>
          </div>

          {/* Semester Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Semester:</label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSemester(1)}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs border text-center transition-all ${
                  semester === 1
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Semester 1 (Ganjil)
              </button>
              <button
                type="button"
                onClick={() => setSemester(2)}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs border text-center transition-all ${
                  semester === 2
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Semester 2 (Genap)
              </button>
            </div>
          </div>

          {/* Quick Info & Action */}
          <div className="flex items-end gap-2">
            {viewMode === 'print' ? (
              <button
                onClick={handleTriggerPrint}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            ) : (
              <button
                onClick={() => setViewMode('print')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Buka Lembar Cetak</span>
              </button>
            )}
          </div>
        </div>

        {/* Print Settings Options (Visible only in Print Preview mode) */}
        {viewMode === 'print' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs bg-slate-50/60 p-3 rounded-xl">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lingkup Halaman Cetak:</label>
              <select
                value={printScope}
                onChange={(e) => setPrintScope(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium bg-white"
              >
                <option value="full">Lengkap (Sampul + Identitas + Rapor Nilai)</option>
                <option value="rapor_only">Laporan Nilai Semester Saja (Halaman Nilai)</option>
                <option value="identitas_only">Sampul Depan & Identitas Siswa Saja</option>
              </select>
            </div>

            <div className="flex items-center gap-4 sm:col-span-2 pt-2 sm:pt-4">
              <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>Watermark Resmi & Logo Muhammadiyah</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={showSignatures}
                  onChange={(e) => setShowSignatures(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>Stempel Sekolah & Tanda Tangan Resmi</span>
              </label>
            </div>
          </div>
        )}

        {/* Selected Student Banner Card */}
        {currentStudent && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-indigo-950 p-3.5 px-4 rounded-xl text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-amber-300 font-bold text-base flex items-center justify-center shrink-0">
                {currentStudent.namaLengkap.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                    {currentStudent.namaLengkap}
                  </span>
                  {currentStudent.id === 'std-syauqi' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wide uppercase">
                      ★ Sesuai Referensi PDF
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  NIS: <span className="font-mono font-bold">{currentStudent.noInduk}</span> • NISN: <span className="font-mono">{currentStudent.nisn}</span> • Kelas: {currentStudent.kelas}A • Fase: {currentStudent.fase || 'C'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getStudentUrl(currentStudent.noInduk)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                title="Buka Profil Buku Induk"
              >
                <span>Buku Induk</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {currentStudent ? (
        viewMode === 'editor' ? (
          <RaporEditor
            student={currentStudent}
            semester={semester}
            onSave={handleSaveStudent}
            onPreviewPrint={() => setViewMode('print')}
          />
        ) : (
          <div className="flex justify-center">
            <RaporPrintView
              student={currentStudent}
              schoolProfile={schoolProfile}
              semester={semester}
              printScope={printScope}
              showWatermark={showWatermark}
              showSignatures={showSignatures}
              onPrint={handleTriggerPrint}
            />
          </div>
        )
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-semibold text-sm">
            Tidak ada siswa yang dipilih. Silakan pilih siswa dari menu dropdown di atas.
          </p>
        </div>
      )}
    </div>
  );
};
