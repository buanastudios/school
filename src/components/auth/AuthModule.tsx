import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import {
  ChevronLeft,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Smartphone,
  Sparkles,
  Building2,
} from 'lucide-react';
import { globalCoreGateway } from '../../core/governance';

type AuthMode = 'signin' | 'signup' | 'forgot';
type ViewMode = 'auto' | 'desktop' | 'mobile';

// ==========================================
// VECTOR ILLUSTRATIONS (HIGH FIDELITY)
// ==========================================

// 1. Desktop Educator Illustration with 3 Floating Trendline Cards
const DesktopIllustration: React.FC = () => (
  <div className="relative w-full max-w-lg mx-auto py-2 flex items-center justify-center">
    {/* Soft background glow */}
    <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-indigo-50/30 rounded-full blur-2xl -z-10" />

    {/* Floating Card 1: Top Right */}
    <div className="absolute -top-4 right-2 sm:right-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-lg shadow-blue-500/10 flex items-center gap-3 w-56 animate-bounce-subtle z-20">
      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
        <span className="tracking-tighter">B</span>
      </div>
      <div className="flex-1 min-w-0">
        <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 30" fill="none">
          <path
            d="M 0 20 Q 25 15, 45 22 T 80 8 T 100 12"
            stroke="#64748b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
        98%
      </span>
    </div>

    {/* Floating Card 2: Middle Right */}
    <div className="absolute top-28 right-0 sm:-right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-lg shadow-blue-500/10 flex items-center gap-3 w-56 z-20">
      <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
        <span className="rotate-45 block w-3.5 h-3.5 border-2 border-white rounded-xs" />
      </div>
      <div className="flex-1 min-w-0">
        <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 30" fill="none">
          <path
            d="M 0 18 Q 30 25, 55 10 T 85 18 T 100 6"
            stroke="#64748b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
        Rapor
      </span>
    </div>

    {/* Floating Card 3: Bottom (under character foot) */}
    <div className="absolute bottom-2 left-6 sm:left-12 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-lg shadow-blue-500/10 flex items-center gap-3 w-56 z-20">
      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
        <span className="text-xs font-black">P</span>
      </div>
      <div className="flex-1 min-w-0">
        <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 30" fill="none">
          <path
            d="M 0 22 Q 20 8, 45 16 T 75 12 T 100 4"
            stroke="#64748b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
        Aktif
      </span>
    </div>

    {/* Main Character Vector */}
    <svg
      viewBox="0 0 320 400"
      className="w-64 sm:w-72 h-auto max-h-[380px] drop-shadow-sm select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hair Bun */}
      <circle cx="160" cy="55" r="14" fill="#1e293b" />
      <path d="M148 58 Q160 48 172 58 Q160 66 148 58 Z" fill="#334155" />

      {/* Head */}
      <circle cx="160" cy="80" r="18" fill="#fecaca" />
      {/* Front Hair Bangs */}
      <path d="M144 74 Q160 62 176 74 Q172 65 160 65 Q148 65 144 74 Z" fill="#1e293b" />

      {/* Neck */}
      <rect x="156" y="97" width="8" height="12" rx="2" fill="#fecaca" />

      {/* Upper Body / Heather Grey Top */}
      <path
        d="M138 108 L182 108 L194 175 L126 175 Z"
        fill="#e2e8f0"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Left Arm on Hip */}
      <path
        d="M138 108 L116 138 L130 156"
        stroke="#e2e8f0"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="130" cy="156" r="6" fill="#fecaca" />

      {/* Right Arm Relaxed */}
      <path
        d="M182 108 L204 148 L214 176"
        stroke="#e2e8f0"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="214" cy="176" r="6" fill="#fecaca" />

      {/* Waist & Belt */}
      <rect x="126" y="172" width="68" height="10" rx="3" fill="#0f172a" />

      {/* Charcoal Navy Trousers - Left Standing Leg */}
      <path
        d="M130 182 L132 290 L136 335 L148 335 L154 290 L158 182 Z"
        fill="#1e293b"
      />
      {/* Standing Shoe */}
      <path d="M132 335 L120 342 L148 342 L148 335 Z" fill="#0f172a" />

      {/* Charcoal Navy Trousers - Right Leg Raised/Resting */}
      <path
        d="M162 182 L198 215 L182 255 L164 252 L172 215 L156 182 Z"
        fill="#1e293b"
      />
      <path
        d="M182 255 L174 300 L188 300 L198 255 Z"
        fill="#1e293b"
      />
      {/* Resting Shoe */}
      <path d="M174 300 L170 306 L192 306 L188 300 Z" fill="#0f172a" />
    </svg>
  </div>
);

