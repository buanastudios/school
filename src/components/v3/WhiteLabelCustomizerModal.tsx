import React, { useState } from 'react';
import { useV3App } from '../../context/V3AppContext';
import {
  X,
  Palette,
  Globe,
  Mail,
  MessageSquare,
  ShieldCheck,
  Check,
  RotateCcw,
} from 'lucide-react';
import type { SchoolTier } from '../../types/v3';

interface WhiteLabelCustomizerModalProps {
  onClose: () => void;
}

export const WhiteLabelCustomizerModal: React.FC<WhiteLabelCustomizerModalProps> = ({ onClose }) => {
  const { branding, updateBranding, schoolTier, setSchoolTier } = useV3App();

  const [institutionName, setInstitutionName] = useState(branding.institutionName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [customDomain, setCustomDomain] = useState(branding.customDomain);
  const [primaryColor, setPrimaryColor] = useState(branding.theme.primaryColor);
  const [accentColor, setAccentColor] = useState(branding.theme.accentColor);
  const [headerTheme, setHeaderTheme] = useState(branding.theme.headerTheme);
  const [emailSignature, setEmailSignature] = useState(branding.emailSignature);
  const [smsSenderId, setSmsSenderId] = useState(branding.smsSenderId);
  const [selectedTier, setSelectedTier] = useState<SchoolTier>(schoolTier);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const presetPalettes = [
    { name: 'Royal Blue (Default)', primary: '#135bec', accent: '#10b981' },
    { name: 'Emerald Islamic Ma\'had', primary: '#059669', accent: '#d97706' },
    { name: 'Classic Burgundy Campus', primary: '#991b1b', accent: '#f59e0b' },
    { name: 'Deep Indigo Polytechnic', primary: '#4338ca', accent: '#06b6d4' },
    { name: 'Modern Dark Slate', primary: '#0f172a', accent: '#3b82f6' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      institutionName,
      tagline,
      customDomain,
      emailSignature,
      smsSenderId,
      theme: {
        ...branding.theme,
        primaryColor,
        accentColor,
        headerTheme,
      },
    });
    setSchoolTier(selectedTier);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setPrimaryColor('#135bec');
    setAccentColor('#10b981');
    setHeaderTheme('brand');
    setInstitutionName('SD Muhammadiyah 2 Bandung');
    setCustomDomain('https://portal.sdmuhammadiyah2bdg.sch.id');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">White-Labeling & Branding Engine</h3>
              <p className="text-[11px] text-slate-400">PRD Section 1: Kustomisasi Tenant, Domain, Tema & Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Branding tenant berhasil diperbarui dan diterapkan ke seluruh antarmuka!</span>
            </div>
          )}

          {/* 1. Identity & Custom Domain */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
              1. Identitas Institusi & Custom Domain
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Institusi / Sekolah</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Domain Sekolah (FQDN)</label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="https://portal.namasekolah.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline Institusi</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* 2. Educational Tier (Terminology Mapping) */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
              2. Tingkat Pendidikan (Dynamic Terminology Mapping)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'k12', label: 'K-12 (SD/SMP/SMA)', desc: 'Guru, Murid, Rapor, Kelas' },
                { id: 'higher_ed', label: 'Universitas', desc: 'Dosen, Mahasiswa, KHS, Seksi' },
                { id: 'pesantren', label: 'Pesantren', desc: 'Ustadz, Santri, Syahadah, Halaqah' },
                { id: 'vocational', label: 'SMK / Vokasi', desc: 'Instruktur, Taruna, Portofolio' },
                { id: 'adult_learning', label: 'Corporate / Adult', desc: 'Trainer, Fellow, Certificate' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTier(tier.id as SchoolTier)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTier === tier.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <p className="text-xs">{tier.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tier.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Color Palettes & Visual Branding */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
              3. Palet Warna & Visual Theme
            </h4>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-2">
              {presetPalettes.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setPrimaryColor(p.primary);
                    setAccentColor(p.accent);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium hover:bg-slate-50 transition-colors"
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary }} />
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accent }} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Warna Primer</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs font-mono border border-slate-300 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Warna Aksen</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs font-mono border border-slate-300 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gaya Header Bar</label>
                <select
                  value={headerTheme}
                  onChange={(e) => setHeaderTheme(e.target.value as 'brand' | 'light' | 'dark')}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 font-semibold"
                >
                  <option value="brand">Sesuai Warna Primer (Brand)</option>
                  <option value="light">Putih Bersih (Light)</option>
                  <option value="dark">Gelap Premium (Dark)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Gateways & Signatures */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
              4. Gateway Email & SMS Sender Signature
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Signature Email Otomatis
                  </span>
                </label>
                <input
                  type="text"
                  value={emailSignature}
                  onChange={(e) => setEmailSignature(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    SMS / WA Sender ID
                  </span>
                </label>
                <input
                  type="text"
                  value={smsSenderId}
                  onChange={(e) => setSmsSenderId(e.target.value)}
                  placeholder="SD_MUH_BDG"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Compliance Badge */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Standar Kepatuhan Data Terisolasi Aktif: <strong>FERPA, GDPR, HIPAA & COBIT 5</strong></span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Compliant
            </span>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
              >
                Simpan & Terapkan Branding
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
