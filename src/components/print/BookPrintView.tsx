import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, ArrowLeft, BookOpen, Sliders } from 'lucide-react';
import { TutWuriHandayaniLogo } from './SchoolLogos';

interface BookPrintViewProps {
  onBack: () => void;
}

export const BookPrintView: React.FC<BookPrintViewProps> = ({ onBack }) => {
  const { schoolProfile, mutations, getMonthlyRekap } = useApp();

  // Print mode selection
  const [printTarget, setPrintTarget] = useState<'mutasi_year' | 'mutasi_month' | 'buku_induk'>('mutasi_year');
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // Oktober
  const [includeCover, setIncludeCover] = useState(true);
  const [includeIntro, setIncludeIntro] = useState(true);
  const includeSignature = true;
  const [fillBlankRows, setFillBlankRows] = useState(true); // Fill up to 20 rows like a physical book
  const [pageSize, setPageSize] = useState<'A4_landscape' | 'A4_portrait'>('A4_landscape');

  const monthsInOrder = [
    { num: 7, name: 'JULI', year: 2023 },
    { num: 8, name: 'AGUSTUS', year: 2023 },
    { num: 9, name: 'SEPTEMBER', year: 2023 },
    { num: 10, name: 'OKTOBER', year: 2023 },
    { num: 11, name: 'NOVEMBER', year: 2023 },
    { num: 12, name: 'DESEMBER', year: 2023 },
    { num: 1, name: 'JANUARI', year: 2024 },
    { num: 2, name: 'FEBRUARI', year: 2024 },
    { num: 3, name: 'MARET', year: 2024 },
    { num: 4, name: 'APRIL', year: 2024 },
    { num: 5, name: 'MEI', year: 2024 },
    { num: 6, name: 'JUNI', year: 2024 },
  ];

  const handleTriggerPrint = () => {
    window.print();
  };

  // Months to render for the book
  const activeMonths =
    printTarget === 'mutasi_year'
      ? monthsInOrder
      : monthsInOrder.filter((m) => m.num === selectedMonth);

  const ROWS_PER_PAGE = 18;

  return (
    <div className="space-y-6 pb-20 md:pb-12">
      {/* Screen Controls Header (Hidden in Print) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Pencetakan Buku Resmi On-Demand</span>
              </h2>
              <p className="text-xs text-slate-500">
                Cetak seluruh buku mutasi dengan halaman sampul, kata pengantar, halaman berhadapan, dan tanda tangan Kepala Sekolah.
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerPrint}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Unduh PDF</span>
          </button>
        </div>

        {/* Print Configuration Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Target Book Type */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Jenis Dokumen:</label>
            <select
              value={printTarget}
              onChange={(e) => setPrintTarget(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
            >
              <option value="mutasi_year">Buku Mutasi 1 Tahun Lengkap (12 Bulan)</option>
              <option value="mutasi_month">Buku Mutasi Bulan Tertentu</option>
              <option value="buku_induk">Buku Induk Register Peserta Didik</option>
            </select>
          </div>

          {/* Month selector if mutasi_month */}
          {printTarget === 'mutasi_month' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Bulan:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
              >
                {monthsInOrder.map((m) => (
                  <option key={m.num} value={m.num}>
                    {m.name} {m.year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Page Orientation */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tata Letak (Ukuran):</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
            >
              <option value="A4_landscape">A4 Landscape (Buku Berhadapan)</option>
              <option value="A4_portrait">A4 Portrait (Halaman Tunggal)</option>
            </select>
          </div>

          {/* Checkbox Options */}
          <div className="flex flex-col justify-center space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="inline-flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeCover}
                onChange={(e) => setIncludeCover(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Sertakan Sampul Buku</span>
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeIntro}
                onChange={(e) => setIncludeIntro(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Sertakan Lembar Petunjuk</span>
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={fillBlankRows}
                onChange={(e) => setFillBlankRows(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Garis Kosong (Format Buku Fisik)</span>
            </label>
          </div>
        </div>

        {/* Tip / Notice */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Tips Cetak:</strong> Pada jendela cetak browser (Ctrl + P), pastikan pilih <em>Ukuran Kertas A4</em>, <em>Margins: Minimum / None</em>, dan centang <em>Background graphics</em> agar garis tabel tampil sempurna.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRINT CONTENT CONTAINER (Preview on Screen, Print to Paper) */}
      {/* ========================================================= */}
      <div className="print-container space-y-8 font-serif text-black">
        {/* ===================================================== */}
        {/* 1. COVER PAGE (Halaman Sampul Buku Mutasi Murid)      */}
        {/* ===================================================== */}
        {includeCover && (
          <div className="print-page bg-white p-8 sm:p-14 border border-slate-300 shadow-md max-w-4xl mx-auto min-h-[900px] flex flex-col justify-between relative">
            {/* Top Right School Identification Boxes */}
            <div className="flex justify-end text-[11px]">
              <div className="space-y-1 font-sans">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[10px]">NOMOR POKOK SEKOLAH NASIONAL</span>
                  <div className="flex border border-black">
                    {schoolProfile.npsn.padEnd(8, ' ').split('').map((char, i) => (
                      <span key={i} className="w-5 h-5 border-r last:border-r-0 border-black flex items-center justify-center font-bold text-xs">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[10px]">NOMOR STATISTIK SEKOLAH</span>
                  <div className="flex border border-black">
                    {schoolProfile.nss.padEnd(12, ' ').split('').map((char, i) => (
                      <span key={i} className="w-4 h-5 border-r last:border-r-0 border-black flex items-center justify-center font-bold text-[11px]">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[10px]">KODE SEKOLAH</span>
                  <div className="flex border border-black">
                    {schoolProfile.kodeSekolah.padEnd(10, ' ').split('').map((char, i) => (
                      <span key={i} className="w-4 h-5 border-r last:border-r-0 border-black flex items-center justify-center font-bold text-[11px]">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center Logo & Title */}
            <div className="my-auto text-center space-y-6">
              <div className="flex justify-center mb-4">
                <TutWuriHandayaniLogo className="w-32 h-32" />
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-black tracking-wider uppercase font-serif text-black">
                  {printTarget === 'buku_induk' ? 'BUKU INDUK REGISTER PESERTA DIDIK' : 'BUKU MUTASI MURID'}
                </h1>
                {printTarget === 'buku_induk' && (
                  <p className="text-xl font-bold tracking-widest uppercase text-red-600 font-sans">
                    KURIKULUM MERDEKA • SEKOLAH DASAR (SD)
                  </p>
                )}
              </div>

              {/* School Info Box */}
              <div className="max-w-xl mx-auto border-2 border-black rounded-2xl p-6 sm:p-8 text-left space-y-3 font-sans shadow-xs mt-8">
                <div className="grid grid-cols-12 gap-1 text-sm">
                  <span className="col-span-4 font-bold text-black uppercase">NAMA SEKOLAH</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-7 font-black tracking-wide border-b border-dotted border-black pb-0.5">
                    {schoolProfile.namaSekolah}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-sm">
                  <span className="col-span-4 font-bold text-black uppercase">ALAMAT SEKOLAH</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-7 font-semibold border-b border-dotted border-black pb-0.5">
                    {schoolProfile.alamatSekolah}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-sm">
                  <span className="col-span-4 font-bold text-black uppercase">DESA / KELURAHAN</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-7 font-semibold border-b border-dotted border-black pb-0.5">
                    {schoolProfile.desaKelurahan}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-sm">
                  <span className="col-span-4 font-bold text-black uppercase">KECAMATAN</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-7 font-semibold border-b border-dotted border-black pb-0.5">
                    {schoolProfile.kecamatan}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-sm">
                  <span className="col-span-4 font-bold text-black uppercase">KABUPATEN / KOTA</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-7 font-semibold border-b border-dotted border-black pb-0.5">
                    {schoolProfile.kabupatenKota}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-sm">
                  <span className="col-span-4 font-bold text-black uppercase">PROVINSI</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-7 font-semibold border-b border-dotted border-black pb-0.5">
                    {schoolProfile.provinsi}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-sm pt-1">
                  <span className="col-span-4 font-bold text-black uppercase">TAHUN PELAJARAN</span>
                  <span className="col-span-1 text-center font-bold">:</span>
                  <span className="col-span-7 font-black tracking-widest text-indigo-900 border-b border-dotted border-black pb-0.5">
                    {schoolProfile.tahunPelajaran}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Official Footer */}
            <div className="text-center font-sans text-xs text-slate-500 pt-6">
              KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI REPUBLIK INDONESIA
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* 2. PETUNJUK & IDENTITAS                               */}
        {/* ===================================================== */}
        {includeIntro && (
          <div className="print-page bg-white p-8 sm:p-14 border border-slate-300 shadow-md max-w-4xl mx-auto min-h-[900px] flex flex-col justify-between">
            <div>
              <h2 className="text-center text-xl font-bold uppercase tracking-wider mb-8 font-serif">
                MUTASI MURID ( SISWA / I ) MASUK DAN KELUAR
              </h2>

              {/* Box with official text */}
              <div className="border-2 border-black rounded-xl p-8 max-w-2xl mx-auto space-y-4 text-justify font-serif text-sm leading-relaxed">
                <p className="indent-8">
                  Format Buku Mutasi cukup mudah dimengerti dan tidak perlu kiranya penjelasan khusus.
                </p>
                <p className="indent-8">
                  Penerimaan Siswa Baru ( PSB ) tidak masuk mutasi siswa.
                </p>
                <p className="indent-8">
                  Mutasi siswa, berarti siswa tersebut telah belajar di satu sekolah beberapa waktu, pindah kesekolah lain.
                </p>
                <p className="indent-8">
                  Bila siswa berlangsung wajar-wajar saja, sebenarnya tidak perlu buku-buku mutasi masuk dan keluar ini.
                </p>
                <p className="indent-8">
                  Pada zaman kolusi, beberapa sekolah melaksanakan naik terbang terhadap siswanya, artinya siswa tersebut tidak naik kelas, tetapi diberi kesempatan untuk naik kelas, asal pindah sekolah. Tentu dengan imbalan tertentu.
                </p>
                <p className="indent-8">
                  Cara kolusi itulah yang membuat kualitas pendidikan kita semakin terpuruk, sekaligus makin rendah Sumber Daya Manusia (SDM) Indonesia.
                </p>
                <p className="indent-8">
                  Untuk memperkecil solusi itulah format buku mutasi ini di ciptakan agar semua siswa yang masuk dan keluar tercatat dan dapat ditelusuri.
                </p>
                <p className="indent-8">
                  Sekolah yang bermutu baik, siswanya tidak ada yang pindah sekolah, kecuali karena terpaksa mengikuti orang tua pindah tempat kerja.
                </p>
                <p className="indent-8">
                  Sekolah yang kurang baik, jumlah siswanya tidak stabil, berbondong-bondong siswa masuk dan berbondong-bondong pindah, mutu pendidikan tidak diperhatikan, yang penting uang masuk. Disinyalir ada sekolah sebagai institusi membagi-bagikan STTB, padahal kita sangat mendambakan Sumber Daya Manusia berkualitas untuk pembangunan.
                </p>
                <p className="indent-8">
                  Pada era reformasi kini, sangat perlu pengelolaan pendidikan secara professional, artinya sekolah mampu menelusuri dan mengembangkan.
                </p>
              </div>
            </div>

            {/* Bottom School Details Box */}
            <div className="border border-black rounded-xl p-5 max-w-2xl mx-auto w-full font-sans text-xs space-y-2 mt-8">
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold">NAMA SEKOLAH</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold border-b border-dotted border-black">{schoolProfile.namaSekolah}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold">ALAMAT SEKOLAH</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 border-b border-dotted border-black">{schoolProfile.alamatSekolah}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-bold">DI</span>
                <span className="col-span-1 text-center">:</span>
                <span className="col-span-7 font-bold border-b border-dotted border-black">{schoolProfile.kabupatenKota}</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* 3. MONTHLY SPREAD PAGES                               */}
        {/* ===================================================== */}
        {activeMonths.map((mInfo) => {
          const keluarList = mutations.filter(
            (m) => m.type === 'keluar' && m.bulan === mInfo.num && m.tahun === mInfo.year
          );
          const masukList = mutations.filter(
            (m) => m.type === 'masuk' && m.bulan === mInfo.num && m.tahun === mInfo.year
          );
          const rekap = getMonthlyRekap(mInfo.num, mInfo.year, schoolProfile.tahunPelajaran);

          return (
            <React.Fragment key={`${mInfo.year}-${mInfo.num}`}>
              {/* -------------------------------------------------- */}
              {/* HALAMAN KIRI: MUTASI KELUAR & TABEL REKAPITULASI   */}
              {/* -------------------------------------------------- */}
              <div className="print-page bg-white p-6 sm:p-10 border border-slate-300 shadow-md max-w-6xl mx-auto min-h-[850px] flex flex-col justify-between">
                <div>
                  {/* Top Header of Left Page */}
                  <div className="flex items-center justify-between pb-2 border-b-2 border-black font-sans">
                    <div className="text-xs font-bold uppercase tracking-wider">
                      BULAN : <span className="underline decoration-dotted text-sm font-black">{mInfo.name} {mInfo.year}</span>
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider">
                      KELUAR : ...................................
                    </div>
                  </div>

                  {/* Mutasi Keluar Table */}
                  <table className="table-official w-full text-[10px] border-collapse border border-black mt-2 font-sans">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center border-b border-black">
                        <th className="py-1 px-1 border border-black w-8">No. Urut</th>
                        <th className="py-1 px-1 border border-black w-14">Tgl</th>
                        <th className="py-1 px-2 border border-black text-left">Nama</th>
                        <th className="py-1 px-1 border border-black w-8">L/P</th>
                        <th className="py-1 px-1 border border-black w-20">No. Induk</th>
                        <th className="py-1 px-1 border border-black w-24">No. Induk Siswa Nasional</th>
                        <th className="py-1 px-1 border border-black w-12">Kelas</th>
                        <th className="py-1 px-2 border border-black w-32">No. Surat Pindah</th>
                        <th className="py-1 px-2 border border-black text-left">Keterangan Pindah ke</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render Actual Records */}
                      {keluarList.map((k, idx) => (
                        <tr key={k.id} className="border-b border-black">
                          <td className="py-1 px-1 text-center border border-black font-bold">{idx + 1}</td>
                          <td className="py-1 px-1 text-center border border-black whitespace-nowrap">{k.tanggal}</td>
                          <td className="py-1 px-2 border border-black font-semibold uppercase">{k.namaSiswa}</td>
                          <td className="py-1 px-1 text-center border border-black font-bold">{k.jenisKelamin}</td>
                          <td className="py-1 px-1 text-center border border-black font-mono">{k.noInduk}</td>
                          <td className="py-1 px-1 text-center border border-black font-mono">{k.nisn}</td>
                          <td className="py-1 px-1 text-center border border-black font-bold">{k.kelas}</td>
                          <td className="py-1 px-2 border border-black font-mono text-[9px]">{k.noSuratPindah || '-'}</td>
                          <td className="py-1 px-2 border border-black">{k.keteranganPindah || '-'}</td>
                        </tr>
                      ))}

                      {/* Blank rows to replicate ruled physical ledger book */}
                      {fillBlankRows &&
                        Array.from({ length: Math.max(0, ROWS_PER_PAGE - keluarList.length) }).map((_, i) => (
                          <tr key={`blank-out-${i}`} className="border-b border-black h-6">
                            <td className="border border-black text-center text-slate-300 text-[9px]">{keluarList.length + i + 1}</td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom REKAPITULASI Table */}
                <div className="mt-4 pt-2 font-sans">
                  <div className="text-[10px] font-black uppercase text-center tracking-widest pb-1">
                    REKAPITULASI
                  </div>
                  <table className="table-official w-full text-[9px] border-collapse border border-black text-center">
                    <thead>
                      <tr className="bg-slate-100 font-extrabold border-b border-black">
                        <th className="py-1 px-2 border border-black w-14" rowSpan={2}>KELAS</th>
                        <th className="py-0.5 px-1 border border-black" colSpan={3}>Awal bulan</th>
                        <th className="py-0.5 px-1 border border-black" colSpan={3}>MASUK</th>
                        <th className="py-0.5 px-1 border border-black" colSpan={3}>KELUAR</th>
                        <th className="py-0.5 px-1 border border-black" colSpan={3}>Akhir bulan</th>
                        <th className="py-1 px-2 border border-black" rowSpan={2}>Keterangan</th>
                      </tr>
                      <tr className="bg-slate-50 font-bold border-b border-black">
                        <th className="border border-black w-6">L</th>
                        <th className="border border-black w-6">P</th>
                        <th className="border border-black w-8">Jumlah</th>
                        <th className="border border-black w-6">L</th>
                        <th className="border border-black w-6">P</th>
                        <th className="border border-black w-8">Jumlah</th>
                        <th className="border border-black w-6">L</th>
                        <th className="border border-black w-6">P</th>
                        <th className="border border-black w-8">Jumlah</th>
                        <th className="border border-black w-6">L</th>
                        <th className="border border-black w-6">P</th>
                        <th className="border border-black w-8">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rekap.items.map((it) => (
                        <tr key={it.kelas} className="border-b border-black font-medium">
                          <td className="py-0.5 px-1 border border-black font-bold">{it.kelas}</td>
                          <td className="border border-black">{it.awalL}</td>
                          <td className="border border-black">{it.awalP}</td>
                          <td className="border border-black font-bold">{it.awalTotal}</td>

                          <td className="border border-black">{it.masukL || ''}</td>
                          <td className="border border-black">{it.masukP || ''}</td>
                          <td className="border border-black font-bold">{it.masukTotal || ''}</td>

                          <td className="border border-black">{it.keluarL || ''}</td>
                          <td className="border border-black">{it.keluarP || ''}</td>
                          <td className="border border-black font-bold">{it.keluarTotal || ''}</td>

                          <td className="border border-black font-semibold">{it.akhirL}</td>
                          <td className="border border-black font-semibold">{it.akhirP}</td>
                          <td className="border border-black font-black">{it.akhirTotal}</td>
                          <td className="border border-black text-left px-1 text-[8px]">
                            {it.keluarTotal > 0 ? `${it.keluarTotal} murid pindah` : it.masukTotal > 0 ? `${it.masukTotal} murid masuk` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-black font-black bg-slate-100">
                        <td className="py-1 px-1 border border-black">Jumlah</td>
                        <td className="border border-black">{rekap.totalAwalL}</td>
                        <td className="border border-black">{rekap.totalAwalP}</td>
                        <td className="border border-black">{rekap.totalAwal}</td>

                        <td className="border border-black">{rekap.totalMasukL || ''}</td>
                        <td className="border border-black">{rekap.totalMasukP || ''}</td>
                        <td className="border border-black">{rekap.totalMasuk || ''}</td>

                        <td className="border border-black">{rekap.totalKeluarL || ''}</td>
                        <td className="border border-black">{rekap.totalKeluarP || ''}</td>
                        <td className="border border-black">{rekap.totalKeluar || ''}</td>

                        <td className="border border-black">{rekap.totalAkhirL}</td>
                        <td className="border border-black">{rekap.totalAkhirP}</td>
                        <td className="border border-black">{rekap.totalAkhir}</td>
                        <td className="border border-black"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* HALAMAN KANAN: MUTASI MASUK & PENGESAHAN KEPALA    */}
              {/* SEKOLAH                                            */}
              {/* -------------------------------------------------- */}
              <div className="print-page bg-white p-6 sm:p-10 border border-slate-300 shadow-md max-w-6xl mx-auto min-h-[850px] flex flex-col justify-between">
                <div>
                  {/* Top Header of Right Page */}
                  <div className="flex items-center justify-between pb-2 border-b-2 border-black font-sans">
                    <div className="text-xs font-black uppercase tracking-wider">
                      MASUK
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider">
                      MUTASI MURID
                    </div>
                  </div>

                  {/* Mutasi Masuk Table */}
                  <table className="table-official w-full text-[10px] border-collapse border border-black mt-2 font-sans">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center border-b border-black">
                        <th className="py-1 px-1 border border-black w-8" rowSpan={2}>No. Urut</th>
                        <th className="py-1 px-1 border border-black w-14" rowSpan={2}>Tgl</th>
                        <th className="py-1 px-2 border border-black text-left" rowSpan={2}>Nama</th>
                        <th className="py-1 px-1 border border-black w-8" rowSpan={2}>L/P</th>
                        <th className="py-1 px-1 border border-black w-20" rowSpan={2}>No. Induk</th>
                        <th className="py-1 px-1 border border-black w-24" rowSpan={2}>No. Induk Siswa Nasional</th>
                        <th className="py-1 px-1 border border-black w-12" rowSpan={2}>Kelas</th>
                        <th className="py-0.5 px-1 border border-black" colSpan={3}>Berasal dari</th>
                        <th className="py-0.5 px-1 border border-black" colSpan={2}>Persetujuan Kanwil/Kanko</th>
                      </tr>
                      <tr className="bg-slate-50 font-bold text-center border-b border-black text-[9px]">
                        <th className="border border-black w-28">Sekolah</th>
                        <th className="border border-black w-14">No. Induk</th>
                        <th className="border border-black w-10">Kelas</th>
                        <th className="border border-black w-14">Tgl</th>
                        <th className="border border-black w-24">Nomor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render Actual Records */}
                      {masukList.map((m, idx) => (
                        <tr key={m.id} className="border-b border-black">
                          <td className="py-1 px-1 text-center border border-black font-bold">{idx + 1}</td>
                          <td className="py-1 px-1 text-center border border-black whitespace-nowrap">{m.tanggal}</td>
                          <td className="py-1 px-2 border border-black font-semibold uppercase">{m.namaSiswa}</td>
                          <td className="py-1 px-1 text-center border border-black font-bold">{m.jenisKelamin}</td>
                          <td className="py-1 px-1 text-center border border-black font-mono">{m.noInduk}</td>
                          <td className="py-1 px-1 text-center border border-black font-mono">{m.nisn}</td>
                          <td className="py-1 px-1 text-center border border-black font-bold">{m.kelas}</td>
                          <td className="py-1 px-2 border border-black">{m.asalSekolah || '-'}</td>
                          <td className="py-1 px-1 text-center border border-black font-mono text-[9px]">{m.noIndukAsal || '-'}</td>
                          <td className="py-1 px-1 text-center border border-black">{m.kelasAsal || '-'}</td>
                          <td className="py-1 px-1 text-center border border-black text-[9px]">{m.persetujuanKanwilTgl || '-'}</td>
                          <td className="py-1 px-1 text-center border border-black text-[9px] font-mono">{m.persetujuanKanwilNomor || '-'}</td>
                        </tr>
                      ))}

                      {/* Blank rows to replicate ruled physical ledger book */}
                      {fillBlankRows &&
                        Array.from({ length: Math.max(0, ROWS_PER_PAGE - masukList.length) }).map((_, i) => (
                          <tr key={`blank-in-${i}`} className="border-b border-black h-6">
                            <td className="border border-black text-center text-slate-300 text-[9px]">{masukList.length + i + 1}</td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                            <td className="border border-black"></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Signature Section */}
                <div className="mt-8 pt-4 font-sans flex justify-between items-end">
                  <div className="text-[10px] text-slate-500 italic">
                    Dicetak resmi secara digital melalui Sistem Sekolah • {schoolProfile.namaSekolah}
                  </div>

                  <div className="text-left w-64">
                    <p className="text-xs font-bold text-black uppercase">
                      KEPALA SEKOLAH,
                    </p>

                    {/* Official Signature SVG / Upload */}
                    <div className="h-16 my-1 flex items-center">
                      {includeSignature && schoolProfile.kepalaSekolahTtd ? (
                        <img
                          src={schoolProfile.kepalaSekolahTtd}
                          alt="Tanda Tangan Kepala Sekolah"
                          className="h-14 object-contain"
                        />
                      ) : (
                        <div className="h-14"></div>
                      )}
                    </div>

                    <p className="text-xs font-bold text-black border-b border-black pb-0.5 inline-block min-w-[200px]">
                      ( {schoolProfile.kepalaSekolahNama} )
                    </p>
                    <p className="text-[10px] font-mono text-black mt-0.5">
                      NIP. {schoolProfile.kepalaSekolahNip}
                    </p>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
