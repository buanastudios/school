import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  SchoolProfile,
  User,
  UserRole,
  StudentMutation,
  StudentMasterRecord,
  MonthlyRekapitulasi,
  MonthlyClassRekap,
  ExtracurricularMaster,
  MustHaveSkillMaster,
  StudentMustHaveSkillRecord,
  Extracurricular,
  AuditLogEntry,
  AuditActionType,
  AppModuleDefinition,
} from '../types';
import {
  initialSchoolProfile,
  initialUsers,
  initialMutations,
  initialStudents,
  baselineClassCounts,
  initialExtracurriculars,
  initialMustHaveSkills,
  getDefaultMustHaveSkillsForStudent,
} from '../data/initialData';
import { defaultAppModules } from '../modules/moduleRegistry';
import { initialAuditLogs } from '../data/initialAuditLogs';

interface AppContextType {
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Enterprise Authentication & Access
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; message: string; user?: User };
  register: (userData: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    assignedClass?: number;
  }) => { success: boolean; message: string; user?: User };
  logout: () => void;
  requestPasswordReset: (emailOrPhone: string) => { success: boolean; message: string; resetCode?: string };
  verifyResetCode: (code: string, newPassword?: string) => { success: boolean; message: string };

  mutations: StudentMutation[];
  addMutation: (mutation: Omit<StudentMutation, 'id' | 'createdAt' | 'noUrut'>) => void;
  updateMutation: (id: string, data: Partial<StudentMutation>) => void;
  deleteMutation: (id: string) => void;

  students: StudentMasterRecord[];
  addStudent: (student: Omit<StudentMasterRecord, 'id' | 'noUrutBukuInduk'>) => void;
  updateStudent: (id: string, data: Partial<StudentMasterRecord>) => void;
  deleteStudent: (id: string) => void;

  // Ekstrakurikuler Dinamis (Robotic, Jiujitsu, Drawing, Cooking, Futsal, Silat, dll)
  extracurriculars: ExtracurricularMaster[];
  addExtracurricular: (ekskul: Omit<ExtracurricularMaster, 'id'>) => void;
  updateExtracurricular: (id: string, data: Partial<ExtracurricularMaster>) => void;
  toggleExtracurricularStatus: (id: string) => void;
  deleteExtracurricular: (id: string) => void;

  // Kokurikuler & Must-Have Skills (Swimming, Horse Riding, Camping Skill, Rope Rappelling)
  mustHaveSkills: MustHaveSkillMaster[];
  addMustHaveSkill: (skill: Omit<MustHaveSkillMaster, 'id'>) => void;
  updateMustHaveSkill: (id: string, data: Partial<MustHaveSkillMaster>) => void;
  toggleMustHaveSkillStatus: (id: string) => void;
  deleteMustHaveSkill: (id: string) => void;

  // Student specific activity management
  updateStudentExtracurriculars: (studentId: string, ekskuls: Extracurricular[]) => void;
  updateStudentMustHaveSkill: (
    studentId: string,
    skillKode: string,
    record: Partial<StudentMustHaveSkillRecord>
  ) => void;

  // Dynamic Plug-and-Play Module Management
  modules: AppModuleDefinition[];
  toggleModule: (moduleId: string) => boolean;
  reorderModules: (orderedIds: string[]) => void;
  updateModuleRoles: (moduleId: string, allowedRoles: UserRole[]) => void;
  updateModuleDetails: (moduleId: string, data: Partial<AppModuleDefinition>) => void;

  // Enterprise Security & Audit Log System (Admin Only Access)
  auditLogs: AuditLogEntry[];
  logAuditAction: (
    action: AuditActionType,
    targetEntity: string,
    details: string,
    status?: 'SUCCESS' | 'WARNING' | 'FAILED'
  ) => void;
  clearAuditLogs: () => void;

  getMonthlyRekap: (bulan: number, tahun: number, tahunPelajaran: string) => MonthlyRekapitulasi;
  exportDataAsJson: () => string;
  importDataFromJson: (jsonStr: string) => boolean;
  resetToDefaultData: () => void;
}

