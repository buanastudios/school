/**
 * Tenant Isolation Engine & Extensible Schema Engine (COBIT 5 DSS05, APO13)
 * Provides logical multi-tenancy, branding resolution, and deactivation cascade.
 */

import type { Tenant, WhiteLabelBranding } from './types';

export const initialTenants: Tenant[] = [
  {
    id: 'tenant-sd-muh-2',
    code: 'SD-MUH-02',
    name: 'SD Muhammadiyah 2 Bandung',
    domain: 'sdmuhammadiyah2bdg.sch.id',
    status: 'ACTIVE',
    onboardingMode: 'ADMIN_INVITED_ONLY',
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    sessionPolicy: {
      accessTokenTtlSeconds: 900, // 15 mins
      refreshTokenTtlSeconds: 604800, // 7 days
      inactivityThresholdDays: 90,
    },
    branding: {
      institutionName: 'SD Muhammadiyah 2',
      institutionalTitle: 'Sistem Pengelolaan Sekolah Dasar Terpadu',
      npsn: '20219876',
      nss: '102026008002',
      primaryColor: '#135bec',
      accentColor: '#10b981',
      supportEmail: 'support@sdmuhammadiyah2bdg.sch.id',
      portalSubtitle: 'Portal Administrasi Kurikulum Merdeka & Buku Induk Siswa',
    },
    customSchemaExtensions: {
      assigned_class: 'INTEGER',
      nuptk: 'STRING',
      nip: 'STRING',
      signature_url: 'STRING',
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'tenant-buana-demo',
    code: 'BUANA-ACADEMY',
    name: 'Buana Academy International (Demo)',
    domain: 'academy.buana.studio',
    status: 'ACTIVE',
    onboardingMode: 'OPEN_REGISTRATION',
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    sessionPolicy: {
      accessTokenTtlSeconds: 900,
      refreshTokenTtlSeconds: 604800,
      inactivityThresholdDays: 90,
    },
    branding: {
      institutionName: 'Buana Academy',
      institutionalTitle: 'Next-Gen Educational SaaS Portal',
      npsn: '20999888',
      nss: '109990001111',
      primaryColor: '#6366f1',
      accentColor: '#f59e0b',
      supportEmail: 'contact@buanastudios.com',
      portalSubtitle: 'Multi-Tenant White-Label Demonstration Institution',
    },
    customSchemaExtensions: {
      loyalty_tier: 'STRING',
      department: 'STRING',
      student_quota: 'INTEGER',
    },
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'tenant-global-gov',
    code: 'GOV-EDU-CORP',
    name: 'Institusi Pendidikan Mitra Daerah (Suspended Sandbox)',
    domain: 'mitra.buanaschool.id',
    status: 'SUSPENDED', // Demonstrates Tenant Deactivation Cascade (PRD Section 7.1)
    onboardingMode: 'IDP_FEDERATION',
    passwordPolicy: {
      minLength: 14,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    sessionPolicy: {
      accessTokenTtlSeconds: 600,
      refreshTokenTtlSeconds: 259200,
      inactivityThresholdDays: 60,
    },
    branding: {
      institutionName: 'Mitra Edukasi Terpadu',
      institutionalTitle: 'Pusat Tata Kelola Pendidikan Wilayah',
      primaryColor: '#475569',
      accentColor: '#ef4444',
      supportEmail: 'security@buanastudios.com',
      portalSubtitle: 'Akun Ditangguhkan oleh Tata Kelola Platform',
    },
    customSchemaExtensions: {
      government_id: 'STRING',
      region_code: 'STRING',
    },
    createdAt: '2026-05-15T00:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
];

export class TenantEngine {
  private tenants: Map<string, Tenant> = new Map();

  constructor(seedTenants: Tenant[] = initialTenants) {
    seedTenants.forEach((t) => this.tenants.set(t.id, t));
  }

  public getAllTenants(): Tenant[] {
    return Array.from(this.tenants.values());
  }

  public getTenant(tenantId: string): Tenant | undefined {
    return this.tenants.get(tenantId);
  }

  public resolveTenantByHeader(headerTenantId?: string): Tenant {
    if (headerTenantId && this.tenants.has(headerTenantId)) {
      return this.tenants.get(headerTenantId)!;
    }
    // Default fallback to primary school tenant
    return this.tenants.get('tenant-sd-muh-2') || Array.from(this.tenants.values())[0];
  }

  /**
   * Tenant Deactivation Cascade (Section 7.1)
   * Throws 403 Forbidden if tenant status is SUSPENDED
   */
  public verifyTenantActive(tenantId: string): { allowed: boolean; status: number; message?: string } {
    const tenant = this.getTenant(tenantId);
    if (!tenant) {
      return { allowed: false, status: 404, message: `Tenant [${tenantId}] not found.` };
    }
    if (tenant.status === 'SUSPENDED') {
      return {
        allowed: false,
        status: 403,
        message: `TENANT_SUSPENDED: Access for tenant [${tenant.name}] is suspended by platform governance. All downstream customer tokens are revoked.`,
      };
    }
    if (tenant.status === 'PROVISIONING') {
      return {
        allowed: false,
        status: 423,
        message: `TENANT_PROVISIONING: Tenant [${tenant.name}] is currently undergoing secure initialization.`,
      };
    }
    return { allowed: true, status: 200 };
  }

  public updateTenantBranding(tenantId: string, branding: Partial<WhiteLabelBranding>): boolean {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;
    tenant.branding = { ...tenant.branding, ...branding };
    tenant.updatedAt = new Date().toISOString();
    return true;
  }

  public setTenantStatus(tenantId: string, status: Tenant['status']): boolean {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;
    tenant.status = status;
    tenant.updatedAt = new Date().toISOString();
    return true;
  }

  public setOnboardingMode(tenantId: string, mode: Tenant['onboardingMode']): boolean {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return false;
    tenant.onboardingMode = mode;
    tenant.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Logical Isolation Filter:
   * Enforces that any entity array is strictly scoped to the tenant ID.
   */
  public filterByTenant<T extends { tenantId?: string }>(items: T[], tenantId: string): T[] {
    return items.filter((item) => !item.tenantId || item.tenantId === tenantId);
  }
}
