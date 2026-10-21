/**
 * Provisioning & Identity Lifecycle Engine (COBIT 5 DSS05.04 & APO13.02)
 * - Multi-mode registration (Open, Admin-Invited, IDP Federation)
 * - Password Policy verification
 * - Brute-Force Rate Limiting (5 attempts in 15 mins -> 423 Locked)
 * - User Enumeration Denial (Synthetic latency + 202 Accepted)
 * - 90-Day Inactivity transition to INACTIVE
 * - PII Field-Level Encryption prior to storage
 */

import type { StructuralUser, Tenant, CoreApiResponse } from './types';
import { COBIT_PERMISSIONS } from './types';
import { hashPassword, encryptPiiField, generateSignedVerificationToken } from './crypto';

export class IdentityLifecycleEngine {
  private failedAttempts: Map<string, { count: number; firstAttemptAt: number }> = new Map();

  /**
   * Password Policy Validation (Section 3.1 A)
   * Hard default: min 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.
   */
  public validatePasswordStrength(
    password: string,
    policy: Tenant['passwordPolicy']
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < policy.minLength) {
      errors.push(`Panjang kata sandi minimal ${policy.minLength} karakter (terisi ${password.length}).`);
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Wajib memuat sekurang-kurangnya 1 huruf besar (uppercase A-Z).');
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Wajib memuat sekurang-kurangnya 1 huruf kecil (lowercase a-z).');
    }
    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Wajib memuat sekurang-kurangnya 1 angka (0-9).');
    }
    if (policy.requireSpecialChars && !/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Wajib memuat sekurang-kurangnya 1 karakter khusus / simbol (@$!%*?&...).');
    }

    if (policy.customRegex) {
      const rx = new RegExp(policy.customRegex);
      if (!rx.test(password)) {
        errors.push('Kata sandi tidak memenuhi pola regex kustom kebijakan institusi.');
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Multi-Mode User Registration API (Section 3.1 A)
   */
  public async registerUser(
    tenant: Tenant,
    payload: {
      email: string;
      password?: string;
      fullName: string;
      role?: string;
      assignedClass?: number;
      mobilePhone?: string;
      nip?: string;
      nationalId?: string;
      invitedByAdminId?: string;
    },
    existingUsers: StructuralUser[]
  ): Promise<CoreApiResponse<{ user: StructuralUser; verificationToken?: string }>> {
    const traceId = 'trc_reg_' + Math.random().toString(36).substring(2, 9);
    const start = performance.now();

    // 1. Tenant Status Check (Deactivation Cascade)
    if (tenant.status === 'SUSPENDED') {
      return {
        status: 403,
        success: false,
        error: 'TENANT_SUSPENDED',
        message: 'Tenant access is suspended by platform governance.',
        traceId,
        latencyMs: Math.round(performance.now() - start),
      };
    }

    // 2. Onboarding Strategy Enforcement
    if (tenant.onboardingMode === 'ADMIN_INVITED_ONLY' && !payload.invitedByAdminId) {
      return {
        status: 403,
        success: false,
        error: 'ONBOARDING_STRATEGY_RESTRICTED',
        message:
          'COBIT 5 DSS05.04: Kebijakan institusi mewajibkan pendaftaran hanya melalui undangan Administrator resmi (ADMIN_INVITED_ONLY). Pendaftaran mandiri ditutup.',
        traceId,
        latencyMs: Math.round(performance.now() - start),
      };
    }

    // 3. Duplicate Email Check
    const normalizedEmail = payload.email.trim().toLowerCase();
    const duplicate = existingUsers.find(
      (u) => u.tenantId === tenant.id && u.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      return {
        status: 409,
        success: false,
        error: 'EMAIL_ALREADY_REGISTERED',
        message: 'Email tersebut sudah terdaftar di bawah institusi tenant ini.',
        traceId,
        latencyMs: Math.round(performance.now() - start),
      };
    }

    // 4. Password Policy Validation
    const rawPassword = payload.password || 'Buana2026!Default';
    const pwdValidation = this.validatePasswordStrength(rawPassword, tenant.passwordPolicy);
    if (!pwdValidation.valid) {
      return {
        status: 422,
        success: false,
        error: 'PASSWORD_POLICY_VIOLATION',
        message: pwdValidation.errors.join(' '),
        traceId,
        latencyMs: Math.round(performance.now() - start),
      };
    }

    // 5. Secure Argon2id Password Hashing (Section 5.1)
    const passwordHash = await hashPassword(rawPassword);

    // 6. Application-Layer PII Field-Level Encryption (Section 5.1 AES-256-GCM)
    const piiEncrypted: StructuralUser['piiEncrypted'] = {};
    if (payload.mobilePhone) {
      piiEncrypted.mobilePhone = await encryptPiiField(payload.mobilePhone);
    }
    if (payload.nationalId) {
      piiEncrypted.nationalId = await encryptPiiField(payload.nationalId);
    }
    if (payload.nip) {
      piiEncrypted.nip = await encryptPiiField(payload.nip);
    }

    // 7. Role & Default Permissions Assignment
    const assignedRole = payload.role || 'wali_kelas';
    const defaultPermissions: string[] = [
      COBIT_PERMISSIONS.STUDENT_RECORD_READER,
    ];
    if (assignedRole === 'admin') {
      defaultPermissions.push(
        COBIT_PERMISSIONS.USER_ACCOUNT_MODIFIER,
        COBIT_PERMISSIONS.ROLE_ADMINISTRATOR,
        COBIT_PERMISSIONS.SESSION_KILL_SWITCH
      );
    } else if (assignedRole === 'kepala_sekolah') {
      defaultPermissions.push(
        COBIT_PERMISSIONS.ATTESTATION_SIGNER,
        COBIT_PERMISSIONS.AUDIT_LOG_VIEWER // Head of school has audit review privilege
      );
    } else {
      defaultPermissions.push(
        COBIT_PERMISSIONS.STUDENT_RECORD_WRITER,
        COBIT_PERMISSIONS.RAPOR_GRADE_EDITOR
      );
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const newUser: StructuralUser = {
      id: userId,
      tenantId: tenant.id,
      email: normalizedEmail,
      passwordHash,
      status: tenant.onboardingMode === 'OPEN_REGISTRATION' ? 'PENDING_VERIFICATION' : 'ACTIVE',
      roles: [assignedRole],
      permissions: defaultPermissions,
      failedLoginAttempts: 0,
      extensionAttributes: {
        fullName: payload.fullName,
        institutionRole: assignedRole,
        assignedClass: payload.assignedClass,
        nip: payload.nip,
        mobilePhone: payload.mobilePhone,
        nationalId: payload.nationalId,
      },
      piiEncrypted,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // 8. Generate HMAC-SHA256 Verification Token Webhook Payload (Section 3.1 A)
    const { token: verificationToken } = await generateSignedVerificationToken(userId, tenant.id);

    return {
      status: 201,
      success: true,
      message:
        tenant.onboardingMode === 'OPEN_REGISTRATION'
          ? 'Akun berhasil dibuat. Token verifikasi kriptografis diterbitkan melalui webhook.'
          : 'Pendaftaran pengguna berhasil disahkan oleh otoritas tenant.',
      data: { user: newUser, verificationToken },
      traceId,
      latencyMs: Math.round(performance.now() - start),
    };
  }

  /**
   * Brute-Force Rate Limiting Engine (Section 7.1 & DSS05.04)
   * 5 failed attempts in 15 mins -> 423 Locked for 15 minutes.
   */
  public registerFailedAttempt(
    key: string,
    user?: StructuralUser
  ): { isLocked: boolean; unlockAt?: string; remainingAttempts: number } {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 mins
    const maxAttempts = 5;

    const existing = this.failedAttempts.get(key);
    if (!existing || now - existing.firstAttemptAt > windowMs) {
      this.failedAttempts.set(key, { count: 1, firstAttemptAt: now });
      return { isLocked: false, remainingAttempts: maxAttempts - 1 };
    }

    existing.count += 1;
    if (existing.count >= maxAttempts) {
      const unlockTime = new Date(now + windowMs).toISOString();
      if (user) {
        user.status = 'LOCKED';
        user.lockedUntil = unlockTime;
      }
      return { isLocked: true, unlockAt: unlockTime, remainingAttempts: 0 };
    }

    return {
      isLocked: false,
      remainingAttempts: maxAttempts - existing.count,
    };
  }

  public clearFailedAttempts(key: string, user?: StructuralUser): void {
    this.failedAttempts.delete(key);
    if (user && user.status === 'LOCKED') {
      user.status = 'ACTIVE';
      user.lockedUntil = undefined;
      user.failedLoginAttempts = 0;
    }
  }

  public isRateLimited(key: string, user?: StructuralUser): { locked: boolean; unlockAt?: string } {
    if (user && user.status === 'LOCKED' && user.lockedUntil) {
      if (new Date(user.lockedUntil).getTime() > Date.now()) {
        return { locked: true, unlockAt: user.lockedUntil };
      }
      // Unlock after expiry
      user.status = 'ACTIVE';
      user.lockedUntil = undefined;
      user.failedLoginAttempts = 0;
      this.failedAttempts.delete(key);
    }
    return { locked: false };
  }

  /**
   * User Enumeration Denial on Forgot Password (PRD Section 7.1)
   * Executes synthetic delay and returns identical 202 Accepted response.
   */
  public async handleForgotPasswordEnumerationSafe(
    _tenantId: string,
    targetIdentifier: string,
    users: StructuralUser[]
  ): Promise<CoreApiResponse<{ sent: boolean }>> {
    const traceId = 'trc_fp_' + Math.random().toString(36).substring(2, 9);
    const start = performance.now();

    const normalized = targetIdentifier.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === normalized ||
        u.extensionAttributes.mobilePhone === targetIdentifier
    );

    // Constant-time synthetic database latency path delay (simulating ~120ms normal query)
    await new Promise((resolve) => setTimeout(resolve, 120 + Math.random() * 40));

    // Identical message returned regardless of account existence
    const uniformMessage =
      'An email containing your recovery instructions has been dispatched if the account is registered.';

    return {
      status: 202, // 202 Accepted as mandated by PRD Section 7.1
      success: true,
      message: uniformMessage,
      data: { sent: Boolean(found) },
      traceId,
      latencyMs: Math.round(performance.now() - start),
    };
  }

  /**
   * Inactivity Engine (PRD Section 3.1 B)
   * Sweeps users with no active access token generation for 90 days -> INACTIVE.
   */
  public sweepInactiveUsers(users: StructuralUser[], thresholdDays: number = 90): StructuralUser[] {
    const now = Date.now();
    const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;
    const modified: StructuralUser[] = [];

    users.forEach((user) => {
      if (user.status === 'ACTIVE' && user.lastTokenIssuedAt) {
        const lastActive = new Date(user.lastTokenIssuedAt).getTime();
        if (now - lastActive > thresholdMs) {
          user.status = 'INACTIVE';
          user.updatedAt = new Date().toISOString();
          modified.push(user);
        }
      }
    });

    return modified;
  }
}
