import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  CampusBranch,
  WhiteLabelTenantBranding,
  SchoolTier,
  DynamicTerminology,
  V3UserRole,
  LanguageCode,
  TimezoneCode,
  V3StudentProfile,
  StaffFacultyProfile,
  ParentGuardianProfile,
  TimetableSlot,
  TimetableConflict,
  AttendanceRecord,
  CourseSyllabusItem,
  GradebookEntry,
  ExamAssessmentPlan,
  InvoiceRecord,
  StudentFeeStructure,
  OperationalExpense,
  StaffPayrollRecord,
  NoticeBoardItem,
  DirectMessage,
  AdmissionsApplicant,
  CampusAssetRecord,
  LibraryBookRecord,
  LibraryBorrowingRecord,
} from '../types/v3';
import {
  initialCampuses,
  initialBranding,
  initialV3Students,
  initialStaffProfiles,
  initialParents,
  initialTimetableSlots,
  initialAttendanceRecords,
  initialCourseSyllabus,
  initialGradebookEntries,
  initialExamPlans,
  initialFeeStructures,
  initialInvoices,
  initialExpenses,
  initialPayroll,
  initialNoticeBoard,
  initialDirectMessages,
  initialAdmissionsApplicants,
  initialCampusAssets,
  initialLibraryBooks,
  initialBorrowingRecords,
} from '../data/v3/initialV3Data';
import { TerminologyEngine } from '../core/v3/terminologyEngine';
import { detectTimetableConflicts } from '../core/v3/timetableConflictEngine';

const V3_STORAGE_PREFIX = 'buana_v3_core';

interface V3AppContextType {
  // 1. Architecture & Multi-Campus
  campuses: CampusBranch[];
  activeCampusId: string;
  setActiveCampusId: (id: string) => void;
  activeCampus: CampusBranch;

  // 2. White-Labeling & Branding
  branding: WhiteLabelTenantBranding;
  updateBranding: (updates: Partial<WhiteLabelTenantBranding>) => void;
  terminology: DynamicTerminology;
  schoolTier: SchoolTier;
  setSchoolTier: (tier: SchoolTier) => void;

  // 3. RBAC & Active Simulation Role
  activeRole: V3UserRole;
  setActiveRole: (role: V3UserRole) => void;
  hasPermission: (permission: string) => boolean;

  // 4. Localization (i18n) & Timezone
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  timezone: TimezoneCode;
  setTimezone: (tz: TimezoneCode) => void;

  // 5. Pillar 1: SIS
  students: V3StudentProfile[];
  updateStudentLifecycle: (studentId: string, status: V3StudentProfile['status']) => void;
  staff: StaffFacultyProfile[];
  parents: ParentGuardianProfile[];

  // 6. Pillar 2: Academic & Scheduling
  timetableSlots: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (slotId: string) => void;
  timetableConflicts: TimetableConflict[];
  attendanceRecords: AttendanceRecord[];
  logAttendance: (record: Omit<AttendanceRecord, 'id' | 'parentAlertDispatched'>, triggerAlert?: boolean) => void;
  courseSyllabus: CourseSyllabusItem[];
  toggleSyllabusMilestone: (courseId: string, weekNumber: number) => void;

  // 7. Pillar 3: Assessment & Grading
  gradebook: GradebookEntry[];
  examPlans: ExamAssessmentPlan[];
  addExamPlan: (plan: Omit<ExamAssessmentPlan, 'id'>) => void;

  // 8. Pillar 4: Finance & Operations
  feeStructures: StudentFeeStructure[];
  invoices: InvoiceRecord[];
  processInvoicePayment: (invoiceId: string, gateway: InvoiceRecord['paymentGatewayUsed']) => void;
  expenses: OperationalExpense[];
  payroll: StaffPayrollRecord[];
  disbursePayroll: (payrollId: string) => void;

  // 9. Pillar 5: Communication
  notices: NoticeBoardItem[];
  addNotice: (notice: Omit<NoticeBoardItem, 'id' | 'publishedAt'>) => void;
  directMessages: DirectMessage[];
  sendDirectMessage: (msg: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>) => void;

  // 10. Pillar 6: Addons
  applicants: AdmissionsApplicant[];
  updateApplicantStage: (applicantId: string, stage: AdmissionsApplicant['stage']) => void;
  campusAssets: CampusAssetRecord[];
  libraryBooks: LibraryBookRecord[];
  borrowings: LibraryBorrowingRecord[];
  returnBorrowedBook: (borrowingId: string) => void;
}

const V3AppContext = createContext<V3AppContextType | undefined>(undefined);

