import React, { useState } from 'react';
import { v3ApiEndpointCatalog } from '../../core/v3/v3ApiEndpoints';
import type { V3ApiEndpointDefinition } from '../../types/v3';
import { Copy, Check, Search } from 'lucide-react';

export const V3ApiExplorerModule: React.FC = () => {
  const [filterPillar, setFilterPillar] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<V3ApiEndpointDefinition>(v3ApiEndpointCatalog[0]);
  const [copied, setCopied] = useState(false);

  const pillars = ['ALL', 'SIS', 'Academics', 'Assessment', 'Finance', 'Communication', 'Addons', 'WhiteLabel'];

  const filteredEndpoints = v3ApiEndpointCatalog.filter((ep) => {
    const matchPillar = filterPillar === 'ALL' || ep.pillar === filterPillar;
    const matchSearch =
      ep.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchPillar && matchSearch;
  });

  const handleCopySample = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedEndpoint.responseSample, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-600 text-white';
      case 'POST':
        return 'bg-emerald-600 text-white';
      case 'PATCH':
      case 'PUT':
        return 'bg-amber-600 text-white';
      case 'DELETE':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-5">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30">
              NFR: API-First Architecture
            </span>
            <span className="text-xs text-slate-400">• v3.0 OpenAPI 3.1 Spec</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            RESTful & GraphQL Universal Educational API Explorer
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Spesifikasi API lengkap untuk integrasi kustom sekolah enterprise (Moodle, Canvas LMS, Edmodo, Payment Aggregator, & Mesin Biometrik).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
            Base URL: https://api.buana.school/v3
          </span>
        </div>
      </div>

      {/* Main Explorer Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Endpoints Index */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari rute endpoint atau fungsionalitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Pillar Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
              {pillars.map((pil) => (
                <button
                  key={pil}
                  onClick={() => setFilterPillar(pil)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    filterPillar === pil
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pil}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredEndpoints.map((ep) => {
              const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <div
                  key={`${ep.method}-${ep.path}`}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-wider ${getMethodBadge(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800 truncate">{ep.path}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{ep.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Endpoint Specification & Sample Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-mono tracking-wider ${getMethodBadge(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <h3 className="font-mono font-extrabold text-sm sm:text-base text-slate-900">{selectedEndpoint.path}</h3>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">{selectedEndpoint.summary}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedEndpoint.description}</p>
              </div>

              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                Pillar: {selectedEndpoint.pillar}
              </span>
            </div>

            {/* Required Roles & Security */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Otorisasi RBAC Minimum yang Diperlukan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEndpoint.requiredRole.map((role) => (
                  <span key={role} className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Request Payload Sample */}
            {Boolean(selectedEndpoint.requestSample) && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Contoh Request Body (JSON):</span>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-48">
                  {JSON.stringify(selectedEndpoint.requestSample, null, 2)}
                </pre>
              </div>
            )}

            {/* Response Payload Sample */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Contoh Response Payload (HTTP 200 OK):</span>
                <button
                  onClick={handleCopySample}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin JSON'}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-64 shadow-inner">
                {JSON.stringify(selectedEndpoint.responseSample, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
