/**
 * ISACA COBIT 5 (DSS05, APO13, MEA01) Governance & Multi-Tenant White-Label Core Types
 * BUANA STUDIOS Enterprise Architecture Engine v2.0
 */

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
export type OnboardingMode = 'OPEN_REGISTRATION' | 'ADMIN_INVITED_ONLY' | 'IDP_FEDERATION';
export type UserLifecycleStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'PENDING_VERIFICATION';

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  customRegex?: string;
}

export interface SessionPolicy {
  accessTokenTtlSeconds: number; // default: 900 (15 minutes)
  refreshTokenTtlSeconds: number; // default: 604800 (7 days)
  inactivityThresholdDays: number; // default: 90 days
}

export interface WhiteLabelBranding {
  institutionName: string;
  institutionalTitle: string;
  npsn?: string;
  nss?: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  supportEmail: string;
  portalSubtitle: string;
}

export interface Tenant {
  id: string; // e.g. 'tenant-sd-muh-2', 'tenant-buana-demo'
  code: string;
  name: string;
  domain: string;
  status: TenantStatus;
  onboardingMode: OnboardingMode;
  passwordPolicy: PasswordPolicy;
  sessionPolicy: SessionPolicy;
  branding: WhiteLabelBranding;
  customSchemaExtensions: Record<string, string>; // name -> type descriptor
  createdAt: string;
  updatedAt: string;
}

/**
 * Structural Identity Record (PRD Section 2)
 * Base User table contains ONLY structural identity data.
 * Custom business attributes handled via localized JSONB extension block.
 */
export interface EncryptedFieldData {
  ciphertext: string;
  iv: string;
  tag: string;
  algorithm: 'AES-256-GCM';
}

export interface StructuralUser {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  status: UserLifecycleStatus;
  roles: string[];
  permissions: string[];
  failedLoginAttempts: number;
  lockedUntil?: string; // ISO 8601 when account will unlock (423 Locked)
  lastLoginAt?: string;
  lastTokenIssuedAt?: string;
  
  // Localized JSONB business attributes block (Section 2)
  extensionAttributes: {
    fullName: string;
    institutionRole: string; // e.g. 'Wali Kelas', 'Kepala Sekolah', 'Tata Usaha', 'Auditor'
    assignedClass?: number;
    nip?: string;
    nuptk?: string;
    mobilePhone?: string;
    nationalId?: string; // NIK
    department?: string;
    loyaltyTier?: string;
    signatureRef?: string;
    [key: string]: unknown;
  };

  // Application-Layer AES-256-GCM Encrypted PII Fields (Section 5.1)
  piiEncrypted?: {
    mobilePhone?: EncryptedFieldData;
    nationalId?: EncryptedFieldData;
    nip?: EncryptedFieldData;
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * Logical Access Control & Segregation of Duties (SoD - Section 4)
 */
export const COBIT_PERMISSIONS = {
  // Conflicting pair strictly validated by APO13.01
  AUDIT_LOG_VIEWER: 'Audit_Log_Viewer',
  USER_ACCOUNT_MODIFIER: 'User_Account_Modifier',
  
  // Additional core permissions
  ROLE_ADMINISTRATOR: 'Role_Administrator',
  TENANT_CONFIG_MODIFIER: 'Tenant_Config_Modifier',
  STUDENT_RECORD_READER: 'Student_Record_Reader',
  STUDENT_RECORD_WRITER: 'Student_Record_Writer',
  RAPOR_GRADE_EDITOR: 'Rapor_Grade_Editor',
  ATTESTATION_SIGNER: 'Attestation_Signer',
  SESSION_KILL_SWITCH: 'Session_Kill_Switch',
} as const;

export interface SoDRule {
  id: string;
  name: string;
  description: string;
  conflictingPermissions: [string, string];
  severity: 'CRITICAL' | 'HIGH';
}

/**
 * Dual Authorization Control (Section 4.2 Four-Eyes Principle)
 */
export interface DualAuthRoleElevationRequest {
  id: string;
  tenantId: string;
  targetUserId: string;
  targetUserEmail: string;
  currentRoles: string[];
  requestedRole: string;
  requestedPermissions: string[];
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  createdBy: string;
  createdByName: string;
  createdAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  justification: string;
}

/**
 * Token Claims & Active Sessions (Section 3.1 B)
 */
export interface TokenClaims {
  sub: string; // User ID
  tenant_id: string;
  jti: string; // Unique Session ID for instant revocation
  email: string;
  roles: string[];
  permissions: string[];
  token_type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface ActiveSession {
  jti: string;
  userId: string;
  userEmail: string;
  tenantId: string;
  ipAddress: string;
  userAgent: string;
  issuedAt: string;
  expiresAt: string;
  isRevoked: boolean;
  revokedAt?: string;
}

/**
 * Structural JSON Audit Ledger Schema (PRD Section 6.1)
 * WORM (Write Once Read Many) immutable ledger pipeline
 */
export interface SiemAuditRecord {
  timestamp: string;
  event_id: string;
  tenant_id: string;
  trace_id: string;
  actor: {
    user_id: string;
    ip_address: string;
    user_agent: string;
  };
  event_type: string;
  action_status: 'SUCCESS' | 'WARNING' | 'FAILED';
  resource_affected: string;
  state_delta: {
    previous_state?: Record<string, unknown>;
    new_state?: Record<string, unknown>;
  };
  compliance_framework?: string[]; // e.g. ['COBIT 5 DSS05.04', 'COBIT 5 APO13.01']
}

/**
 * Automated Identity Recertification Engine (PRD Section 3.1 C - MEA01)
 */
export interface AttestationHistoryRecord {
  attestation_id: string;
  tenant_id: string;
  attested_by_user_id: string;
  attested_by_name: string;
  attested_at: string;
  snapshot_hash: string;
  user_count: number;
  role_distribution: Record<string, number>;
  active_sessions_count: number;
  notes: string;
  status: 'VERIFIED_COMPLIANT' | 'FLAGGED_EXCEPTIONS';
}

/**
 * Core API Gateway Contract
 */
export interface CoreApiRequest<T = unknown> {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: {
    'X-Tenant-ID'?: string;
    Authorization?: string;
    'X-Client-IP'?: string;
    'User-Agent'?: string;
    [key: string]: string | undefined;
  };
  body?: T;
}

export interface CoreApiResponse<T = unknown> {
  status: number; // HTTP Status Code (200, 202, 401, 403, 409, 423, etc.)
  success: boolean;
  data?: T;
  error?: string;
  message: string;
  traceId: string;
  latencyMs: number;
  headers?: Record<string, string>;
}
