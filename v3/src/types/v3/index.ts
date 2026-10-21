/**
 * Universal School Management Enterprise Suite (v3.0.0)
 * Core Architecture, Multi-Tenancy White-Label Foundation & 6 Universal Pillars
 */

// ========================================================
// 1. CORE ARCHITECTURE & MULTI-TENANCY (WHITE-LABEL FOUNDATION)
// ========================================================

export type SchoolTier = 'k12' | 'higher_ed' | 'pesantren' | 'vocational' | 'adult_learning';

export interface DynamicTerminology {
  tier: SchoolTier;
  labelGrade: string;      // "Grade" | "Year" | "Tingkat/Kelas" | "Semester" | "Mustawa"
  labelTeacher: string;    // "Teacher" | "Professor" | "Instructor" | "Guru" | "Ustadz/Ustadzah"
  labelStudent: string;    // "Student" | "Pupil" | "Scholar" | "Mahasiswa" | "Santri"
  labelClass: string;      // "Class" | "Cohort" | "Section" | "Rombel" | "Halaqah"
  labelReportCard: string; // "Report Card" | "Transcript" | "Buku Rapor" | "KHS" | "Syahadah"
  labelHeadmaster: string; // "Principal" | "Dean" | "Kepala Sekolah" | "Rektor" | "Mudir"
}

export interface WhiteLabelTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerTheme: 'light' | 'dark' | 'brand';
  borderRadius: 'rounded-none' | 'rounded-md' | 'rounded-xl' | 'rounded-2xl';
  fontFamily: 'Inter' | 'Plus Jakarta Sans' | 'Poppins' | 'Geist';
}

export interface WhiteLabelTenantBranding {
  tenantId: string;
  institutionName: string;
  tagline: string;
  customDomain: string; // e.g. "https://portal.sdmuhammadiyah2bdg.sch.id"
  logoUrl: string;
  faviconUrl: string;
  theme: WhiteLabelTheme;
  emailSignature: string;
  smsSenderId: string;
  activeTier: SchoolTier;
  customTerminology?: Partial<DynamicTerminology>;
  complianceStandards: ('FERPA' | 'GDPR' | 'HIPAA' | 'ISO27001' | 'COBIT_5')[];
}

export interface CampusBranch {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  principalName: string;
  totalStudents: number;
  totalStaff: number;
  isActive: boolean;
  isMainCampus: boolean;
}

// 6 Granular Universal RBAC Roles
export type V3UserRole =
  | 'super_admin'   // Corporate umbrella master admin
  | 'school_admin'  // Campus principal / ops director
  | 'teacher'       // Faculty / instructor
  | 'student'       // Pupil / scholar
  | 'parent'        // Guardian
  | 'accountant';   // Finance officer

export type V3Permission =
  | 'sis:student_read'
  | 'sis:student_write'
  | 'sis:student_lifecycle'
  | 'sis:staff_manage'
  | 'sis:guardian_map'
  | 'academics:timetable_edit'
  | 'academics:attendance_log'
  | 'academics:syllabus_manage'
  | 'assessment:gradebook_edit'
  | 'assessment:exam_plan'
  | 'assessment:report_generate'
  | 'finance:fee_structure'
  | 'finance:invoice_issue'
  | 'finance:payment_collect'
  | 'finance:payroll_process'
  | 'communication:broadcast'
  | 'communication:message_send'
  | 'addons:admissions_manage'
  | 'addons:asset_library_manage'
  | 'governance:whitelabel_edit'
  | 'governance:multicampus_manage';

// ========================================================
// 2. PILLAR 1: SIS (IDENTITY & USER MANAGEMENT)
// ========================================================

export type StudentLifecycleStatus =
  | 'APPLICANT'
  | 'ENROLLED'
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'SUSPENDED'
  | 'GRADUATED'
  | 'ALUMNUS';

export interface MedicalRecord {
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN';
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  emergencyNotes: string;
  doctorContact?: string;
  lastPhysicalExamDate?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: 'Ayah' | 'Ibu' | 'Wali' | 'Kakek/Nenek' | 'Paman/Bibi' | 'Lainnya';
  phone: string;
  isLegalGuardian: boolean;
  priorityOrder: number;
}

export interface StudentDocumentAttachment {
  id: string;
  title: string;
  documentType: 'BIRTH_CERTIFICATE' | 'FAMILY_CARD' | 'IMMUNIZATION' | 'PREVIOUS_TRANSCRIPT' | 'PHOTO';
  fileUrl: string;
  uploadedAt: string;
  verified: boolean;
}

