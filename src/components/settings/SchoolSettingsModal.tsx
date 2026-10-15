import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { SchoolProfile } from '../../types';
import { X, School, Download, Upload, RotateCcw, Check, Database } from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({ isOpen, onClose }) => {
  const { schoolProfile, updateSchoolProfile, exportDataAsJson, importDataFromJson, resetToDefaultData } = useApp();

  const [formData, setFormData] = useState<SchoolProfile>({ ...schoolProfile });
  const [activeTab, setActiveTab] = useState<'profile' | 'backup'>('profile');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleChange = (field: keyof SchoolProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
    setStatusMsg({ type: 'success', text: 'Profil identitas sekolah berhasil diperbarui!' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonString = exportDataAsJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `buana_school_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ type: 'success', text: 'File cadangan data (JSON) berhasil diunduh!' });
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataFromJson(content);
      if (success) {
        setStatusMsg({ type: 'success', text: 'Data sekolah berhasil dipulihkan dari cadangan JSON!' });
      } else {
        setStatusMsg({ type: 'error', text: 'Gagal memulihkan: Format file JSON tidak valid.' });
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'PERINGATAN: Apakah Anda yakin ingin mereset seluruh data kembali ke data sampel awal (SD Muhammadiyah 2 Bandung)? Seluruh data baru akan digantikan.'
      )
    ) {
      resetToDefaultData();
      setStatusMsg({ type: 'success', text: 'Data berhasil direset ke pengaturan awal!' });
      setTimeout(() => onClose(), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Identitas Sekolah & Cadangan Data
              </h3>
              <p className="text-xs text-slate-500">
                Kustomisasi identitas buku resmi dan keamanan data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div
            className={`px-5 py-2.5 text-xs font-semibold ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-slate-50/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Identitas Sekolah
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'backup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cadangkan / Pulihkan JSON
          </button>
        </div>

        {/* TAB 1: IDENTITAS SEKOLAH FORM */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Resmi Sekolah</label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => handleChange('namaSekolah', e.target.value)}
                className="w-full font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => handleChange('npsn', e.target.value)}
                  className="w-full font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">NSS</label>
                <input
                  type="text"
                  value={formData.nss}
                  onChange={(e) => handleChange('nss', e.target.value)}
                  className="w-full font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Sekolah</label>
                <input
                  type="text"
                  value={formData.kodeSekolah}
                  onChange={(e) => handleChange('kodeSekolah', e.target.value)}
                  className="w-full font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Sekolah</label>
              <input
                type="text"
                value={formData.alamatSekolah}
                onChange={(e) => handleChange('alamatSekolah', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Desa / Kelurahan</label>
                <input
                  type="text"
                  value={formData.desaKelurahan}
                  onChange={(e) => handleChange('desaKelurahan', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={formData.kecamatan}
                  onChange={(e) => handleChange('kecamatan', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Kabupaten / Kota</label>
                <input
                  type="text"
                  value={formData.kabupatenKota}
                  onChange={(e) => handleChange('kabupatenKota', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={formData.provinsi}
                  onChange={(e) => handleChange('provinsi', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tahun Pelajaran</label>
                <input
                  type="text"
                  value={formData.tahunPelajaran}
                  onChange={(e) => handleChange('tahunPelajaran', e.target.value)}
                  placeholder="Contoh: 2023 - 2024"
                  className="w-full font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={(e) => handleChange('kodePos', e.target.value)}
                  className="w-full font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Profil</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="p-5 space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-slate-900">Cadangkan Data (Offline & GitHub Pages)</h4>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Aplikasi ini berjalan 100% pada peramban web (offline-ready) dan dapat di-host di GitHub Pages. Seluruh data tersimpan otomatis di perangkat Anda. Unduh salinan JSON ini secara rutin untuk arsip atau pemindahan ke gawai/komputer lain.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900">Pulihkan dari File JSON</h4>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Pilih file cadangan `.json` yang pernah diunduh untuk memulihkan seluruh data siswa, mutasi, dan profil sekolah.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition-all active:scale-95">
                <Upload className="w-4 h-4" />
                <span>Pilih File Backup JSON</span>
                <input type="file" accept=".json" onChange={handleUploadBackup} className="hidden" />
              </label>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-700 block">Kembalikan Data Awal</span>
                <span className="text-[10px] text-slate-500">Mengisi ulang data SD Muhammadiyah 2 Bandung</span>
              </div>
              <button
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data Awal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
