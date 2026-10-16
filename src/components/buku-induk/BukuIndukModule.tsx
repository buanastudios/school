import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getStudentUrl } from '../../utils/routing';
import {
  BookOpen,
  Search,
  Printer,
  Award,
  ClipboardList,
  Info,
  ChevronRight,
  User,
  ExternalLink,
  Share2,
  FileSpreadsheet,
} from 'lucide-react';

interface BukuIndukModuleProps {
  onOpenPrint: () => void;
}

export const BukuIndukModule: React.FC<BukuIndukModuleProps> = ({ onOpenPrint }) => {
  const { students, schoolProfile, currentUser } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'daftar' | 'lembar_induk' | 'rapor' | 'pemeriksaan' | 'petunjuk'>('daftar');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [filterClass, setFilterClass] = useState<number | 'all'>(
    currentUser.role === 'wali_kelas' && currentUser.assignedClass ? currentUser.assignedClass : 'all'
  );
  const [searchTerm, setSearchTerm] = useState('');

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const filteredStudents = students.filter((s) => {
    if (filterClass !== 'all' && s.kelas !== filterClass) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.namaLengkap.toLowerCase().includes(q) ||
        s.noInduk.toLowerCase().includes(q) ||
        s.nisn.toLowerCase().includes(q) ||
        s.nik.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
              Kurikulum Merdeka SD
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Buku Induk Register Peserta Didik
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Buku Induk Register Murid
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar nomor urut, biodata lengkap peserta didik, data capaian pembelajaran, ekstrakurikuler, dan perkembangan kesehatan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Buku Induk</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('daftar')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'daftar'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>II. Nomor Urut Siswa</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lembar_induk')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'lembar_induk'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>IV. Lembar Buku Induk Siswa</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rapor')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'rapor'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Rapor Capaian Pembelajaran</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pemeriksaan')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'pemeriksaan'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>I. Lembar Pemeriksaan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('petunjuk')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'petunjuk'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>III. Petunjuk Pengisian</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: NOMOR URUT PESERTA DIDIK (Matching Photo 9)      */}
      {/* ======================================================== */}
      {activeSubTab === 'daftar' && (
        <div className="space-y-3">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa, NIS, NISN, atau NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/60"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Kelas:</span>
              <button
                onClick={() => setFilterClass('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                  filterClass === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua
              </button>
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <button
                  key={k}
                  onClick={() => setFilterClass(k)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    filterClass === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Kls {k}
                </button>
              ))}
            </div>
          </div>

          {/* Table matching Photo 9 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  II. NOMOR URUT PESERTA DIDIK DALAM BUKU INDUK REGISTER
                </h3>
                <p className="text-xs text-slate-500">
                  Data register resmi peserta didik SD Muhammadiyah 2 Bandung
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                {filteredStudents.length} Siswa Terdaftar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3 text-center w-12">No. Urut</th>
                    <th className="py-2.5 px-3">Nomor Induk Siswa</th>
                    <th className="py-2.5 px-3">Nomor Induk Siswa Nasional</th>
                    <th className="py-2.5 px-3">Nama Peserta Didik</th>
                    <th className="py-2.5 px-2 text-center">L/P</th>
                    <th className="py-2.5 px-3 text-center">Tahun Masuk</th>
                    <th className="py-2.5 px-3 text-center">Tahun Keluar/Lulus</th>
                    <th className="py-2.5 px-3 text-center">Status / KET</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-600">
                        {s.noUrutBukuInduk}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {s.noInduk}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {s.nisn}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-indigo-950">
                        <a
                          href={getStudentUrl(s.noInduk)}
                          className="text-indigo-600 hover:text-indigo-900 font-bold hover:underline inline-flex items-center gap-1 group"
                          title="Buka Rekam Jejak & Live School Hall Siswa"
                        >
                          <span>{s.namaLengkap}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                        </a>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded font-bold text-[10px] ${
                            s.jenisKelamin === 'L'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {s.jenisKelamin}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold">
                        {s.tahunMasuk}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400">
                        {s.tahunKeluarLulus || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {s.statusSiswa}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={getStudentUrl(s.noInduk)}
                            className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded-lg border border-indigo-200 transition-colors"
                            title="Tampilkan di Layar Aula / Rekam Publik"
                          >
                            <Share2 className="w-3 h-3 text-indigo-600" />
                            <span className="hidden sm:inline">Live Hall</span>
                          </a>
                          <a
                            href={`rapor.html?nis=${s.noInduk}`}
                            className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-lg border border-emerald-200 transition-colors"
                            title="Buka / Cetak Rapor Resmi Siswa"
                          >
                            <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                            <span>Rapor</span>
                          </a>
                          <button
                            onClick={() => {
                              setSelectedStudentId(s.id);
                              setActiveSubTab('lembar_induk');
                            }}
                            className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-indigo-600 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <span>Lembar</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LEMBAR BUKU INDUK SISWA (Photos 11, 12, 15)      */}
      {/* ======================================================== */}
      {activeSubTab === 'lembar_induk' && selectedStudent && (
        <div className="space-y-4">
          {/* Student Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Pilih Siswa:</span>
              <select
                value={selectedStudent.id}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    Kelas {st.kelas} • {st.noUrutBukuInduk}. {st.namaLengkap} (NIS: {st.noInduk})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveSubTab('rapor')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span>Lihat Rapor Capaian Pembelajaran</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Individual Dossier Paper matching Photos 11 & 15 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto space-y-6 font-sans">
            {/* Dossier Header */}
            <div className="border-b-2 border-black pb-3 flex justify-between items-start">
              <div>
                <h3 className="text-base sm:text-lg font-black text-black tracking-wide uppercase">
                  IV. LEMBAR BUKU INDUK SISWA
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {schoolProfile.namaSekolah} • Tahun Pelajaran {selectedStudent.tahunPelajaran}
                </p>
              </div>
              <div className="text-right text-xs space-y-1">
                <div>
                  <span className="font-semibold text-slate-600">Nomor Induk Siswa (NIS): </span>
                  <span className="font-mono font-bold text-black">{selectedStudent.noInduk}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">NISN: </span>
                  <span className="font-mono font-bold text-black">{selectedStudent.nisn}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">NIK: </span>
                  <span className="font-mono font-bold text-black">{selectedStudent.nik}</span>
                </div>
              </div>
            </div>

            {/* Layout: Main Details + Photo Column */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Left 3 cols: Info Sections A, B, C */}
              <div className="md:col-span-3 space-y-5 text-xs">
                {/* A. KETERANGAN PRIBADI SISWA */}
                <div className="space-y-2">
                  <h4 className="font-black text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wider">
                    A. KETERANGAN PRIBADI SISWA
                  </h4>
                  <div className="grid grid-cols-12 gap-y-1.5 gap-x-2 text-slate-800">
                    <span className="col-span-5 font-semibold">1. Nama Lengkap</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6 font-bold uppercase">{selectedStudent.namaLengkap}</span>

                    <span className="col-span-5 font-semibold">   Nama Panggilan</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.namaPanggilan}</span>

                    <span className="col-span-5 font-semibold">2. Jenis Kelamin</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>

                    <span className="col-span-5 font-semibold">3. Tempat & Tgl Lahir</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6 font-semibold">{selectedStudent.tempatLahir}, {selectedStudent.tanggalLahir}</span>

                    <span className="col-span-5 font-semibold">4. Agama</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.agama}</span>

                    <span className="col-span-5 font-semibold">5. Kewarganegaraan</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.kewarganegaraan}</span>

                    <span className="col-span-5 font-semibold">6. Anak Ke</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.anakKe}</span>

                    <span className="col-span-5 font-semibold">7. Jumlah Saudara Kandung</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.jumlahSaudaraKandung} orang</span>

                    <span className="col-span-5 font-semibold">8. Bahasa Sehari-hari</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.bahasaSehariHari}</span>

                    <span className="col-span-5 font-semibold">9. Golongan Darah</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.golonganDarah || '-'}</span>

                    <span className="col-span-5 font-semibold">10. Alamat Tempat Tinggal</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6 font-medium">
                      {selectedStudent.alamatTinggal.jalan}, RT/RW {selectedStudent.alamatTinggal.rtRw}, Kel. {selectedStudent.alamatTinggal.desaKelurahan}, Kec. {selectedStudent.alamatTinggal.kecamatan}, {selectedStudent.alamatTinggal.kabupatenKota}
                    </span>

                    <span className="col-span-5 font-semibold">11. No. Telepon / HP</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6 font-mono">{selectedStudent.alamatTinggal.noTelepon || '-'}</span>

                    <span className="col-span-5 font-semibold">12. Bertempat Tinggal Pada</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.bertempatTinggalPada}</span>

                    <span className="col-span-5 font-semibold">13. Jarak ke Sekolah</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.jarakKeSekolahKm || '1'} Km</span>
                  </div>
                </div>

                {/* B. KETERANGAN ORANG TUA / WALI */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-black text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wider">
                    B. KETERANGAN ORANG TUA / WALI
                  </h4>
                  <div className="grid grid-cols-12 gap-y-1.5 gap-x-2 text-slate-800">
                    <span className="col-span-5 font-semibold">14. Nama Ayah Kandung</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6 font-bold">{selectedStudent.orangTua.namaAyah}</span>

                    <span className="col-span-5 font-semibold">    Nama Ibu Kandung</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6 font-bold">{selectedStudent.orangTua.namaIbu}</span>

                    <span className="col-span-5 font-semibold">15. Pendidikan Terakhir Ayah</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.orangTua.pendidikanAyah}</span>

                    <span className="col-span-5 font-semibold">    Pendidikan Terakhir Ibu</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.orangTua.pendidikanIbu}</span>

                    <span className="col-span-5 font-semibold">16. Pekerjaan Ayah</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.orangTua.pekerjaanAyah}</span>

                    <span className="col-span-5 font-semibold">    Pekerjaan Ibu</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.orangTua.pekerjaanIbu}</span>
                  </div>
                </div>

                {/* C. PERKEMBANGAN PESERTA DIDIK */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-black text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wider">
                    C. PERKEMBANGAN PESERTA DIDIK
                  </h4>
                  <div className="grid grid-cols-12 gap-y-1.5 gap-x-2 text-slate-800">
                    <span className="col-span-5 font-semibold">18. Pendidikan Sebelumnya</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6 font-semibold">{selectedStudent.pendidikanSebelumnya.jenisMasuk}</span>

                    <span className="col-span-5 font-semibold">    Asal Sekolah</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.pendidikanSebelumnya.asalSekolah || '-'}</span>

                    <span className="col-span-5 font-semibold">    Nomor & Tgl STTB</span>
                    <span className="col-span-1 text-center">:</span>
                    <span className="col-span-6">{selectedStudent.pendidikanSebelumnya.noSttb || '-'} ({selectedStudent.pendidikanSebelumnya.tanggalSttb || '-'})</span>
                  </div>
                </div>

                {/* F. FISIK & KESEHATAN (Matching Photo 12) */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-black text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wider">
                    F. CATATAN KESEHATAN & FISIK
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block">Tinggi Badan</span>
                      <span className="text-sm font-black text-slate-900">
                        {selectedStudent.catatanKesehatan[0]?.tinggiBadanGanjil || 118} cm
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block">Berat Badan</span>
                      <span className="text-sm font-black text-slate-900">
                        {selectedStudent.catatanKesehatan[0]?.beratBadanGanjil || 22} kg
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block">Penglihatan</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedStudent.catatanKesehatan[0]?.penglihatan || 'Normal'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block">Pendengaran</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedStudent.catatanKesehatan[0]?.pendengaran || 'Baik'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 1 col: Pas Foto Boxes (Matching Photo 11 & 15) */}
              <div className="space-y-4">
                <div className="border border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                  <div className="w-28 h-36 mx-auto border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-white overflow-hidden shadow-2xs">
                    {selectedStudent.pasFotoUrl ? (
                      <img
                        src={selectedStudent.pasFotoUrl}
                        alt="Pas Foto Siswa"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <User className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                        <span className="text-[10px] font-bold block">Pas Photo</span>
                        <span className="text-[9px]">3 x 4</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">
                    Cap tiga jari tengah kiri mengenai pas photo bagian bawah
                  </p>
                </div>

                <div className="border border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1">
                    Tanda Tangan Siswa
                  </span>
                  <div className="h-16 border-b border-dotted border-slate-400 flex items-center justify-center text-slate-300 text-xs italic">
                    ( Tanda tangan )
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: RAPOR CAPAIAN MERDEKA (Matching Photo 13)        */}
      {/* ======================================================== */}
      {activeSubTab === 'rapor' && selectedStudent && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-4xl mx-auto space-y-6 font-sans">
            <div className="border-b-2 border-black pb-3 text-center">
              <h3 className="text-base sm:text-lg font-black text-black uppercase">
                IV. LAPORAN HASIL CAPAIAN PEMBELAJARAN PESERTA DIDIK SEKOLAH DASAR (SD)
              </h3>
              <p className="text-xs font-bold text-indigo-700 uppercase">
                KURIKULUM MERDEKA • SD MUHAMMADIYAH 2 BANDUNG
              </p>
            </div>

            {/* Quick Link to Official Rapor Module */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 p-4 rounded-xl text-white shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">Modul Rapor Resmi (Input Nilai & Cetak PDF)</h4>
                  <p className="text-xs text-indigo-100">
                    Buka formulir input capaian kompetensi guru, kokurikuler P5, ekstrakurikuler, dan cetak PDF resmi format Kemendikdasmen.
                  </p>
                </div>
              </div>
              <a
                href={`rapor.html?nis=${selectedStudent.noInduk}`}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs shadow-md transition-all shrink-0 text-center"
              >
                Buka Modul Rapor →
              </a>
            </div>

            {/* Student ID row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">Nama Peserta Didik</span>
                <span className="font-extrabold text-slate-900 uppercase">{selectedStudent.namaLengkap}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">NIS / NISN</span>
                <span className="font-mono font-bold text-slate-900">{selectedStudent.noInduk} / {selectedStudent.nisn}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">Kelas / Fase</span>
                <span className="font-bold text-slate-900">
                  Kelas {selectedStudent.kelas} ({selectedStudent.kelas <= 2 ? 'Fase A' : selectedStudent.kelas <= 4 ? 'Fase B' : 'Fase C'})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">Tahun Pelajaran</span>
                <span className="font-bold text-slate-900">{selectedStudent.tahunPelajaran}</span>
              </div>
            </div>

            {/* A. Intrakurikuler Table */}
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-2">
                A. INTRAKURIKULER
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 font-extrabold border-b border-slate-300 text-center">
                      <th className="py-2 px-2 border border-slate-300 w-8" rowSpan={2}>No</th>
                      <th className="py-2 px-3 border border-slate-300 text-left" rowSpan={2}>MATA PELAJARAN</th>
                      <th className="py-1 px-2 border border-slate-300" colSpan={3}>SEMESTER GANJIL</th>
                      <th className="py-1 px-2 border border-slate-300 bg-indigo-50" colSpan={3}>SEMESTER GENAP</th>
                    </tr>
                    <tr className="bg-slate-50 font-bold border-b border-slate-300 text-center text-[10px]">
                      <th className="border border-slate-300 w-12">Nilai</th>
                      <th className="border border-slate-300 text-left px-2">Capaian Pembelajaran</th>
                      <th className="border border-slate-300 w-12">KKTP</th>
                      <th className="border border-slate-300 w-12 bg-indigo-50/50">Nilai</th>
                      <th className="border border-slate-300 text-left px-2 bg-indigo-50/50">Capaian Pembelajaran</th>
                      <th className="border border-slate-300 w-12 bg-indigo-50/50">KKTP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedStudent.grades.map((g, idx) => (
                      <tr key={g.mapelId} className="hover:bg-slate-50">
                        <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-900">{g.mapelNama}</td>
                        <td className="py-2 px-2 border border-slate-300 text-center font-bold">{g.nilaiGanjil || '-'}</td>
                        <td className="py-2 px-2 border border-slate-300 text-[11px] text-slate-600">{g.capaianGanjil || '-'}</td>
                        <td className="py-2 px-2 border border-slate-300 text-center text-slate-500">{g.kktpGanjil || 75}</td>
                        <td className="py-2 px-2 border border-slate-300 text-center font-extrabold text-indigo-700 bg-indigo-50/30">{g.nilaiGenap || '-'}</td>
                        <td className="py-2 px-2 border border-slate-300 text-[11px] text-slate-700 bg-indigo-50/30">{g.capaianGenap || '-'}</td>
                        <td className="py-2 px-2 border border-slate-300 text-center text-slate-500 bg-indigo-50/30">{g.kktpGenap || 75}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* B. Ekstrakurikuler Table */}
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-2">
                B. EKSTRAKURIKULER
              </h4>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="py-1.5 px-2 border border-slate-300 w-8 text-center">No</th>
                    <th className="py-1.5 px-3 border border-slate-300">Kegiatan Ekstrakurikuler</th>
                    <th className="py-1.5 px-3 border border-slate-300 text-center w-28">Nilai Sem 1</th>
                    <th className="py-1.5 px-3 border border-slate-300 text-center w-28">Nilai Sem 2</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.extracurriculars.map((ek, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center border border-slate-300 font-bold">{i + 1}</td>
                      <td className="py-1.5 px-3 border border-slate-300 font-semibold">{ek.nama}</td>
                      <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-emerald-700">{ek.nilaiGanjil || '-'}</td>
                      <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-emerald-700">{ek.nilaiGenap || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Decision & Signatures matching Photo 13 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase block">KETIDAKHADIRAN</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Sakit</span>
                    <strong className="text-slate-800">{selectedStudent.attendance.sakitSem2} Hari</strong>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Izin</span>
                    <strong className="text-slate-800">{selectedStudent.attendance.izinSem2} Hari</strong>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Alpa</span>
                    <strong className="text-slate-800">{selectedStudent.attendance.alpaSem2} Hari</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">KEPUTUSAN KENAIKAN KELAS:</span>
                  <p className="font-black text-indigo-900 mt-0.5">
                    Naik ke Kelas {selectedStudent.kenaikanKelas?.keKelas || 2}
                  </p>
                </div>
              </div>

              {/* Signatures from Photo 13 */}
              <div className="flex justify-between items-end p-2 text-right">
                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-700">Mengetahui,</p>
                  <p className="text-[11px] font-bold text-slate-900">Kepala Sekolah :</p>
                  <div className="h-12 my-1 flex items-center">
                    {schoolProfile.kepalaSekolahTtd && (
                      <img src={schoolProfile.kepalaSekolahTtd} alt="TTD" className="h-10 object-contain" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-900">( {schoolProfile.kepalaSekolahNama} )</p>
                  <p className="text-[10px] text-slate-500">NIP. {schoolProfile.kepalaSekolahNip}</p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">Bandung, 26 Juni 2025</p>
                  <p className="text-[11px] font-bold text-slate-900">Wali Kelas :</p>
                  <div className="h-12 my-1 flex items-center justify-end">
                    <span className="font-serif italic text-indigo-800 text-sm">Neni R.</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">( Neni Rohaeni, S.Pd. )</p>
                  <p className="text-[10px] text-slate-500">NIP. 197508202005012003</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: LEMBAR PEMERIKSAAN BUKU INDUK (Photo 8)          */}
      {/* ======================================================== */}
      {activeSubTab === 'pemeriksaan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              I. LEMBAR PEMERIKSAAN BUKU INDUK REGISTER PESERTA DIDIK
            </h3>
            <p className="text-xs text-slate-500">
              Pemeriksaan berkala oleh Kepala Sekolah, Pengawas Pembina, dan Dinas Pendidikan
            </p>
          </div>

          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-300">
                <th className="py-2 px-2 border border-slate-300 w-12 text-center">No. Urut</th>
                <th className="py-2 px-3 border border-slate-300 w-32">Hari / Tanggal</th>
                <th className="py-2 px-3 border border-slate-300">Nama Petugas Pemeriksa</th>
                <th className="py-2 px-3 border border-slate-300 w-44">Jabatan</th>
                <th className="py-2 px-3 border border-slate-300">Catatan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2 px-2 text-center border border-slate-300 font-bold">1</td>
                <td className="py-2 px-3 border border-slate-300">Senin, 16 Okt 2023</td>
                <td className="py-2 px-3 border border-slate-300 font-bold">Dra. Hj. Nunung Rohayati, M.M.Pd.</td>
                <td className="py-2 px-3 border border-slate-300">Pengawas Pembina Disdik Kota Bandung</td>
                <td className="py-2 px-3 border border-slate-300 text-emerald-800 font-medium">Buku register mutasi dan induk tertib dan lengkap.</td>
              </tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-200 h-8">
                  <td className="border border-slate-300 text-center text-slate-300">{i + 2}</td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: PETUNJUK PENGISIAN (Photo 10)                     */}
      {/* ======================================================== */}
      {activeSubTab === 'petunjuk' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-4 font-sans text-xs text-slate-800 leading-relaxed">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
            III. PETUNJUK PENGISIAN BUKU INDUK REGISTER PESERTA DIDIK SD
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Buku Induk Register merupakan ringkasan hasil penilaian terhadap seluruh aktivitas pembelajaran yang dilakukan peserta didik dalam kurun waktu tertentu.</li>
            <li>Buku Induk Register ini digunakan selama peserta didik yang bersangkutan mengikuti seluruh program pembelajaran di Sekolah Dasar ini.</li>
            <li>Identitas Sekolah diisi dengan data yang sesuai dengan keberadaan Sekolah Dasar penulisan Nama Sekolah ditulis menggunakan Kapital Onderscat di setiap awal kata; contoh (SD Nusa Bangsa), untuk halaman depan ditulis dengan huruf kapital.</li>
            <li>Keterangan tentang diri Peserta Didik diisi lengkap sesuai ijazah sebelumnya atau akta kelahiran.</li>
            <li>Buku Induk Register ini harus dilengkapi dengan pas foto berwarna dengan latar belakang serta menggunakan baju putih seragam dan pengisiannya dilakukan oleh Wali Kelas.</li>
            <li>Laporan hasil belajar merupakan laporan keseluruhan dari proses dan akhir pembelajaran. Laporan hasil belajar merupakan laporan hasil dari analisis pendidik terhadap perkembangan belajar peserta didik.</li>
            <li>Predikat ditulis dalam bentuk huruf sesuai kriteria.</li>
            <li>Penilaian Capaian Pembelajaran ditulis dengan kalimat positif sesuai capaian pembelajaran yang diperoleh peserta didik.</li>
            <li>Penjelasan lebih detail mengenai capaian pembelajaran peserta didik dapat dilihat pada Leger.</li>
            <li>Laporan Ekstrakurikuler diisi berdasarkan kegiatan Ekstrakurikuler yang diikuti oleh peserta didik.</li>
            <li>Ketidakhadiran diisi dengan data akumulasi ketidakhadiran peserta didik karena Sakit, Izin atau Tanpa Keterangan selama satu semester.</li>
            <li>Keterangan kenaikan kelas diisi dengan putusan apakah peserta didik naik kelas yang ditentukan melalui rapat dewan guru.</li>
            <li>Laporan Profil Pelajar Pancasila, Capaian dan Karakter yang dapat dicapai antar lintas disiplin ilmu tertuang dalam 6 dimensi.</li>
            <li>Capaian dan Karakter yang dijabarkan dalam Profil Pelajar Pancasila dibangun dalam keseharian dan dihidupkan dalam diri setiap individu peserta didik melalui budaya sekolah, pembelajaran intrakurikuler, P5, maupun Ekstrakurikuler.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
