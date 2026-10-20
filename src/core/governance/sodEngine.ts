/**
 * Segregation of Duties (SoD) Engine & Dual Authorization Control (COBIT 5 APO13.01)
 * Enforces:
 * 1. System Constraint: Mutual exclusion of Audit_Log_Viewer and User_Account_Modifier (409 Conflict).
 * 2. Dual Authorization Control (Four-Eyes Principle): Role elevation requires approval from a distinct admin (Approved_By != Created_By).
 */

import type { DualAuthRoleElevationRequest, SoDRule } from './types';
import { COBIT_PERMISSIONS } from './types';

export const standardSoDRules: SoDRule[] = [
  {
    id: 'sod_rule_001_core',
    name: 'Audit Log vs User Management Separation',
    description:
      'COBIT 5 APO13.01: No user account can possess both Audit_Log_Viewer and User_Account_Modifier simultaneously to prevent ledger tampering and privilege monopolization.',
    conflictingPermissions: [
      COBIT_PERMISSIONS.AUDIT_LOG_VIEWER,
      COBIT_PERMISSIONS.USER_ACCOUNT_MODIFIER,
    ],
    severity: 'CRITICAL',
  },
  {
    id: 'sod_rule_002_role_admin',
    name: 'Role Administration vs Audit Viewing Separation',
    description:
      'Role administrators capable of changing permission matrices cannot inspect the forensic audit trail directly without secondary witness.',
    conflictingPermissions: [
      COBIT_PERMISSIONS.ROLE_ADMINISTRATOR,
      COBIT_PERMISSIONS.AUDIT_LOG_VIEWER,
    ],
    severity: 'HIGH',
  },
  {
    id: 'sod_rule_003_record_writer',
    name: 'Academic Record Writer vs Audit Separation',
    description:
      'Staff with write access to student master records and grades cannot hold audit ledger viewing access.',
    conflictingPermissions: [
      COBIT_PERMISSIONS.STUDENT_RECORD_WRITER,
      COBIT_PERMISSIONS.AUDIT_LOG_VIEWER,
    ],
    severity: 'HIGH',
  },
];

export class SoDEngine {
  private rules: SoDRule[] = [...standardSoDRules];
  private elevationRequests: Map<string, DualAuthRoleElevationRequest> = new Map();

  constructor() {
    // Seed an initial demo pending approval to illustrate Four-Eyes Principle in action
    const seedId = 'req_demo_elevation_001';
    this.elevationRequests.set(seedId, {
      id: seedId,
      tenantId: 'tenant-sd-muh-2',
      targetUserId: 'usr_wk6_001',
      targetUserEmail: 'syamsul.bahri@sdmuhammadiyah2bdg.sch.id',
      currentRoles: ['wali_kelas'],
      requestedRole: 'kepala_sekolah',
      requestedPermissions: [
        COBIT_PERMISSIONS.STUDENT_RECORD_WRITER,
        COBIT_PERMISSIONS.ROLE_ADMINISTRATOR,
      ],
      status: 'PENDING_APPROVAL',
      createdBy: 'usr_admin_001',
      createdByName: 'Administrator Sistem (Buana Studios)',
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      justification: 'Promosi sementara Pelaksana Tugas (Plt) Kepala Sekolah semester ganjil.',
    });
  }

