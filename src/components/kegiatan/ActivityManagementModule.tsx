import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Bot,
  Shield,
  Palette,
  UtensilsCrossed,
  Swords,
  Waves,
  Compass,
  Tent,
  Mountain,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  User,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type {
  ExtracurricularMaster,
  MustHaveSkillMaster,
  ActivityCategory,
  SkillMasteryLevel,
  StudentMasterRecord,
  Extracurricular,
} from '../../types';

export const ActivityManagementModule: React.FC = () => {
  const {
    students,
    extracurriculars,
    mustHaveSkills,
    addExtracurricular,
    updateExtracurricular,
    toggleExtracurricularStatus,
    deleteExtracurricular,
    updateStudentExtracurriculars,
    updateStudentMustHaveSkill,
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'ekskul' | 'must_have' | 'siswa'>(
    'ekskul'
  );

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<number>(0);

  // Modals
  const [isEkskulModalOpen, setIsEkskulModalOpen] = useState(false);
  const [editingEkskul, setEditingEkskul] = useState<ExtracurricularMaster | null>(null);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] =
    useState<StudentMasterRecord | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedStudentForSkill, setSelectedStudentForSkill] =
    useState<StudentMasterRecord | null>(null);

  // Helper icon mapper
  const renderIcon = (name?: string, className = 'w-5 h-5') => {
    switch (name) {
      case 'Bot':
        return <Bot className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Palette':
        return <Palette className={className} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Swords':
        return <Swords className={className} />;
      case 'Waves':
        return <Waves className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Tent':
        return <Tent className={className} />;
      case 'Mountain':
        return <Mountain className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Student enrollment count per ekskul
  const ekskulEnrollmentCount = useMemo(() => {
    const counts: Record<string, number> = {};
    extracurriculars.forEach((e) => {
      counts[e.nama] = 0;
    });

    students.forEach((s) => {
      s.extracurriculars?.forEach((ek) => {
        if (counts[ek.nama] !== undefined) {
          counts[ek.nama] += 1;
        } else {
          counts[ek.nama] = 1;
        }
      });
    });
    return counts;
  }, [students, extracurriculars]);

  // Filtered extracurriculars
  const filteredEkskuls = useMemo(() => {
    return extracurriculars.filter((e) => {
      const matchSearch =
        e.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.pembina.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || e.kategori === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [extracurriculars, searchTerm, selectedCategory]);

  // Filtered students for student tab
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass =
        selectedClassFilter === 0 || s.kelas === selectedClassFilter;
      const matchSearch =
        s.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.noInduk.includes(searchTerm) ||
        (s.namaPanggilan && s.namaPanggilan.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchClass && matchSearch;
    });
  }, [students, selectedClassFilter, searchTerm]);

  // Count active vs non-active
  const activeEkskulCount = extracurriculars.filter((e) => e.status === 'aktif').length;

  return (
    <div className="space-y-6 pb-20 md:pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Sistem Manajemen Program & Bakat Siswa
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/25 text-emerald-200 border border-emerald-400/30">
              {activeEkskulCount} Ekskul Aktif
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/25 text-amber-200 border border-amber-400/30">
              4 Keahlian Wajib Kokurikuler
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ekstrakurikuler Dinamis & Keahlian Wajib Siswa
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            Kelola kegiatan ekstrakurikuler berbasis minat (Robotic, Jiujitsu, Drawing, Cooking, Futsal, Silat) serta pemantauan sertifikasi 4 keahlian lapangan wajib khas sekolah (Berenang, Berkuda, Pramuka/Camping, dan Rope Rappelling).
          </p>
        </div>

        {/* Ambient shapes */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveMainTab('ekskul');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeMainTab === 'ekskul'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Ekstrakurikuler Dinamis ({extracurriculars.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveMainTab('must_have');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeMainTab === 'must_have'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Keahlian Wajib Kokurikuler (4 Pilar)</span>
        </button>

        <button
          onClick={() => {
            setActiveMainTab('siswa');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeMainTab === 'siswa'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pilihan Minat & Nilai Siswa ({students.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EKSTRAKURIKULER DINAMIS                           */}
      {/* ======================================================== */}
      {activeMainTab === 'ekskul' && (
        <div className="space-y-5">
          {/* Government Silat Notice Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Swords className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Instruksi Pemerintah / Dinas: Pelestarian Seni Pencak Silat
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                    Mandatory Regulation
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pemerintah mengimbau penambahan muatan seni bela diri tradisional (Pencak Silat) sebagai penguatan karakter bangsa. Anda dapat mengaktifkan atau menonaktifkannya sewaktu-waktu sesuai kesiapan jadwal dan minat siswa.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {(() => {
                const silatEkskul = extracurriculars.find((e) => e.isWajibPemerintah || e.id === 'ek-silat');
                if (!silatEkskul) return null;
                const isAktif = silatEkskul.status === 'aktif';
                return (
                  <button
                    onClick={() => toggleExtracurricularStatus(silatEkskul.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
                      isAktif
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isAktif ? (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        <span>Silat: Aktif Dibuka</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        <span>Silat: Dinonaktifkan</span>
                      </>
                    )}
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Controls: Search, Category Filter, and Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama ekskul, pembina, atau kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['all', 'Teknologi', 'Bela Diri', 'Seni & Desain', 'Kuliner & Keterampilan', 'Olahraga'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white shadow-xs font-bold'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'all' ? 'Semua Kategori' : cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setEditingEkskul(null);
                setIsEkskulModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Ekskul Baru</span>
            </button>
          </div>

          {/* Extracurricular Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEkskuls.map((ek) => {
              const enrolled = ekskulEnrollmentCount[ek.nama] || 0;
              const isAktif = ek.status === 'aktif';

              return (
                <div
                  key={ek.id}
                  className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-xs ${
                    isAktif ? 'border-slate-200 hover:border-indigo-300' : 'border-slate-200 opacity-60 bg-slate-50/70'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${
                            ek.kategori === 'Teknologi'
                              ? 'bg-gradient-to-tr from-cyan-600 to-blue-500'
                              : ek.kategori === 'Bela Diri'
                              ? 'bg-gradient-to-tr from-rose-600 to-amber-600'
                              : ek.kategori === 'Seni & Desain'
                              ? 'bg-gradient-to-tr from-fuchsia-600 to-pink-500'
                              : ek.kategori === 'Kuliner & Keterampilan'
                              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                              : 'bg-gradient-to-tr from-indigo-600 to-blue-500'
                          }`}
                        >
                          {renderIcon(ek.iconName, 'w-6 h-6')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {ek.kategori}
                            </span>
                            {ek.isWajibPemerintah && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                                Mandat Pemerintah
                              </span>
                            )}
                          </div>
                          <h3 className="font-extrabold text-slate-900 text-base mt-0.5">
                            {ek.nama}
                          </h3>
                        </div>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => toggleExtracurricularStatus(ek.id)}
                        title={isAktif ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isAktif ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {isAktif ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {ek.deskripsi}
                    </p>

                    {/* Metadata details */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="font-semibold text-slate-800">Pembina:</span>
                        <span className="truncate">{ek.pembina}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-semibold text-slate-800">Jadwal:</span>
                        <span className="truncate">{ek.jadwal}</span>
                      </div>
                      {ek.lokasi && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="font-semibold text-slate-800">Lokasi:</span>
                          <span className="truncate">{ek.lokasi}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Enrolled Count and Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">
                        {enrolled} Siswa Terdaftar
                      </span>
                      {ek.kuotaMaksimal && (
                        <span className="text-[11px] text-slate-400">
                          / {ek.kuotaMaksimal}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingEkskul(ek);
                          setIsEkskulModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Ekskul"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus ekstrakurikuler ${ek.nama}?`)) {
                            deleteExtracurricular(ek.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Ekskul"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KOKURIKULER & MUST-HAVE SKILLS                     */}
      {/* ======================================================== */}
      {activeMainTab === 'must_have' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  4 Keahlian Wajib Karakter Lapangan (Buana School / SD At-Tibyan)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Seluruh siswa dilatih dan diuji dalam 4 keterampilan hidup esensial yang memadukan <strong>olahraga sunnah (Berenang, Berkuda)</strong> serta <strong>ketangkasan alam bebas (Pramuka/Camping Skill, Rope Rappelling)</strong>. Siswa yang lulus setiap level berhak mendapatkan lencana resmi pada rekam jejak digital.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mustHaveSkills.map((sk, idx) => {
              // Calculate how many students earned badge in this skill
              const badgeEarners = students.filter(
                (s) =>
                  s.mustHaveSkills?.some(
                    (msk) => msk.kode === sk.kode && msk.badgeEarned
                  )
              ).length;

              return (
                <div
                  key={sk.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 to-blue-600 text-white flex items-center justify-center shadow-md">
                          {renderIcon(sk.iconName, 'w-6 h-6')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                              Pilar {idx + 1} • {sk.kategori}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Wajib Lulus
                            </span>
                          </div>
                          <h3 className="font-black text-slate-900 text-lg mt-1">
                            {sk.nama}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {sk.deskripsi}
                    </p>

                    {/* Competency Checklist */}
                    <div className="space-y-2 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Standar Kompetensi Kelulusan
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {sk.kompetensiDasar.map((kd, kIdx) => (
                          <li key={kIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{kd}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Testing levels */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-800">Instruktur:</span>
                        <span>{sk.instruktur}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-semibold text-slate-800">Jadwal:</span>
                        <span>{sk.jadwalLatihan}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="font-semibold text-slate-800">Lokasi:</span>
                        <span>{sk.lokasi}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-slate-800">
                        {badgeEarners} dari {students.length} Siswa
                      </span>
                      <span className="text-slate-400">telah lulus uji kompetensi</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveMainTab('siswa');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <span>Lihat Siswa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PILIHAN MINAT & NILAI SISWA                       */}
      {/* ======================================================== */}
      {activeMainTab === 'siswa' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa berdasarkan nama atau NIS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                Kelas:
              </span>
              {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedClassFilter(k)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedClassFilter === k
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {k === 0 ? 'Semua' : `Kls ${k}`}
                </button>
              ))}
            </div>
          </div>

          {/* Table of Students */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Siswa</th>
                    <th className="py-3 px-3">Kelas</th>
                    <th className="py-3 px-4">Pilihan Ekstrakurikuler</th>
                    <th className="py-3 px-4">Keahlian Wajib (4 Pilar)</th>
                    <th className="py-3 px-4 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStudents.map((s) => {
                    const badges = s.mustHaveSkills?.filter((m) => m.badgeEarned).length || 0;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {s.namaLengkap.charAt(0)}
                            </div>
                            <div>
                              <a
                                href={`siswa.html?nis=${encodeURIComponent(s.noInduk)}`}
                                className="font-bold text-slate-900 hover:text-indigo-600 hover:underline flex items-center gap-1"
                              >
                                <span>{s.namaLengkap}</span>
                              </a>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                NIS: {s.noInduk}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-800">
                            Kelas {s.kelas}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {s.extracurriculars && s.extracurriculars.length > 0 ? (
                              s.extracurriculars.map((ek, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                                >
                                  <span>{ek.nama}</span>
                                  {ek.nilaiGenap && (
                                    <span className="text-[9px] text-emerald-600">
                                      ({ek.nilaiGenap})
                                    </span>
                                  )}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Belum memilih ekskul
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                badges === 4
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : badges >= 2
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {badges} / 4 Lulus Uji
                            </span>

                            <div className="flex items-center gap-1 text-slate-400">
                              {s.mustHaveSkills?.map((ms) => (
                                <span
                                  key={ms.kode}
                                  title={`${ms.nama}: ${ms.levelCapaian}`}
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    ms.badgeEarned ? 'bg-emerald-500' : 'bg-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedStudentForEdit(s);
                                setIsStudentModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                              Ubah Ekskul
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudentForSkill(s);
                                setIsSkillModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
                            >
                              Uji Keterampilan
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: TAMBAH / EDIT EKSTRAKURIKULER MASTER            */}
      {/* ======================================================== */}
      {isEkskulModalOpen && (
        <ExtracurricularFormModal
          isOpen={isEkskulModalOpen}
          initialData={editingEkskul}
          onClose={() => {
            setIsEkskulModalOpen(false);
            setEditingEkskul(null);
          }}
          onSave={(data) => {
            if (editingEkskul) {
              updateExtracurricular(editingEkskul.id, data);
            } else {
              addExtracurricular(data);
            }
            setIsEkskulModalOpen(false);
            setEditingEkskul(null);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT PILIHAN EKSKUL SISWA                      */}
      {/* ======================================================== */}
      {isStudentModalOpen && selectedStudentForEdit && (
        <StudentExtracurricularModal
          isOpen={isStudentModalOpen}
          student={selectedStudentForEdit}
          availableEkskuls={extracurriculars}
          onClose={() => {
            setIsStudentModalOpen(false);
            setSelectedStudentForEdit(null);
          }}
          onSave={(updatedEkskuls) => {
            updateStudentExtracurriculars(selectedStudentForEdit.id, updatedEkskuls);
            setIsStudentModalOpen(false);
            setSelectedStudentForEdit(null);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 3: UPDATE PENGUJIAN KEHALIAN WAJIB SISWA          */}
      {/* ======================================================== */}
      {isSkillModalOpen && selectedStudentForSkill && (
        <StudentMustHaveSkillModal
          isOpen={isSkillModalOpen}
          student={selectedStudentForSkill}
          skillsMaster={mustHaveSkills}
          onClose={() => {
            setIsSkillModalOpen(false);
            setSelectedStudentForSkill(null);
          }}
          onSave={(skillKode, record) => {
            updateStudentMustHaveSkill(selectedStudentForSkill.id, skillKode, record);
          }}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// SUB-MODAL 1: FORM TAMBAH/EDIT EKSTRAKURIKULER MASTER
// -------------------------------------------------------------
interface ExtracurricularFormModalProps {
  isOpen: boolean;
  initialData: ExtracurricularMaster | null;
  onClose: () => void;
  onSave: (data: Omit<ExtracurricularMaster, 'id'>) => void;
}

const ExtracurricularFormModal: React.FC<ExtracurricularFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  const [nama, setNama] = useState(initialData?.nama || '');
  const [kategori, setKategori] = useState<ActivityCategory>(
    initialData?.kategori || 'Teknologi'
  );
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');
  const [pembina, setPembina] = useState(initialData?.pembina || '');
  const [jadwal, setJadwal] = useState(initialData?.jadwal || '');
  const [lokasi, setLokasi] = useState(initialData?.lokasi || '');
  const [kuotaMaksimal, setKuotaMaksimal] = useState<number>(
    initialData?.kuotaMaksimal || 30
  );
  const [status, setStatus] = useState<'aktif' | 'nonaktif'>(
    initialData?.status || 'aktif'
  );
  const [isWajibPemerintah, setIsWajibPemerintah] = useState<boolean>(
    initialData?.isWajibPemerintah || false
  );
  const [iconName, setIconName] = useState<string>(initialData?.iconName || 'Bot');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    onSave({
      nama,
      kategori,
      deskripsi,
      pembina,
      jadwal,
      lokasi,
      tingkatKelas: [1, 2, 3, 4, 5, 6],
      kuotaMaksimal: Number(kuotaMaksimal) || 30,
      status,
      isWajibPemerintah,
      iconName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              {initialData ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Nama Ekstrakurikuler
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Robotic & Coding, Jiujitsu (Grappling), Drawing..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Teknologi">Teknologi</option>
                <option value="Bela Diri">Bela Diri</option>
                <option value="Seni & Desain">Seni & Desain</option>
                <option value="Kuliner & Keterampilan">Kuliner & Keterampilan</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Bahasa & Keagamaan">Bahasa & Keagamaan</option>
                <option value="Petualangan & Alam Bebas">Petualangan & Alam Bebas</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Pilih Ikon</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Bot">Robotik (Bot)</option>
                <option value="Shield">Bela Diri (Shield)</option>
                <option value="Swords">Silat / Ksatria (Swords)</option>
                <option value="Palette">Seni Gambar (Palette)</option>
                <option value="UtensilsCrossed">Memasak (Utensils)</option>
                <option value="Trophy">Olahraga (Trophy)</option>
                <option value="Waves">Renang (Waves)</option>
                <option value="Compass">Petualangan (Compass)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Deskripsi & Capaian Belajar
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan keterampilan apa yang dipelajari siswa..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nama Pembina / Pelatih
              </label>
              <input
                type="text"
                value={pembina}
                onChange={(e) => setPembina(e.target.value)}
                placeholder="Contoh: Sensei Ahmad, Kak Aditya..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Jadwal Latihan
              </label>
              <input
                type="text"
                value={jadwal}
                onChange={(e) => setJadwal(e.target.value)}
                placeholder="Contoh: Sabtu, 08.00 - 09.30"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Lokasi</label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: Lab Robotik, Dojo Hall..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Kuota Maksimal
              </label>
              <input
                type="number"
                value={kuotaMaksimal}
                onChange={(e) => setKuotaMaksimal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={status === 'aktif'}
                onChange={(e) => setStatus(e.target.checked ? 'aktif' : 'nonaktif')}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-bold text-slate-700">Status Aktif (Buka Pendaftaran)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isWajibPemerintah}
                onChange={(e) => setIsWajibPemerintah(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="font-bold text-amber-700">Program Anjuran Pemerintah</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              Simpan Ekstrakurikuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-MODAL 2: EDIT PILIHAN EKSKUL SISWA
// -------------------------------------------------------------
interface StudentExtracurricularModalProps {
  isOpen: boolean;
  student: StudentMasterRecord;
  availableEkskuls: ExtracurricularMaster[];
  onClose: () => void;
  onSave: (updatedEkskuls: Extracurricular[]) => void;
}

export const StudentExtracurricularModal: React.FC<StudentExtracurricularModalProps> = ({
  isOpen,
  student,
  availableEkskuls,
  onClose,
  onSave,
}) => {
  const [selectedList, setSelectedList] = useState<Extracurricular[]>(
    student.extracurriculars || []
  );

  if (!isOpen) return null;

  const handleToggleEkskul = (ekMaster: ExtracurricularMaster) => {
    const exists = selectedList.some((e) => e.nama === ekMaster.nama);
    if (exists) {
      setSelectedList((prev) => prev.filter((e) => e.nama !== ekMaster.nama));
    } else {
      setSelectedList((prev) => [
        ...prev,
        {
          nama: ekMaster.nama,
          nilaiGanjil: 'Baik',
          keteranganGanjil: 'Aktif mengikuti pertemuan latihan rutin',
          nilaiGenap: 'Sangat Baik',
          keteranganGenap: 'Menunjukkan perkembangan minat dan kedisiplinan tinggi',
          pembina: ekMaster.pembina,
          jadwal: ekMaster.jadwal,
        },
      ]);
    }
  };

  const handleUpdateGrade = (
    index: number,
    field: 'nilaiGanjil' | 'nilaiGenap' | 'keteranganGenap',
    val: string
  ) => {
    setSelectedList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 shrink-0">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Pilihan Ekstrakurikuler: {student.namaLengkap}
            </h3>
            <p className="text-xs text-slate-500">
              Kelas {student.kelas} • NIS: {student.noInduk}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-2">
              Pilih Ekstrakurikuler yang Diikuti Siswa (Bisa Lebih Dari Satu):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableEkskuls
                .filter((ek) => ek.status === 'aktif')
                .map((ek) => {
                  const isChecked = selectedList.some((e) => e.nama === ek.nama);
                  return (
                    <button
                      type="button"
                      key={ek.id}
                      onClick={() => handleToggleEkskul(ek)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                      />
                      <div className="min-w-0">
                        <p className="text-xs leading-tight truncate">{ek.nama}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {ek.pembina} • {ek.jadwal}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Detailed evaluation inputs for chosen extracurriculars */}
          {selectedList.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="font-bold text-slate-700 block">
                Penilaian & Catatan Capaian Ekskul Siswa:
              </label>

              {selectedList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-indigo-700">
                      {idx + 1}. {item.nama}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedList((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-rose-600 hover:underline text-[11px]"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">
                        Predikat Sem 1
                      </span>
                      <select
                        value={item.nilaiGanjil || 'Baik'}
                        onChange={(e) =>
                          handleUpdateGrade(idx, 'nilaiGanjil', e.target.value)
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Sangat Baik">Sangat Baik</option>
                        <option value="Baik">Baik</option>
                        <option value="Cukup">Cukup</option>
                        <option value="Kurang">Kurang</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">
                        Predikat Sem 2
                      </span>
                      <select
                        value={item.nilaiGenap || 'Sangat Baik'}
                        onChange={(e) =>
                          handleUpdateGrade(idx, 'nilaiGenap', e.target.value)
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Sangat Baik">Sangat Baik</option>
                        <option value="Baik">Baik</option>
                        <option value="Cukup">Cukup</option>
                        <option value="Kurang">Kurang</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">
                      Catatan Capaian / Perkembangan:
                    </span>
                    <input
                      type="text"
                      value={item.keteranganGenap || ''}
                      onChange={(e) =>
                        handleUpdateGrade(idx, 'keteranganGenap', e.target.value)
                      }
                      placeholder="Contoh: Menguasai teknik kuncian armlock dengan baik..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onSave(selectedList)}
            className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs text-xs"
          >
            Simpan Pilihan Siswa
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-MODAL 3: UPDATE PENGUJIAN KEHALIAN WAJIB SISWA (4 PILAR)
// -------------------------------------------------------------
interface StudentMustHaveSkillModalProps {
  isOpen: boolean;
  student: StudentMasterRecord;
  skillsMaster: MustHaveSkillMaster[];
  onClose: () => void;
  onSave: (skillKode: string, record: any) => void;
}

export const StudentMustHaveSkillModal: React.FC<StudentMustHaveSkillModalProps> = ({
  isOpen,
  student,
  skillsMaster,
  onClose,
  onSave,
}) => {
  const [selectedKode, setSelectedKode] = useState<string>(skillsMaster[0]?.kode || 'swimming');

  const currentSkillRecord = useMemo(() => {
    return student.mustHaveSkills?.find((s) => s.kode === selectedKode) || {
      skillId: `mhs-${selectedKode}`,
      kode: selectedKode,
      nama: skillsMaster.find((m) => m.kode === selectedKode)?.nama || '',
      levelCapaian: 'Tingkat Berkembang' as SkillMasteryLevel,
      badgeEarned: false,
      tanggalUjian: new Date().toISOString().split('T')[0],
      penguji: '',
      catatan: '',
    };
  }, [student, selectedKode, skillsMaster]);

  const [level, setLevel] = useState<SkillMasteryLevel>(currentSkillRecord.levelCapaian);
  const [badge, setBadge] = useState<boolean>(currentSkillRecord.badgeEarned);
  const [tanggal, setTanggal] = useState<string>(
    currentSkillRecord.tanggalUjian || new Date().toISOString().split('T')[0]
  );
  const [penguji, setPenguji] = useState<string>(currentSkillRecord.penguji || '');
  const [catatan, setCatatan] = useState<string>(currentSkillRecord.catatan || '');

  // Synchronize when active skill changes
  const handleSelectSkillTab = (kode: string) => {
    setSelectedKode(kode);
    const rec = student.mustHaveSkills?.find((s) => s.kode === kode);
    if (rec) {
      setLevel(rec.levelCapaian);
      setBadge(rec.badgeEarned);
      setTanggal(rec.tanggalUjian || new Date().toISOString().split('T')[0]);
      setPenguji(rec.penguji || '');
      setCatatan(rec.catatan || '');
    } else {
      setLevel('Tingkat Berkembang');
      setBadge(false);
      setTanggal(new Date().toISOString().split('T')[0]);
      setPenguji('');
      setCatatan('');
    }
  };

  if (!isOpen) return null;

  const handleSaveCurrent = () => {
    onSave(selectedKode, {
      levelCapaian: level,
      badgeEarned: badge,
      tanggalUjian: tanggal,
      penguji,
      catatan,
    });
    alert(`Hasil uji kompetensi untuk ${currentSkillRecord.nama} berhasil disimpan!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Uji Kompetensi Keahlian Wajib: {student.namaLengkap}
            </h3>
            <p className="text-xs text-slate-500">
              Sertifikasi 4 Keterampilan Lapangan Khas Sekolah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Skill Selector Pills */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {skillsMaster.map((sk) => {
            const isSelected = sk.kode === selectedKode;
            const isEarned = student.mustHaveSkills?.some(
              (m) => m.kode === sk.kode && m.badgeEarned
            );

            return (
              <button
                type="button"
                key={sk.id}
                onClick={() => handleSelectSkillTab(sk.kode)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{sk.nama.split(' ')[0]}</span>
                  {isEarned && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded-md">
                      ✓ Lulus
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Form to record test */}
        <div className="space-y-3 pt-2 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Tingkat Kelulusan / Capaian
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as SkillMasteryLevel)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Lulus Uji Mandiri / Mahir">
                ★ Lulus Uji Mandiri / Mahir (Lencana Emas)
              </option>
              <option value="Tingkat Terampil">Tingkat Terampil (Lulus Dasar)</option>
              <option value="Tingkat Berkembang">Tingkat Berkembang</option>
              <option value="Tingkat Pemula">Tingkat Pemula</option>
              <option value="Belum Diuji">Belum Diuji</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <span className="font-bold text-emerald-900">
              Sertifikasi / Lencana Diberikan (Badge Earned)
            </span>
            <input
              type="checkbox"
              checked={badge}
              onChange={(e) => setBadge(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tanggal Ujian
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Penguji / Instruktur
              </label>
              <input
                type="text"
                value={penguji}
                onChange={(e) => setPenguji(e.target.value)}
                placeholder="Contoh: Coach Hendri, Kang Fajar..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Catatan Kemampuan Spesifik
            </label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Lulus lintasan 25m gaya dada, berani treading water 3 menit..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 text-xs"
          >
            Selesai / Tutup
          </button>
          <button
            type="button"
            onClick={handleSaveCurrent}
            className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs text-xs"
          >
            Simpan Nilai Keahlian Ini
          </button>
        </div>
      </div>
    </div>
  );
};