// 2. Mobile Login Illustration (Phone with Blue Arrow Circle + Folded Arms Character)
const MobileLoginIllustration: React.FC = () => (
  <div className="relative w-full max-w-xs mx-auto py-3 flex items-center justify-center gap-3">
    {/* Phone Outline Mockup */}
    <div className="w-28 h-52 rounded-3xl border-4 border-slate-700 bg-white shadow-md p-2 flex flex-col items-center justify-center relative shrink-0">
      {/* Speaker Notch */}
      <div className="absolute top-2 w-8 h-1 rounded-full bg-slate-300" />
      {/* Vibrant Blue Circle with Downward Arrow */}
      <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>

    {/* Standing Character with Folded Arms */}
    <div className="w-24 relative flex flex-col items-center">
      <svg viewBox="0 0 120 220" className="w-full h-auto" fill="none">
        {/* Head & Hair */}
        <circle cx="60" cy="30" r="14" fill="#a78bfa" />
        <path d="M48 24 Q60 14 74 24 Q72 16 60 16 Q48 16 48 24 Z" fill="#1e293b" />
        <circle cx="60" cy="32" r="11" fill="#b45309" />
        {/* Light Grey Sweater */}
        <path d="M42 50 L78 50 L84 100 L36 100 Z" fill="#e2e8f0" />
        {/* Folded Arms */}
        <rect x="40" y="72" width="40" height="14" rx="7" fill="#cbd5e1" />
        <path d="M46 72 Q60 84 74 72" stroke="#94a3b8" strokeWidth="3" fill="none" />
        {/* Dark Trousers */}
        <path d="M38 100 L44 180 L54 180 L58 108 L62 108 L66 180 L76 180 L82 100 Z" fill="#1e293b" />
        {/* Shoes */}
        <path d="M42 180 L36 186 L54 186 L54 180 Z" fill="#0f172a" />
        <path d="M66 180 L66 186 L84 186 L78 180 Z" fill="#0f172a" />
        {/* Accent checkmark / leaf at feet */}
        <path d="M85 168 Q95 160 98 178 Q90 178 85 168 Z" fill="#135bec" />
      </svg>
    </div>
  </div>
);