export interface V3StudentProfile {
  id: string;
  campusId: string;
  nisn: string;
  nis: string;
  fullName: string;
  nickname?: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  gradeLevel: number; // 1 - 12 (or semester)
  classCohort: string; // e.g. "6-A", "Cohort 2026"
  status: StudentLifecycleStatus;
  guardianIds: string[]; // Linked to Parent accounts
  medical: MedicalRecord;
  emergencyContacts: EmergencyContact[];
  documents: StudentDocumentAttachment[];
  avatarUrl?: string;
  enrollmentDate: string;
  graduationDate?: string;
}

export interface StaffFacultyProfile {
  id: string;
  campusId: string;
  nip: string;
  nuptk?: string;
  fullName: string;
  email: string;
  phone: string;
  department: string; // e.g. "Matematika & IPA", "Bahasa", "Agama Islam"
  qualifications: {
    degree: string;
    institution: string;
    graduationYear: number;
  }[];
  contractType: 'PERMANENT' | 'FULL_TIME' | 'CONTRACT' | 'ADJUNCT_HONORER';
  assignedTeachingHoursPerWeek: number;
  assignedCohorts: string[];
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED';
  avatarUrl?: string;
}

export interface ParentGuardianProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  address: string;
  linkedStudentIds: string[]; // multi-student mapping
  isPrimaryBillingContact: boolean;
  relationship: string;
}

// ========================================================
// 3. PILLAR 2: ACADEMIC & SCHEDULING ENGINE
// ========================================================

export interface TimetableSlot {
  id: string;
  campusId: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 = Senin
  startTime: string; // "07:30"
  endTime: string;   // "09:00"
  cohortName: string; // e.g. "Kelas 6A"
  subjectCode: string; // e.g. "MTH-6"
  subjectName: string;
  teacherId: string;
  teacherName: string;
  roomName: string; // e.g. "Lab IPA 1", "R. 302"
}

export interface TimetableConflict {
  slotA: TimetableSlot;
  slotB: TimetableSlot;
  conflictType: 'TEACHER_COLLISION' | 'ROOM_COLLISION';
  description: string;
}

export type AttendanceStatus = 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA' | 'TERLAMBAT';

export interface AttendanceRecord {
  id: string;
  campusId: string;
  date: string; // "YYYY-MM-DD"
  studentId: string;
  studentName: string;
  cohortName: string;
  subjectCode?: string; // Optional for subject-wise
  status: AttendanceStatus;
  checkInTime?: string;
  notes?: string;
  parentAlertDispatched: boolean;
}

export interface CourseSyllabusItem {
  id: string;
  code: string;
  name: string;
  creditsOrHours: number;
  type: 'MANDATORY' | 'ELECTIVE';
  category: 'CORE' | 'APPLIED' | 'RELIGIOUS' | 'LOCAL_CONTENT';
  targetGradeLevel: number;
  milestones: {
    weekNumber: number;
    topic: string;
    learningGoal: string;
    completed: boolean;
  }[];
}

// ========================================================
// 4. PILLAR 3: ASSESSMENT & GRADING ENGINE
// ========================================================

export type GradingScaleType = 'GPA_4' | 'LETTER_GRADE' | 'PERCENTAGE_100' | 'COMPETENCY_MERDEKA';

export interface GradebookEntry {
  id: string;
  studentId: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  academicYear: string;
  term: string; // e.g. "Semester 1 (Ganjil)"
  assignmentsScore: number; // 0 - 100
  midtermExamScore: number; // 0 - 100
  finalExamScore: number;   // 0 - 100
  finalPercentage: number;  // Weighted total
  finalGradeLetter: string; // A, B, C, D, F
  gpaPoint: number;         // 4.0, 3.5, 3.0, etc.
  competencySummary: string; // Descriptive feedback
}

export interface ExamAssessmentPlan {
  id: string;
  campusId: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  examDate: string;
  durationMinutes: number;
  weightCourseworkPercent: number; // e.g. 30%
  weightMidtermPercent: number;    // e.g. 30%
  weightFinalPercent: number;      // e.g. 40%
  isPublished: boolean;
}

// ========================================================
// 5. PILLAR 4: FINANCE & OPERATIONS
// ========================================================

export type FeeCategory = 'TUITION_SPP' | 'TRANSPORT' | 'LABORATORY' | 'LIBRARY' | 'DEVELOPMENT_BUILDING' | 'ACTIVITY';
export type PaymentPlanType = 'MONTHLY' | 'SEMESTER' | 'ANNUAL' | 'INSTALLMENT';
export type InvoiceStatus = 'UNPAID' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID';