export const V3AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Campus & Multi-Branch
  const [campuses] = useState<CampusBranch[]>(initialCampuses);
  const [activeCampusId, setActiveCampusIdState] = useState<string>(() => {
    return localStorage.getItem(`${V3_STORAGE_PREFIX}_active_campus`) || 'campus_main';
  });

  // White-Label Branding
  const [branding, setBranding] = useState<WhiteLabelTenantBranding>(() => {
    const saved = localStorage.getItem(`${V3_STORAGE_PREFIX}_branding`);
    return saved ? JSON.parse(saved) : initialBranding;
  });

  // Dynamic Terminology
  const [schoolTier, setSchoolTierState] = useState<SchoolTier>(() => {
    return (localStorage.getItem(`${V3_STORAGE_PREFIX}_tier`) as SchoolTier) || 'k12';
  });
  const terminologyEngine = new TerminologyEngine(schoolTier, branding.customTerminology);
  const terminology = terminologyEngine.getTerms();

  // Active Role Simulator
  const [activeRole, setActiveRoleState] = useState<V3UserRole>(() => {
    return (localStorage.getItem(`${V3_STORAGE_PREFIX}_active_role`) as V3UserRole) || 'super_admin';
  });

  // Localization
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem(`${V3_STORAGE_PREFIX}_lang`) as LanguageCode) || 'id';
  });
  const [timezone, setTimezoneState] = useState<TimezoneCode>(() => {
    return (localStorage.getItem(`${V3_STORAGE_PREFIX}_tz`) as TimezoneCode) || 'Asia/Jakarta';
  });

  // Pillar 1: SIS State
  const [students, setStudents] = useState<V3StudentProfile[]>(() => {
    const saved = localStorage.getItem(`${V3_STORAGE_PREFIX}_students`);
    return saved ? JSON.parse(saved) : initialV3Students;
  });
  const [staff] = useState<StaffFacultyProfile[]>(initialStaffProfiles);
  const [parents] = useState<ParentGuardianProfile[]>(initialParents);

  // Pillar 2: Academic & Scheduling
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem(`${V3_STORAGE_PREFIX}_slots`);
    return saved ? JSON.parse(saved) : initialTimetableSlots;
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${V3_STORAGE_PREFIX}_attendance`);
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });
  const [courseSyllabus, setCourseSyllabus] = useState<CourseSyllabusItem[]>(initialCourseSyllabus);

  // Pillar 3: Assessment
  const [gradebook] = useState<GradebookEntry[]>(initialGradebookEntries);
  const [examPlans, setExamPlans] = useState<ExamAssessmentPlan[]>(initialExamPlans);

  // Pillar 4: Finance
  const [feeStructures] = useState<StudentFeeStructure[]>(initialFeeStructures);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    const saved = localStorage.getItem(`${V3_STORAGE_PREFIX}_invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });
  const [expenses] = useState<OperationalExpense[]>(initialExpenses);
  const [payroll, setPayroll] = useState<StaffPayrollRecord[]>(initialPayroll);

  // Pillar 5: Communication
  const [notices, setNotices] = useState<NoticeBoardItem[]>(initialNoticeBoard);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem(`${V3_STORAGE_PREFIX}_messages`);
    return saved ? JSON.parse(saved) : initialDirectMessages;
  });

  // Pillar 6: Addons
  const [applicants, setApplicants] = useState<AdmissionsApplicant[]>(initialAdmissionsApplicants);
  const [campusAssets] = useState<CampusAssetRecord[]>(initialCampusAssets);
  const [libraryBooks] = useState<LibraryBookRecord[]>(initialLibraryBooks);
  const [borrowings, setBorrowings] = useState<LibraryBorrowingRecord[]>(initialBorrowingRecords);

  // Calculate Conflicts
  const timetableConflicts = detectTimetableConflicts(
    timetableSlots.filter((s) => s.campusId === activeCampusId)
  );

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_active_campus`, activeCampusId);
  }, [activeCampusId]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_branding`, JSON.stringify(branding));
  }, [branding]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_tier`, schoolTier);
  }, [schoolTier]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_active_role`, activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_lang`, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_tz`, timezone);
  }, [timezone]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_slots`, JSON.stringify(timetableSlots));
  }, [timetableSlots]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_attendance`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${V3_STORAGE_PREFIX}_messages`, JSON.stringify(directMessages));
  }, [directMessages]);

  const activeCampus =
    campuses.find((c) => c.id === activeCampusId) || campuses[0];

  const updateBranding = (updates: Partial<WhiteLabelTenantBranding>) => {
    setBranding((prev) => ({ ...prev, ...updates }));
  };

  const setSchoolTier = (tier: SchoolTier) => {
    setSchoolTierState(tier);
    setBranding((prev) => ({ ...prev, activeTier: tier }));
  };

  const setActiveCampusId = (id: string) => {
    setActiveCampusIdState(id);
  };

  const setActiveRole = (role: V3UserRole) => {
    setActiveRoleState(role);
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const setTimezone = (tz: TimezoneCode) => {
    setTimezoneState(tz);
  };

  const hasPermission = (permission: string): boolean => {
    if (activeRole === 'super_admin') return true;
    if (activeRole === 'school_admin' && !permission.startsWith('governance:')) return true;
    if (activeRole === 'accountant' && (permission.startsWith('finance:') || permission === 'sis:student_read')) return true;
    if (activeRole === 'teacher' && (permission.startsWith('academics:') || permission.startsWith('assessment:') || permission.startsWith('communication:'))) return true;
    if (activeRole === 'parent' && (permission === 'assessment:gradebook_read' || permission === 'finance:payment_collect' || permission === 'communication:message_send')) return true;
    if (activeRole === 'student' && (permission === 'assessment:gradebook_read' || permission === 'academics:timetable_read')) return true;
    return false;
  };

  // Actions: Pillar 1 SIS
  const updateStudentLifecycle = (studentId: string, status: V3StudentProfile['status']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  // Actions: Pillar 2 Academics
  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      id: `slot_${Date.now()}`,
      ...slot,
    };
    setTimetableSlots((prev) => [...prev, newSlot]);
  };

  const deleteTimetableSlot = (slotId: string) => {
    setTimetableSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const logAttendance = (
    record: Omit<AttendanceRecord, 'id' | 'parentAlertDispatched'>,
    triggerAlert: boolean = true
  ) => {
    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      ...record,
      parentAlertDispatched: triggerAlert && record.status !== 'HADIR',
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
  };

  const toggleSyllabusMilestone = (courseId: string, weekNumber: number) => {
    setCourseSyllabus((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          milestones: c.milestones.map((m) =>
            m.weekNumber === weekNumber ? { ...m, completed: !m.completed } : m
          ),
        };
      })
    );
  };

  // Actions: Pillar 3 Assessment
  const addExamPlan = (plan: Omit<ExamAssessmentPlan, 'id'>) => {
    const newPlan: ExamAssessmentPlan = {
      id: `exm_${Date.now()}`,
      ...plan,
    };
    setExamPlans((prev) => [...prev, newPlan]);
  };

  // Actions: Pillar 4 Finance
  const processInvoicePayment = (
    invoiceId: string,
    gateway: InvoiceRecord['paymentGatewayUsed'] = 'MIDTRANS_VA'
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        return {
          ...inv,
          paymentStatus: 'PAID',
          amountPaid: inv.totalAmount,
          paymentGatewayUsed: gateway,
          transactionId: `TRX-${Date.now().toString().slice(-6)}`,
          paidAt: new Date().toISOString(),
        };
      })
    );
  };

  const disbursePayroll = (payrollId: string) => {
    setPayroll((prev) =>
      prev.map((p) =>
        p.id === payrollId
          ? { ...p, status: 'DISBURSED', paymentDate: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  };

  // Actions: Pillar 5 Communication
  const addNotice = (notice: Omit<NoticeBoardItem, 'id' | 'publishedAt'>) => {
    const newNotice: NoticeBoardItem = {
      id: `ntc_${Date.now()}`,
      ...notice,
      publishedAt: new Date().toISOString(),
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const sendDirectMessage = (msg: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>) => {
    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      ...msg,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setDirectMessages((prev) => [...prev, newMsg]);
  };

  // Actions: Pillar 6 Addons
  const updateApplicantStage = (applicantId: string, stage: AdmissionsApplicant['stage']) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === applicantId ? { ...app, stage } : app))
    );
  };

  const returnBorrowedBook = (borrowingId: string) => {
    setBorrowings((prev) =>
      prev.map((b) =>
        b.id === borrowingId
          ? { ...b, status: 'RETURNED', returnDate: new Date().toISOString().split('T')[0] }
          : b
      )
    );
  };

  return (
    <V3AppContext.Provider
      value={{
        campuses,
        activeCampusId,
        setActiveCampusId,
        activeCampus,
        branding,
        updateBranding,
        terminology,
        schoolTier,
        setSchoolTier,
        activeRole,
        setActiveRole,
        hasPermission,
        language,
        setLanguage,
        timezone,
        setTimezone,
        students,
        updateStudentLifecycle,
        staff,
        parents,
        timetableSlots,
        addTimetableSlot,
        deleteTimetableSlot,
        timetableConflicts,
        attendanceRecords,
        logAttendance,
        courseSyllabus,
        toggleSyllabusMilestone,
        gradebook,
        examPlans,
        addExamPlan,
        feeStructures,
        invoices,
        processInvoicePayment,
        expenses,
        payroll,
        disbursePayroll,
        notices,
        addNotice,
        directMessages,
        sendDirectMessage,
        applicants,
        updateApplicantStage,
        campusAssets,
        libraryBooks,
        borrowings,
        returnBorrowedBook,
      }}
    >
      {children}
    </V3AppContext.Provider>
  );
};

export const useV3App = (): V3AppContextType => {
  const context = useContext(V3AppContext);
  if (!context) {
    throw new Error('useV3App must be used within a V3AppProvider');
  }
  return context;
};
