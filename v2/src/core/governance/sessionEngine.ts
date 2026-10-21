/**
 * The Global Session & Invalidation Engine (Kill-Switch) (COBIT 5 DSS05.04)
 * - Short-lived Access Tokens (15 min)
 * - Refresh Tokens (7 days)
 * - Unique Session ID (jti) mapping
 * - High-speed Redis-like revocation cache
 * - Global Session Kill-Switch
 */

import type { ActiveSession, TokenClaims } from './types';

export class SessionEngine {
  // In-memory high-speed cache (simulating Redis distributed store with sliding expiration)
  private revokedJtis: Map<string, { revokedAt: string; reason: string }> = new Map();
  private activeSessions: Map<string, ActiveSession> = new Map();

  constructor() {
    // Seed an initial demo active session
    const demoJti = 'jti_demo_seed_001';
    this.activeSessions.set(demoJti, {
      jti: demoJti,
      userId: 'usr_admin_001',
      userEmail: 'admin@buanastudios.com',
      tenantId: 'tenant-sd-muh-2',
      ipAddress: '198.51.100.42',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Buana/2.0 Core',
      issuedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      isRevoked: false,
    });
  }

  /**
   * Issue a new token pair: Access Token (15m) + Refresh Token (7d)
   */
  public createSession(
    userId: string,
    userEmail: string,
    tenantId: string,
    roles: string[],
    permissions: string[],
    ipAddress: string = '127.0.0.1',
    userAgent: string = 'Buana Client Browser'
  ): {
    accessToken: string;
    refreshToken: string;
    jti: string;
    expiresIn: number;
  } {
    const jti = `jti_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const nowSec = Math.floor(Date.now() / 1000);
    const accessTtl = 15 * 60; // 15 mins
    const refreshTtl = 7 * 24 * 60 * 60; // 7 days

    const accessClaims: TokenClaims = {
      sub: userId,
      tenant_id: tenantId,
      jti,
      email: userEmail,
      roles,
      permissions,
      token_type: 'access',
      iat: nowSec,
      exp: nowSec + accessTtl,
    };

    const refreshClaims: TokenClaims = {
      sub: userId,
      tenant_id: tenantId,
      jti: `${jti}_ref`,
      email: userEmail,
      roles,
      permissions,
      token_type: 'refresh',
      iat: nowSec,
      exp: nowSec + refreshTtl,
    };

    // Store active session descriptor
    this.activeSessions.set(jti, {
      jti,
      userId,
      userEmail,
      tenantId,
      ipAddress,
      userAgent,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + accessTtl * 1000).toISOString(),
      isRevoked: false,
    });

    // Simple Base64-encoded JWT structure simulation
    const encodedHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const encodedAccessPayload = btoa(JSON.stringify(accessClaims));
    const accessSignature = 'sig_' + Math.random().toString(36).substring(2, 10);
    const accessToken = `${encodedHeader}.${encodedAccessPayload}.${accessSignature}`;

    const encodedRefreshPayload = btoa(JSON.stringify(refreshClaims));
    const refreshSignature = 'sig_ref_' + Math.random().toString(36).substring(2, 10);
    const refreshToken = `${encodedHeader}.${encodedRefreshPayload}.${refreshSignature}`;

    return {
      accessToken,
      refreshToken,
      jti,
      expiresIn: accessTtl,
    };
  }

  /**
   * Parse token and verify validity against revocation cache
   */
  public verifyToken(token: string): {
    valid: boolean;
    claims?: TokenClaims;
    error?: string;
  } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'MALFORMED_JWT: Token format invalid.' };
      }

      const claims: TokenClaims = JSON.parse(atob(parts[1]));
      const nowSec = Math.floor(Date.now() / 1000);

      // Expiry Check
      if (claims.exp < nowSec) {
        return { valid: false, error: 'TOKEN_EXPIRED: Access token expired. Use refresh token.' };
      }

      // High-speed JTI Invalidation Cache Check (Kill-Switch)
      if (this.revokedJtis.has(claims.jti)) {
        const info = this.revokedJtis.get(claims.jti);
        return {
          valid: false,
          error: `TOKEN_REVOKED: Session [${claims.jti}] revoked on ${info?.revokedAt}. Reason: ${info?.reason}`,
        };
      }

      return { valid: true, claims };
    } catch {
      return { valid: false, error: 'INVALID_SIGNATURE: Token decoding failed.' };
    }
  }

  /**
   * Token Revocation API (/api/v1/auth/revoke)
   * The Global Session Kill-Switch
   */
  public revokeSession(jti: string, reason: string = 'ADMIN_SESSION_TERMINATION'): boolean {
    const revokedAt = new Date().toISOString();
    this.revokedJtis.set(jti, { revokedAt, reason });

    const session = this.activeSessions.get(jti);
    if (session) {
      session.isRevoked = true;
      session.revokedAt = revokedAt;
    }
    return true;
  }

  /**
   * Revoke all sessions for a specific user across all devices
   */
  public revokeAllUserSessions(userId: string, reason: string = 'USER_GLOBAL_KILL_SWITCH'): number {
    let count = 0;
    this.activeSessions.forEach((sess) => {
      if (sess.userId === userId && !sess.isRevoked) {
        this.revokeSession(sess.jti, reason);
        count++;
      }
    });
    return count;
  }

  public getActiveSessions(tenantId?: string): ActiveSession[] {
    const all = Array.from(this.activeSessions.values());
    if (tenantId) {
      return all.filter((s) => s.tenantId === tenantId);
    }
    return all;
  }

  public isJtiRevoked(jti: string): boolean {
    return this.revokedJtis.has(jti);
  }
}