const STORAGE_KEY = 'buana_school_db_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_school`);
    return saved ? JSON.parse(saved) : initialSchoolProfile;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to homeroom teacher class 1
    return initialUsers.find((u) => u.role === 'wali_kelas' && u.assignedClass === 1) || initialUsers[0];
  });

  const [mutations, setMutations] = useState<StudentMutation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_mutations`);
    return saved ? JSON.parse(saved) : initialMutations;
  });

  const [students, setStudents] = useState<StudentMasterRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasSyauqi = parsed.some((s: StudentMasterRecord) => s.id === 'std-syauqi');
          const combined = hasSyauqi ? parsed : [initialStudents[0], ...parsed];
          return combined.map((st: StudentMasterRecord) => ({
            ...st,
            mustHaveSkills:
              st.mustHaveSkills && st.mustHaveSkills.length > 0
                ? st.mustHaveSkills
                : getDefaultMustHaveSkillsForStudent(st.kelas),
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialStudents;
  });

  const [extracurriculars, setExtracurriculars] = useState<ExtracurricularMaster[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_extracurriculars`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialExtracurriculars;
  });

  const [mustHaveSkills, setMustHaveSkills] = useState<MustHaveSkillMaster[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_must_have_skills`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialMustHaveSkills;
  });

  const [modules, setModules] = useState<AppModuleDefinition[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_modules`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = defaultAppModules.map((def) => {
            const found = parsed.find((p: AppModuleDefinition) => p.id === def.id);
            return found ? { ...def, ...found } : def;
          });
          return merged.sort((a, b) => a.order - b.order);
        }
      } catch (e) {
        console.error('Failed to parse saved modules', e);
      }
    }
    return defaultAppModules;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved audit logs', e);
      }
    }
    return initialAuditLogs;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_is_authenticated`);
    return saved !== null ? saved === 'true' : true;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_is_authenticated`, String(isAuthenticated));
  }, [isAuthenticated]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_school`, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_mutations`, JSON.stringify(mutations));
  }, [mutations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_extracurriculars`, JSON.stringify(extracurriculars));
  }, [extracurriculars]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_must_have_skills`, JSON.stringify(mustHaveSkills));
  }, [mustHaveSkills]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_modules`, JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAuditAction = (
    action: AuditActionType,
    targetEntity: string,
    details: string,
    status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS'
  ) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      targetEntity,
      details,
      status,
      ipAddress: '192.168.1.10',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Buana Core Engine',
    };

    setAuditLogs((prev) => [entry, ...prev].slice(0, 500));
  };

  const toggleModule = (moduleId: string): boolean => {
    const target = modules.find((m) => m.id === moduleId);
    if (!target) return false;

    // Safety guard: Core modules cannot be disabled
    if (target.isCore && target.isEnabled) {
      logAuditAction(
        'SECURITY_ALERT',
        `Modul Inti: ${target.name}`,
        'Percobaan penonaktifan modul inti yang dilindungi ditolak oleh sistem keamanan.',
        'WARNING'
      );
      return false;
    }

    const nextState = !target.isEnabled;
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, isEnabled: nextState } : m))
    );

    logAuditAction(
      'MODULE_CONFIG_UPDATE',
      `Modul: ${target.name} (${target.code})`,
      `Status modul diubah menjadi: ${nextState ? 'AKTIF (Tersedia di Navigasi)' : 'NONAKTIF (Disembunyikan)'}.`,
      'SUCCESS'
    );
    return true;
  };

  const reorderModules = (orderedIds: string[]) => {
    setModules((prev) => {
      const reordered = orderedIds
        .map((id, index) => {
          const found = prev.find((m) => m.id === id);
          return found ? { ...found, order: index + 1 } : null;
        })
        .filter((m): m is AppModuleDefinition => m !== null);
      return reordered;
    });

    logAuditAction(
      'MENU_CONFIG_UPDATE',
      'Tata Susunan Menu & Modul',
      `Urutan navigasi modul berhasil diperbarui (${orderedIds.length} item disusun ulang).`,
      'SUCCESS'
    );
  };

  const updateModuleRoles = (moduleId: string, allowedRoles: UserRole[]) => {
    const target = modules.find((m) => m.id === moduleId);
    if (!target) return;

    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, allowedRoles } : m))
    );

    logAuditAction(
      'MODULE_CONFIG_UPDATE',
      `Otorisasi Modul: ${target.name}`,
      `Hak akses modul diperbarui untuk peran: ${allowedRoles.join(', ')}.`,
      'SUCCESS'
    );
  };

  const updateModuleDetails = (moduleId: string, data: Partial<AppModuleDefinition>) => {
    const target = modules.find((m) => m.id === moduleId);
    if (!target) return;

    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, ...data } : m))
    );

    logAuditAction(
      'MODULE_CONFIG_UPDATE',
      `Metadata Modul: ${target.name}`,
      'Pembaruan atribut dan metadata modul sistem registry.',
      'SUCCESS'
    );
  };

  const clearAuditLogs = () => {
    if (currentUser.role !== 'admin') {
      logAuditAction(
        'SECURITY_ALERT',
        'Log Audit Keamanan',
        `Upaya pembersihan log audit oleh pengguna non-administrator (${currentUser.name}) ditolak.`,
        'FAILED'
      );
      return;
    }
    const resetEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_SETTINGS_UPDATE',
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      targetEntity: 'Log Audit Keamanan',
      details: 'Seluruh riwayat audit log dibersihkan dan diarsipkan oleh Administrator Sistem.',
      status: 'SUCCESS',
      ipAddress: '192.168.1.10',
    };
    setAuditLogs([resetEntry]);
  };

  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...profile }));
    logAuditAction(
      'SYSTEM_SETTINGS_UPDATE',
      'Profil Institusi Sekolah',
      'Pembaruan identitas lembaga, nomor statistik (NPSN/NSS), atau tanda tangan pimpinan.',
      'SUCCESS'
    );
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    logAuditAction(
      'AUTH_SWITCH_USER',
      `Pengguna: ${user.name} (${user.role})`,
      `Sesi kerja aktif dialihkan ke akun ${user.name}.`,
      'SUCCESS'
    );
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      status: userData.status || 'active',
    };
    setUsers((prev) => [...prev, newUser]);
    logAuditAction(
      'USER_CREATE',
      `Pengguna: ${newUser.name}`,
      `Pendaftaran akun pengguna baru dengan peran: ${newUser.role}${newUser.assignedClass ? ` (Kelas ${newUser.assignedClass})` : ''}.`,
      'SUCCESS'
    );
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    const existing = users.find((u) => u.id === id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...userData } : u)));
    if (currentUser.id === id) {
      setCurrentUserState((prev) => ({ ...prev, ...userData }));
    }
    logAuditAction(
      'USER_UPDATE',
      `Pengguna: ${existing?.name || id}`,
      'Pembaruan data profil pengguna, kredensial, atau status akses.',
      'SUCCESS'
    );
  };

  const deleteUser = (id: string) => {
    const existing = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser.id === id) {
      const remaining = users.filter((u) => u.id !== id);
      if (remaining.length > 0) setCurrentUserState(remaining[0]);
    }
    logAuditAction(
      'USER_DELETE',
      `Pengguna: ${existing?.name || id}`,
      'Penghapusan akun pengguna dari basis data sistem.',
      'WARNING'
    );
  };

  const login = (email: string, _password?: string) => {
    const trimmed = email.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === trimmed) ||
        (u.nip && u.nip.toLowerCase() === trimmed) ||
        (trimmed === 'admin' && u.role === 'admin')
    );

    if (!found) {
      logAuditAction(
        'SECURITY_ALERT',
        'Autentikasi Pengguna',
        `Percobaan login gagal untuk akun/identitas: "${email}". Akun tidak ditemukan.`,
        'FAILED'
      );
      return {
        success: false,
        message: 'Email atau NIP tidak ditemukan dalam sistem sekolah. Silakan periksa kembali atau gunakan akun demo.',
      };
    }

    if (found.status === 'inactive') {
      logAuditAction(
        'SECURITY_ALERT',
        `Pengguna: ${found.name}`,
        `Percobaan login ke akun berstatus NONAKTIF (${found.email}) diblokir oleh sistem.`,
        'FAILED'
      );
      return {
        success: false,
        message: 'Akun Anda berstatus nonaktif. Silakan hubungi Administrator Sistem Buana School.',
      };
    }

    // Success
    const updatedUser: User = { ...found, lastLogin: new Date().toISOString() };
    setCurrentUserState(updatedUser);
    setIsAuthenticated(true);
    setUsers((prev) => prev.map((u) => (u.id === found.id ? updatedUser : u)));

    logAuditAction(
      'AUTH_LOGIN',
      `Pengguna: ${found.name} (${found.role})`,
      `Pengguna berhasil masuk ke sistem melalui portal autentikasi.`,
      'SUCCESS'
    );

    return {
      success: true,
      message: `Selamat datang kembali, ${found.name}!`,
      user: updatedUser,
    };
  };

  const register = (userData: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    assignedClass?: number;
  }) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email && u.email.toLowerCase() === trimmedEmail);

    if (existing) {
      return {
        success: false,
        message: 'Email tersebut sudah terdaftar dalam sistem Buana School. Silakan gunakan opsi Login.',
      };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      phone: userData.phone?.trim(),
      role: userData.role,
      assignedClass: userData.assignedClass,
      status: 'active',
      lastLogin: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserState(newUser);
    setIsAuthenticated(true);

    logAuditAction(
      'AUTH_REGISTER',
      `Pengguna Baru: ${newUser.name} (${newUser.role})`,
      `Pendaftaran mandiri akun baru berhasil via form Sign Up.`,
      'SUCCESS'
    );

    return {
      success: true,
      message: 'Akun berhasil didaftarkan dan Anda langsung masuk ke sistem!',
      user: newUser,
    };
  };

  const logout = () => {
    logAuditAction(
      'AUTH_LOGOUT',
      `Pengguna: ${currentUser.name} (${currentUser.role})`,
      `Pengguna telah keluar dari sesi kerja sistem.`,
      'SUCCESS'
    );
    setIsAuthenticated(false);
  };

  const requestPasswordReset = (emailOrPhone: string) => {
    const query = emailOrPhone.trim().toLowerCase();
    const match = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === query) ||
        (u.phone && u.phone.replace(/\D/g, '') === query.replace(/\D/g, ''))
    );

    const targetLabel = match ? `${match.name} (${match.email || match.phone})` : query;
    logAuditAction(
      'AUTH_PASSWORD_RESET',
      `Permintaan Reset Sandi: ${targetLabel}`,
      `Kode verifikasi pemulihan akses telah diterbitkan (Simulasi OTP: 2026).`,
      'SUCCESS'
    );

    return {
      success: true,
      message: `Kode verifikasi 4-digit telah disiapkan untuk akun terkait. Gunakan kode 2026 untuk verifikasi.`,
      resetCode: '2026',
    };
  };

  const verifyResetCode = (code: string, _newPassword?: string) => {
    if (code.trim() === '2026') {
      logAuditAction(
        'AUTH_PASSWORD_RESET',
        `Pengguna: ${currentUser.name}`,
        'Verifikasi kode OTP pemulihan kata sandi berhasil diselesaikan.',
        'SUCCESS'
      );
      return {
        success: true,
        message: 'Kata sandi berhasil diperbarui! Silakan masuk kembali dengan kata sandi baru Anda.',
      };
    }
    return {
      success: false,
      message: 'Kode verifikasi yang Anda masukkan tidak cocok. Coba kode demo: 2026.',
    };
  };

  const addMutation = (data: Omit<StudentMutation, 'id' | 'createdAt' | 'noUrut'>) => {
    const existingInMonth = mutations.filter(
      (m) => m.type === data.type && m.bulan === data.bulan && m.tahun === data.tahun
    );
    const nextNo = existingInMonth.length + 1;

    const newMutation: StudentMutation = {
      ...data,
      id: `mut-${Date.now()}`,
      noUrut: nextNo,
      createdAt: new Date().toISOString(),
      createdById: currentUser.id,
    };

    setMutations((prev) => [...prev, newMutation]);
    logAuditAction(
      'MUTATION_CREATE',
      `Mutasi ${data.type.toUpperCase()}: ${data.namaSiswa}`,
      `Pencatatan mutasi siswa kelas ${data.kelas} periode bulan ${data.bulan}/${data.tahun}.`,
      'SUCCESS'
    );
  };

  const updateMutation = (id: string, data: Partial<StudentMutation>) => {
    setMutations((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    logAuditAction(
      'MUTATION_UPDATE',
      `Mutasi ID: ${id}`,
      'Pembaruan rincian data mutasi siswa.',
      'SUCCESS'
    );
  };

  const deleteMutation = (id: string) => {
    const existing = mutations.find((m) => m.id === id);
    setMutations((prev) => prev.filter((m) => m.id !== id));
    logAuditAction(
      'MUTATION_DELETE',
      `Mutasi: ${existing?.namaSiswa || id}`,
      'Penghapusan rekaman mutasi siswa.',
      'WARNING'
    );
  };

  const addStudent = (studentData: Omit<StudentMasterRecord, 'id' | 'noUrutBukuInduk'>) => {
    const nextNo = students.length + 1;
    const newStudent: StudentMasterRecord = {
      ...studentData,
      id: `std-${Date.now()}`,
      noUrutBukuInduk: nextNo,
    };
    setStudents((prev) => [...prev, newStudent]);
    logAuditAction(
      'STUDENT_CREATE',
      `Buku Induk: ${newStudent.namaLengkap} (NIS: ${newStudent.noInduk})`,
      `Registrasi nomor urut buku induk #${nextNo} untuk siswa baru kelas ${newStudent.kelas}.`,
      'SUCCESS'
    );
  };

  const updateStudent = (id: string, data: Partial<StudentMasterRecord>) => {
    const existing = students.find((s) => s.id === id);
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    logAuditAction(
      'STUDENT_UPDATE',
      `Buku Induk: ${existing?.namaLengkap || id}`,
      'Pembaruan biodata peserta didik atau capaian lembar buku induk.',
      'SUCCESS'
    );
  };

  const deleteStudent = (id: string) => {
    const existing = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    logAuditAction(
      'STUDENT_DELETE',
      `Buku Induk: ${existing?.namaLengkap || id}`,
      'Penghapusan arsip data siswa dari buku induk sekolah.',
      'WARNING'
    );
  };

  const getMonthlyRekap = (bulan: number, tahun: number, tahunPelajaran: string): MonthlyRekapitulasi => {
    const classItems: MonthlyClassRekap[] = [];

    let totalAwalL = 0;
    let totalAwalP = 0;
    let totalMasukL = 0;
    let totalMasukP = 0;
    let totalKeluarL = 0;
    let totalKeluarP = 0;

    for (let c = 1; c <= 6; c++) {
      const baseline = baselineClassCounts.find((b) => b.kelas === c) || { l: 0, p: 0 };

      // Perhitungan mutasi bulanan per rombel kelas sesuai standar register kesiswaan
      const masukInMonth = mutations.filter(
        (m) => m.type === 'masuk' && m.kelas === c && m.bulan === bulan && m.tahun === tahun
      );
      const keluarInMonth = mutations.filter(
        (m) => m.type === 'keluar' && m.kelas === c && m.bulan === bulan && m.tahun === tahun
      );

      const masukL = masukInMonth.filter((m) => m.jenisKelamin === 'L').length;
      const masukP = masukInMonth.filter((m) => m.jenisKelamin === 'P').length;
      const masukTotal = masukL + masukP;

      const keluarL = keluarInMonth.filter((m) => m.jenisKelamin === 'L').length;
      const keluarP = keluarInMonth.filter((m) => m.jenisKelamin === 'P').length;
      const keluarTotal = keluarL + keluarP;

      // Base awal count:
      const awalL = baseline.l;
      const awalP = baseline.p;
      const awalTotal = awalL + awalP;

      const akhirL = Math.max(0, awalL + masukL - keluarL);
      const akhirP = Math.max(0, awalP + masukP - keluarP);
      const akhirTotal = akhirL + akhirP;

      totalAwalL += awalL;
      totalAwalP += awalP;
      totalMasukL += masukL;
      totalMasukP += masukP;
      totalKeluarL += keluarL;
      totalKeluarP += keluarP;

      classItems.push({
        kelas: c,
        awalL,
        awalP,
        awalTotal,
        masukL,
        masukP,
        masukTotal,
        keluarL,
        keluarP,
        keluarTotal,
        akhirL,
        akhirP,
        akhirTotal,
      });
    }

    const totalAwal = totalAwalL + totalAwalP;
    const totalMasuk = totalMasukL + totalMasukP;
    const totalKeluar = totalKeluarL + totalKeluarP;
    const totalAkhirL = totalAwalL + totalMasukL - totalKeluarL;
    const totalAkhirP = totalAwalP + totalMasukP - totalKeluarP;
    const totalAkhir = totalAkhirL + totalAkhirP;

    return {
      bulan,
      tahun,
      tahunPelajaran,
      items: classItems,
      totalAwalL,
      totalAwalP,
      totalAwal,
      totalMasukL,
      totalMasukP,
      totalMasuk,
      totalKeluarL,
      totalKeluarP,
      totalKeluar,
      totalAkhirL,
      totalAkhirP,
      totalAkhir,
    };
  };

  const addExtracurricular = (ekskul: Omit<ExtracurricularMaster, 'id'>) => {
    const newEkskul: ExtracurricularMaster = {
      ...ekskul,
      id: `ek-${Date.now()}`,
    };
    setExtracurriculars((prev) => [newEkskul, ...prev]);
  };

  const updateExtracurricular = (id: string, data: Partial<ExtracurricularMaster>) => {
    setExtracurriculars((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  };

  const toggleExtracurricularStatus = (id: string) => {
    setExtracurriculars((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === 'aktif' ? 'nonaktif' : 'aktif' } : e
      )
    );
  };

  const deleteExtracurricular = (id: string) => {
    setExtracurriculars((prev) => prev.filter((e) => e.id !== id));
  };

  const addMustHaveSkill = (skill: Omit<MustHaveSkillMaster, 'id'>) => {
    const newSkill: MustHaveSkillMaster = {
      ...skill,
      id: `mhs-${Date.now()}`,
    };
    setMustHaveSkills((prev) => [...prev, newSkill]);
  };

  const updateMustHaveSkill = (id: string, data: Partial<MustHaveSkillMaster>) => {
    setMustHaveSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const toggleMustHaveSkillStatus = (id: string) => {
    setMustHaveSkills((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'aktif' ? 'nonaktif' : 'aktif' } : s
      )
    );
  };

  const deleteMustHaveSkill = (id: string) => {
    setMustHaveSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStudentExtracurriculars = (studentId: string, ekskuls: Extracurricular[]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, extracurriculars: ekskuls } : s))
    );
  };

  const updateStudentMustHaveSkill = (
    studentId: string,
    skillKode: string,
    record: Partial<StudentMustHaveSkillRecord>
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentSkills = s.mustHaveSkills || getDefaultMustHaveSkillsForStudent(s.kelas);
        const updatedSkills = currentSkills.map((sk) =>
          sk.kode === skillKode ? { ...sk, ...record } : sk
        );
        return { ...s, mustHaveSkills: updatedSkills };
      })
    );
  };

  const exportDataAsJson = (): string => {
    const payload = {
      version: '2.5',
      system: 'BUANA STUDIOS • Enterprise School Platform',
      exportedAt: new Date().toISOString(),
      exportedBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
      },
      schoolProfile,
      users,
      mutations,
      students,
      extracurriculars,
      mustHaveSkills,
      modules,
      auditLogs,
    };
    logAuditAction(
      'DATA_EXPORT',
      'Basis Data Sekolah Lengkap',
      'Ekspor berkas cadangan JSON institusi untuk arsip dan keamanan.',
      'SUCCESS'
    );
    return JSON.stringify(payload, null, 2);
  };

  const importDataFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.schoolProfile) setSchoolProfile(data.schoolProfile);
      if (data.users && Array.isArray(data.users)) setUsers(data.users);
      if (data.mutations && Array.isArray(data.mutations)) setMutations(data.mutations);
      if (data.students && Array.isArray(data.students)) setStudents(data.students);
      if (data.extracurriculars && Array.isArray(data.extracurriculars)) setExtracurriculars(data.extracurriculars);
      if (data.mustHaveSkills && Array.isArray(data.mustHaveSkills)) setMustHaveSkills(data.mustHaveSkills);
      if (data.modules && Array.isArray(data.modules)) setModules(data.modules);
      if (data.auditLogs && Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);

      logAuditAction(
        'DATA_IMPORT',
        'Pemulihan Basis Data',
        'Impor berkas JSON berhasil memulihkan data sekolah, siswa, mutasi, dan konfigurasi modul.',
        'SUCCESS'
      );
      return true;
    } catch (e) {
      console.error('Import failed', e);
      logAuditAction(
        'DATA_IMPORT',
        'Pemulihan Basis Data',
        'Kegagalan pemulihan berkas cadangan JSON: format data tidak valid.',
        'FAILED'
      );
      return false;
    }
  };

  const resetToDefaultData = () => {
    setSchoolProfile(initialSchoolProfile);
    setUsers(initialUsers);
    setCurrentUserState(initialUsers.find((u) => u.assignedClass === 1) || initialUsers[0]);
    setMutations(initialMutations);
    setStudents(initialStudents);
    setExtracurriculars(initialExtracurriculars);
    setMustHaveSkills(initialMustHaveSkills);
    setModules(defaultAppModules);
    setAuditLogs(initialAuditLogs);

    localStorage.removeItem(`${STORAGE_KEY}_school`);
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    localStorage.removeItem(`${STORAGE_KEY}_mutations`);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_extracurriculars`);
    localStorage.removeItem(`${STORAGE_KEY}_must_have_skills`);
    localStorage.removeItem(`${STORAGE_KEY}_modules`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);

    logAuditAction(
      'SYSTEM_SETTINGS_UPDATE',
      'Basis Data Sistem',
      'Sistem dikembalikan ke kondisi bawaan standar institusi (Factory Reset).',
      'WARNING'
    );
  };

  return (
    <AppContext.Provider
      value={{
        schoolProfile,
        updateSchoolProfile,
        users,
        currentUser,
        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        isAuthenticated,
        login,
        register,
        logout,
        requestPasswordReset,
        verifyResetCode,
        mutations,
        addMutation,
        updateMutation,
        deleteMutation,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        extracurriculars,
        addExtracurricular,
        updateExtracurricular,
        toggleExtracurricularStatus,
        deleteExtracurricular,
        mustHaveSkills,
        addMustHaveSkill,
        updateMustHaveSkill,
        toggleMustHaveSkillStatus,
        deleteMustHaveSkill,
        updateStudentExtracurriculars,
        updateStudentMustHaveSkill,
        modules,
        toggleModule,
        reorderModules,
        updateModuleRoles,
        updateModuleDetails,
        auditLogs,
        logAuditAction,
        clearAuditLogs,
        getMonthlyRekap,
        exportDataAsJson,
        importDataFromJson,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
