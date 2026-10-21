import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import type { AdmissionsPipelineStage } from '../../types/v3';
import {
  CheckCircle2,
} from 'lucide-react';

export const Pillar6AddonsModule: React.FC = () => {
  const {
    applicants,
    updateApplicantStage,
    campusAssets,
    libraryBooks,
    borrowings,
    returnBorrowedBook,
    activeCampus,
  } = useV3App();

  const [activeSubTab, setActiveSubTab] = useState<'admissions' | 'assets' | 'library'>('admissions');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  const stages: { stage: AdmissionsPipelineStage; label: string; color: string }[] = [
    { stage: 'INQUIRY', label: 'Prospek Awal (Inquiry)', color: 'bg-slate-100 text-slate-700' },
    { stage: 'APPLIED', label: 'Formulir Masuk (Applied)', color: 'bg-blue-100 text-blue-800' },
    { stage: 'REVIEW_ACADEMIC', label: 'Review Rapor & Berkas', color: 'bg-indigo-100 text-indigo-800' },
    { stage: 'INTERVIEW', label: 'Wawancara & Tes Minat', color: 'bg-purple-100 text-purple-800' },
    { stage: 'OFFER_ACCEPTED', label: 'Lolos & Diterima', color: 'bg-emerald-100 text-emerald-800' },
    { stage: 'ENROLLED', label: 'Daftar Ulang Resmi (Enrolled)', color: 'bg-teal-100 text-teal-800' },
  ];

  const filteredApplicants = applicants.filter((a) => {
    return stageFilter === 'ALL' || a.stage === stageFilter;
  });

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              Pillar 6: Core Add-Ons (Value-Adds)
            </span>
            <span className="text-xs text-teal-200">• {activeCampus.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Admissions CRM, Inventory & Library Systems
          </h2>
          <p className="text-xs text-teal-100 mt-1 max-w-2xl leading-relaxed">
            Pipeline konversi pendaftaran siswa baru (PPDB CRM), pelacakan aset sarana prasarana per ruangan, dan sirkulasi peminjaman buku perpustakaan berhitung denda otomatis.
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('admissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'admissions' ? 'bg-white text-teal-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Admissions / PPDB CRM ({applicants.length})
          </button>
          <button
            onClick={() => setActiveSubTab('assets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'assets' ? 'bg-white text-teal-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Inventaris Aset Sarpras ({campusAssets.length})
          </button>
          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'library' ? 'bg-white text-teal-950 shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Perpustakaan & Peminjaman ({borrowings.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: ADMISSIONS CRM PIPELINE */}
      {/* ======================================================== */}
      {activeSubTab === 'admissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Pipeline CRM Penerimaan Siswa Baru (PPDB Online)
              </h3>
              <p className="text-xs text-slate-500">
                Pantau berkas, skor ujian masuk, dan alur konversi calon peserta didik baru secara transparan.
              </p>
            </div>

            {/* Stage Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => setStageFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  stageFilter === 'ALL' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Semua Tahap
              </button>
              {stages.map((st) => (
                <button
                  key={st.stage}
                  onClick={() => setStageFilter(st.stage)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    stageFilter === st.stage ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApplicants.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
                      {app.applicationNumber}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{app.applicantFullName}</h4>
                    <p className="text-xs text-slate-500">Target: Tingkat {app.targetGrade} • Asal: {app.previousSchool}</p>
                  </div>

                  {/* Stage Dropdown Selector */}
                  <select
                    value={app.stage}
                    onChange={(e) => updateApplicantStage(app.id, e.target.value as AdmissionsPipelineStage)}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold border border-teal-300 bg-white text-teal-900 outline-none"
                  >
                    {stages.map((st) => (
                      <option key={st.stage} value={st.stage}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                  <p>Orang Tua: <strong className="text-slate-900">{app.parentName}</strong> ({app.parentPhone})</p>
                  {app.entranceExamScore && (
                    <p>Skor Tes Kesiapan Belajar: <strong className="text-emerald-700 font-black">{app.entranceExamScore} / 100</strong></p>
                  )}
                  {app.interviewNotes && (
                    <p className="text-[11px] text-slate-500 italic">"{app.interviewNotes}"</p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Berkas Terunggah: {app.documentsUploaded.length} Dokumen</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Tim PPDB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: INVENTORY & ASSET MANAGEMENT */}
      {/* ======================================================== */}
      {activeSubTab === 'assets' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Inventaris Sarana & Prasarana Kampus (Asset Ledger)
            </h3>
            <p className="text-xs text-slate-500">
              Pencatatan aset proyektor, mikroskop lab, perangkat server IT, dan alokasi ruangan sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campusAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {asset.assetCode}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">{asset.name}</h4>
                    <p className="text-xs text-blue-600 font-medium">Lokasi: {asset.roomLocation}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {asset.condition}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                  <span>Dibeli: {asset.purchaseDate}</span>
                  <span className="font-bold text-slate-900">Nilai Aset: IDR {asset.purchaseCost.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: LIBRARY & BOOK BORROWING LEDGER */}
      {/* ======================================================== */}
      {activeSubTab === 'library' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Katalog Perpustakaan & Sirkulasi Peminjaman Buku
            </h3>
            <p className="text-xs text-slate-500">
              Pelacakan sirkulasi buku cetak, tenggat pengembalian, dan kalkulasi denda keterlambatan buku otomatis.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daftar Peminjaman Aktif:
            </h4>
            <div className="space-y-2">
              {borrowings.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h5 className="font-extrabold text-slate-900">{b.bookTitle}</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Peminjam: <strong>{b.borrowerName}</strong> ({b.borrowerRole}) • Pinjam: {b.borrowDate} • Jatuh Tempo: <strong>{b.dueDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        b.status === 'BORROWED'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {b.status === 'BORROWED' ? 'Sedang Dipinjam' : 'Telah Dikembalikan'}
                    </span>

                    {b.status === 'BORROWED' && (
                      <button
                        onClick={() => returnBorrowedBook(b.id)}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        Konfirmasi Kembali
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-3 border-t">
              Koleksi Buku Utama:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {libraryBooks.map((bk) => (
                <div key={bk.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 text-xs">
                  <p className="font-mono text-[10px] text-slate-400">ISBN: {bk.isbn}</p>
                  <h5 className="font-extrabold text-slate-900">{bk.title}</h5>
                  <p className="text-slate-500">Penulis: {bk.author}</p>
                  <div className="pt-2 flex justify-between text-[11px] text-slate-600 font-semibold border-t">
                    <span>Tersedia: <strong className="text-emerald-700">{bk.availableCopies}</strong></span>
                    <span>Total Eksemplar: {bk.totalCopies}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
