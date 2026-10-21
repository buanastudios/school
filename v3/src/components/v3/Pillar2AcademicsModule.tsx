import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import type { AttendanceStatus } from '../../types/v3';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Users,
  Send,
  Zap,
} from 'lucide-react';

export const Pillar2AcademicsModule: React.FC = () => {
  const {
    timetableSlots,
    addTimetableSlot,
    deleteTimetableSlot,
    timetableConflicts,
    attendanceRecords,
    logAttendance,
    courseSyllabus,
    toggleSyllabusMilestone,
    terminology,
    activeCampus,
    students,
  } = useV3App();

  const [activeSubTab, setActiveSubTab] = useState<'timetable' | 'attendance' | 'syllabus'>('timetable');
  const [selectedDay, setSelectedDay] = useState<number>(1); // 1 = Senin

  // Timetable Form State
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:00');
  const [cohortName, setCohortName] = useState('6-A');
  const [subjectName, setSubjectName] = useState('Matematika Terapan');
  const [teacherName, setTeacherName] = useState('Ahmad Fauzi, S.Pd.');
  const [teacherId, setTeacherId] = useState('stf_002');
  const [roomName, setRoomName] = useState('Ruang 601');

  // Attendance Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('HADIR');
  const [attendanceNotes, setAttendanceNotes] = useState('');
  const [alertSentNotice, setAlertSentNotice] = useState<string | null>(null);

  const days = [
    { id: 1, name: 'Senin' },
    { id: 2, name: 'Selasa' },
    { id: 3, name: 'Rabu' },
    { id: 4, name: 'Kamis' },
    { id: 5, name: 'Jumat' },
  ];

  const filteredSlots = timetableSlots.filter(
    (s) => s.campusId === activeCampus.id && s.dayOfWeek === selectedDay
  );

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    addTimetableSlot({
      campusId: activeCampus.id,
      dayOfWeek: selectedDay as 1 | 2 | 3 | 4 | 5 | 6 | 7,
      startTime,
      endTime,
      cohortName,
      subjectCode: subjectName.substring(0, 3).toUpperCase() + '-6',
      subjectName,
      teacherId,
      teacherName,
      roomName,
    });
    setIsSlotModalOpen(false);
  };

  const handleSimulateConflict = () => {
    // Inject deliberate collision: Ahmad Fauzi scheduled in Ruang 602 at same time
    addTimetableSlot({
      campusId: activeCampus.id,
      dayOfWeek: 1,
      startTime: '07:30',
      endTime: '09:00',
      cohortName: '6-B (Simulasi Bentrok)',
      subjectCode: 'MTH-6B',
      subjectName: 'Matematika Terapan',
      teacherId: 'stf_001', // Same teacher as slot_01
      teacherName: 'Syamsul Bahri, S.Pd.I., Gr.',
      roomName: 'Ruang 601', // Same room
    });
  };

  const handleRecordAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === selectedStudentId);
    if (!std) return;

    logAttendance(
      {
        campusId: activeCampus.id,
        date: new Date().toISOString().split('T')[0],
        studentId: std.id,
        studentName: std.fullName,
        cohortName: std.classCohort,
        status: attendanceStatus,
        checkInTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        notes: attendanceNotes,
      },
      attendanceStatus !== 'HADIR'
    );

    if (attendanceStatus !== 'HADIR') {
      setAlertSentNotice(
        `Peringatan Otomatis WhatsApp/SMS terkirim ke wali [${std.fullName}]: Siswa berstatus [${attendanceStatus}] pada ${new Date().toLocaleTimeString('id-ID')}.`
      );
      setTimeout(() => setAlertSentNotice(null), 5000);
    }
    setAttendanceNotes('');
  };

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              Pillar 2: Academics
            </span>
            <span className="text-xs text-emerald-200">• {activeCampus.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Academic & Scheduling Engine
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
            Penyusun jadwal pelajaran interaktif dengan deteksi bentrok otomatis (Conflict Engine), pencatatan presensi terhubung alert SMS/WA wali murid, dan silabus kurikulum modular.
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('timetable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'timetable' ? 'bg-white text-emerald-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Jadwal & Conflict Engine
          </button>
          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'attendance' ? 'bg-white text-emerald-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Presensi & Alert Wali ({attendanceRecords.length})
          </button>
          <button
            onClick={() => setActiveSubTab('syllabus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'syllabus' ? 'bg-white text-emerald-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Silabus & Mata Pelajaran
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: TIMETABLE BUILDER & CONFLICT DETECTION ENGINE */}
      {/* ======================================================== */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-4">
          {/* Conflict Alert Banner (If Conflicts Exist) */}
          {timetableConflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <h4 className="font-extrabold text-sm text-rose-900">
                  Terdeteksi {timetableConflicts.length} Bentrok Jadwal (Timetable Collision Detected!)
                </h4>
              </div>
              <div className="space-y-1.5 text-xs">
                {timetableConflicts.map((c, idx) => (
                  <div key={idx} className="bg-white/90 p-2.5 rounded-xl border border-rose-200 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-rose-800 uppercase text-[10px] block">
                        {c.conflictType === 'TEACHER_COLLISION' ? '🚨 Bentrok Guru Pengajar' : '⚠️ Bentrok Penggunaan Ruangan'}
                      </span>
                      <p className="text-slate-800 mt-0.5">{c.description}</p>
                    </div>
                    <button
                      onClick={() => deleteTimetableSlot(c.slotB.id)}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-100 hover:bg-rose-200 px-2 py-1 rounded-lg shrink-0 transition-colors"
                      title="Batalkan slot yang bertabrakan"
                    >
                      Hapus Slot B
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar & Day Picker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {days.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDay === d.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateConflict}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                title="Picu simulasi tabrakan jadwal guru & ruangan untuk demonstrasi PRD Section 2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Simulasi Bentrok Jadwal</span>
              </button>

              <button
                onClick={() => setIsSlotModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Jam Pelajaran</span>
              </button>
            </div>
          </div>

          {/* Timetable Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSlots.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Belum ada jadwal pelajaran pada hari {days.find((d) => d.id === selectedDay)?.name}. Klik "Tambah Jam Pelajaran".
              </div>
            ) : (
              filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {slot.cohortName}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1">{slot.subjectName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{slot.subjectCode}</p>
                    </div>

                    <button
                      onClick={() => deleteTimetableSlot(slot.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-all"
                      title="Hapus slot jadwal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.startTime} - {slot.endTime} WIB</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Lokasi: {slot.roomName}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: ATTENDANCE TRACKER & AUTOMATED PARENT ALERTS */}
      {/* ======================================================== */}
      {activeSubTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Quick Attendance Logger */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Pencatatan Presensi & Pemicu Notifikasi Instan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kepatuhan PRD Pillar 2: Bila siswa Sakit/Izin/Alpa, sistem otomatis memicu notifikasi darurat ke SMS/WA wali murid.
              </p>
            </div>

            {alertSentNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{alertSentNotice}</span>
              </div>
            )}

            <form onSubmit={handleRecordAttendance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih {terminology.labelStudent}
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 font-medium bg-slate-50"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({terminology.labelClass} {s.classCohort})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Kehadiran</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['HADIR', 'SAKIT', 'IZIN', 'ALPA', 'TERLAMBAT'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAttendanceStatus(st)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        attendanceStatus === st
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Suhu 38.5C, izin urusan keluarga..."
                  value={attendanceNotes}
                  onChange={(e) => setAttendanceNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Presensi & Kirim Alert Otomatis</span>
              </button>
            </form>
          </div>

          {/* Right: Real-time Attendance Ledger */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Buku Rekap Presensi Harian</h4>
                <p className="text-[11px] text-slate-500">Tanggal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-700">
                Total: {attendanceRecords.length} Catatan
              </span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {attendanceRecords.map((att) => {
                const isSickOrAbsent = att.status !== 'HADIR';
                return (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">{att.studentName}</strong>
                        <span className="text-slate-500">({att.cohortName})</span>
                        {att.checkInTime && (
                          <span className="text-[10px] text-slate-400 font-mono">Pukul {att.checkInTime}</span>
                        )}
                      </div>
                      {att.notes && <p className="text-[11px] text-slate-600 mt-0.5">{att.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {att.parentAlertDispatched && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> Alert Terkirim
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                          att.status === 'HADIR'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isSickOrAbsent
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: COURSE & SYLLABUS MANAGER */}
      {/* ======================================================== */}
      {activeSubTab === 'syllabus' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Manajemen Program, Mata Pelajaran & Capaian Silabus
            </h3>
            <p className="text-xs text-slate-500">
              Pengaturan mata pelajaran wajib vs pilihan (Elective), kredit jam tatap muka, dan pemantauan capaian target mingguan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {courseSyllabus.map((course) => {
              const totalMilestones = course.milestones.length;
              const completedCount = course.milestones.filter((m) => m.completed).length;
              const percent = Math.round((completedCount / totalMilestones) * 100);

              return (
                <div
                  key={course.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          course.type === 'MANDATORY' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {course.type === 'MANDATORY' ? 'Wajib' : 'Pilihan (Elective)'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1">{course.name}</h4>
                      <p className="text-xs text-slate-500">Bobot: {course.creditsOrHours} Jam Pelajaran / Pekan</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-700">{percent}%</span>
                      <p className="text-[10px] text-slate-400">Progres Silabus</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Milestones Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Target & Capaian Pembelajaran Pekanan:
                    </span>
                    {course.milestones.map((m) => (
                      <button
                        key={m.weekNumber}
                        type="button"
                        onClick={() => toggleSyllabusMilestone(course.id, m.weekNumber)}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                          m.completed
                            ? 'bg-emerald-50/60 border-emerald-200 text-slate-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={() => {}}
                            className="rounded text-emerald-600 cursor-pointer"
                          />
                          <span>Pekan {m.weekNumber}: {m.topic}</span>
                        </div>
                        {m.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Tambah Jam Pelajaran Hari {days.find((d) => d.id === selectedDay)?.name}
            </h3>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Mulai</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Selesai</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Rombel / Kelas</label>
                <input
                  type="text"
                  value={cohortName}
                  onChange={(e) => setCohortName(e.target.value)}
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
                <label className="block font-semibold mb-1">Guru Pengajar</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => { setTeacherName(e.target.value); setTeacherId("stf_" + e.target.value.toLowerCase().replace(/\s+/g, "_")); }}
                  className="w-full p-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Ruangan</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full p-2 border rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