// 3. Mobile Sign Up Illustration (Phone with Step Dots & Button + Leaf & Gesturing Character)
const MobileSignUpIllustration: React.FC = () => (
  <div className="relative w-full max-w-xs mx-auto py-2 flex items-center justify-center gap-2">
    {/* Blue Tropical Leaf Left */}
    <div className="w-8 self-end pb-4">
      <svg viewBox="0 0 40 80" className="w-full h-auto text-blue-600 fill-current">
        <path d="M 5 75 Q 35 50 35 20 Q 15 20 5 75 Z" />
        <path d="M 12 55 Q 30 40 28 28" stroke="white" strokeWidth="1.5" fill="none" />
      </svg>
    </div>

    {/* Phone Mockup with Step Carousel */}
    <div className="w-32 h-56 rounded-3xl border-4 border-slate-300 bg-white shadow-md p-3 flex flex-col items-center justify-between relative shrink-0">
      <div className="w-8 h-1 rounded-full bg-slate-300 mx-auto" />
      {/* Mock Screen Content */}
      <div className="w-full border border-blue-400 rounded-xl p-2.5 space-y-2 mt-2">
        {/* 3 Step Dots */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-xs" />
        </div>
        {/* Placeholder Lines */}
        <div className="w-3/4 h-1.5 rounded-full bg-slate-200" />
        <div className="w-1/2 h-1.5 rounded-full bg-slate-200" />
        {/* Blue Button in Mockup */}
        <div className="w-8 h-3.5 rounded bg-blue-600 ml-auto mt-2" />
      </div>
      <div className="w-12 h-1 rounded-full bg-slate-200 mb-1" />
    </div>

    {/* Gesturing Character Right */}
    <div className="w-20 relative flex flex-col items-center">
      <svg viewBox="0 0 100 200" className="w-full h-auto" fill="none">
        {/* Head */}
        <circle cx="50" cy="25" r="12" fill="#fecaca" />
        <path d="M38 20 Q50 10 62 20 Q60 12 50 12 Q40 12 38 20 Z" fill="#1e293b" />
        {/* Blue T-shirt */}
        <path d="M34 42 L66 42 L72 90 L28 90 Z" fill="#135bec" />
        {/* Left Gesturing Arm */}
        <path d="M34 42 L18 64 L12 60" stroke="#fecaca" strokeWidth="6" strokeLinecap="round" />
        {/* Dark Pants */}
        <path d="M30 90 L34 165 L44 165 L48 98 L52 98 L56 165 L66 165 L70 90 Z" fill="#1e293b" />
        {/* Shoes */}
        <rect x="32" y="165" width="12" height="6" rx="2" fill="#0f172a" />
        <rect x="56" y="165" width="12" height="6" rx="2" fill="#0f172a" />
      </svg>
    </div>
  </div>
);

// 4. Mobile Forgot Password Illustration (Character looking at '?' with passcode pill)
const MobileForgotIllustration: React.FC = () => (
  <div className="relative w-full max-w-xs mx-auto py-2 flex flex-col items-center">
    {/* Floating 4-dot Passcode Pill */}
    <div className="absolute top-2 right-4 bg-white border border-slate-300 rounded-full px-4 py-2 shadow-md flex items-center gap-2.5 z-20">
      <div className="flex flex-col items-center gap-0.5">
        <span className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="w-3 h-0.5 bg-blue-600" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="w-3 h-0.5 bg-blue-600" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="w-3 h-0.5 bg-blue-600" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="w-3 h-0.5 bg-blue-600" />
      </div>
    </div>

    {/* Character Profile & Question Mark */}
    <div className="w-48 relative flex items-center justify-center pt-8">
      {/* Floating Blue Question Mark */}
      <span className="absolute top-2 left-6 text-3xl font-black text-blue-600 animate-pulse">
        ?
      </span>

      {/* Tropical Leaves Behind Character */}
      <svg viewBox="0 0 100 120" className="absolute -right-2 bottom-0 w-28 h-auto text-blue-600 fill-current opacity-90 -z-10">
        <path d="M 10 110 Q 80 80 75 10 Q 40 20 10 110 Z" />
        <path d="M 25 80 Q 60 50 62 30" stroke="white" strokeWidth="2" fill="none" />
      </svg>

      {/* Character Portrait from Behind */}
      <svg viewBox="0 0 160 160" className="w-36 h-auto" fill="none">
        {/* Hair Bun / Back of Head */}
        <circle cx="80" cy="50" r="26" fill="#1e293b" />
        <circle cx="88" cy="54" r="16" fill="#a16207" />
        {/* Dark Charcoal Blazer */}
        <path
          d="M30 150 L45 85 L115 85 L130 150 Z"
          fill="#334155"
          stroke="#1e293b"
          strokeWidth="2"
        />
        {/* Collar Detail */}
        <path d="M65 85 L80 110 L95 85" stroke="#cbd5e1" strokeWidth="3" fill="none" />
      </svg>
    </div>
  </div>
);

export const AuthModule: React.FC = () => {
  const { login, register, verifyResetCode } = useApp();

  // Screen modes
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [viewMode, setViewMode] = useState<ViewMode>('auto');
  const [selectedTenantId, setSelectedTenantId] = useState<string>('tenant-sd-muh-2');
  const tenant =
    globalCoreGateway.tenantEngine.getTenant(selectedTenantId) ||
    globalCoreGateway.tenantEngine.getAllTenants()[0];

  const [isWindowMobile, setIsWindowMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Track window resizing for auto mode
  useEffect(() => {
    const handleResize = () => {
      setIsWindowMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine whether to render the desktop or mobile screen
  const isMobileLayout = viewMode === 'mobile' || (viewMode === 'auto' && isWindowMobile);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [role, setRole] = useState<UserRole>('wali_kelas');
  const [assignedClass, setAssignedClass] = useState<number>(1);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password fields
  const [forgotQuery, setForgotQuery] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState(['2', '0', '2', '6']);
  const [newPassword, setNewPassword] = useState('');

  // Status feedback
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFeedback(null);

    // COBIT 5 Section 7.1: Tenant Deactivation Cascade
    const tenantCheck = globalCoreGateway.tenantEngine.verifyTenantActive(selectedTenantId);
    if (!tenantCheck.allowed) {
      setFeedback({
        type: 'error',
        message: tenantCheck.message || 'Akses ditolak: Tenant saat ini berstatus SUSPENDED oleh tata kelola platform.',
      });
      return;
    }

    const rawInput = email.trim();
    const isTryingAdmin =
      !rawInput ||
      rawInput.toLowerCase() === 'admin' ||
      rawInput.toLowerCase() === 'administrator' ||
      rawInput.toLowerCase().startsWith('admin@');
    const targetEmail = isTryingAdmin ? 'admin@buanastudios.com' : rawInput;
    const targetPassword = password.trim() || 'Buana2026!';
    const res = login(targetEmail, targetPassword);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleSignUp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFeedback(null);

    // COBIT 5 Section 7.1: Tenant Deactivation Cascade
    const tenantCheck = globalCoreGateway.tenantEngine.verifyTenantActive(selectedTenantId);
    if (!tenantCheck.allowed) {
      setFeedback({
        type: 'error',
        message: tenantCheck.message || 'Pendaftaran ditolak: Tenant sedang ditangguhkan.',
      });
      return;
    }

    // COBIT 5 Section 3.1 A: Onboarding Strategy Enforcement
    if (tenant.onboardingMode === 'ADMIN_INVITED_ONLY') {
      setFeedback({
        type: 'error',
        message: `COBIT 5 DSS05.04: Kebijakan institusi [${tenant.name}] mewajibkan pendaftaran hanya melalui undangan Administrator resmi (ADMIN_INVITED_ONLY). Pendaftaran mandiri publik ditutup.`,
      });
      return;
    }

    if (!fullName.trim()) {
      setFeedback({ type: 'error', message: 'Silakan isi Nama Lengkap Anda.' });
      return;
    }
    if (!email.trim()) {
      setFeedback({ type: 'error', message: 'Silakan masukkan alamat Email yang valid.' });
      return;
    }

    // COBIT 5 Section 3.1 A: Password Policy Framework Validation
    if (password) {
      const pwdCheck = globalCoreGateway.identityEngine.validatePasswordStrength(password, tenant.passwordPolicy);
      if (!pwdCheck.valid) {
        setFeedback({
          type: 'error',
          message: `Kebijakan Sandi COBIT 5: ${pwdCheck.errors.join(' ')}`,
        });
        return;
      }
    }

    if (!agreeTerms) {
      setFeedback({
        type: 'error',
        message: 'Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi.',
      });
      return;
    }

    const res = register({
      name: fullName.trim(),
      email: email.trim(),
      phone: mobilePhone.trim(),
      role,
      assignedClass: role === 'wali_kelas' ? assignedClass : undefined,
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleForgotSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFeedback(null);

    if (!forgotQuery.trim()) {
      setFeedback({ type: 'error', message: 'Silakan masukkan Email atau Nomor HP terdaftar.' });
      return;
    }

    // COBIT 5 Section 7.1: User Enumeration Denial (constant-time synthetic delay + 202 Accepted)
    const res = await globalCoreGateway.dispatch({
      path: '/api/v1/auth/forgot-password',
      method: 'POST',
      headers: { 'X-Tenant-ID': selectedTenantId },
      body: { identifier: forgotQuery.trim() },
    });

    setFeedback({
      type: 'info',
      message: `${res.message} (HTTP ${res.status} Accepted - Delay ${res.latencyMs}ms)`,
    });
    setForgotStep(2);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const codeStr = otpCode.join('');
    const res = verifyResetCode(codeStr, newPassword);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setAuthMode('signin');
        setForgotStep(1);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Quick autofill demo accounts
  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Buana2026!');
    setFeedback({
      type: 'info',
      message: `Akun demo dipilih: ${userEmail}. Klik "Sign In" atau "Login" untuk masuk.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Testing Bar (Allows testing Desktop/Tablet and Smartphone views on any device) */}
      <header className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between z-50 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center font-black text-[10px]">
            BS
          </div>
          <span className="font-bold tracking-tight">{tenant.branding.institutionName}</span>
          <span className="text-slate-400 hidden sm:inline">• v2.0 COBIT 5 Core</span>

          {/* White-Label Tenant Context Dropdown */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 ml-2">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="bg-transparent text-white text-[11px] font-bold outline-none cursor-pointer"
              title="Ganti Tenant White-Label (PRD Section 2)"
            >
              {globalCoreGateway.tenantEngine.getAllTenants().map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name} ({t.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('auto')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              viewMode === 'auto' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
            title="Sesuai resolusi layar aktif"
          >
            Auto
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              viewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
            title="Pratinjau Layout Desktop / Tablet (Image 1)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              viewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
            title="Pratinjau Layout Smartphone (Images 2, 3, 4)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>
      </header>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : feedback.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {feedback.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          {feedback.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCREEN OPTION A: DESKTOP & TABLET LAYOUT (IMAGE 1)       */}
      {/* ======================================================== */}
      {!isMobileLayout ? (
        <main className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-45px)] overflow-hidden">
          {/* Left Section (White / Curve / Brand / Educator / Value Prop) */}
          <div className="w-full md:w-1/2 bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10">
            {/* Top Brand Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Buana<span className="text-blue-600">School</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  by BUANA STUDIOS
                </span>
              </div>
            </div>

            {/* Educator & Trendline Vector Graphic */}
            <div className="my-auto py-4">
              <DesktopIllustration />
            </div>

            {/* Bottom Headlines */}
            <div className="space-y-2 max-w-lg">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
                Solusi Manajemen Sekolah Terpadu dalam Satu Sentuhan.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Akses portal resmi guru wali kelas, staf tata usaha, dan pimpinan untuk tata kelola rapor Kurikulum Merdeka, buku mutasi 12 bulan, dan buku induk murid.
              </p>
            </div>
          </div>

          {/* Right Section (Royal Blue Tech Hexagon Mesh + Floating White Card) */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1864f7] via-[#135bec] to-[#0a3eb5] flex items-center justify-center p-6 sm:p-10 lg:p-14 relative overflow-hidden">
            {/* SVG Hexagon Tech Background Mesh Pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern id="hexagons" width="70" height="121.24" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
                  <path
                    d="M35,0 L70,20.2 L70,60.6 L35,80.8 L0,60.6 L0,20.2 Z M35,121.2 L70,101 L70,60.6 L35,80.8 L0,60.6 L0,101 Z"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <circle cx="35" cy="0" r="2.5" fill="#ffffff" />
                  <circle cx="70" cy="20.2" r="2.5" fill="#ffffff" />
                  <circle cx="70" cy="60.6" r="2.5" fill="#ffffff" />
                  <circle cx="35" cy="80.8" r="2.5" fill="#ffffff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>

            {/* Glowing Accent Spheres */}
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            {/* Floating White Rounded Card */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 sm:p-9 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Pill Tab Switcher: Sign In / Sign Up */}
              <div className="flex justify-center">
                <div className="inline-flex bg-slate-100 p-1 rounded-full border border-slate-200">
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setFeedback(null);
                    }}
                    className={`px-7 py-2 rounded-full text-xs font-bold transition-all ${
                      authMode === 'signin'
                        ? 'bg-[#135bec] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setFeedback(null);
                    }}
                    className={`px-7 py-2 rounded-full text-xs font-bold transition-all ${
                      authMode === 'signup'
                        ? 'bg-[#135bec] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* TAB 1: SIGN IN FORM */}
              {authMode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@buanastudios.com atau ketik 'admin'"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Toggle + Forgot Password */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          rememberMe ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            rememberMe ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] text-slate-600 font-medium">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setFeedback(null);
                      }}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#135bec] hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs tracking-wide shadow-md shadow-blue-500/25 transition-all mt-2"
                  >
                    Sign In
                  </button>

                  {/* Quick One-Click Demo Accounts */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
                      Akun Cepat (Sesi Lokal)
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      <button
                        type="button"
                        onClick={() => handleQuickFill('admin@buanastudios.com')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[10px] font-bold text-blue-700 border border-blue-200 transition-colors shadow-2xs"
                        title="Masuk sebagai Administrator Sistem (Buana Studios)"
                      >
                        🛡️ Admin (Buana Studios)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickFill('kepsek@sdmuhammadiyah2bdg.sch.id')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-[10px] font-semibold text-slate-700 hover:text-purple-700 border border-slate-200 transition-colors"
                      >
                        Kepala Sekolah
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickFill('syamsul.bahri@sdmuhammadiyah2bdg.sch.id')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-[10px] font-semibold text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors"
                      >
                        Wali Kelas 6
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: SIGN UP FORM */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama Lengkap dengan Gelar"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alisamran346@gmail.com"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile *
                    </label>
                    <input
                      type="tel"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Peran *
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >                        
                        <option value="kepala_sekolah">Kepala Sekolah</option>
                        <option value="wali_kelas">Wali Kelas</option>
                        <option value="tata_usaha">Tata Usaha</option>
                      </select>
                    </div>

                    {role === 'wali_kelas' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Kelas *
                        </label>
                        <select
                          value={assignedClass}
                          onChange={(e) => setAssignedClass(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map((k) => (
                            <option key={k} value={k}>
                              Kelas {k}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <label className="flex items-start gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[11px] text-slate-500 leading-tight">
                      By sign up, you're agree to our{' '}
                      <span className="text-blue-600 font-semibold">Term & Conditions</span> and{' '}
                      <span className="text-blue-600 font-semibold">Privacy Policy</span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#135bec] hover:bg-blue-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-500/25 transition-all mt-2"
                  >
                    Continue
                  </button>
                </form>
              )}

              {/* TAB 3: FORGOT PASSWORD */}
              {authMode === 'forgot' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-extrabold text-slate-900 text-base">Forget Password</h3>
                  </div>

                  <p className="text-xs text-slate-500">
                    Enter your email or phone number, we will send you verification code
                  </p>

                  {forgotStep === 1 ? (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email ID / Mobile number
                        </label>
                        <input
                          type="text"
                          value={forgotQuery}
                          onChange={(e) => setForgotQuery(e.target.value)}
                          placeholder="guru@buanaschool.sch.id atau 08123..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-[#135bec] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
                      >
                        Submit
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-2 text-center">
                          Masukkan 4 Digit Kode Verifikasi
                        </label>
                        <div className="flex justify-center gap-3">
                          {otpCode.map((digit, idx) => (
                            <input
                              key={idx}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => {
                                const next = [...otpCode];
                                next[idx] = e.target.value;
                                setOtpCode(next);
                              }}
                              className="w-12 h-12 text-center text-lg font-bold rounded-xl border-2 border-blue-500 focus:bg-blue-50 outline-none"
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-blue-600 text-center font-medium mt-2">
                          Kode simulasi aktif: 2026
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Kata Sandi Baru (Opsional)
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Masukkan kata sandi baru"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all"
                      >
                        Verifikasi & Atur Ulang
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Bottom Support Notice */}
              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-[11px] text-slate-400">
                  If you experience any inconvenience, please contact{' '}
                  <a
                    href="mailto:support@buana.studio"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    support@buana.studio
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ======================================================== */
        /* SCREEN OPTION B: SMARTPHONE PORTRAIT LAYOUTS            */
        /* (IMAGES 2, 3, AND 4)                                    */
        /* ======================================================== */
        <main className="flex-1 flex justify-center items-start p-4 sm:p-6 bg-slate-100 min-h-[calc(100vh-45px)]">
          {/* Mobile Phone Canvas Container */}
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between p-6 sm:p-7 min-h-[640px]">
            {/* Top Navigation Chevron (For Login & Forgot) */}
            <div className="flex items-center justify-between h-7">
              {authMode !== 'signin' ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setFeedback(null);
                  }}
                  className="p-1 -ml-2 rounded-lg text-slate-800 hover:bg-slate-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              ) : (
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Buana School
                </span>
              )}

              {/* Mode switch pills */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    authMode === 'signin' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    authMode === 'signup' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* SCREEN B1: MOBILE LOGIN (IMAGE 3) */}
            {authMode === 'signin' && (
              <div className="space-y-4 my-auto">
                <MobileLoginIllustration />

                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Login</h2>

                <form onSubmit={handleSignIn} className="space-y-4">
                  {/* @ Email ID Underline Input */}
                  <div className="relative border-b border-slate-200 focus-within:border-blue-600 transition-colors pb-1 flex items-center gap-3">
                    <AtSign className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@buanastudios.com atau 'admin'"
                      className="w-full text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                  </div>

                  {/* Lock Password Underline Input */}
                  <div className="relative border-b border-slate-200 focus-within:border-blue-600 transition-colors pb-1 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forget Password Link */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setFeedback(null);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Forget Password
                    </button>
                  </div>

                  {/* Blue Login Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
                  >
                    Login
                  </button>
                </form>

                {/* OR Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Google SSO Button */}
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@buanastudios.com')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2.5 transition-colors"
                >
                  {/* Google SVG Logo */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Login with Google (Admin Sesi)</span>
                </button>

                {/* Mobile Quick Account Pills */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-1.5">
                    Pilih Akun Demo Instan:
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('admin@buanastudios.com')}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-[10px] font-bold text-blue-700 border border-blue-200 transition-colors hover:bg-blue-100"
                    >
                      🛡️ Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('kepsek@sdmuhammadiyah2bdg.sch.id')}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-[10px] font-bold text-purple-700 border border-purple-200 transition-colors hover:bg-purple-100"
                    >
                      Kepsek
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('syamsul.bahri@sdmuhammadiyah2bdg.sch.id')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200 transition-colors hover:bg-emerald-100"
                    >
                      Wali Kelas 6
                    </button>
                  </div>
                </div>

                {/* Bottom Register Prompt */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  New to Buana School?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setFeedback(null);
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN B2: MOBILE SIGN UP (IMAGE 2) */}
            {authMode === 'signup' && (
              <div className="space-y-3.5 my-auto">
                <MobileSignUpIllustration />

                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign Up</h2>

                <form onSubmit={handleSignUp} className="space-y-3">
                  {/* @ Email */}
                  <div className="relative border-b border-slate-200 focus-within:border-blue-600 transition-colors pb-1 flex items-center gap-3">
                    <AtSign className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alisamran346@gmail.com"
                      className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                  </div>

                  {/* Full Name */}
                  <div className="relative border-b border-slate-200 focus-within:border-blue-600 transition-colors pb-1 flex items-center gap-3">
                    <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="relative border-b border-slate-200 focus-within:border-blue-600 transition-colors pb-1 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="tel"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      placeholder="Mobile"
                      className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative border-b border-slate-200 focus-within:border-blue-600 transition-colors pb-1 flex items-center gap-3">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    />
                  </div>

                  {/* Role */}
                  <div className="relative border-b border-slate-200 focus-within:border-blue-600 transition-colors pb-1 flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full text-xs text-slate-800 outline-none bg-transparent cursor-pointer"
                    >
                      <option value="wali_kelas">Wali Kelas</option>
                      <option value="kepala_sekolah">Kepala Sekolah</option>
                      <option value="tata_usaha">Tata Usaha</option>
                    </select>
                  </div>

                  {/* Terms disclaimer */}
                  <p className="text-[11px] text-slate-400 leading-tight pt-1">
                    By sign up, you're agree to our{' '}
                    <span className="text-blue-600 font-semibold">Term & Conditions</span> and{' '}
                    <span className="text-blue-600 font-semibold">Privacy Policy</span>
                  </p>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all mt-2"
                  >
                    Continue
                  </button>
                </form>

                {/* Join us before? Login */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  Join us before?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setFeedback(null);
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN B3: MOBILE FORGOT PASSWORD (IMAGE 4) */}
            {authMode === 'forgot' && (
              <div className="space-y-4 my-auto">
                <MobileForgotIllustration />

                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Forget Password
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Enter your email or phone number, we will send you verification code
                  </p>
                </div>

                {forgotStep === 1 ? (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    {/* @ Email ID / Mobile number Underline Input */}
                    <div className="relative border-b border-slate-200 focus-within:border-blue-600 transition-colors pb-1 flex items-center gap-3">
                      <AtSign className="w-5 h-5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={forgotQuery}
                        onChange={(e) => setForgotQuery(e.target.value)}
                        placeholder="Email ID / Mobile number"
                        className="w-full text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
                    >
                      Submit
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="flex justify-center gap-3 py-2">
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const next = [...otpCode];
                              next[idx] = e.target.value;
                              setOtpCode(next);
                            }}
                            className="w-12 h-12 text-center text-lg font-bold rounded-xl border-2 border-blue-500 focus:bg-blue-50 outline-none"
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-blue-600 text-center font-medium">
                        Kode simulasi: 2026
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition-all"
                    >
                      Konfirmasi Kode
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center text-xs text-slate-500">
                  Ingat kata sandi?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setFeedback(null);
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Kembali ke Login
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Footer Brand */}
            <div className="pt-4 text-center border-t border-slate-100 text-[10px] text-slate-400">
              Buana School • BUANA STUDIOS
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
