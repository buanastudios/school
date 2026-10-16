import React, { useState } from 'react';
import type { StudentMasterRecord, SubjectGrade } from '../../types';
import {
  subjectCompetencyPresets,
  defaultSchoolSubjects,
  homeroomNotesPresets,
} from '../../data/raporPresets';
import {
  Save,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  Award,
  BookOpen,
  Calendar,
  UserCheck,
  ClipboardList,
} from 'lucide-react';

interface RaporEditorProps {
  student: StudentMasterRecord;
  semester: 1 | 2;
  onSave: (updatedStudent: StudentMasterRecord) => void;
  onPreviewPrint: () => void;
}

export const RaporEditor: React.FC<RaporEditorProps> = ({
  student,
  semester,
  onSave,
  onPreviewPrint,
}) => {
  // Helper to ensure student has all default subjects
  const syncStudentSubjects = (st: StudentMasterRecord): StudentMasterRecord => {
    const existingMapelIds = new Set(st.grades.map((g) => g.mapelId));
    const missing = defaultSchoolSubjects.filter((d) => !existingMapelIds.has(d.mapelId));
    if (missing.length === 0) return st;

    const newGrades: SubjectGrade[] = [
      ...st.grades,
      ...missing.map((m) => ({
        ...m,
        nilaiGanjil: 85,
        nilaiGenap: 85,
        capaianTinggiGanjil: `Mencapai Kompetensi dengan sangat baik dalam materi pembelajaran ${m.mapelNama}.`,
        capaianPerluPeningkatanGanjil: 'Perlu peningkatan dalam keaktifan dan ketelitian.',
        capaianTinggiGenap: `Mencapai Kompetensi dengan sangat baik dalam materi pembelajaran ${m.mapelNama}.`,
        capaianPerluPeningkatanGenap: 'Perlu peningkatan dalam keaktifan dan ketelitian.',
      })),
    ];

    return {
      ...st,
      grades: newGrades,
    };
  };

  // Local state for the student being edited
  const [formData, setFormData] = useState<StudentMasterRecord>(() => syncStudentSubjects(student));
  const [activeTab, setActiveTab] = useState<
    'mapel' | 'kokurikuler' | 'ekskul' | 'kehadiran' | 'keputusan' | 'identitas'
  >('mapel');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize when selected student ID changes
  const [lastStudentId, setLastStudentId] = useState(student.id);
  if (student.id !== lastStudentId) {
    setLastStudentId(student.id);
    setFormData(syncStudentSubjects(student));
  }

  const handleGradeChange = (
    mapelId: string,
    field: 'nilai' | 'capaianTinggi' | 'capaianPeningkatan',
    value: any
  ) => {
    setFormData((prev) => {
      const updatedGrades = prev.grades.map((g) => {
        if (g.mapelId !== mapelId) return g;
        if (field === 'nilai') {
          const numVal = value === '' ? undefined : Number(value);
          return semester === 1 ? { ...g, nilaiGanjil: numVal } : { ...g, nilaiGenap: numVal };
        }
        if (field === 'capaianTinggi') {
          return semester === 1
            ? { ...g, capaianTinggiGanjil: value }
            : { ...g, capaianTinggiGenap: value };
        }
        if (field === 'capaianPeningkatan') {
          return semester === 1
            ? { ...g, capaianPerluPeningkatanGanjil: value }
            : { ...g, capaianPerluPeningkatanGenap: value };
        }
        return g;
      });
      return { ...prev, grades: updatedGrades };
    });
  };

  const handleApplyPreset = (mapelId: string, type: 'tinggi' | 'peningkatan', text: string) => {
    if (type === 'tinggi') {
      const formatted = `Mencapai Kompetensi dengan sangat baik dalam hal ${text}`;
      handleGradeChange(mapelId, 'capaianTinggi', formatted);
    } else {
      const formatted = `Perlu peningkatan dalam hal ${text}`;
      handleGradeChange(mapelId, 'capaianPeningkatan', formatted);
    }
  };

  const handleAddCustomSubject = () => {
    const name = prompt('Masukkan Nama Mata Pelajaran Baru (Muatan Lokal):', 'Bahasa Arab');
    if (!name) return;
    const newId = `m-custom-${Date.now()}`;
    const newGrade: SubjectGrade = {
      mapelId: newId,
      mapelNama: name,
      kategori: 'Muatan Lokal',
      kelompok: 'Kelompok B',
      nilaiGanjil: 88,
      nilaiGenap: 88,
      capaianTinggiGanjil: `Mencapai Kompetensi dengan sangat baik dalam pembelajaran ${name}.`,
      capaianPerluPeningkatanGanjil: 'Perlu peningkatan dalam penguasaan kosakata dasar.',
      capaianTinggiGenap: `Mencapai Kompetensi dengan sangat baik dalam pembelajaran ${name}.`,
      capaianPerluPeningkatanGenap: 'Perlu peningkatan dalam penguasaan kosakata dasar.',
    };

    setFormData((prev) => ({
      ...prev,
      grades: [...prev.grades, newGrade],
    }));
  };

  const handleDeleteSubject = (mapelId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini dari rapor?')) return;
    setFormData((prev) => ({
      ...prev,
      grades: prev.grades.filter((g) => g.mapelId !== mapelId),
    }));
  };

  const handleSaveAll = () => {
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Active semester values
  const catatanWaliKelas =
    semester === 1
      ? formData.catatanWaliKelasSem1 || ''
      : formData.catatanWaliKelasSem2 || '';

  const kokurikulerVal =
    semester === 1 ? formData.kokurikulerSem1 || '' : formData.kokurikulerSem2 || '';

  const ekskulList =
    semester === 1 ? formData.ekskulSem1 || [] : formData.ekskulSem2 || [];

  const handleUpdateEkskul = (index: number, field: 'nama' | 'predikat' | 'keterangan', val: string) => {
    setFormData((prev) => {
      const currentList = semester === 1 ? [...(prev.ekskulSem1 || [])] : [...(prev.ekskulSem2 || [])];
      if (!currentList[index]) return prev;
      currentList[index] = { ...currentList[index], [field]: val };
      return semester === 1 ? { ...prev, ekskulSem1: currentList } : { ...prev, ekskulSem2: currentList };
    });
  };

  const handleAddEkskul = () => {
    const newEkskul = {
      nama: 'Hizbul Wathan',
      predikat: 'Sangat Baik',
      keterangan: 'Menunjukkan perkembangan yang sangat baik dalam kegiatan kepanduan.',
    };
    setFormData((prev) => {
      const currentList = semester === 1 ? [...(prev.ekskulSem1 || [])] : [...(prev.ekskulSem2 || [])];
      return semester === 1
        ? { ...prev, ekskulSem1: [...currentList, newEkskul] }
        : { ...prev, ekskulSem2: [...currentList, newEkskul] };
    });
  };

  const handleRemoveEkskul = (index: number) => {
    setFormData((prev) => {
      const currentList = semester === 1 ? [...(prev.ekskulSem1 || [])] : [...(prev.ekskulSem2 || [])];
      currentList.splice(index, 1);
      return semester === 1 ? { ...prev, ekskulSem1: currentList } : { ...prev, ekskulSem2: currentList };
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner & Action Controls */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold text-xs backdrop-blur-sm">
              Input & Keputusan Guru
            </span>
            <span className="text-indigo-200 text-xs font-semibold">
              Semester {semester} ({semester === 1 ? 'Ganjil' : 'Genap'}) • TP {formData.tahunPelajaran || '2025/2026'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
            Penilaian Rapor: {formData.namaLengkap}
          </h2>
          <p className="text-xs text-indigo-100">
            NIS: {formData.noInduk} • NISN: {formData.nisn} • Kelas {formData.kelas}A • Fase {formData.fase || 'C'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Nilai</span>
          </button>

          <button
            onClick={onPreviewPrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-extrabold text-xs shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Pratinjau / Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 p-3 px-5 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Nilai dan capaian rapor berhasil disimpan ke basis data! Data akan langsung terlihat di lembar cetak resmi.</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/80 px-4 pt-2 gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('mapel')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'mapel'
              ? 'bg-white border-indigo-600 text-indigo-600 font-bold shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Nilai & Capaian Mapel</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px]">
            {formData.grades.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kokurikuler')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'kokurikuler'
              ? 'bg-white border-indigo-600 text-indigo-600 font-bold shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Kokurikuler (P5)</span>
        </button>

        <button
          onClick={() => setActiveTab('ekskul')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ekskul'
              ? 'bg-white border-indigo-600 text-indigo-600 font-bold shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Ekstrakurikuler</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
            {ekskulList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kehadiran')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'kehadiran'
              ? 'bg-white border-indigo-600 text-indigo-600 font-bold shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Absensi & Catatan Wali Kelas</span>
        </button>

        <button
          onClick={() => setActiveTab('keputusan')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'keputusan'
              ? 'bg-white border-indigo-600 text-indigo-600 font-bold shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Keputusan Kenaikan / TTD</span>
        </button>

        <button
          onClick={() => setActiveTab('identitas')}
          className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'identitas'
              ? 'bg-white border-indigo-600 text-indigo-600 font-bold shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Data Identitas Rapor</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ================= TAB 1: NILAI & CAPAIAN MAPEL ================= */}
        {activeTab === 'mapel' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-800">Petunjuk Kurikulum Merdeka:</span> Masukkan Nilai Akhir (0-100), deskripsi capaian kompetensi tertinggi (sangat baik), dan capaian yang perlu ditingkatkan.
              </div>
              <button
                onClick={handleAddCustomSubject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Muatan Lokal</span>
              </button>
            </div>

            {/* Subject List */}
            <div className="space-y-4">
              {formData.grades.map((grade, idx) => {
                const nilai = semester === 1 ? grade.nilaiGanjil ?? '' : grade.nilaiGenap ?? '';
                const capaianTinggi =
                  semester === 1 ? grade.capaianTinggiGanjil || '' : grade.capaianTinggiGenap || '';
                const capaianPeningkatan =
                  semester === 1
                    ? grade.capaianPerluPeningkatanGanjil || ''
                    : grade.capaianPerluPeningkatanGenap || '';
                const presets = subjectCompetencyPresets[grade.mapelId];

                return (
                  <div
                    key={grade.mapelId}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{grade.mapelNama}</h4>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {grade.kelompok || (grade.kategori === 'Muatan Lokal' ? 'Kelompok B' : 'Kelompok A')}
                          </span>
                        </div>
                      </div>

                      {/* Final Grade Input */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Nilai Akhir:</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={nilai}
                            onChange={(e) => handleGradeChange(grade.mapelId, 'nilai', e.target.value)}
                            placeholder="85"
                            className="w-16 px-2.5 py-1 text-center font-bold text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                          />
                        </div>

                        {grade.mapelId.startsWith('m-custom') && (
                          <button
                            onClick={() => handleDeleteSubject(grade.mapelId)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Mata Pelajaran"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Capaian Kompetensi Textareas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                      {/* Capaian Sangat Baik */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-emerald-800 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Capaian Sangat Baik:</span>
                          </label>

                          {presets && presets.tinggi.length > 0 && (
                            <div className="relative group">
                              <button
                                type="button"
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Pilih Rekomendasi</span>
                              </button>
                              <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-72 p-2 bg-white rounded-xl shadow-lg border border-slate-200 z-30 space-y-1">
                                {presets.tinggi.map((txt, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => handleApplyPreset(grade.mapelId, 'tinggi', txt)}
                                    className="w-full text-left text-[11px] p-1.5 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors leading-snug"
                                  >
                                    • {txt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          value={capaianTinggi}
                          onChange={(e) =>
                            handleGradeChange(grade.mapelId, 'capaianTinggi', e.target.value)
                          }
                          placeholder="Mencapai Kompetensi dengan sangat baik dalam hal..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed text-[11px]"
                        />
                      </div>

                      {/* Capaian Perlu Peningkatan */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-amber-800 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span>Perlu Peningkatan:</span>
                          </label>

                          {presets && presets.peningkatan.length > 0 && (
                            <div className="relative group">
                              <button
                                type="button"
                                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Pilih Rekomendasi</span>
                              </button>
                              <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-72 p-2 bg-white rounded-xl shadow-lg border border-slate-200 z-30 space-y-1">
                                {presets.peningkatan.map((txt, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => handleApplyPreset(grade.mapelId, 'peningkatan', txt)}
                                    className="w-full text-left text-[11px] p-1.5 rounded-lg hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition-colors leading-snug"
                                  >
                                    • {txt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <textarea
                          rows={3}
                          value={capaianPeningkatan}
                          onChange={(e) =>
                            handleGradeChange(grade.mapelId, 'capaianPeningkatan', e.target.value)
                          }
                          placeholder="Perlu peningkatan dalam hal..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: KOKURIKULER (P5) ================= */}
        {activeTab === 'kokurikuler' && (
          <div className="space-y-4 max-w-3xl">
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2">
              <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Deskripsi Capaian Kokurikuler (Semester {semester})</span>
              </h3>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Tuliskan evaluasi penguatan profil pelajar / profil lulusan yang dicapai peserta didik melalui projek kokurikuler di semester ini.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Deskripsi Resmi Kokurikuler yang Tercetak di Rapor:
              </label>
              <textarea
                rows={5}
                value={kokurikulerVal}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) =>
                    semester === 1
                      ? { ...prev, kokurikulerSem1: val }
                      : { ...prev, kokurikulerSem2: val }
                  );
                }}
                placeholder="Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan..."
                className="w-full p-3 rounded-xl border border-slate-300 font-serif text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-600">Template Cepat:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const text =
                      'Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan, yang ditunjukkan melalui kegiatan kokurikuler Proyek Tidur Cepat dan Bangun Pagi. Pada dimensi keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa, ananda berkembang dalam subdimensi hubungan dengan Tuhan Yang Maha Esa. Pada dimensi penalaran kritis, ananda cakap dalam subdimensi penyelesaian masalah. Pada dimensi kesehatan, ananda cakap dalam subdimensi kebugaran, kesehatan fisik, dan kesehatan mental.';
                    setFormData((prev) =>
                      semester === 1
                        ? { ...prev, kokurikulerSem1: text }
                        : { ...prev, kokurikulerSem2: text }
                    );
                  }}
                  className="p-3 text-left rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-slate-700"
                >
                  <p className="font-bold text-indigo-900 mb-1">1. Proyek Tidur Cepat & Bangun Pagi</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">Dimensi keimanan, penalaran kritis, kebugaran jasmani & mental.</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text =
                      'Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan, yang ditunjukkan melalui kegiatan kokurikuler Gerakan Mencintai Tradisi dan Budaya Nusantara. Pada dimensi kewargaan, ananda cakap dalam subdimensi kewargaan lokal. Pada dimensi kemandirian, ananda cakap dalam subdimensi pengembangan diri. Pada dimensi kolaborasi, ananda cakap dalam subdimensi kerja sama.';
                    setFormData((prev) =>
                      semester === 1
                        ? { ...prev, kokurikulerSem1: text }
                        : { ...prev, kokurikulerSem2: text }
                    );
                  }}
                  className="p-3 text-left rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-slate-700"
                >
                  <p className="font-bold text-indigo-900 mb-1">2. Gerakan Mencintai Tradisi Nusantara</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">Dimensi kewargaan, kemandirian, dan kolaborasi.</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: EKSTRAKURIKULER ================= */}
        {activeTab === 'ekskul' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Daftar Ekstrakurikuler Semester {semester}
                </h3>
                <p className="text-xs text-slate-500">
                  Kegiatan ekstrakurikuler (misal: Attiera, Hizbul Wathan, Silat, Robotic) beserta catatan capaian.
                </p>
              </div>
              <button
                onClick={handleAddEkskul}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Ekskul</span>
              </button>
            </div>

            <div className="space-y-3">
              {ekskulList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.nama}
                        onChange={(e) => handleUpdateEkskul(idx, 'nama', e.target.value)}
                        placeholder="Nama Ekstrakurikuler"
                        className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-xs w-full max-w-xs"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveEkskul(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Keterangan Capaian / Deskripsi:
                    </label>
                    <textarea
                      rows={2}
                      value={item.keterangan}
                      onChange={(e) => handleUpdateEkskul(idx, 'keterangan', e.target.value)}
                      placeholder="Baik, Ananda menunjukkan penguasaan dalam..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: KEHADIRAN & CATATAN WALI KELAS ================= */}
        {activeTab === 'kehadiran' && (
          <div className="space-y-6 max-w-3xl">
            {/* Absensi */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Ketidakhadiran Semester {semester}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Sakit (Hari):</label>
                  <input
                    type="number"
                    min="0"
                    value={semester === 1 ? formData.attendance.sakitSem1 : formData.attendance.sakitSem2}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        attendance: {
                          ...prev.attendance,
                          ...(semester === 1 ? { sakitSem1: val } : { sakitSem2: val }),
                        },
                      }));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-sm text-center"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Izin (Hari):</label>
                  <input
                    type="number"
                    min="0"
                    value={semester === 1 ? formData.attendance.izinSem1 : formData.attendance.izinSem2}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        attendance: {
                          ...prev.attendance,
                          ...(semester === 1 ? { izinSem1: val } : { izinSem2: val }),
                        },
                      }));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-sm text-center"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tanpa Keterangan (Hari):</label>
                  <input
                    type="number"
                    min="0"
                    value={semester === 1 ? formData.attendance.alpaSem1 : formData.attendance.alpaSem2}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        attendance: {
                          ...prev.attendance,
                          ...(semester === 1 ? { alpaSem1: val } : { alpaSem2: val }),
                        },
                      }));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-sm text-center"
                  />
                </div>
              </div>
            </div>

            {/* Catatan Wali Kelas */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Catatan Wali Kelas (Pesan Pembinaan & Evaluasi):
              </label>
              <textarea
                rows={4}
                value={catatanWaliKelas}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) =>
                    semester === 1
                      ? { ...prev, catatanWaliKelasSem1: val }
                      : { ...prev, catatanWaliKelasSem2: val }
                  );
                }}
                placeholder="Tuliskan catatan wali kelas di sini..."
                className="w-full p-3 rounded-xl border border-slate-300 font-serif text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Suggestions */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-500">Pilihan Catatan Cepat:</span>
                <div className="mt-1 flex flex-col gap-1.5">
                  {homeroomNotesPresets.map((note, nIdx) => (
                    <button
                      key={nIdx}
                      type="button"
                      onClick={() =>
                        setFormData((prev) =>
                          semester === 1
                            ? { ...prev, catatanWaliKelasSem1: note }
                            : { ...prev, catatanWaliKelasSem2: note }
                        )
                      }
                      className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 transition-colors"
                    >
                      • {note}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: KEPUTUSAN KENAIKAN / TTD ================= */}
        {activeTab === 'keputusan' && (
          <div className="space-y-6 max-w-3xl">
            {/* Status Kenaikan / Kelulusan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Keputusan Kenaikan / Kelulusan (Semester 2)
              </h3>
              <p className="text-xs text-slate-500">
                Pernyataan resmi kelulusan untuk kelas 6 atau kenaikan kelas untuk kelas 1-5.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, kelulusanStatus: 'Lulus' }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.kelulusanStatus === 'Lulus'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  ✓ Lulus (Tingkat Akhir Kelas 6)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      kelulusanStatus: `Naik ke Kelas ${prev.kelas + 1}`,
                    }))
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.kelulusanStatus?.startsWith('Naik')
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  ✓ Naik ke Kelas {formData.kelas + 1}
                </button>

                <input
                  type="text"
                  value={formData.kelulusanStatus || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kelulusanStatus: e.target.value }))}
                  placeholder="Kustom: misal 'Lulus' atau 'Naik ke Kelas 6'"
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                />
              </div>
            </div>

            {/* Tanggal & Data Penandatangan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Data Wali Kelas
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Wali Kelas:</label>
                  <input
                    type="text"
                    value={formData.waliKelasNama || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, waliKelasNama: e.target.value }))}
                    placeholder="Syamsul Bahri, S.Pd.I., Gr."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">NUPTK / NIP:</label>
                  <input
                    type="text"
                    value={formData.waliKelasNuptk || formData.waliKelasNip || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        waliKelasNuptk: e.target.value,
                        waliKelasNip: e.target.value,
                      }))
                    }
                    placeholder="7035768669130423"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tanggal Titimangsa Rapor:
                  </label>
                  <input
                    type="text"
                    value={semester === 1 ? formData.tglRaporSem1 || '' : formData.tglRaporSem2 || ''}
                    onChange={(e) =>
                      setFormData((prev) =>
                        semester === 1
                          ? { ...prev, tglRaporSem1: e.target.value }
                          : { ...prev, tglRaporSem2: e.target.value }
                      )
                    }
                    placeholder="Kota Bandung, 22 Desember 2025"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Data Kepala Sekolah
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Kepala Sekolah:</label>
                  <input
                    type="text"
                    value={formData.kepalaSekolahNama || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kepalaSekolahNama: e.target.value }))}
                    placeholder="Tete Rohaeni, S.Pd., M.M."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">NIP Kepala Sekolah:</label>
                  <input
                    type="text"
                    value={formData.kepalaSekolahNip || '-'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kepalaSekolahNip: e.target.value }))}
                    placeholder="NIP. -"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: DATA IDENTITAS SISWA & SEKOLAH ================= */}
        {activeTab === 'identitas' && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="font-bold text-slate-900 text-sm">
              Data Identitas Peserta Didik (Halaman 3 Rapor)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Murid:</label>
                <input
                  type="text"
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData((prev) => ({ ...prev, namaLengkap: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Induk / NIS:</label>
                <input
                  type="text"
                  value={formData.noInduk}
                  onChange={(e) => setFormData((prev) => ({ ...prev, noInduk: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NISN:</label>
                <input
                  type="text"
                  value={formData.nisn}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nisn: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tempat Lahir:</label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tempatLahir: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir (YYYY-MM-DD):</label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tanggalLahir: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ayah:</label>
                <input
                  type="text"
                  value={formData.orangTua.namaAyah}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orangTua: { ...prev.orangTua, namaAyah: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ibu:</label>
                <input
                  type="text"
                  value={formData.orangTua.namaIbu}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orangTua: { ...prev.orangTua, namaIbu: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ayah:</label>
                <input
                  type="text"
                  value={formData.orangTua.pekerjaanAyah || 'Karyawan Swasta'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orangTua: { ...prev.orangTua, pekerjaanAyah: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ibu:</label>
                <input
                  type="text"
                  value={formData.orangTua.pekerjaanIbu || 'Karyawan Swasta'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orangTua: { ...prev.orangTua, pekerjaanIbu: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Telepon Rumah / WA:</label>
                <input
                  type="text"
                  value={formData.alamatTinggal.noTelepon || formData.nomorTeleponRumah || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nomorTeleponRumah: e.target.value,
                      alamatTinggal: { ...prev.alamatTinggal, noTelepon: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap:</label>
                <input
                  type="text"
                  value={formData.alamatTinggal.jalan}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alamatTinggal: { ...prev.alamatTinggal, jalan: e.target.value },
                    }))
                  }
                  placeholder="Jl. Parahyangan No. 18 RT.01 RW. 08"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Bottom Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-medium">
          Perubahan otomatis disinkronkan ke tampilan cetak resmi saat disimpan.
        </span>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>

          <button
            onClick={onPreviewPrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Pratinjau / Cetak Rapor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