  /**
   * Validate Permission Set against Segregation of Duties rules
   * Throws 409 Conflict if violation detected.
   */
  public evaluatePermissions(permissions: string[]): {
    valid: boolean;
    violatedRule?: SoDRule;
    conflictDetail?: string;
  } {
    for (const rule of this.rules) {
      const [permA, permB] = rule.conflictingPermissions;
      const hasA = permissions.includes(permA);
      const hasB = permissions.includes(permB);

      if (hasA && hasB) {
        return {
          valid: false,
          violatedRule: rule,
          conflictDetail: `SOD_CONFLICT_VIOLATION [${rule.id}]: User cannot hold both '${permA}' and '${permB}' simultaneously.`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Dual Authorization Control: Request Role Elevation (Section 4.2)
   * Remains in PENDING_APPROVAL state.
   */
  public requestRoleElevation(
    tenantId: string,
    targetUserId: string,
    targetUserEmail: string,
    currentRoles: string[],
    requestedRole: string,
    requestedPermissions: string[],
    creatorId: string,
    creatorName: string,
    justification: string
  ): {
    success: boolean;
    request?: DualAuthRoleElevationRequest;
    error?: string;
    statusCode: number;
  } {
    // Step 1: Check SoD constraints on proposed permissions
    const sodCheck = this.evaluatePermissions(requestedPermissions);
    if (!sodCheck.valid) {
      return {
        success: false,
        statusCode: 409, // 409 Conflict as mandated by PRD
        error: sodCheck.conflictDetail,
      };
    }

    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRequest: DualAuthRoleElevationRequest = {
      id,
      tenantId,
      targetUserId,
      targetUserEmail,
      currentRoles,
      requestedRole,
      requestedPermissions,
      status: 'PENDING_APPROVAL',
      createdBy: creatorId,
      createdByName: creatorName,
      createdAt: new Date().toISOString(),
      justification,
    };

    this.elevationRequests.set(id, newRequest);

    return {
      success: true,
      statusCode: 202, // 202 Accepted, pending secondary approval
      request: newRequest,
    };
  }

  /**
   * Approve Role Elevation (Four-Eyes Principle Execution)
   * Strictly enforces Approved_By != Created_By
   */
  public approveRoleElevation(
    requestId: string,
    approverId: string,
    approverName: string
  ): {
    success: boolean;
    request?: DualAuthRoleElevationRequest;
    error?: string;
    statusCode: number;
  } {
    const req = this.elevationRequests.get(requestId);
    if (!req) {
      return { success: false, statusCode: 404, error: 'Elevation request not found.' };
    }

    if (req.status !== 'PENDING_APPROVAL') {
      return {
        success: false,
        statusCode: 400,
        error: `Request has already been processed with status: ${req.status}.`,
      };
    }

    // Four-Eyes Principle: Requester cannot self-approve
    if (req.createdBy === approverId) {
      return {
        success: false,
        statusCode: 403, // Dual authorization rule failure
        error: `DUAL_AUTHORIZATION_VIOLATION: COBIT 5 APO13.01 requires role elevations to be approved by a separate administrative account (Approved_By != Created_By). Requester [${req.createdByName}] cannot approve their own elevation payload.`,
      };
    }

    req.status = 'APPROVED';
    req.approvedBy = approverId;
    req.approvedByName = approverName;
    req.approvedAt = new Date().toISOString();

    return {
      success: true,
      statusCode: 200,
      request: req,
    };
  }

  /**
   * Reject Role Elevation
   */
  public rejectRoleElevation(
    requestId: string,
    reviewerId: string,
    reviewerName: string,
    reason: string
  ): boolean {
    const req = this.elevationRequests.get(requestId);
    if (!req || req.status !== 'PENDING_APPROVAL') return false;

    req.status = 'REJECTED';
    req.approvedBy = reviewerId;
    req.approvedByName = reviewerName;
    req.approvedAt = new Date().toISOString();
    req.rejectionReason = reason;
    return true;
  }

  public getPendingRequests(tenantId?: string): DualAuthRoleElevationRequest[] {
    const all = Array.from(this.elevationRequests.values());
    return all.filter((r) => r.status === 'PENDING_APPROVAL' && (!tenantId || r.tenantId === tenantId));
  }

  public getAllRequests(tenantId?: string): DualAuthRoleElevationRequest[] {
    const all = Array.from(this.elevationRequests.values());
    if (tenantId) return all.filter((r) => r.tenantId === tenantId);
    return all;
  }

  public getRules(): SoDRule[] {
    return this.rules;
  }
}
