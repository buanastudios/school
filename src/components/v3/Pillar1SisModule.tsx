import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import type { StudentLifecycleStatus, V3StudentProfile } from '../../types/v3';
import {
  HeartPulse,
  PhoneCall,
  FileCheck2,
  Search,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export const Pillar1SisModule: React.FC = () => {
  const {
    students,
    updateStudentLifecycle,
    staff,
    parents,
    terminology,
    activeCampus,
  } = useV3App();

  const [activeSubTab, setActiveSubTab] = useState<'students' | 'staff' | 'guardians'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<V3StudentProfile>(students[0]);

  const lifecycleStages: { status: StudentLifecycleStatus; label: string; color: string }[] = [
    { status: 'APPLICANT', label: 'Calon / Pendaftar', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { status: 'ENROLLED', label: 'Diterima / Terdaftar', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { status: 'ACTIVE', label: 'Aktif Belajar', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { status: 'ON_LEAVE', label: 'Cuti Akademik', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { status: 'SUSPENDED', label: 'Skorsing', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { status: 'GRADUATED', label: 'Lulusan', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { status: 'ALUMNUS', label: 'Alumni Terdaftar', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  ];

  const filteredStudents = students.filter((s) => {
    const matchCampus = s.campusId === activeCampus.id;
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.classCohort.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCampus && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              Pillar 1: SIS
            </span>
            <span className="text-xs text-blue-200">• {activeCampus.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Identity & User Management (SIS Engine)
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
            Pengelolaan komprehensif siklus hidup {terminology.labelStudent.toLowerCase()} (calon hingga alumni), rekam medis & kontak darurat, kualifikasi direktori {terminology.labelTeacher.toLowerCase()}, dan relasi multi-wali keluarga.
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'students' ? 'bg-white text-indigo-900 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Siklus {terminology.labelStudent} ({students.length})
          </button>
          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'staff' ? 'bg-white text-indigo-900 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Direktori {terminology.labelTeacher} ({staff.length})
          </button>
          <button
            onClick={() => setActiveSubTab('guardians')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'guardians' ? 'bg-white text-indigo-900 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Pemetaan Wali ({parents.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: STUDENTS LIFECYCLE & MEDICAL/DOCUMENT VAULT */}
      {/* ======================================================== */}
      {activeSubTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Student List & Lifecycle filter */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
              {/* Search & Filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Cari nama ${terminology.labelStudent}, NISN, kelas...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    statusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({students.length})
                </button>
                {lifecycleStages.map((st) => (
                  <button
                    key={st.status}
                    onClick={() => setStatusFilter(st.status)}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                      statusFilter === st.status ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Students List Cards */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredStudents.map((std) => {
                const isSelected = selectedStudent.id === std.id;
                const statusMeta = lifecycleStages.find((s) => s.status === std.status) || lifecycleStages[2];

                return (
                  <div
                    key={std.id}
                    onClick={() => setSelectedStudent(std)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-extrabold text-xs text-slate-900 truncate">{std.fullName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          NISN: <span className="font-mono">{std.nisn}</span> • {terminology.labelClass}: <strong>{std.classCohort}</strong>
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${statusMeta.color}`}>
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Gol. Darah: <strong>{std.medical.bloodType}</strong></span>
                      <span className="flex items-center gap-1 text-blue-600 font-semibold">
                        Lihat Rekam Medis & Berkas <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Lifecycle Control, Medical Vault & Documents */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{selectedStudent.fullName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                      {selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lahir: {selectedStudent.birthPlace}, {selectedStudent.birthDate} • Masuk: {selectedStudent.enrollmentDate}
                  </p>
                </div>

                {/* Lifecycle Status Modifier */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Status Siklus Hidup Siswa (Lifecycle):
                  </label>
                  <select
                    value={selectedStudent.status}
                    onChange={(e) => updateStudentLifecycle(selectedStudent.id, e.target.value as StudentLifecycleStatus)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {lifecycleStages.map((st) => (
                      <option key={st.status} value={st.status}>
                        {st.label} ({st.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lifecycle Progress Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Tahapan Lifecycle Pelajar (Kepatuhan Standar SIS)
                </p>
                <div className="flex items-center justify-between gap-1 overflow-x-auto text-[10px]">
                  {['APPLICANT', 'ENROLLED', 'ACTIVE', 'GRADUATED', 'ALUMNUS'].map((step, idx) => {
                    const currentIdx = ['APPLICANT', 'ENROLLED', 'ACTIVE', 'GRADUATED', 'ALUMNUS'].indexOf(selectedStudent.status);
                    const isPassed = currentIdx >= idx;
                    return (
                      <div key={step} className="flex items-center gap-1.5 shrink-0">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            isPassed ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className={`font-semibold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step}
                        </span>
                        {idx < 4 && <ArrowRight className="w-3 h-3 text-slate-300 mx-1" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Medical Record Vault */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  Rekam Medis & Riwayat Kesehatan Siswa (FERPA/HIPAA Compliant)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-rose-50/40 p-3.5 rounded-xl border border-rose-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Golongan Darah</span>
                    <strong className="text-sm font-black text-rose-700">{selectedStudent.medical.bloodType}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block">Alergi Makanan / Obat</span>
                    <strong className="text-slate-800">
                      {selectedStudent.medical.allergies.length > 0
                        ? selectedStudent.medical.allergies.join(', ')
                        : 'Tidak ada alergi teridentifikasi'}
                    </strong>
                  </div>
                  <div className="sm:col-span-3 pt-1 border-t border-rose-100/60">
                    <span className="text-[11px] text-slate-500 block">Instruksi Medis Darurat:</span>
                    <p className="text-slate-700 mt-0.5">{selectedStudent.medical.emergencyNotes || 'Tidak ada catatan khusus.'}</p>
                    {selectedStudent.medical.doctorContact && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Kontak Dokter Keluarga: <strong className="text-slate-800">{selectedStudent.medical.doctorContact}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  Kontak Darurat Berurutan (Emergency Hierarchy)
                </h4>
                <div className="space-y-1.5">
                  {selectedStudent.emergencyContacts.map((emg) => (
                    <div
                      key={emg.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center">
                          {emg.priorityOrder}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{emg.name} ({emg.relationship})</p>
                          <p className="text-[11px] text-slate-500 font-mono">{emg.phone}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-600">
                        {emg.isLegalGuardian ? 'Wali Hukum Sah' : 'Kontak Kerabat'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Attachments Vault */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  Brankas Dokumen Siswa Terverifikasi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedStudent.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-emerald-950 truncate max-w-[200px]">{doc.title}</p>
                        <p className="text-[10px] text-emerald-700">Diunggah: {doc.uploadedAt}</p>
                      </div>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: STAFF & FACULTY DIRECTORY */}
      {/* ======================================================== */}
      {activeSubTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Direktori {terminology.labelTeacher} & Staf Kependidikan
              </h3>
              <p className="text-xs text-slate-500">
                Pemantauan kualifikasi akademik, jenis kontrak kerja (Tetap/Honorer), dan alokasi beban jam mengajar per minggu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{st.fullName}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">NIP: {st.nip}</p>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{st.department}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    st.contractType === 'PERMANENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {st.contractType}
                  </span>
                </div>

                <div className="space-y-1 text-xs border-t border-slate-100 pt-2.5 text-slate-600">
                  <p className="text-[11px]">Beban Mengajar: <strong>{st.assignedTeachingHoursPerWeek} Jam / Minggu</strong></p>
                  <p className="text-[11px]">Rombel Binaan: <strong>{st.assignedCohorts.join(', ')}</strong></p>
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Kualifikasi Akademik:</span>
                    {st.qualifications.map((q, idx) => (
                      <p key={idx} className="text-[11px] text-slate-700">
                        • {q.degree} ({q.institution}, {q.graduationYear})
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: PARENT / GUARDIAN MAPPING */}
      {/* ======================================================== */}
      {activeSubTab === 'guardians' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Pemetaan Relasi Orang Tua & Wali Murid (Multi-Student Mapping)
            </h3>
            <p className="text-xs text-slate-500">
              Menghubungkan satu wali murid ke banyak anak dalam kampus yang sama untuk penagihan terpusat dan protokol penjemputan aman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parents.map((p) => {
              const linkedStudents = students.filter((s) => p.linkedStudentIds.includes(s.id));
              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{p.fullName}</h4>
                      <p className="text-xs text-slate-500">{p.relationship} • {p.occupation}</p>
                      <p className="text-xs font-mono text-slate-600 mt-1">{p.phone} • {p.email}</p>
                    </div>
                    {p.isPrimaryBillingContact && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        Kontak Tagihan Utama
                      </span>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                      Anak / Siswa Terhubung:
                    </span>
                    {linkedStudents.map((std) => (
                      <div key={std.id} className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{std.fullName}</span>
                        <span className="text-slate-500">{terminology.labelClass} {std.classCohort}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
