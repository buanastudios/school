import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentTimeframeCharts } from './StudentTimeframeCharts';
import { getStudentUrl, getFullStudentUrl, getRaporUrl } from '../../utils/routing';
import {
  StudentExtracurricularModal,
  StudentMustHaveSkillModal,
} from '../kegiatan/ActivityManagementModule';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Maximize2,
  Minimize2,
  QrCode,
  School,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  User,
  Users,
  Waves,
  Compass,
  Tent,
  Mountain,
  Clock,
  Edit3,
  Bot,
  Shield,
  Palette,
  UtensilsCrossed,
  Swords,
  Printer,
} from 'lucide-react';

interface StudentPublicProfileProps {
  studentId?: string;
  isPublicHallView?: boolean;
  onBack?: () => void;
}

export const StudentPublicProfile: React.FC<StudentPublicProfileProps> = ({
  studentId,
  isPublicHallView = false,
  onBack,
}) => {
  const {
    students,
    schoolProfile,
    extracurriculars,
    mustHaveSkills,
    updateStudentExtracurriculars,
    updateStudentMustHaveSkill,
  } = useApp();

  // Extract student ID / NIS from clean path, hash, or query parameters
  const [activeId, setActiveId] = useState<string>(() => {
    if (studentId) return studentId;

    // 1. Check clean path e.g. /siswa/2425010009 or /buana-school/siswa/2425010009
    const pathMatch = window.location.pathname.match(/\/siswa\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) {
      const p = pathMatch[1];
      const match = students.find((s) => s.noInduk === p || s.nisn === p || s.id === p);
      if (match) return match.id;
    }

    // 2. Check hash routing e.g. #/siswa/2425010009 or #2425010009
    const hashMatch = window.location.hash.match(/#(?:\/siswa\/|\/)?([a-zA-Z0-9_-]+)/);
    if (hashMatch) {
      const h = hashMatch[1];
      const match = students.find((s) => s.noInduk === h || s.nisn === h || s.id === h);
      if (match) return match.id;
    }

    // 3. Check search query parameter ?nis=... (Primary official student ID)
    const params = new URLSearchParams(window.location.search);
    const nisParam = params.get('nis');
    if (nisParam) {
      const match = students.find((s) => s.noInduk === nisParam || s.nisn === nisParam);
      if (match) return match.id;
    }

    // 4. Fallback search query parameter ?id=...
    const idParam = params.get('id');
    if (idParam) {
      const match = students.find((s) => s.id === idParam || s.noInduk === idParam);
      if (match) return match.id;
    }

    // 5. Fallback search query parameter ?nama=...
    const namaParam = params.get('nama');
    if (namaParam) {
      const match = students.find((s) =>
        s.namaLengkap.toLowerCase().includes(namaParam.toLowerCase())
      );
      if (match) return match.id;
    }

    return students[0]?.id || '';
  });

  const [isHallMode, setIsHallMode] = useState<boolean>(() => {
    if (isPublicHallView) return true;
    const params = new URLSearchParams(window.location.search);
    return params.get('public') === 'true' || params.get('hall') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'ringkasan' | 'akademik' | 'p5' | 'ekskul' | 'prestasi'>('ringkasan');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isEditEkskulModalOpen, setIsEditEkskulModalOpen] = useState(false);
  const [isEditSkillModalOpen, setIsEditSkillModalOpen] = useState(false);

  const student = students.find((s) => s.id === activeId) || students[0];

  useEffect(() => {
    // If student ID prop changes
    if (studentId) setActiveId(studentId);
  }, [studentId]);

  useEffect(() => {
    if (student?.noInduk) {
      const cleanUrl = getStudentUrl(student.noInduk);
      // Ensure browser address bar updates to clean /siswa/:nis format
      if (window.location.pathname.endsWith('siswa.html') || window.location.search.includes('nis=')) {
        window.history.replaceState({}, '', cleanUrl);
      }
    }
  }, [student?.noInduk]);

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500">
        Data siswa tidak ditemukan.
      </div>
    );
  }

  const shareableUrl = getFullStudentUrl(student.noInduk);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  // Calculate statistics
  const latestHistorical = student.historicalScores?.[student.historicalScores.length - 1];
  const firstHistorical = student.historicalScores?.[0];
  const avgImprovement =
    latestHistorical && firstHistorical
      ? (latestHistorical.nilaiRataRata - firstHistorical.nilaiRataRata).toFixed(1)
      : '0.0';


  // Determine Kurikulum Merdeka Phase
  const getFase = (kelas: number) => {
    if (kelas <= 2) return 'Fase A';
    if (kelas <= 4) return 'Fase B';
    return 'Fase C';
  };

  return (
    <div className={`space-y-6 pb-24 md:pb-12 ${isHallMode ? 'bg-slate-900 text-white min-h-screen p-4 sm:p-8 -m-3.5 sm:-m-6 lg:-m-8' : ''}`}>
      {/* Top Bar / Controls */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border ${
        isHallMode ? 'bg-slate-800/90 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className={`p-2 rounded-xl transition-colors ${
                isHallMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Live Public Record
              </span>
              <span className={`text-xs ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Mading Digital & Hall of Fame Siswa
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
              Rekam Jejak Prestasi & Capaian Murid
            </h2>
          </div>
        </div>

        {/* Action buttons: Share link, QR, Hall Mode toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              copyFeedback
                ? 'bg-emerald-600 text-white'
                : isHallMode
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {copyFeedback ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copyFeedback ? 'Tautan Disalin!' : 'Salin Link Publik'}</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isHallMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>

          <a
            href={getRaporUrl(student.noInduk)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            title="Buka / Cetak Rapor Resmi Kurikulum Merdeka"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Rapor Resmi</span>
          </a>

          <button
            onClick={() => setIsHallMode(!isHallMode)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            {isHallMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isHallMode ? 'Mode Standar' : 'Layar Aula (Hall Mode)'}</span>
          </button>
        </div>
      </div>

      {/* Quick Student Switcher Bar (Explore All Grades 1 to 6) */}
      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
        isHallMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 shrink-0">
            Pilih Siswa (Kelas 1 - 6):
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {students.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveId(s.id);
                window.history.replaceState({}, '', getStudentUrl(s.noInduk));
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                s.id === student.id
                  ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-400'
                  : isHallMode
                  ? 'bg-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                s.kelas === 6 ? 'bg-amber-400' : s.kelas >= 4 ? 'bg-blue-400' : 'bg-emerald-400'
              }`} />
              <span>Kls {s.kelas} • {s.namaPanggilan || s.namaLengkap.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* HERO BANNER: STUDENT SPOTLIGHT & HALL OF FAME           */}
      {/* ======================================================== */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xl ${
        isHallMode
          ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border-indigo-900/60'
          : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white border-transparent'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Pas Foto Box with Ribbon */}
          <div className="relative shrink-0">
            <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden border-4 border-white/40 shadow-2xl bg-white/20 backdrop-blur-md flex flex-col items-center justify-center">
              {student.pasFotoUrl ? (
                <img src={student.pasFotoUrl} alt={student.namaLengkap} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-white/80 p-2">
                  <User className="w-14 h-14 mx-auto mb-1 text-white/60" />
                  <span className="text-[10px] font-bold block">FOTO RESMI</span>
                  <span className="text-[9px]">SD Muhammadiyah 2</span>
                </div>
              )}
            </div>
            {/* Top Student Ribbon */}
            <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] shadow-lg flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span>Siswa Berprestasi</span>
            </div>
          </div>

          {/* Student Identitas & Quick Stats */}
          <div className="flex-1 text-center md:text-left min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-md border border-white/20">
                Kelas {student.kelas} • {getFase(student.kelas)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                Status: {student.statusSiswa}
              </span>
              <span className="text-xs text-indigo-200">
                TP {student.tahunPelajaran}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase drop-shadow-xs">
              {student.namaLengkap}
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100 flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
              <span>NIS: <strong className="font-mono text-white">{student.noInduk}</strong></span>
              <span>•</span>
              <span>NISN: <strong className="font-mono text-white">{student.nisn}</strong></span>
              <span>•</span>
              <span>TTL: <strong>{student.tempatLahir}, {student.tanggalLahir}</strong></span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-indigo-200">
              <div className="flex items-center gap-1.5">
                <School className="w-4 h-4 text-amber-300" />
                <span>{schoolProfile.namaSekolah}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Wali Kelas: <strong>{student.kenaikanKelas?.waliKelasNama || 'Neni Rohaeni, S.Pd.'}</strong></span>
              </div>
            </div>
          </div>

          {/* Key Metric Badges */}
          <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-56 text-center">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] text-indigo-200 block font-semibold">Rata-Rata Nilai</span>
              <span className="text-2xl font-black text-white">{latestHistorical?.nilaiRataRata || 93.5}</span>
              <span className="text-[10px] text-emerald-300 block font-bold">
                ▲ +{avgImprovement} Poin
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] text-indigo-200 block font-semibold">Kehadiran</span>
              <span className="text-2xl font-black text-white">{latestHistorical?.kehadiranPersen || 98}%</span>
              <span className="text-[10px] text-indigo-200 block font-medium">Sangat Rajin</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] text-indigo-200 block font-semibold">Projek P5</span>
              <span className="text-2xl font-black text-amber-300">{student.cocurriculars?.length || 2}</span>
              <span className="text-[10px] text-amber-200 block font-bold">Tuntas</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[10px] text-indigo-200 block font-semibold">Prestasi / Karya</span>
              <span className="text-2xl font-black text-amber-300">{student.contributions?.length || 3}</span>
              <span className="text-[10px] text-amber-200 block font-bold">Penghargaan</span>
            </div>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none p-1.5 rounded-2xl ${
        isHallMode ? 'bg-slate-800' : 'bg-slate-100'
      }`}>
        {[
          { id: 'ringkasan', label: 'Ringkasan & Grafik Progres', icon: TrendingUp },
          { id: 'akademik', label: 'Nilai Intrakurikuler', icon: BookOpen },
          { id: 'p5', label: 'Kokurikuler (Projek P5)', icon: Sparkles },
          { id: 'ekskul', label: 'Ekstrakurikuler', icon: Trophy },
          { id: 'prestasi', label: 'Prestasi & Kontribusi', icon: Award },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isHallMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: RINGKASAN & GRAFIK PROGRES NILAI STATISTIK   */}
      {/* ======================================================== */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-6">
          {/* Multi-Timeframe Charts: Monthly Line Graph, Semester Grouped Bar, Yearly Dual-Axis */}
          <StudentTimeframeCharts student={student} isHallMode={isHallMode} />

          {/* Subject by Subject Mastery Progress Grid */}
          <div className={`p-5 sm:p-6 rounded-2xl border ${
            isHallMode ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="text-base font-extrabold flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-400" />
              <span>Penguasaan Capaian Per Mata Pelajaran (Semester Genap)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.grades.map((g) => {
                const score = g.nilaiGenap || g.nilaiGanjil || 80;
                const kktp = g.kktpGenap || 75;
                const percent = Math.min(100, Math.max(0, score));

                return (
                  <div
                    key={g.mapelId}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isHallMode ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate">{g.mapelNama}</span>
                      <span className="font-black text-sm text-indigo-500">
                        {score} <span className="text-[10px] text-slate-400 font-normal">(KKTP {kktp})</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${
                          score >= 90
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : score >= 80
                            ? 'bg-gradient-to-r from-indigo-500 to-blue-400'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        }`}
                      />
                    </div>

                    <p className={`text-[10px] mt-1.5 truncate ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {g.capaianGenap || g.capaianGanjil || 'Capaian pembelajaran tercapai sangat baik.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: NILAI LENGKAP INTRAKURIKULER                 */}
      {/* ======================================================== */}
      {activeTab === 'akademik' && (
        <div className={`p-5 sm:p-6 rounded-2xl border ${
          isHallMode ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="border-b pb-3 mb-4 flex items-center justify-between border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-base font-extrabold">Daftar Nilai & Deskripsi Capaian Pembelajaran</h3>
              <p className={`text-xs ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Semester Ganjil dan Semester Genap Kurikulum Merdeka
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Total {student.grades.length} Mata Pelajaran
            </span>
          </div>

          <div className="space-y-3">
            {student.grades.map((g, idx) => (
              <div
                key={g.mapelId}
                className={`p-4 rounded-xl border ${
                  isHallMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-extrabold text-sm">{g.mapelNama}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      g.kategori === 'Agama'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                        : g.kategori === 'Muatan Lokal'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>
                      {g.kategori}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] block opacity-70">Sem 1</span>
                      <strong className="text-sm font-black text-slate-800 dark:text-white">{g.nilaiGanjil || '-'}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] block opacity-70">Sem 2</span>
                      <strong className="text-base font-black text-indigo-500">{g.nilaiGenap || '-'}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  {g.capaianGenap && (
                    <p className={isHallMode ? 'text-slate-300' : 'text-slate-700'}>
                      <strong className="text-indigo-400">Capaian Sem 2: </strong>
                      {g.capaianGenap}
                    </p>
                  )}
                  {g.capaianGanjil && (
                    <p className={isHallMode ? 'text-slate-400' : 'text-slate-500'}>
                      <strong className="text-slate-400">Capaian Sem 1: </strong>
                      {g.capaianGanjil}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: KOKURIKULER & 4 KEAHLIAN WAJIB SEKOLAH        */}
      {/* ======================================================== */}
      {activeTab === 'p5' && (
        <div className="space-y-6">
          {/* Sub-section 3A: 4 Keahlian Wajib Lapangan (Must-Have Skills) */}
          <div className={`p-5 sm:p-6 rounded-2xl border ${
            isHallMode ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="border-b pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-slate-200 dark:border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <h3 className="text-base font-black flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-500" />
                    <span>4 Keahlian Wajib Kokurikuler & Ketangkasan Lapangan</span>
                  </h3>
                </div>
                <p className={`text-xs mt-0.5 ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Standar karakter khas Buana School: Olahraga Sunnah (Berenang, Berkuda) & Alam Bebas (Pramuka/Camping, Rope Rappelling)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {student.mustHaveSkills?.filter((m) => m.badgeEarned).length || 0} / 4 Lencana Lulus
                </span>
                <button
                  onClick={() => setIsEditSkillModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Uji Keterampilan</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.mustHaveSkills?.map((sk) => {
                const isMahir = sk.levelCapaian === 'Lulus Uji Mandiri / Mahir';
                const isTerampil = sk.levelCapaian === 'Tingkat Terampil';

                return (
                  <div
                    key={sk.kode}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isHallMode
                        ? 'bg-slate-900/60 border-slate-700'
                        : sk.badgeEarned
                        ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${
                            sk.kode === 'swimming'
                              ? 'bg-cyan-600 text-white'
                              : sk.kode === 'horse_riding'
                              ? 'bg-amber-600 text-white'
                              : sk.kode === 'camping_skill'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 text-white'
                          }`}>
                            {sk.kode === 'swimming' && <Waves className="w-6 h-6" />}
                            {sk.kode === 'horse_riding' && <Compass className="w-6 h-6" />}
                            {sk.kode === 'camping_skill' && <Tent className="w-6 h-6" />}
                            {sk.kode === 'rope_rappelling' && <Mountain className="w-6 h-6" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Must-Have Skill
                            </span>
                            <h4 className="font-extrabold text-sm">{sk.nama}</h4>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap border ${
                          isMahir
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                            : isTerampil
                            ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-400/40'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/40'
                        }`}>
                          {sk.levelCapaian}
                        </span>
                      </div>

                      {sk.catatan && (
                        <p className={`text-xs leading-relaxed my-2.5 ${isHallMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          "{sk.catatan}"
                        </p>
                      )}

                      {sk.pencapaianSpesifik && sk.pencapaianSpesifik.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-2">
                          {sk.pencapaianSpesifik.map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              ✓ {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">Penguji: {sk.penguji || 'Instruktur Resmi'}</span>
                      </div>
                      {sk.tanggalUjian && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sk.tanggalUjian}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-section 3B: Projek Penguatan Profil Pelajar Pancasila (P5) */}
          <div className={`p-5 sm:p-6 rounded-2xl border ${
            isHallMode ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="border-b pb-3 mb-4 flex items-center justify-between border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Projek Penguatan Profil Pelajar Pancasila (P5)</span>
                </h3>
                <p className={`text-xs ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Dokumentasi tema projek lintas disiplin ilmu yang telah diselesaikan
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {student.cocurriculars?.length || 0} Projek Tuntas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.cocurriculars?.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isHallMode ? 'bg-slate-900/60 border-slate-700' : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                        Tema: {p.tema}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">
                        {p.capaian}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm mb-1">{p.judulProjek}</h4>
                    <p className={`text-xs leading-relaxed mb-3 ${isHallMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {p.deskripsi}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {p.dimensi.map((d, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        >
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                    <p className={`text-[11px] italic ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Catatan Guru: "{p.keterangan}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: EKSTRAKURIKULER DINAMIS                      */}
      {/* ======================================================== */}
      {activeTab === 'ekskul' && (
        <div className={`p-5 sm:p-6 rounded-2xl border ${
          isHallMode ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="border-b pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-500" />
                <span>Pilihan Ekstrakurikuler & Pembinaan Bakat Siswa</span>
              </h3>
              <p className={`text-xs ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Kegiatan dinamis berbasis minat: Robotic, Jiujitsu (Grappling), Drawing, Cooking, Futsal, Pencak Silat
              </p>
            </div>

            <button
              onClick={() => setIsEditEkskulModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Pilihan Ekskul Siswa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {student.extracurriculars && student.extracurriculars.length > 0 ? (
              student.extracurriculars.map((ek, i) => {
                const isSilat = ek.nama.toLowerCase().includes('silat');
                const isRobotic = ek.nama.toLowerCase().includes('robot');
                const isJiujitsu = ek.nama.toLowerCase().includes('jiujitsu');
                const isDrawing = ek.nama.toLowerCase().includes('draw') || ek.nama.toLowerCase().includes('gambar');
                const isCooking = ek.nama.toLowerCase().includes('cook') || ek.nama.toLowerCase().includes('chef');
                const isFutsal = ek.nama.toLowerCase().includes('futsal');

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                      isHallMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-xs ${
                            isSilat
                              ? 'bg-amber-600'
                              : isRobotic
                              ? 'bg-cyan-600'
                              : isJiujitsu
                              ? 'bg-rose-600'
                              : isDrawing
                              ? 'bg-fuchsia-600'
                              : isCooking
                              ? 'bg-emerald-600'
                              : isFutsal
                              ? 'bg-blue-600'
                              : 'bg-indigo-600'
                          }`}>
                            {isSilat ? (
                              <Swords className="w-5 h-5" />
                            ) : isRobotic ? (
                              <Bot className="w-5 h-5" />
                            ) : isJiujitsu ? (
                              <Shield className="w-5 h-5" />
                            ) : isDrawing ? (
                              <Palette className="w-5 h-5" />
                            ) : isCooking ? (
                              <UtensilsCrossed className="w-5 h-5" />
                            ) : isFutsal ? (
                              <Trophy className="w-5 h-5" />
                            ) : (
                              <span>{i + 1}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs leading-snug">{ek.nama}</h4>
                            {ek.pembina && (
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {ek.pembina}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {ek.jadwal && (
                        <p className="text-[10px] text-indigo-400 font-semibold mb-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{ek.jadwal}</span>
                        </p>
                      )}

                      {(ek.keteranganGenap || ek.keteranganGanjil) && (
                        <p className={`text-[11px] leading-relaxed italic mb-3 ${
                          isHallMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          "{ek.keteranganGenap || ek.keteranganGanjil}"
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2.5 border-t border-slate-200 dark:border-slate-800">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[10px] opacity-70 block">Semester 1</span>
                        <strong className="text-emerald-400 font-bold">{ek.nilaiGanjil || 'Baik'}</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[10px] opacity-70 block">Semester 2</span>
                        <strong className="text-emerald-400 font-bold">{ek.nilaiGenap || 'Sangat Baik'}</strong>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 p-8 text-center text-slate-400 italic">
                Siswa belum memilih ekstrakurikuler. Klik tombol "Ubah Pilihan Ekskul Siswa" di atas untuk menambahkan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: PRESTASI & KONTRIBUSI SEKOLAH                */}
      {/* ======================================================== */}
      {activeTab === 'prestasi' && (
        <div className={`p-5 sm:p-6 rounded-2xl border ${
          isHallMode ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="border-b pb-3 mb-4 flex items-center justify-between border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Prestasi, Penghargaan & Kontribusi Siswa</span>
              </h3>
              <p className={`text-xs ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Rekam jejak kejuaraan lomba, peran kepemimpinan, dan karya inovasi
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {student.contributions?.length || 0} Penghargaan Tercatat
            </span>
          </div>

          <div className="space-y-3.5">
            {student.contributions?.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isHallMode ? 'bg-slate-900/60 border-slate-700' : 'bg-amber-50/30 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {c.jenis}
                      </span>
                      {c.tingkat && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-400/30">
                          Tingkat {c.tingkat}
                        </span>
                      )}
                      <span className={`text-[10px] ${isHallMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {c.tanggal}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm mt-1">{c.judul}</h4>
                    {c.penghargaan && (
                      <p className="text-xs font-bold text-amber-400 mt-0.5">
                        ★ {c.penghargaan}
                      </p>
                    )}
                    <p className={`text-xs mt-1 leading-relaxed ${isHallMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {c.deskripsi}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Modal for Hall Display */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-black text-base uppercase">Scan Rekam Publik Siswa</h3>
            <p className="text-xs text-slate-500">
              Pindai QR code ini dengan kamera smartphone untuk membuka profil lengkap siswa secara langsung.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center">
              {/* Clean Vector SVG QR Code Representation */}
              <div className="w-48 h-48 bg-white p-2 rounded-xl border border-slate-300 shadow-xs flex flex-col items-center justify-center text-center">
                <QrCode className="w-36 h-36 text-slate-900" />
                <span className="text-[10px] font-mono font-bold text-slate-600 mt-1 truncate max-w-[180px]">
                  {student.noInduk} • {student.namaPanggilan}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-left bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block">Tautan Resmi Publik (Clean URL):</span>
              <div className="text-[11px] font-mono font-bold text-indigo-700 truncate select-all">
                {shareableUrl}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                {copyFeedback ? 'Disalin!' : 'Salin Tautan'}
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Pilihan Ekskul Siswa */}
      {isEditEkskulModalOpen && (
        <StudentExtracurricularModal
          isOpen={isEditEkskulModalOpen}
          student={student}
          availableEkskuls={extracurriculars}
          onClose={() => setIsEditEkskulModalOpen(false)}
          onSave={(updated) => {
            updateStudentExtracurriculars(student.id, updated);
            setIsEditEkskulModalOpen(false);
          }}
        />
      )}

      {/* Modal Uji Kompetensi Keahlian Wajib */}
      {isEditSkillModalOpen && (
        <StudentMustHaveSkillModal
          isOpen={isEditSkillModalOpen}
          student={student}
          skillsMaster={mustHaveSkills}
          onClose={() => setIsEditSkillModalOpen(false)}
          onSave={(skillKode, record) => {
            updateStudentMustHaveSkill(student.id, skillKode, record);
          }}
        />
      )}
    </div>
  );
};