export interface StudentFeeStructure {
  id: string;
  category: FeeCategory;
  name: string;
  amount: number;
  paymentPlan: PaymentPlanType;
  dueDayOfMonth: number;
  applicableGrades: number[];
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  campusId: string;
  studentId: string;
  studentName: string;
  guardianName: string;
  category: FeeCategory;
  description: string;
  baseAmount: number;
  lateFeePenalty: number;
  totalAmount: number;
  amountPaid: number;
  currency: 'IDR' | 'USD' | 'SGD' | 'SAR';
  issueDate: string;
  dueDate: string;
  paymentStatus: InvoiceStatus;
  paymentGatewayUsed?: 'STRIPE' | 'MIDTRANS_VA' | 'PAYPAL' | 'BANK_TRANSFER_MANUAL';
  transactionId?: string;
  paidAt?: string;
}

export interface OperationalExpense {
  id: string;
  campusId: string;
  date: string;
  category: 'UTILITIES' | 'MAINTENANCE' | 'LAB_SUPPLIES' | 'CURRICULUM_MATERIALS' | 'VENDOR_SERVICES';
  vendorName: string;
  description: string;
  amount: number;
  paymentMethod: string;
  approvedBy: string;
}

export interface StaffPayrollRecord {
  id: string;
  campusId: string;
  periodMonthYear: string; // "Oktober 2026"
  staffId: string;
  staffName: string;
  contractType: string;
  baseSalary: number;
  teachingHourIncentive: number;
  attendanceDeduction: number;
  netSalary: number;
  status: 'PENDING_APPROVAL' | 'PROCESSED' | 'DISBURSED';
  paymentDate?: string;
}

// ========================================================
// 6. PILLAR 5: COMMUNICATION & COLLABORATION
// ========================================================

export interface NoticeBoardItem {
  id: string;
  campusId: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  targetAudience: 'ALL' | 'TEACHERS' | 'PARENTS' | 'STUDENTS';
  priority: 'NORMAL' | 'HIGH' | 'EMERGENCY';
  channels: ('IN_APP' | 'EMAIL' | 'SMS_WA')[];
}

export interface DirectMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: V3UserRole;
  recipientId: string;
  recipientName: string;
  recipientRole: V3UserRole;
  content: string;
  timestamp: string;
  isRead: boolean;
  relatedStudentName?: string;
}

// ========================================================
// 7. PILLAR 6: CORE ADD-ONS (ADMISSIONS & ASSETS)
// ========================================================

export type AdmissionsPipelineStage =
  | 'INQUIRY'
  | 'APPLIED'
  | 'REVIEW_ACADEMIC'
  | 'INTERVIEW'
  | 'OFFER_ACCEPTED'
  | 'ENROLLED'
  | 'REJECTED';

export interface AdmissionsApplicant {
  id: string;
  applicationNumber: string;
  campusId: string;
  targetGrade: number;
  applicantFullName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  previousSchool: string;
  stage: AdmissionsPipelineStage;
  submittedAt: string;
  documentsUploaded: {
    title: string;
    fileUrl: string;
    verified: boolean;
  }[];
  interviewNotes?: string;
  entranceExamScore?: number;
}

export interface CampusAssetRecord {
  id: string;
  campusId: string;
  assetCode: string;
  name: string;
  category: 'ELECTRONIC_IT' | 'LAB_EQUIPMENT' | 'FURNITURE' | 'VEHICLE';
  roomLocation: string;
  purchaseDate: string;
  purchaseCost: number;
  condition: 'EXCELLENT' | 'GOOD' | 'NEEDS_REPAIR' | 'DAMAGED';
}

export interface LibraryBookRecord {
  id: string;
  campusId: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
}

export interface LibraryBorrowingRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerId: string;
  borrowerName: string;
  borrowerRole: 'student' | 'teacher';
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  overdueFineAmount: number;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

// ========================================================
// 8. NON-FUNCTIONAL REQUIREMENTS (NFR)
// ========================================================

export type LanguageCode = 'id' | 'en';
export type TimezoneCode = 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura' | 'UTC' | 'America/New_York' | 'Europe/London';

export interface V3ApiEndpointDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  pillar: 'SIS' | 'Academics' | 'Assessment' | 'Finance' | 'Communication' | 'Addons' | 'WhiteLabel';
  summary: string;
  description: string;
  requiredRole: V3UserRole[];
  requestSample?: unknown;
  responseSample?: unknown;
}
