import React from 'react';
import type { StudentMasterRecord, SchoolProfile } from '../../types';
import {
  KemendikbudCoverLogo,
  RepeatingWatermarkBackground,
  SchoolOfficialStamp,
  WaliKelasSignatureSvg,
  PrincipalSignatureSvg,
} from './RaporEmblems';

interface RaporPrintViewProps {
  student: StudentMasterRecord;
  schoolProfile: SchoolProfile;
  semester: 1 | 2;
  printScope: 'full' | 'rapor_only' | 'identitas_only';
  showWatermark?: boolean;
  showSignatures?: boolean;
  onPrint?: () => void;
}

export const RaporPrintView: React.FC<RaporPrintViewProps> = ({
  student,
  schoolProfile,
  semester,
  printScope,
  showWatermark = true,
  showSignatures = true,
}) => {
  // Format dates
  const formatDateIndonesia = (dateStr?: string) => {
    if (!dateStr) return '-';
    if (dateStr.includes('Januari') || dateStr.includes('Desember') || dateStr.includes('Juli') || dateStr.includes('Juni')) {
      return dateStr;
    }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const tglLahirFormatted = `${student.tempatLahir}, ${formatDateIndonesia(student.tanggalLahir)}`;
  const tglDiterimaFormatted = formatDateIndonesia(student.pendidikanSebelumnya?.diterimaTanggal || '2025-07-15');

  // Semester specific data
  const tglRapor =
    semester === 1
      ? student.tglRaporSem1 || 'Kota Bandung, 22 Desember 2025'
      : student.tglRaporSem2 || 'Kota Bandung, 02 Juni 2026';

  const catatanWaliKelas =
    semester === 1
      ? student.catatanWaliKelasSem1 ||
        'Ananda memiliki potensi yang baik, namun disiplin belajar masih perlu ditingkatkan. Guru melihat bahwa ketika Ananda benar-benar fokus, hasilnya sangat memuaskan.'
      : student.catatanWaliKelasSem2 ||
        'Alhamdulillah ananda telah menjalani semester akhirnya dengan baik, bersemangatlah dalam kebaikan dengan mempertahankannya sampai di tahap berikutnya dan jadilah pribadi yang lebih baik di jenjang selanjutnya.';

  const kokurikulerDesc =
    semester === 1
      ? student.kokurikulerSem1 ||
        'Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan, yang ditunjukkan melalui kegiatan kokurikuler Proyek Tidur Cepat dan Bangun Pagi. Pada dimensi keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa, ananda berkembang dalam subdimensi hubungan dengan Tuhan Yang Maha Esa. Pada dimensi penalaran kritis, ananda cakap dalam subdimensi penyelesaian masalah. Pada dimensi kesehatan, ananda cakap dalam subdimensi kebugaran, kesehatan fisik, dan kesehatan mental.'
      : student.kokurikulerSem2 ||
        'Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan, yang ditunjukkan melalui kegiatan kokurikuler Gerakan Mencintai Tradisi dan Budaya Nusantara. Pada dimensi kewargaan, ananda cakap dalam subdimensi kewargaan lokal. Pada dimensi kemandirian, ananda cakap dalam subdimensi pengembangan diri. Pada dimensi kolaborasi, ananda cakap dalam subdimensi kerja sama.';

  const ekskulList =
    semester === 1
      ? student.ekskulSem1 && student.ekskulSem1.length > 0
        ? student.ekskulSem1
        : [
            {
              nama: 'Attiera',
              keterangan:
                'Baik, Ananda menunjukkan penguasaan dalam kegiatan pengenalan alat camping, survival, dan pembuatan tenda; baris-berbaris; tali-temali; navigasi; serta hiking, botani zoologi, dan pembuatan api menggunakan kayu bakar.',
            },
          ]
      : student.ekskulSem2 && student.ekskulSem2.length > 0
      ? student.ekskulSem2
      : [
          {
            nama: 'Attiera',
            keterangan:
              'Baik, Ananda menunjukkan penguasaan dalam kegiatan cara menangani luka di alam dan membuat bidai; belajar sandi morse; membuat tenda; camping; serta outbond.',
          },
          {
            nama: 'Hizbul Wathan',
            keterangan:
              'Menunjukkan perkembangan yang sangat baik dalam kegiatan kepanduan Hizbul Wathan. Siswa mampu bekerja sama dengan kelompok, memahami esensi kepanduan, serta memiliki kedisiplinan dan rasa tanggung jawab yang tinggi dalam menuntaskan tugas-tugas latihan.',
          },
        ];

  const attendanceSakit = semester === 1 ? student.attendance.sakitSem1 : student.attendance.sakitSem2;
  const attendanceIzin = semester === 1 ? student.attendance.izinSem1 : student.attendance.izinSem2;
  const attendanceAlpa = semester === 1 ? student.attendance.alpaSem1 : student.attendance.alpaSem2;

  // Filter subjects by kelompok
  const kelompokASubjects = student.grades.filter(
    (g) => g.kelompok === 'Kelompok A' || g.kategori === 'Agama' || g.kategori === 'Umum'
  );
  const kelompokBSubjects = student.grades.filter(
    (g) => g.kelompok === 'Kelompok B' || g.kategori === 'Muatan Lokal'
  );

  // Split Kelompok A for pagination:
  // In reference PDF:
  // Sem 1: Page 6 has Kelompok A items 1-6; Page 7 has Kelompok A items 7-8 and Kelompok B items 1-2, plus Kokurikuler and Ekstrakurikuler.
  // Sem 2: Page 9 has Kelompok A items 1-7; Page 10 has Kelompok A item 8 and Kelompok B items 1-2, Kokurikuler, Ekstrakurikuler, Absensi, Catatan, and Kelulusan.
  const page1KelompokACount = semester === 1 ? 6 : 7;
  const subjectsPage1 = kelompokASubjects.slice(0, page1KelompokACount);
  const subjectsPage2A = kelompokASubjects.slice(page1KelompokACount);

  const waliKelasNama = student.waliKelasNama || 'Syamsul Bahri, S.Pd.I., Gr.';
  const waliKelasNip = student.waliKelasNuptk || student.waliKelasNip || 'NUPTK. 7035768669130423';
  const kepalaSekolahNama = student.kepalaSekolahNama || schoolProfile.kepalaSekolahNama || 'Tete Rohaeni, S.Pd., M.M.';
  const kepalaSekolahNip = student.kepalaSekolahNip && student.kepalaSekolahNip !== '-' ? student.kepalaSekolahNip : 'NIP. -';

  // Standard Running Header for Semester Report Pages
  const renderStudentHeader = () => (
    <div className="w-full border-b border-slate-700 pb-2 mb-3 text-[11px] leading-tight font-serif text-black">
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-28 font-medium">Nama Murid</td>
              <td className="w-3">:</td>
              <td className="font-bold uppercase tracking-tight">{student.namaLengkap}</td>
            </tr>
            <tr>
              <td className="font-medium">NIS/NISN</td>
              <td>:</td>
              <td className="font-semibold">{student.noInduk} / {student.nisn}</td>
            </tr>
            <tr>
              <td className="font-medium">Sekolah</td>
              <td>:</td>
              <td className="font-semibold uppercase">{schoolProfile.namaSekolah}</td>
            </tr>
            <tr>
              <td className="font-medium">Alamat</td>
              <td>:</td>
              <td>{schoolProfile.alamatSekolah}</td>
            </tr>
          </tbody>
        </table>

        {/* Right column */}
        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-24 font-medium">Kelas</td>
              <td className="w-3">:</td>
              <td className="font-bold">{student.kelas}A</td>
            </tr>
            <tr>
              <td className="font-medium">Fase</td>
              <td>:</td>
              <td className="font-semibold">{student.fase || (student.kelas >= 5 ? 'C' : student.kelas >= 3 ? 'B' : 'A')}</td>
            </tr>
            <tr>
              <td className="font-medium">Semester</td>
              <td>:</td>
              <td className="font-bold">{semester}</td>
            </tr>
            <tr>
              <td className="font-medium">Tahun Ajaran</td>
              <td>:</td>
              <td className="font-semibold">{student.tahunPelajaran || '2025/2026'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Running Footer for each page
  const renderFooter = (pageNumber: number) => (
    <div className="mt-auto pt-3 border-t border-slate-400 flex items-center justify-between text-[10px] font-sans font-bold text-slate-800">
      <div className="flex items-center gap-1.5 uppercase">
        <span>Kelas {student.kelas}A</span>
        <span>|</span>
        <span className="truncate max-w-[280px]">{student.namaLengkap}</span>
        <span>|</span>
        <span>{student.noInduk}</span>
      </div>
      <div>
        <span>Halaman : {pageNumber}</span>
      </div>
    </div>
  );

  return (
    <div className="rapor-print-container flex flex-col items-center gap-8 py-4">
      {/* ================= PAGE 1: COVER RAPOR ================= */}
      {(printScope === 'full' || printScope === 'identitas_only') && (
        <section className="print-page relative w-[210mm] min-h-[297mm] h-[297mm] bg-white p-[18mm] text-slate-900 shadow-xl flex flex-col justify-between overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-[15mm]">
          {showWatermark && <RepeatingWatermarkBackground />}

          {/* Top Logo & Department */}
          <div className="relative z-10 text-center flex flex-col items-center pt-8">
            <KemendikbudCoverLogo className="w-36 h-36 mb-6" />

            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wider text-black uppercase leading-tight mt-4">
              SEKOLAH DASAR
            </h1>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-black tracking-widest mt-1">
              ( SD )
            </h2>
          </div>

          {/* Student Name Box & NISN/NIS Box */}
          <div className="relative z-10 w-full flex flex-col items-center space-y-7 my-auto">
            <div className="w-full max-w-md text-center">
              <p className="text-sm sm:text-base font-serif font-bold text-black mb-2">
                Nama Peserta Didik
              </p>
              <div className="w-full border-2 border-black py-3 px-4 bg-white/80 shadow-xs">
                <span className="text-lg sm:text-xl font-serif font-black tracking-wide text-black uppercase">
                  {student.namaLengkap}
                </span>
              </div>
            </div>

            <div className="w-full max-w-md text-center">
              <p className="text-sm sm:text-base font-serif font-bold text-black mb-2">
                NISN / NIS
              </p>
              <div className="w-full border-2 border-black py-3 px-4 bg-white/80 shadow-xs">
                <span className="text-lg sm:text-xl font-serif font-black tracking-wider text-black">
                  {student.nisn} / {student.noInduk}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Ministry Branding */}
          <div className="relative z-10 text-center pb-8">
            <h3 className="text-base sm:text-lg font-serif font-black text-black tracking-wider uppercase leading-snug">
              KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH
            </h3>
            <h4 className="text-base sm:text-lg font-serif font-black text-black tracking-widest uppercase mt-0.5">
              REPUBLIK INDONESIA
            </h4>
          </div>
        </section>
      )}

      {/* ================= PAGE 2: IDENTITAS SEKOLAH ================= */}
      {(printScope === 'full' || printScope === 'identitas_only') && (
        <section className="print-page relative w-[210mm] min-h-[297mm] h-[297mm] bg-white p-[20mm] text-slate-900 shadow-xl flex flex-col justify-between overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-[16mm]">
          {showWatermark && <RepeatingWatermarkBackground />}

          <div className="relative z-10">
            {/* Title */}
            <div className="text-center mb-10 pt-4">
              <h1 className="text-2xl font-serif font-black tracking-wider text-black uppercase">
                SEKOLAH DASAR
              </h1>
              <h2 className="text-xl font-serif font-black text-black tracking-widest mt-1">
                ( SD )
              </h2>
            </div>

            {/* School Profile Table */}
            <div className="max-w-xl mx-auto font-serif text-[13px] leading-relaxed text-black pt-4">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="align-top">
                    <td className="w-44 py-2 font-bold">Nama Sekolah</td>
                    <td className="w-4 py-2">:</td>
                    <td className="py-2 font-black uppercase text-slate-950">
                      {schoolProfile.namaSekolah}
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 font-bold">NPSN</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-semibold">{schoolProfile.npsn || '20219853'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 font-bold">NIS/NSS/NDS</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-semibold">{schoolProfile.nss || '103102185065'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 font-bold">Alamat Sekolah</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-medium">{schoolProfile.alamatSekolah}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 pl-4 text-slate-800">Kelurahan / Desa</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-medium">{schoolProfile.desaKelurahan}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 pl-4 text-slate-800">Kecamatan</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-medium">{schoolProfile.kecamatan}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 pl-4 text-slate-800">Kota/Kabupaten</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-medium">{schoolProfile.kabupatenKota}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 pl-4 text-slate-800">Provinsi</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-medium">{schoolProfile.provinsi}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 font-bold">Website</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-medium">http://</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-2 font-bold">E-mail</td>
                    <td className="py-2">:</td>
                    <td className="py-2 font-medium">sdmuhammadiyah2@yahoo.co.id</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative z-10 text-center pb-4 text-[10px] text-slate-500 font-sans">
            Dokumen Resmi Buku Rapor SD Muhammadiyah 2 Kota Bandung
          </div>
        </section>
      )}

      {/* ================= PAGE 3: IDENTITAS PESERTA DIDIK ================= */}
      {(printScope === 'full' || printScope === 'identitas_only') && (
        <section className="print-page relative w-[210mm] min-h-[297mm] h-[297mm] bg-white p-[18mm] text-slate-900 shadow-xl flex flex-col justify-between overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-[14mm]">
          {showWatermark && <RepeatingWatermarkBackground />}

          <div className="relative z-10">
            {/* Header Title */}
            <h2 className="text-center font-serif font-black text-lg sm:text-xl text-black tracking-wide uppercase underline mb-5">
              IDENTITAS PESERTA DIDIK
            </h2>

            {/* 17 Points Table */}
            <div className="font-serif text-[11.5px] leading-tight text-black">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="align-top">
                    <td className="w-6 py-0.5 font-bold">1.</td>
                    <td className="w-48 py-0.5">Nama Lengkap Peserta Didik</td>
                    <td className="w-3 py-0.5">:</td>
                    <td className="py-0.5 font-black uppercase">{student.namaLengkap}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">2.</td>
                    <td className="py-0.5">Nomor Induk/NISN</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5 font-bold">{student.noInduk} / {student.nisn}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">3.</td>
                    <td className="py-0.5">Tempat ,Tanggal Lahir</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{tglLahirFormatted}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">4.</td>
                    <td className="py-0.5">Jenis Kelamin</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">5.</td>
                    <td className="py-0.5">Agama</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.agama}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">6.</td>
                    <td className="py-0.5">Status dalam Keluarga</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.statusDalamKeluarga || 'Anak Kandung'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">7.</td>
                    <td className="py-0.5">Anak ke</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.anakKe}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">8.</td>
                    <td className="py-0.5">Alamat Peserta Didik</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5 leading-snug">
                      {student.alamatTinggal.jalan} RT.{student.alamatTinggal.rtRw} Kel. {student.alamatTinggal.desaKelurahan} Kec. {student.alamatTinggal.kecamatan} {student.alamatTinggal.kabupatenKota}
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">9.</td>
                    <td className="py-0.5">Nomor Telepon Rumah</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.alamatTinggal.noTelepon || student.nomorTeleponRumah || '-'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">10.</td>
                    <td className="py-0.5">Sekolah Asal</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.pendidikanSebelumnya?.asalSekolah || '-'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">11.</td>
                    <td className="py-0.5">Diterima di sekolah ini</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5"></td>
                  </tr>
                  <tr className="align-top">
                    <td></td>
                    <td className="py-0.5 pl-4">Di kelas</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.pendidikanSebelumnya?.dariTingkat || '-'}</td>
                  </tr>
                  <tr className="align-top">
                    <td></td>
                    <td className="py-0.5 pl-4">Pada tanggal</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{tglDiterimaFormatted}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">12.</td>
                    <td className="py-0.5">Nama Orang Tua</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5"></td>
                  </tr>
                  <tr className="align-top">
                    <td></td>
                    <td className="py-0.5 pl-4">a. Ayah</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5 font-semibold">{student.orangTua.namaAyah}</td>
                  </tr>
                  <tr className="align-top">
                    <td></td>
                    <td className="py-0.5 pl-4">b. Ibu</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5 font-semibold">{student.orangTua.namaIbu}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">13.</td>
                    <td className="py-0.5">Alamat Orang Tua</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5 leading-snug">
                      {student.alamatTinggal.jalan} RT.{student.alamatTinggal.rtRw} Kel. {student.alamatTinggal.desaKelurahan} Kec. {student.alamatTinggal.kecamatan} {student.alamatTinggal.kabupatenKota}
                    </td>
                  </tr>
                  <tr className="align-top">
                    <td></td>
                    <td className="py-0.5 pl-4">Nomor Telepon Rumah</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">-</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">14.</td>
                    <td className="py-0.5">Pekerjaan Orang Tua :</td>
                    <td className="py-0.5"></td>
                    <td className="py-0.5"></td>
                  </tr>
                  <tr className="align-top">
                    <td></td>
                    <td className="py-0.5 pl-4">a. Ayah</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.orangTua.pekerjaanAyah || 'Karyawan Swasta'}</td>
                  </tr>
                  <tr className="align-top">
                    <td></td>
                    <td className="py-0.5 pl-4">b. Ibu</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.orangTua.pekerjaanIbu || 'Karyawan Swasta'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">15.</td>
                    <td className="py-0.5">Nama Wali Siswa</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.orangTua.namaWali || '-'}</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">16.</td>
                    <td className="py-0.5">Alamat Wali Peserta Didik</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">-</td>
                  </tr>
                  <tr className="align-top">
                    <td></td>
                    <td className="py-0.5 pl-4">Nomor Telepon Rumah</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">-</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-0.5 font-bold">17.</td>
                    <td className="py-0.5">Pekerjaan Wali Peserta Didik</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{student.orangTua.pekerjaanWali || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Pasfoto & Principal Signatures */}
          <div className="relative z-10 flex items-end justify-between pt-4 font-serif text-[12px] text-black">
            {/* Pasfoto 3x4 Box */}
            <div className="flex flex-col items-center">
              <div className="w-[30mm] h-[40mm] border border-black border-dashed flex flex-col items-center justify-center text-center p-2 text-[10px] text-slate-500 bg-white">
                {student.pasFotoUrl ? (
                  <img src={student.pasFotoUrl} alt="Pasfoto Murid" className="w-full h-full object-cover" />
                ) : (
                  <span>Pasfoto<br />3 x 4 cm</span>
                )}
              </div>
            </div>

            {/* Principal Signature & Stamp Block */}
            <div className="text-left w-64 relative">
              <p>Kota Bandung, {tglDiterimaFormatted}</p>
              <p className="font-bold">Kepala Sekolah</p>

              <div className="relative h-20 flex items-center">
                {showSignatures && (
                  <>
                    <div className="absolute -left-6 -top-2 z-10">
                      <SchoolOfficialStamp className="w-28 h-28 opacity-90" />
                    </div>
                    <div className="relative z-20 pl-6">
                      <PrincipalSignatureSvg className="w-36 h-16" />
                    </div>
                  </>
                )}
              </div>

              <p className="font-bold underline text-black">{kepalaSekolahNama}</p>
              <p className="text-[11px] text-black">NIP. -</p>
            </div>
          </div>
        </section>
      )}

      {/* ================= PAGE 4: PINDAH SEKOLAH (KELUAR) ================= */}
      {printScope === 'full' && (
        <section className="print-page relative w-[210mm] min-h-[297mm] h-[297mm] bg-white p-[18mm] text-slate-900 shadow-xl flex flex-col justify-between overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-[14mm]">
          {showWatermark && <RepeatingWatermarkBackground />}

          <div className="relative z-10">
            <h2 className="text-center font-serif font-black text-lg text-black uppercase tracking-wider mb-4">
              KETERANGAN PINDAH SEKOLAH
            </h2>
            <p className="font-serif text-xs mb-3 text-black">
              Nama Peserta Didik : <span className="font-bold">{student.namaLengkap}</span>
            </p>

            <table className="w-full border-collapse border border-black text-[11px] font-serif text-black">
              <thead>
                <tr className="bg-slate-50/50">
                  <th colSpan={4} className="border border-black py-2 font-bold uppercase tracking-wider">
                    KELUAR
                  </th>
                </tr>
                <tr className="bg-slate-100/40 text-center">
                  <th className="border border-black p-2 w-28">Tanggal</th>
                  <th className="border border-black p-2 w-28">Kelas yang ditinggalkan</th>
                  <th className="border border-black p-2">Sebab-sebab Keluar atau Atas Permintaan (Tertulis)</th>
                  <th className="border border-black p-2 w-48">Tanda Tangan Kepala Sekolah, Stempel Sekolah, dan Tanda Tangan Orang Tua/Wali</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="h-44 align-top">
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2 flex flex-col justify-between h-44 text-[10px]">
                      <div>
                        <p className="font-bold">Kepala Sekolah,</p>
                        <div className="h-10"></div>
                        <p className="border-b border-black w-32"></p>
                        <p>NIP.</p>
                      </div>
                      <div>
                        <p className="font-bold">Orang Tua/Wali,</p>
                        <div className="h-8"></div>
                        <p className="border-b border-black w-32"></p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="relative z-10 text-center pb-2 text-[10px] text-slate-500 font-sans">
            Buku Induk Register & Mutasi Kurikulum Merdeka SD
          </div>
        </section>
      )}

      {/* ================= PAGE 5: PINDAH SEKOLAH (MASUK) ================= */}
      {printScope === 'full' && (
        <section className="print-page relative w-[210mm] min-h-[297mm] h-[297mm] bg-white p-[18mm] text-slate-900 shadow-xl flex flex-col justify-between overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-[14mm]">
          {showWatermark && <RepeatingWatermarkBackground />}

          <div className="relative z-10">
            <h2 className="text-center font-serif font-black text-lg text-black uppercase tracking-wider mb-4">
              KETERANGAN PINDAH SEKOLAH
            </h2>
            <p className="font-serif text-xs mb-3 text-black">
              Nama Peserta Didik : <span className="font-bold">{student.namaLengkap}</span>
            </p>

            <table className="w-full border-collapse border border-black text-[11px] font-serif text-black">
              <thead>
                <tr className="bg-slate-100/40 text-center">
                  <th className="border border-black p-2 w-10">NO</th>
                  <th className="border border-black p-2">MASUK</th>
                  <th className="border border-black p-2 w-52">Tanda Tangan Kepala Sekolah</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="h-44 align-top">
                    <td className="border border-black p-2 text-center font-bold">{i + 1}.</td>
                    <td className="border border-black p-2 leading-relaxed text-[11px]">
                      <p>1. Nama Siswa : ......................................................</p>
                      <p>2. Nomor Induk : ......................................................</p>
                      <p>3. Nama Sekolah : ......................................................</p>
                      <p>4. Masuk di Sekolah ini:</p>
                      <p className="pl-4">a. Tanggal : ......................................................</p>
                      <p className="pl-4">b. Di Kelas : ......................................................</p>
                      <p>5. Tahun Pelajaran : ......................................................</p>
                    </td>
                    <td className="border border-black p-2 flex flex-col justify-between h-44 text-[10px]">
                      <div>
                        <p>........................, .............................</p>
                        <p className="font-bold mt-1">Kepala Sekolah,</p>
                      </div>
                      <div className="pb-2">
                        <div className="h-14"></div>
                        <p className="border-b border-black w-36"></p>
                        <p className="mt-0.5">NIP.</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="relative z-10 text-center pb-2 text-[10px] text-slate-500 font-sans">
            Buku Induk Register & Mutasi Kurikulum Merdeka SD
          </div>
        </section>
      )}

      {/* ================= PAGE 6 / SEMESTER HALAMAN 1: LAPORAN HASIL BELAJAR ================= */}
      {(printScope === 'full' || printScope === 'rapor_only') && (
        <section className="print-page relative w-[210mm] min-h-[297mm] h-[297mm] bg-white p-[15mm] text-slate-900 shadow-xl flex flex-col justify-between overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-[12mm]">
          {showWatermark && <RepeatingWatermarkBackground />}

          <div className="relative z-10">
            {renderStudentHeader()}

            <h2 className="text-center font-serif font-black text-base text-black uppercase tracking-wider mb-3">
              LAPORAN HASIL BELAJAR
            </h2>

            {/* Grades Table Kelompok A Part 1 */}
            <table className="w-full border-collapse border border-black text-[10.5px] font-serif text-black leading-snug">
              <thead>
                <tr className="bg-slate-100/50 text-center">
                  <th className="border border-black p-1.5 w-8">No</th>
                  <th className="border border-black p-1.5 w-44">Mata Pelajaran</th>
                  <th className="border border-black p-1.5 w-16">Nilai Akhir</th>
                  <th className="border border-black p-1.5">Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-50/60 font-bold">
                  <td colSpan={4} className="border border-black px-2 py-1">
                    Kelompok A
                  </td>
                </tr>
                {subjectsPage1.map((subj, idx) => {
                  const nilai = semester === 1 ? subj.nilaiGanjil : subj.nilaiGenap;
                  const capaianTinggi = semester === 1 ? subj.capaianTinggiGanjil : subj.capaianTinggiGenap;
                  const capaianPeningkatan =
                    semester === 1 ? subj.capaianPerluPeningkatanGanjil : subj.capaianPerluPeningkatanGenap;
                  const legacyCapaian = semester === 1 ? subj.capaianGanjil : subj.capaianGenap;

                  return (
                    <tr key={subj.mapelId} className="align-top">
                      <td className="border border-black p-1.5 text-center font-semibold">{idx + 1}</td>
                      <td className="border border-black p-1.5 font-medium">{subj.mapelNama}</td>
                      <td className="border border-black p-1.5 text-center font-bold text-xs">{nilai ?? '-'}</td>
                      <td className="border border-black p-1.5 text-justify text-[10px] space-y-1">
                        {capaianTinggi ? (
                          <div>
                            <p>{capaianTinggi}</p>
                            {capaianPeningkatan && capaianPeningkatan !== '-' && (
                              <p className="mt-1 font-normal text-slate-900">{capaianPeningkatan}</p>
                            )}
                          </div>
                        ) : legacyCapaian ? (
                          <p>{legacyCapaian}</p>
                        ) : (
                          <p>Mencapai Kompetensi dengan sangat baik dalam materi pembelajaran yang telah ditetapkan.</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="relative z-10">
            {renderFooter(1)}
          </div>
        </section>
      )}

      {/* ================= PAGE 7 / SEMESTER HALAMAN 2: LANJUTAN NILAI, KOKURIKULER & EKSKUL ================= */}
      {(printScope === 'full' || printScope === 'rapor_only') && (
        <section className="print-page relative w-[210mm] min-h-[297mm] h-[297mm] bg-white p-[15mm] text-slate-900 shadow-xl flex flex-col justify-between overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-[12mm]">
          {showWatermark && <RepeatingWatermarkBackground />}

          <div className="relative z-10 space-y-3">
            {renderStudentHeader()}

            {/* Continuation of Table (Kelompok A remaining + Kelompok B) */}
            <table className="w-full border-collapse border border-black text-[10.5px] font-serif text-black leading-snug">
              <thead>
                <tr className="bg-slate-100/50 text-center">
                  <th className="border border-black p-1.5 w-8">No</th>
                  <th className="border border-black p-1.5 w-44">Mata Pelajaran</th>
                  <th className="border border-black p-1.5 w-16">Nilai Akhir</th>
                  <th className="border border-black p-1.5">Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody>
                {/* Remaining Kelompok A (e.g. PJOK, Bahasa Inggris) */}
                {subjectsPage2A.map((subj, idx) => {
                  const nilai = semester === 1 ? subj.nilaiGanjil : subj.nilaiGenap;
                  const capaianTinggi = semester === 1 ? subj.capaianTinggiGanjil : subj.capaianTinggiGenap;
                  const capaianPeningkatan =
                    semester === 1 ? subj.capaianPerluPeningkatanGanjil : subj.capaianPerluPeningkatanGenap;
                  const legacyCapaian = semester === 1 ? subj.capaianGanjil : subj.capaianGenap;

                  return (
                    <tr key={subj.mapelId} className="align-top">
                      <td className="border border-black p-1.5 text-center font-semibold">
                        {page1KelompokACount + idx + 1}
                      </td>
                      <td className="border border-black p-1.5 font-medium">{subj.mapelNama}</td>
                      <td className="border border-black p-1.5 text-center font-bold text-xs">{nilai ?? '-'}</td>
                      <td className="border border-black p-1.5 text-justify text-[10px] space-y-1">
                        {capaianTinggi ? (
                          <div>
                            <p>{capaianTinggi}</p>
                            {capaianPeningkatan && capaianPeningkatan !== '-' && (
                              <p className="mt-1">{capaianPeningkatan}</p>
                            )}
                          </div>
                        ) : legacyCapaian ? (
                          <p>{legacyCapaian}</p>
                        ) : (
                          <p>Mencapai Kompetensi dengan sangat baik.</p>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* Kelompok B */}
                <tr className="bg-slate-50/60 font-bold">
                  <td colSpan={4} className="border border-black px-2 py-1">
                    Kelompok B
                  </td>
                </tr>
                {kelompokBSubjects.map((subj, idx) => {
                  const nilai = semester === 1 ? subj.nilaiGanjil : subj.nilaiGenap;
                  const capaianTinggi = semester === 1 ? subj.capaianTinggiGanjil : subj.capaianTinggiGenap;
                  const capaianPeningkatan =
                    semester === 1 ? subj.capaianPerluPeningkatanGanjil : subj.capaianPerluPeningkatanGenap;
                  const legacyCapaian = semester === 1 ? subj.capaianGanjil : subj.capaianGenap;

                  return (
                    <tr key={subj.mapelId} className="align-top">
                      <td className="border border-black p-1.5 text-center font-semibold">{idx + 1}</td>
                      <td className="border border-black p-1.5 font-medium">{subj.mapelNama}</td>
                      <td className="border border-black p-1.5 text-center font-bold text-xs">{nilai ?? '-'}</td>
                      <td className="border border-black p-1.5 text-justify text-[10px] space-y-1">
                        {capaianTinggi ? (
                          <div>
                            <p>{capaianTinggi}</p>
                            {capaianPeningkatan && capaianPeningkatan !== '-' && (
                              <p className="mt-1">{capaianPeningkatan}</p>
                            )}
                          </div>
                        ) : legacyCapaian ? (
                          <p>{legacyCapaian}</p>
                        ) : (
                          <p>Mencapai Kompetensi dengan sangat baik.</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Kokurikuler Section */}
            <div className="border border-black">
              <div className="bg-slate-100/60 border-b border-black text-center font-serif font-bold text-xs py-1">
                Kokurikuler
              </div>
              <div className="p-2.5 font-serif text-[10px] leading-relaxed text-justify text-black">
                {kokurikulerDesc}
              </div>
            </div>

            {/* Ekstrakurikuler Table */}
            <table className="w-full border-collapse border border-black text-[10.5px] font-serif text-black leading-snug">
              <thead>
                <tr className="bg-slate-100/50 text-center">
                  <th className="border border-black p-1.5 w-8">No</th>
                  <th className="border border-black p-1.5 w-44">Ekstrakurikuler</th>
                  <th className="border border-black p-1.5">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {ekskulList.map((ekskul, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="border border-black p-1.5 text-center font-semibold">{idx + 1}</td>
                    <td className="border border-black p-1.5 font-bold">{ekskul.nama}</td>
                    <td className="border border-black p-1.5 text-justify text-[10px] leading-relaxed">
                      {ekskul.keterangan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* In Semester 2 reference PDF, Attendance and Promotion status appear on Page 10 */}
            {semester === 2 && (
              <div className="space-y-3 pt-1">
                {/* Ketidakhadiran & Catatan Wali Kelas side by side */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-4 border border-black">
                    <div className="bg-slate-100/60 border-b border-black text-center font-serif font-bold text-[11px] py-1">
                      Ketidakhadiran
                    </div>
                    <div className="p-2 font-serif text-[11px] space-y-1">
                      <div className="flex justify-between border-b border-slate-200 pb-0.5">
                        <span>Sakit</span>
                        <span className="font-bold">: {attendanceSakit} hari</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-0.5">
                        <span>Izin</span>
                        <span className="font-bold">: {attendanceIzin} hari</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanpa Keterangan</span>
                        <span className="font-bold">: {attendanceAlpa} hari</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-8 border border-black">
                    <div className="bg-slate-100/60 border-b border-black text-center font-serif font-bold text-[11px] py-1">
                      Catatan Wali Kelas
                    </div>
                    <div className="p-2 font-serif text-[10px] leading-relaxed text-justify">
                      {catatanWaliKelas}
                    </div>
                  </div>
                </div>

                {/* Keterangan Kelulusan / Kenaikan Kelas */}
                <div className="border border-black py-2 px-4 text-center font-serif font-bold text-xs bg-slate-50/40">
                  {student.kelas === 6 ? (
                    <span>
                      Keterangan Kelulusan : <span className="font-black underline">{student.kelulusanStatus || 'Lulus'}</span>
                    </span>
                  ) : (
                    <span>
                      Keterangan Kenaikan Kelas :{' '}
                      <span className="font-black underline">
                        {student.kelulusanStatus || `Naik ke Kelas ${student.kelas + 1}`}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10">
            {renderFooter(2)}
          </div>
        </section>
      )}

      {/* ================= PAGE 8 (SEM 1) OR PAGE 11 (SEM 2): HALAMAN TANDA TANGAN ================= */}
      {(printScope === 'full' || printScope === 'rapor_only') && (
        <section className="print-page relative w-[210mm] min-h-[297mm] h-[297mm] bg-white p-[15mm] text-slate-900 shadow-xl flex flex-col justify-between overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0 print:p-[12mm]">
          {showWatermark && <RepeatingWatermarkBackground />}

          <div className="relative z-10 space-y-4">
            {renderStudentHeader()}

            {/* In Semester 1 reference, Ketidakhadiran & Catatan Wali Kelas are here on Page 8 */}
            {semester === 1 && (
              <div className="grid grid-cols-12 gap-3 mb-2">
                <div className="col-span-4 border border-black">
                  <div className="bg-slate-100/60 border-b border-black text-center font-serif font-bold text-[11px] py-1">
                    Ketidakhadiran
                  </div>
                  <div className="p-2.5 font-serif text-[11px] space-y-1.5">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span>Sakit</span>
                      <span className="font-bold">: {attendanceSakit} hari</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span>Izin</span>
                      <span className="font-bold">: {attendanceIzin} hari</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tanpa Keterangan</span>
                      <span className="font-bold">: {attendanceAlpa} hari</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-8 border border-black">
                  <div className="bg-slate-100/60 border-b border-black text-center font-serif font-bold text-[11px] py-1">
                    Catatan Wali Kelas
                  </div>
                  <div className="p-2.5 font-serif text-[10.5px] leading-relaxed text-justify">
                    {catatanWaliKelas}
                  </div>
                </div>
              </div>
            )}

            {/* Tanggapan Orang Tua/Wali Murid */}
            <div className="border border-black">
              <div className="bg-slate-100/60 border-b border-black text-center font-serif font-bold text-[11px] py-1">
                Tanggapan Orang Tua/Wali Murid
              </div>
              <div className="h-28 p-3 font-serif text-xs text-slate-400">
                {/* Blank lines or space for parents notes */}
              </div>
            </div>

            {/* Signatures Section */}
            <div className="pt-6 font-serif text-[12px] text-black">
              <div className="grid grid-cols-2 gap-8">
                {/* Left: Orang Tua Murid */}
                <div className="text-left">
                  <p>Mengetahui,</p>
                  <p className="font-bold">Orang Tua Murid</p>
                  <div className="h-24 flex items-end">
                    <p className="border-b border-black border-dotted w-48 mb-2"></p>
                  </div>
                </div>

                {/* Right: Wali Kelas */}
                <div className="text-left relative">
                  <p>{tglRapor}</p>
                  <p className="font-bold">Wali Kelas</p>
                  <div className="h-24 relative flex items-center">
                    {showSignatures && (
                      <div className="pl-4">
                        <WaliKelasSignatureSvg className="w-36 h-16" />
                      </div>
                    )}
                  </div>
                  <p className="font-bold underline text-black">{waliKelasNama}</p>
                  <p className="text-[11px] text-black">{waliKelasNip}</p>
                </div>
              </div>

              {/* Center / Bottom: Kepala Sekolah */}
              <div className="text-center mt-6 flex flex-col items-center">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala Sekolah</p>

                <div className="relative h-24 w-64 flex items-center justify-center my-1">
                  {showSignatures && (
                    <>
                      <div className="absolute left-6 -top-2 z-10">
                        <SchoolOfficialStamp className="w-28 h-28 opacity-90" />
                      </div>
                      <div className="relative z-20 pl-8">
                        <PrincipalSignatureSvg className="w-36 h-16" />
                      </div>
                    </>
                  )}
                </div>

                <p className="font-bold underline text-black">{kepalaSekolahNama}</p>
                <p className="text-[11px] text-black">{kepalaSekolahNip}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            {renderFooter(3)}
          </div>
        </section>
      )}
    </div>
  );
};
