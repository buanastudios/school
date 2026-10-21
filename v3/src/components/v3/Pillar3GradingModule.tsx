import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import type { GradingScaleType } from '../../types/v3';
import {
  CheckCircle2,
  Sparkles,
  QrCode,
  Plus,
} from 'lucide-react';

export const Pillar3GradingModule: React.FC = () => {
  const {
    gradebook,
    examPlans,
    addExamPlan,
    terminology,
    activeCampus,
    branding,
    students,
  } = useV3App();

  const [activeSubTab, setActiveSubTab] = useState<'gradebook' | 'planner' | 'report_cards'>('gradebook');
  const [activeScale, setActiveScale] = useState<GradingScaleType>('GPA_4');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(gradebook[0]?.studentId || '');
  const [isBulkGenerated, setIsBulkGenerated] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Exam Form
  const [examTitle, setExamTitle] = useState('Ujian Praktik Robotika & Sains');
  const [subjectName, setSubjectName] = useState('IPA & Robotika');
  const [examDate, setExamDate] = useState('2026-11-12');
  const [weightCoursework, setWeightCoursework] = useState(30);
  const [weightMidterm, setWeightMidterm] = useState(30);
  const [weightFinal, setWeightFinal] = useState(40);

  const handleBulkGenerate = () => {
    setIsBulkGenerated(true);
    setTimeout(() => setIsBulkGenerated(false), 4000);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    addExamPlan({
      campusId: activeCampus.id,
      title: examTitle,
      subjectCode: subjectName.substring(0, 3).toUpperCase() + '-6',
      subjectName,
      examDate,
      durationMinutes: 90,
      weightCourseworkPercent: weightCoursework,
      weightMidtermPercent: weightMidterm,
      weightFinalPercent: weightFinal,
      isPublished: true,
    });
    setIsExamModalOpen(false);
  };

  const currentStudentGradeEntries = gradebook.filter(
    (g) => g.studentId === selectedStudentId
  );
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              Pillar 3: Assessment & Grading
            </span>
            <span className="text-xs text-purple-200">• {activeCampus.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Assessment & Grading (Reporting Engine)
          </h2>
          <p className="text-xs text-purple-100 mt-1 max-w-2xl leading-relaxed">
            Buku nilai multi-skala (GPA 4.0, Skala Huruf, Persentase, Deskripsi Capaian Kompetensi Kurikulum Merdeka), pembobotan ujian fleksibel, dan penerbitan {terminology.labelReportCard.toLowerCase()} digital sekali klik.
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('gradebook')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'gradebook' ? 'bg-white text-purple-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Buku Nilai (Gradebook)
          </button>
          <button
            onClick={() => setActiveSubTab('planner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'planner' ? 'bg-white text-purple-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Pembobotan Ujian ({examPlans.length})
          </button>
          <button
            onClick={() => setActiveSubTab('report_cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'report_cards' ? 'bg-white text-purple-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Cetak {terminology.labelReportCard}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: CONFIGURABLE MULTI-SCALE GRADEBOOK */}
      {/* ======================================================== */}
      {activeSubTab === 'gradebook' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Buku Nilai Digital Multi-Skala
              </h3>
              <p className="text-xs text-slate-500">
                Pilih format standar penilaian akademik yang disesuaikan dengan kurikulum institusi Anda.
              </p>
            </div>

            {/* Scale Picker */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveScale('GPA_4')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeScale === 'GPA_4' ? 'bg-purple-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                }`}
              >
                GPA 4.0
              </button>
              <button
                onClick={() => setActiveScale('LETTER_GRADE')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeScale === 'LETTER_GRADE' ? 'bg-purple-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                }`}
              >
                Huruf (A-F)
              </button>
              <button
                onClick={() => setActiveScale('PERCENTAGE_100')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeScale === 'PERCENTAGE_100' ? 'bg-purple-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                }`}
              >
                Persen (0-100)
              </button>
              <button
                onClick={() => setActiveScale('COMPETENCY_MERDEKA')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeScale === 'COMPETENCY_MERDEKA' ? 'bg-purple-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                }`}
              >
                Deskriptif
              </button>
            </div>
          </div>

          {/* Gradebook Entries Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">{terminology.labelStudent}</th>
                  <th className="py-2.5 px-3">Mata Pelajaran</th>
                  <th className="py-2.5 px-3 text-center">Tugas (30%)</th>
                  <th className="py-2.5 px-3 text-center">UTS (30%)</th>
                  <th className="py-2.5 px-3 text-center">UAS (40%)</th>
                  <th className="py-2.5 px-3 text-center">Hasil ({activeScale})</th>
                  <th className="py-2.5 px-3">Ulasan Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradebook.map((entry) => (
                  <tr key={entry.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{entry.studentName}</td>
                    <td className="py-3 px-3 font-semibold text-blue-700">{entry.subjectName}</td>
                    <td className="py-3 px-3 text-center font-mono">{entry.assignmentsScore}</td>
                    <td className="py-3 px-3 text-center font-mono">{entry.midtermExamScore}</td>
                    <td className="py-3 px-3 text-center font-mono">{entry.finalExamScore}</td>
                    <td className="py-3 px-3 text-center">
                      {activeScale === 'GPA_4' && (
                        <span className="px-2 py-0.5 rounded-full font-black bg-purple-100 text-purple-800 font-mono">
                          {entry.gpaPoint.toFixed(2)}
                        </span>
                      )}
                      {activeScale === 'LETTER_GRADE' && (
                        <span className="px-2.5 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-800">
                          {entry.finalGradeLetter}
                        </span>
                      )}
                      {activeScale === 'PERCENTAGE_100' && (
                        <span className="font-extrabold font-mono text-slate-900">
                          {entry.finalPercentage.toFixed(1)}%
                        </span>
                      )}
                      {activeScale === 'COMPETENCY_MERDEKA' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          Sangat Mahir
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                      {entry.competencySummary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: EXAM & ASSESSMENT WEIGHTAGE PLANNER */}
      {/* ======================================================== */}
      {activeSubTab === 'planner' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Perencanaan Ujian & Pembobotan Asesmen
              </h3>
              <p className="text-xs text-slate-500">
                Tentukan bobot tugas, penilaian tengah semester, dan ujian akhir untuk kalkulasi nilai akhir otomatis.
              </p>
            </div>
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Ujian Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {plan.subjectCode}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{plan.title}</h4>
                    <p className="text-xs text-slate-500">Tanggal: {plan.examDate} • Durasi: {plan.durationMinutes} Menit</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    plan.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {plan.isPublished ? 'Terjadwal Resmi' : 'Draft'}
                  </span>
                </div>

                {/* Weightage Breakdown */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Distribusi Pembobotan Nilai:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                      <span className="text-[10px] text-slate-500 block">Tugas / Portofolio</span>
                      <strong className="text-blue-700 font-black">{plan.weightCourseworkPercent}%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-[10px] text-slate-500 block">UTS / Formatif</span>
                      <strong className="text-amber-700 font-black">{plan.weightMidtermPercent}%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-50/70 border border-purple-100">
                      <span className="text-[10px] text-slate-500 block">UAS / Sumatif</span>
                      <strong className="text-purple-700 font-black">{plan.weightFinalPercent}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: AUTOMATED REPORT CARDS & BULK GENERATION */}
      {/* ======================================================== */}
      {activeSubTab === 'report_cards' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Penerbitan {terminology.labelReportCard} & Transkrip Massal Sekali Klik
              </h3>
              <p className="text-xs text-slate-500">
                Hasilkan buku rapor digital terverifikasi ber-QR Code dengan tanda tangan resmi pimpinan institusi.
              </p>
            </div>

            <button
              onClick={handleBulkGenerate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Semua Rapor 1-Klik</span>
            </button>
          </div>

          {isBulkGenerated && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Seluruh {terminology.labelReportCard.toLowerCase()} Rombel 6-A ({students.length} Siswa) berhasil digenerate dan diarsipkan dalam brankas digital!</span>
              </div>
              <button
                onClick={() => window.open('cetak-buku.html', '_blank')}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0"
              >
                Buka Pratinjau Cetak
              </button>
            </div>
          )}

          {/* Student Selector for Live Preview */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Pilih Siswa untuk Pratinjau Rapor:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({terminology.labelClass} {s.classCohort})
                </option>
              ))}
            </select>
          </div>

          {/* Printable Digital Transcript Mockup Card */}
          <div className="border-2 border-slate-300 rounded-2xl p-6 bg-slate-50/30 max-w-3xl mx-auto shadow-sm space-y-5">
            {/* School Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="font-black text-base uppercase tracking-tight text-slate-900">{branding.institutionName}</h2>
                <p className="text-xs text-slate-600">{activeCampus.address}, {activeCampus.city}</p>
                <p className="text-[11px] font-mono text-slate-500">Domain Resmi: {branding.customDomain}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-1 rounded-md border border-purple-200">
                  Transkrip Nilai Akademik
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">Dokumen ID: RPR-2026-6A-01</p>
              </div>
            </div>

            {/* Student Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Nama {terminology.labelStudent}: <strong className="text-slate-900">{currentStudent.fullName}</strong></p>
                <p className="text-slate-500">Nomor Induk Siswa Nasional: <strong className="text-slate-900 font-mono">{currentStudent.nisn}</strong></p>
              </div>
              <div className="text-right sm:text-left">
                <p className="text-slate-500">{terminology.labelClass}: <strong className="text-slate-900">{currentStudent.classCohort}</strong></p>
                <p className="text-slate-500">Tahun Ajaran: <strong className="text-slate-900">2026/2027 (Semester Ganjil)</strong></p>
              </div>
            </div>

            {/* Subjects & Marks */}
            <table className="w-full text-xs border border-slate-300 rounded-lg overflow-hidden bg-white">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                <tr>
                  <th className="p-2 text-left">Mata Pelajaran</th>
                  <th className="p-2 text-center">Nilai Angka</th>
                  <th className="p-2 text-center">Predikat</th>
                  <th className="p-2 text-left">Deskripsi Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentStudentGradeEntries.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 font-semibold text-slate-900">{item.subjectName}</td>
                    <td className="p-2 text-center font-bold font-mono">{item.finalPercentage.toFixed(1)}</td>
                    <td className="p-2 text-center font-black text-purple-700">{item.finalGradeLetter}</td>
                    <td className="p-2 text-slate-600 text-[11px]">{item.competencySummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Verification Footer with QR Code & Signature */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-9 h-9 text-slate-900" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Verifikasi QR Otentisitas</p>
                  <p className="text-[10px] text-slate-500">Tersertifikasi Digital oleh BUANA STUDIOS</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[11px] text-slate-500">Bandung, 20 Desember 2026</p>
                <p className="text-xs font-bold text-slate-900 mt-6">{activeCampus.principalName}</p>
                <p className="text-[10px] text-slate-500">{terminology.labelHeadmaster}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Jadwalkan Asesmen / Ujian Baru</h3>
            <form onSubmit={handleAddExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Ujian</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tanggal Ujian</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-[10px]">Bobot Tugas %</label>
                  <input
                    type="number"
                    value={weightCoursework}
                    onChange={(e) => setWeightCoursework(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[10px]">Bobot UTS %</label>
                  <input
                    type="number"
                    value={weightMidterm}
                    onChange={(e) => setWeightMidterm(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[10px]">Bobot UAS %</label>
                  <input
                    type="number"
                    value={weightFinal}
                    onChange={(e) => setWeightFinal(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Simpan Jadwal Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
