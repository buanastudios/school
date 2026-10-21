import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Terminal,
  Zap,
  Globe,
  Lock,
  Layers,
} from 'lucide-react';
import {
  globalCoreGateway,
  COBIT_PERMISSIONS,
  standardSoDRules,
} from '../../core/governance';
import type {
  Tenant,
  StructuralUser,
  SiemAuditRecord,
  DualAuthRoleElevationRequest,
} from '../../core/governance';

type GovernanceTab =
  | 'multi-tenant'
  | 'sod-dual-auth'
  | 'session-killswitch'
  | 'identity-lifecycle'
  | 'siem-worm-audit'
  | 'mea01-recertification';

export const Cobit5GovernanceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GovernanceTab>('multi-tenant');

  // Governance Gateway state hooks
  const [tenants, setTenants] = useState<Tenant[]>(() =>
    globalCoreGateway.tenantEngine.getAllTenants()
  );
  const [selectedTenantId, setSelectedTenantId] = useState<string>('tenant-sd-muh-2');
  const [auditRecords, setAuditRecords] = useState<SiemAuditRecord[]>(() =>
    globalCoreGateway.auditEngine.getAuditTrail(selectedTenantId)
  );
  const [dualAuthRequests, setDualAuthRequests] = useState<DualAuthRoleElevationRequest[]>(() =>
    globalCoreGateway.sodEngine.getAllRequests(selectedTenantId)
  );
  const [activeSessions, setActiveSessions] = useState(() =>
    globalCoreGateway.sessionEngine.getActiveSessions(selectedTenantId)
  );
  const [users, setUsers] = useState<StructuralUser[]>(() =>
    globalCoreGateway.getUsers(selectedTenantId)
  );

  // Interaction feedback states
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    statusCode?: number;
    traceId?: string;
    latencyMs?: number;
    headers?: Record<string, string>;
    rawPayload?: unknown;
  } | null>(null);

  const activeTenant =
    tenants.find((t) => t.id === selectedTenantId) || tenants[0];

  // Refresh local view after actions
  const refreshState = (tenantId: string = selectedTenantId) => {
    setTenants(globalCoreGateway.tenantEngine.getAllTenants());
    setAuditRecords(globalCoreGateway.auditEngine.getAuditTrail(tenantId));
    setDualAuthRequests(globalCoreGateway.sodEngine.getAllRequests(tenantId));
    setActiveSessions(globalCoreGateway.sessionEngine.getActiveSessions(tenantId));
    setUsers(globalCoreGateway.getUsers(tenantId));
  };

  const handleSwitchTenant = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    setFeedback({
      type: 'info',
      title: 'Tenant Dialihkan',
      message: `Konteks kerja multi-tenant aktif: [${tenantId}]. Seluruh permintaan API diinjeksi header X-Tenant-ID: ${tenantId}`,
    });
    refreshState(tenantId);
  };

  // ==========================================
  // TAB 1 ACTIONS: MULTI-TENANT & ISOLATION
  // ==========================================
  const handleToggleTenantStatus = (tenantId: string) => {
    const t = tenants.find((item) => item.id === tenantId);
    if (!t) return;
    const nextStatus = t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    globalCoreGateway.tenantEngine.setTenantStatus(tenantId, nextStatus);

    globalCoreGateway.auditEngine.logEvent(
      tenantId,
      'TENANT_STATUS_MODIFIED',
      { userId: 'platform_governance_admin' },
      tenantId,
      nextStatus === 'SUSPENDED' ? 'WARNING' : 'SUCCESS',
      { previousState: { status: t.status }, newState: { status: nextStatus } },
      ['COBIT 5 APO13.01', 'COBIT 5 DSS05.04']
    );

    refreshState();
    setFeedback({
      type: nextStatus === 'SUSPENDED' ? 'warning' : 'success',
      title: `Status Tenant Diubah: ${nextStatus}`,
      message:
        nextStatus === 'SUSPENDED'
          ? `Tenant Deactivation Cascade Aktif! Seluruh token customer inbound pada [${t.name}] akan otomatis ditolak dengan HTTP 403 Forbidden.`
          : `Tenant [${t.name}] telah diaktifkan kembali. Akses downstream dipulihkan.`,
    });
  };

  const handleTestTenantApiCall = async () => {
    const res = await globalCoreGateway.dispatch({
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'X-Tenant-ID': selectedTenantId,
        'X-Client-IP': '198.51.100.42',
      },
      body: { email: 'admin@buanastudios.com', password: 'Buana2026!' },
    });

    setFeedback({
      type: res.success ? 'success' : res.status === 403 ? 'warning' : 'error',
      title: `Hasil Uji Coba Request (HTTP ${res.status})`,
      message: res.message,
      statusCode: res.status,
      traceId: res.traceId,
      latencyMs: res.latencyMs,
      rawPayload: res.data || { error: res.error },
    });
    refreshState();
  };

  // ==========================================
  // TAB 2 ACTIONS: SoD & FOUR-EYES DUAL APPROVAL
  // ==========================================
  const handleTestSodConflict = async () => {
    // Attempt to assign both Audit_Log_Viewer AND User_Account_Modifier
    const res = await globalCoreGateway.dispatch({
      path: '/api/v1/admin/users/assign-role',
      method: 'POST',
      headers: { 'X-Tenant-ID': selectedTenantId },
      body: {
        targetUserId: 'usr_wk6_001',
        requestedRole: 'auditor_and_admin',
        requestedPermissions: [
          COBIT_PERMISSIONS.AUDIT_LOG_VIEWER,
          COBIT_PERMISSIONS.USER_ACCOUNT_MODIFIER, // CONFLICT!
        ],
        creatorId: 'usr_admin_001',
        creatorName: 'Administrator Sistem',
        justification: 'Uji coba pelanggaran SoD APO13.01',
      },
    });

    setFeedback({
      type: 'error',
      title: `Pencegahan SoD Berhasil! (HTTP ${res.status} Conflict)`,
      message: res.message,
      statusCode: res.status,
      traceId: res.traceId,
      latencyMs: res.latencyMs,
    });
    refreshState();
  };

  const handleSelfApprovalAttempt = async (requestId: string) => {
    const req = dualAuthRequests.find((r) => r.id === requestId);
    if (!req) return;

    // Requester attempts to approve their own request
    const res = await globalCoreGateway.dispatch({
      path: '/api/v1/admin/users/approve-role',
      method: 'POST',
      headers: { 'X-Tenant-ID': selectedTenantId },
      body: {
        requestId,
        approverId: req.createdBy, // SAME ADMIN (VIOLATION)
        approverName: req.createdByName,
      },
    });

    setFeedback({
      type: 'error',
      title: `Prinsip Four-Eyes Ditegakkan (HTTP ${res.status} Forbidden)`,
      message: res.message,
      statusCode: res.status,
      traceId: res.traceId,
      latencyMs: res.latencyMs,
    });
    refreshState();
  };

  const handleValidSecondaryApproval = async (requestId: string) => {
    // Approve with a distinct secondary administrative account
    const res = await globalCoreGateway.dispatch({
      path: '/api/v1/admin/users/approve-role',
      method: 'POST',
      headers: { 'X-Tenant-ID': selectedTenantId },
      body: {
        requestId,
        approverId: 'usr_secondary_officer_99', // DISTINCT ACCOUNT
        approverName: 'Kepala Bagian Tata Usaha (Secondary Approver)',
      },
    });

    setFeedback({
      type: 'success',
      title: `Otorisasi Ganda Sah (HTTP ${res.status})`,
      message: res.message,
      statusCode: res.status,
      traceId: res.traceId,
      latencyMs: res.latencyMs,
      rawPayload: res.data,
    });
    refreshState();
  };

  // ==========================================
  // TAB 3 ACTIONS: SESSION KILL-SWITCH
  // ==========================================
  const handleRevokeSession = async (jti: string) => {
    const res = await globalCoreGateway.dispatch({
      path: '/api/v1/auth/revoke',
      method: 'POST',
      headers: { 'X-Tenant-ID': selectedTenantId },
      body: { jti, reason: 'ADMINISTRATOR_MANUAL_TERMINATION' },
    });

    setFeedback({
      type: 'warning',
      title: `Session Kill-Switch Dieksekusi (HTTP ${res.status})`,
      message: res.message,
      statusCode: res.status,
      traceId: res.traceId,
      latencyMs: res.latencyMs,
    });
    refreshState();
  };

  const handleUserGlobalKillswitch = (userId: string) => {
    const count = globalCoreGateway.sessionEngine.revokeAllUserSessions(
      userId,
      'SECURITY_EMERGENCY_GLOBAL_KILL_SWITCH'
    );
    globalCoreGateway.auditEngine.logEvent(
      selectedTenantId,
      'USER_GLOBAL_KILL_SWITCH_INVOKED',
      { userId: 'admin_security' },
      userId,
      'WARNING',
      { newState: { revokedSessionCount: count } },
      ['COBIT 5 DSS05.04 Global Session Kill-Switch']
    );

    setFeedback({
      type: 'warning',
      title: 'Global Kill-Switch Berhasil',
      message: `Seluruh sesi aktif (${count} perangkat) untuk pengguna [${userId}] telah dicabut seketika dari cache store.`,
    });
    refreshState();
  };

  // ==========================================
  // TAB 4 ACTIONS: IDENTITY LIFECYCLE & BRUTE FORCE
  // ==========================================
  const [simulatedFailedAttempts, setSimulatedFailedAttempts] = useState(0);

  const handleSimulateFailedLogin = async () => {
    const res = await globalCoreGateway.dispatch({
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'X-Tenant-ID': selectedTenantId,
        'X-Client-IP': '203.0.113.19', // Attacker IP
      },
      body: { email: 'syamsul.bahri@sdmuhammadiyah2bdg.sch.id', password: 'WrongPassword123!' },
    });

    setSimulatedFailedAttempts((prev) => Math.min(prev + 1, 5));
    setFeedback({
      type: res.status === 423 ? 'error' : 'warning',
      title: `Hasil Percobaan Login (HTTP ${res.status})`,
      message: res.message,
      statusCode: res.status,
      traceId: res.traceId,
      latencyMs: res.latencyMs,
      headers: res.headers,
    });
    refreshState();
  };

  const handleResetLockout = () => {
    globalCoreGateway.identityEngine.clearFailedAttempts('203.0.113.19_syamsul.bahri@sdmuhammadiyah2bdg.sch.id');
    setSimulatedFailedAttempts(0);
    setFeedback({
      type: 'info',
      title: 'Kunci Akun Direset',
      message: 'Status batas percobaan brute-force pada IP 203.0.113.19 telah dinormalisasi kembali.',
    });
    refreshState();
  };

  const handleTestUserEnumerationSafe = async () => {
    const res = await globalCoreGateway.dispatch({
      path: '/api/v1/auth/forgot-password',
      method: 'POST',
      headers: { 'X-Tenant-ID': selectedTenantId },
      body: { identifier: 'non_existent_hacker_target@unassigned-domain.com' },
    });

    setFeedback({
      type: 'info',
      title: `User Enumeration Denial Sukses (HTTP ${res.status} Accepted)`,
      message: `Pesan Seragam: "${res.message}" (Dieksekusi dengan synthetic latency ${res.latencyMs}ms untuk menggagalkan timing attack).`,
      statusCode: res.status,
      traceId: res.traceId,
      latencyMs: res.latencyMs,
    });
  };

  // ==========================================
  // TAB 5 ACTIONS: SIEM EXPORT
  // ==========================================
  const handleExportSiemJsonl = () => {
    const jsonl = globalCoreGateway.auditEngine.exportSiemJsonl(selectedTenantId);
    const blob = new Blob([jsonl], { type: 'application/x-jsonlines' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siem_audit_worm_${selectedTenantId}_${new Date().toISOString().slice(0, 10)}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSyslog = () => {
    const syslog = globalCoreGateway.auditEngine.exportSyslogRfc5424(selectedTenantId);
    const blob = new Blob([syslog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syslog_rfc5424_${selectedTenantId}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // TAB 6 ACTIONS: RECERTIFICATION (MEA01)
  // ==========================================
  const [attestationNotes, setAttestationNotes] = useState(
    'Pemeriksaan kepatuhan triwulan selesai. Seluruh hak akses telah diverifikasi sesuai matriks peran.'
  );

  const handleSignOffAttestation = async () => {
    const res = await globalCoreGateway.recertificationEngine.commitAttestationSignoff(
      selectedTenantId,
      'usr_auditor_002',
      'Drs. H. Mulyadi, M.Ak., CISA (Auditor Eksternal)',
      users,
      activeSessions.filter((s) => !s.isRevoked).length,
      attestationNotes
    );

    globalCoreGateway.auditEngine.logEvent(
      selectedTenantId,
      'IDENTITY_RECERTIFICATION_SIGNED_OFF',
      { userId: 'usr_auditor_002' },
      res.attestation_id,
      'SUCCESS',
      { newState: { attestationId: res.attestation_id, snapshotHash: res.snapshot_hash } },
      ['COBIT 5 MEA01 Periodic Access Review']
    );

    setFeedback({
      type: 'success',
      title: 'Resertifikasi Identitas Disahkan (COBIT 5 MEA01)',
      message: `Snapshot kriptografis ledger berhasil dibubuhkan tanda tangan audit. Hash: ${res.snapshot_hash.slice(0, 24)}...`,
      rawPayload: res,
    });
    refreshState();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Enterprise Governance Engine */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[11px] border border-blue-400/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                ISACA COBIT 5 Governance Core v2.0
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-400/30">
                DSS05 • APO13 • MEA01 Compliant
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[11px] border border-indigo-400/30">
                White-Label Multi-Tenancy
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Multi-Tenant White-Label Core Governance Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Fondasi keamanan, manajemen identitas, isolasi tenant logis, penegakan Segregation of Duties (SoD), dan audit WORM immutable untuk aplikasi sekolah multi-klien BUANA STUDIOS.
            </p>
          </div>

          {/* Quick Tenant Context Bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[280px] space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Tenant Aktif (X-Tenant-ID)
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  activeTenant.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}
              >
                {activeTenant.status}
              </span>
            </div>

            <select
              value={selectedTenantId}
              onChange={(e) => handleSwitchTenant(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl px-3 py-2 border border-slate-700 outline-none focus:border-blue-400"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.id})
                </option>
              ))}
            </select>

            <p className="text-[11px] text-slate-300 truncate">
              {activeTenant.branding.portalSubtitle}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 scrollbar-none border-t border-slate-800/80 mt-6">
          <button
            onClick={() => setActiveTab('multi-tenant')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'multi-tenant'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>1. Multi-Tenant Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('sod-dual-auth')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'sod-dual-auth'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>2. SoD & Dual Approval (APO13)</span>
          </button>

          <button
            onClick={() => setActiveTab('session-killswitch')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'session-killswitch'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. Session Kill-Switch (DSS05)</span>
          </button>

          <button
            onClick={() => setActiveTab('identity-lifecycle')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'identity-lifecycle'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>4. Brute-Force & Lifecycle</span>
          </button>

          <button
            onClick={() => setActiveTab('siem-worm-audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'siem-worm-audit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>5. WORM Audit & SIEM (DSS05.07)</span>
          </button>

          <button
            onClick={() => setActiveTab('mea01-recertification')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'mea01-recertification'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>6. Resertifikasi Identitas (MEA01)</span>
          </button>
        </div>
      </div>

      {/* Interactive Response Terminal / Banner */}
      {feedback && (
        <div
          className={`rounded-2xl p-4.5 border transition-all animate-in fade-in duration-200 ${
            feedback.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : feedback.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-blue-50 border-blue-200 text-blue-950'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {feedback.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
              {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {feedback.type === 'info' && <Terminal className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm">{feedback.title}</h4>
                  {feedback.statusCode && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/70 border">
                      HTTP {feedback.statusCode}
                    </span>
                  )}
                  {feedback.latencyMs !== undefined && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/70 border">
                      SLA {feedback.latencyMs}ms (Target &lt;300ms)
                    </span>
                  )}
                  {feedback.traceId && (
                    <span className="text-[10px] font-mono opacity-60">
                      Trace: {feedback.traceId}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 leading-relaxed">{feedback.message}</p>
                {Boolean(feedback.rawPayload) && (
                  <pre className="mt-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-36">
                    {JSON.stringify(feedback.rawPayload, null, 2)}
                  </pre>
                )}
              </div>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: MULTI-TENANT WHITE-LABEL ARCHITECTURE (PRD SEC 2) */}
      {/* ======================================================== */}
      {activeTab === 'multi-tenant' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Tenants Cards */}
            {tenants.map((t) => {
              const isSelected = t.id === selectedTenantId;
              return (
                <div
                  key={t.id}
                  className={`rounded-2xl p-5 border transition-all ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                      {t.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base">{t.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{t.domain}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Onboarding Mode:</span>
                      <span className="font-bold text-slate-800">{t.onboardingMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Password Min:</span>
                      <span className="font-bold text-slate-800">{t.passwordPolicy.minLength} Karakter</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Session TTL:</span>
                      <span className="font-bold text-slate-800">
                        {t.sessionPolicy.accessTokenTtlSeconds / 60}m Access / 7h Refresh
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleSwitchTenant(t.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Tenant Terpilih' : 'Pilih Tenant'}
                    </button>
                    <button
                      onClick={() => handleToggleTenantStatus(t.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        t.status === 'ACTIVE'
                          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title="Uji Tenant Deactivation Cascade (PRD Section 7.1)"
                    >
                      {t.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extensible Schema & Isolation Engine Explanation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Extensible Schema Engine & Logical Isolation (PRD Section 2)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tabel pengguna dasar hanya memuat data struktural; atribut bisnis sekolah disimpan terisolasi dalam blok JSONB.
                  </p>
                </div>
              </div>
              <button
                onClick={handleTestTenantApiCall}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Terminal className="w-4 h-4" />
                <span>Uji Request API (X-Tenant-ID: {selectedTenantId})</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                <p className="text-amber-400 font-bold mb-2">// 1. Base User Table (Structural Identity Only)</p>
                <p>id: "usr_wk6_001"</p>
                <p>tenant_id: "{selectedTenantId}" // Logical Filter</p>
                <p>email: "syamsul.bahri@sdmuhammadiyah2bdg.sch.id"</p>
                <p>password_hash: "$argon2id$v=19$m=65536,t=3,p=4$..."</p>
                <p>status: "ACTIVE"</p>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                <p className="text-emerald-400 font-bold mb-2">// 2. Localized JSONB Business Block (Extension Engine)</p>
                <p>extension_attributes: &#123;</p>
                <p className="pl-3">"full_name": "Syamsul Bahri, S.Pd.I., Gr.",</p>
                <p className="pl-3">"assigned_class": 6,</p>
                <p className="pl-3">"nip": "7035768669130423",</p>
                <p className="pl-3">"institution_role": "Wali Kelas 6"</p>
                <p>&#125;</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SoD & DUAL AUTHORIZATION CONTROL (PRD SEC 4.2)   */}
      {/* ======================================================== */}
      {activeTab === 'sod-dual-auth' && (
        <div className="space-y-5">
          {/* SoD Rules Manifest */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Segregation of Duties (SoD) Engine (COBIT 5 APO13.01)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sistem secara permanen memblokir monopoli hak akses untuk mencegah manipulasi data internal.
                  </p>
                </div>
              </div>

              {/* Live Test Conflict Button */}
              <button
                onClick={handleTestSodConflict}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Uji Pelanggaran SoD (Audit_Log_Viewer + User_Account_Modifier)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {standardSoDRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      {rule.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{rule.id}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{rule.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{rule.description}</p>
                  <div className="pt-2 text-[10px] font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                    Konflik: {rule.conflictingPermissions[0]} ⚡ {rule.conflictingPermissions[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Authorization Control Queue (Four-Eyes Principle) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Dual Authorization Control (Four-Eyes Principle Pipeline)
                </h3>
                <p className="text-xs text-slate-500">
                  Elevasi peran (role elevation) harus disetujui akun admin kedua (<code className="font-mono text-blue-600">Approved_By != Created_By</code>).
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {dualAuthRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {req.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Elevasi ke: <span className="text-blue-600">{req.requestedRole}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Target: <span className="font-semibold">{req.targetUserEmail}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Diajukan oleh: <span className="font-medium text-slate-800">{req.createdByName}</span> ({req.createdBy}) • Justifikasi: {req.justification}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSelfApprovalAttempt(req.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
                      title="Uji coba pelanggaran Four-Eyes Principle (Self-approval)"
                    >
                      Coba Self-Approve (Violate)
                    </button>
                    <button
                      onClick={() => handleValidSecondaryApproval(req.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                    >
                      Approve as 2nd Admin
                    </button>
                  </div>
                </div>
              ))}

              {dualAuthRequests.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">
                  Tidak ada permohonan elevasi peran pending saat ini.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: GLOBAL SESSION KILL-SWITCH & JTI REVOCATION      */}
      {/* ======================================================== */}
      {activeTab === 'session-killswitch' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Global Session & Invalidation Engine (Kill-Switch - PRD Section 3.1 B)
                </h3>
                <p className="text-xs text-slate-500">
                  Short-lived Access Token (15 min) + Refresh Token (7 hari). JTI dibatalkan seketika pada cache store Redis.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleUserGlobalKillswitch('usr_admin_001')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Global Kill-Switch Semua Sesi Admin</span>
            </button>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Session ID (JTI)</th>
                  <th className="py-2.5 px-3">Pengguna</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Diterbitkan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi Kill-Switch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeSessions.map((sess) => (
                  <tr key={sess.jti} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {sess.jti}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{sess.userEmail}</p>
                      <p className="text-[10px] text-slate-400">{sess.userId}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{sess.ipAddress}</td>
                    <td className="py-3 px-3 text-slate-500">{new Date(sess.issuedAt).toLocaleTimeString()}</td>
                    <td className="py-3 px-3">
                      {sess.isRevoked ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Revoked (Invalid)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active (15m TTL)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {!sess.isRevoked ? (
                        <button
                          onClick={() => handleRevokeSession(sess.jti)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                        >
                          Revoke JTI
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Dicabut</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: IDENTITY LIFECYCLE & BRUTE-FORCE RATE LIMITING   */}
      {/* ======================================================== */}
      {activeTab === 'identity-lifecycle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Brute-Force Rate Limiter Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Brute-Force Rate Limiting (DSS05.04 & Sec 7.1)
                </h3>
                <p className="text-xs text-slate-500">
                  5 kegagalan login dalam 15 menit mengunci akun ke status <code className="text-rose-600 font-bold">LOCKED</code> dengan HTTP 423.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Simulasi Percobaan Gagal:</span>
                <span className="font-bold text-slate-900">{simulatedFailedAttempts} / 5</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    simulatedFailedAttempts >= 5 ? 'bg-rose-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${(simulatedFailedAttempts / 5) * 100}%` }}
                />
              </div>

              {simulatedFailedAttempts >= 5 && (
                <div className="p-3 rounded-lg bg-rose-100 text-rose-900 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Akun terkunci (HTTP 423 Locked) selama 15 menit ke depan.</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSimulateFailedLogin}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  +1 Percobaan Password Salah
                </button>
                <button
                  onClick={handleResetLockout}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* User Enumeration Denial Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  User Enumeration Denial (PRD Section 7.1)
                </h3>
                <p className="text-xs text-slate-500">
                  Synthetic latency path delay + uniform 202 Accepted response untuk mencegah pemindaian email terdaftar.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <p className="text-slate-600">
                Ketika peretas memasukkan email yang tidak terdaftar, API sengaja menunda respons sesuai waktu query normal (~130ms) dan mengembalikan pesan seragam identik:
              </p>
              <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">
                "An email containing your recovery instructions has been dispatched if the account is registered."
              </div>

              <button
                onClick={handleTestUserEnumerationSafe}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 mt-2"
              >
                Uji Permintaan Forgot Password (Target Email Bodong)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: IMMUTABLE SIEM AUDIT PIPELINE (PRD SECTION 6.1) */}
      {/* ======================================================== */}
      {activeTab === 'siem-worm-audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Immutable WORM Audit Ledger & SIEM Pipeline (PRD Section 6)
                </h3>
                <p className="text-xs text-slate-500">
                  Write-Once Read-Many (WORM) ledger. Format JSON struktural seragam dialirkan ke Splunk / AWS CloudWatch / Datadog.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportSiemJsonl}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export SIEM (JSONL)</span>
              </button>
              <button
                onClick={handleExportSyslog}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Syslog RFC 5424</span>
              </button>
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-3 pt-2">
            {auditRecords.slice(0, 10).map((rec) => (
              <div
                key={rec.event_id}
                className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 overflow-x-auto border border-slate-800"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.action_status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : rec.action_status === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {rec.action_status}
                    </span>
                    <span className="text-white font-bold">{rec.event_type}</span>
                  </div>
                  <span>{new Date(rec.timestamp).toISOString()}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                  <p>event_id: <span className="text-amber-300">{rec.event_id}</span></p>
                  <p>trace_id: <span className="text-amber-300">{rec.trace_id}</span></p>
                  <p>tenant_id: <span className="text-blue-300">{rec.tenant_id}</span></p>
                  <p>actor.user_id: <span className="text-indigo-300">{rec.actor.user_id}</span> ({rec.actor.ip_address})</p>
                  <p>resource_affected: <span className="text-purple-300">{rec.resource_affected}</span></p>
                  <p>compliance: <span className="text-emerald-300">{rec.compliance_framework?.join(', ')}</span></p>
                </div>

                {rec.state_delta && Object.keys(rec.state_delta).length > 0 && (
                  <div className="pt-2 border-t border-slate-800 text-slate-400">
                    <p className="text-slate-500 font-bold mb-1">// state_delta:</p>
                    <pre className="text-[10px] text-emerald-400">
                      {JSON.stringify(rec.state_delta, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: IDENTITY RECERTIFICATION (COBIT 5 MEA01)         */}
      {/* ======================================================== */}
      {activeTab === 'mea01-recertification' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Automated Identity Recertification Engine (COBIT 5 MEA01)
                </h3>
                <p className="text-xs text-slate-500">
                  Menghasilkan snapshot kriptografis dari seluruh matriks izin dan peran pengguna per tenant untuk tinjauan akses berkala.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-900">
                Formulir Pengesahan Audit Akses (Attestation Sign-Off)
              </h4>
              <textarea
                value={attestationNotes}
                onChange={(e) => setAttestationNotes(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                placeholder="Catatan hasil audit berkala..."
              />

              <button
                onClick={handleSignOffAttestation}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sahkan & Bubuhkan Kriptografis Ledger (MEA01 Sign-Off)</span>
              </button>
            </div>

            {/* Attestation History Ledger */}
            <div className="pt-2">
              <h4 className="font-bold text-xs text-slate-900 mb-3">
                Riwayat Pengesahan (attestation_history Table)
              </h4>
              <div className="space-y-3">
                {globalCoreGateway.recertificationEngine
                  .getAttestationHistory(selectedTenantId)
                  .map((item) => (
                    <div
                      key={item.attestation_id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <span className="font-bold text-slate-900 font-mono">
                          {item.attestation_id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Disahkan oleh: <span className="font-bold text-slate-900">{item.attested_by_name}</span> pada {new Date(item.attested_at).toLocaleString()}
                      </p>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-600 break-all">
                        Cryptographic Snapshot Hash (SHA-256): <span className="text-blue-700 font-bold">{item.snapshot_hash}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{item.notes}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
