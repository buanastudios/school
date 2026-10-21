import React from 'react';
import type { AppModuleDefinition, UserRole } from '../types';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BookOpen,
  FileSpreadsheet,
  Trophy,
  Printer,
  Users,
  ShieldCheck,
  Shield,
  Blocks,
  Settings,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

/**
 * BUANA STUDIOS - Enterprise School Management System
 * Dynamic Plug-and-Play Module Registry
 */
export const defaultAppModules: AppModuleDefinition[] = [
  {
    id: 'dashboard',
    code: 'MOD_DASHBOARD',
    name: 'Beranda & Dasbor Eksekutif',
    label: 'Beranda',
    description: 'Statistik demografi siswa, ringkasan mutasi bulanan, dan jalan pintas administrasi.',
    iconName: 'LayoutDashboard',
    path: 'index.html',
    category: 'Utama',
    allowedRoles: ['admin', 'kepala_sekolah', 'wali_kelas', 'tata_usaha'],
    isEnabled: true,
    order: 1,
    badge: 'Utama',
    version: '2.5.0',
    isCore: true,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'mutasi',
    code: 'MOD_MUTASI',
    name: 'Buku Mutasi Siswa Masuk & Keluar',
    label: 'Buku Mutasi',
    description: 'Pencatatan mutasi siswa masuk, keluar, dan rekapitulasi 12 bulan format resmi Kemendikdasmen.',
    iconName: 'ArrowLeftRight',
    path: 'mutasi.html',
    category: 'Kesiswaan',
    allowedRoles: ['admin', 'kepala_sekolah', 'wali_kelas', 'tata_usaha'],
    isEnabled: true,
    order: 2,
    badge: 'Masuk & Keluar',
    version: '2.5.0',
    isCore: false,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'buku-induk',
    code: 'MOD_BUKU_INDUK',
    name: 'Buku Induk Register Peserta Didik',
    label: 'Buku Induk',
    description: 'Daftar nomor induk, lembar biodata siswa 17 poin, dan arsip perkembangan murid.',
    iconName: 'BookOpen',
    path: 'buku-induk.html',
    category: 'Kesiswaan',
    allowedRoles: ['admin', 'kepala_sekolah', 'wali_kelas', 'tata_usaha'],
    isEnabled: true,
    order: 3,
    badge: 'Kurikulum Merdeka',
    version: '2.5.0',
    isCore: false,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'rapor',
    code: 'MOD_RAPOR',
    name: 'Laporan Hasil Belajar & Rapor Merdeka',
    label: 'Rapor Siswa',
    description: 'Input capaian kompetensi guru, nilai akhir, P5 kokurikuler, absensi, dan cetak PDF resmi format Kemendikdasmen.',
    iconName: 'FileSpreadsheet',
    path: 'rapor.html',
    category: 'Akademik',
    allowedRoles: ['admin', 'kepala_sekolah', 'wali_kelas', 'tata_usaha'],
    isEnabled: true,
    order: 4,
    badge: 'Input & Cetak',
    version: '2.5.0',
    isCore: false,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'kegiatan',
    code: 'MOD_KEGIATAN',
    name: 'Ekstrakurikuler & 4 Keahlian Wajib',
    label: 'Ekstra & Kokurikuler',
    description: 'Manajemen bakat siswa, ekskul (Robotic, Silat, Futsal), dan 4 keahlian wajib (Berenang, Berkuda, Berkemah, Rappelling).',
    iconName: 'Trophy',
    path: 'kegiatan.html',
    category: 'Akademik',
    allowedRoles: ['admin', 'kepala_sekolah', 'wali_kelas', 'tata_usaha'],
    isEnabled: true,
    order: 5,
    badge: 'Keahlian Wajib',
    version: '2.5.0',
    isCore: false,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'cetak-buku',
    code: 'MOD_PRINT',
    name: 'Pencetakan Buku On-Demand',
    label: 'Cetak Dokumen Resmi',
    description: 'Ekspor PDF dan pratinjau cetak buku mutasi 12 bulan dan register buku induk dengan halaman berhadapan.',
    iconName: 'Printer',
    path: 'cetak-buku.html',
    category: 'Administrasi',
    allowedRoles: ['admin', 'kepala_sekolah', 'wali_kelas', 'tata_usaha'],
    isEnabled: true,
    order: 6,
    badge: 'Format Cetak',
    version: '2.5.0',
    isCore: false,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'users',
    code: 'MOD_USERS',
    name: 'Manajemen Pengguna & Hak Akses',
    label: 'Manajemen Pengguna',
    description: 'Kelola akun guru wali kelas, staf TU, kepala sekolah, kredensial, dan tanda tangan digital resmi.',
    iconName: 'Users',
    path: 'pengaturan.html?tab=users',
    category: 'Administrasi',
    allowedRoles: ['admin', 'tata_usaha', 'kepala_sekolah'],
    isEnabled: true,
    order: 7,
    badge: 'Akses Guru',
    version: '2.5.0',
    isCore: false,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'universal-v3',
    code: 'MOD_UNIVERSAL_V3',
    name: 'Universal School Suite v3 (6 Pillars)',
    label: 'v3 Universal Suite',
    description: 'Suite pendidikan universal: SIS Lifecycle, Timetable Conflict Engine, Multi-Skala Rapor, Keuangan & Payroll, Komunikasi Omnichannel, dan PPDB CRM.',
    iconName: 'Sparkles',
    path: 'universal-v3.html',
    category: 'Utama',
    allowedRoles: ['admin', 'kepala_sekolah', 'wali_kelas', 'tata_usaha'],
    isEnabled: true,
    order: 8,
    badge: 'v3.0 PRD',
    version: '3.0.0',
    isCore: true,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'cobit5-governance',
    code: 'MOD_COBIT5_GOV',
    name: 'ISACA COBIT 5 Governance & Multi-Tenant Core',
    label: 'Tata Kelola COBIT 5',
    description: 'Framework kepatuhan DSS05 (Keamanan & Identitas), APO13 (Manajemen Keamanan & SoD), MEA01 (Resertifikasi Akses), dan arsitektur Multi-Tenant White-Label.',
    iconName: 'Shield',
    path: 'pengaturan.html?tab=governance',
    category: 'Sistem & Keamanan',
    allowedRoles: ['admin', 'kepala_sekolah'],
    isEnabled: true,
    order: 8,
    badge: 'v2.0 COBIT',
    version: '2.0.0',
    isCore: true,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'audit-log',
    code: 'MOD_AUDIT_LOG',
    name: 'Log Audit Keamanan & Jejak Aktivitas',
    label: 'Log Audit Keamanan',
    description: 'Rekam jejak seluruh mutasi data, login, manipulasi nilai, dan aktivitas administratif untuk kepatuhan sistem.',
    iconName: 'ShieldCheck',
    path: 'pengaturan.html?tab=audit',
    category: 'Sistem & Keamanan',
    allowedRoles: ['admin'], // Strictly admin only
    isEnabled: true,
    order: 9,
    badge: 'Admin Only',
    version: '2.5.0',
    isCore: false,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'modules',
    code: 'MOD_MANAGER',
    name: 'Manajemen Modul & Tata Menu',
    label: 'Manajemen Modul',
    description: 'Sistem kontrol modul plug-and-play untuk mengaktifkan, menonaktifkan, menyusun urutan menu, dan hak akses per modul.',
    iconName: 'Blocks',
    path: 'pengaturan.html?tab=modules',
    category: 'Sistem & Keamanan',
    allowedRoles: ['admin'], // Strictly admin only
    isEnabled: true,
    order: 10,
    badge: 'Sistem',
    version: '2.5.0',
    isCore: true,
    author: 'BUANA STUDIOS',
  },
  {
    id: 'pengaturan',
    code: 'MOD_SETTINGS',
    name: 'Pengaturan Sekolah & Cadangan Data',
    label: 'Pengaturan & Backup',
    description: 'Konfigurasi profil sekolah (NPSN, NSS), kalender akademik, dan pencadangan basis data lokal (JSON).',
    iconName: 'Settings',
    path: 'pengaturan.html',
    category: 'Administrasi',
    allowedRoles: ['admin', 'kepala_sekolah', 'tata_usaha', 'wali_kelas'],
    isEnabled: true,
    order: 11,
    version: '2.5.0',
    isCore: true,
    author: 'BUANA STUDIOS',
  },
];

/**
 * Dynamic Icon Component Renderer
 */
export const renderModuleIcon = (iconName: string, className = 'w-5 h-5'): React.ReactNode => {
  switch (iconName) {
    case 'LayoutDashboard':
      return <LayoutDashboard className={className} />;
    case 'ArrowLeftRight':
      return <ArrowLeftRight className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Printer':
      return <Printer className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Blocks':
      return <Blocks className={className} />;
    case 'Settings':
      return <Settings className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

/**
 * Security Rule: Check if a user role is allowed to view/access a module
 */
export const isUserAuthorizedForModule = (
  module: AppModuleDefinition,
  userRole: UserRole
): boolean => {
  if (!module.isEnabled) return false;
  return module.allowedRoles.includes(userRole);
};
