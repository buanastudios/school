import type { DynamicTerminology, SchoolTier } from '../../types/v3';

export const standardTerminologyPresets: Record<SchoolTier, DynamicTerminology> = {
  k12: {
    tier: 'k12',
    labelGrade: 'Kelas / Tingkat',
    labelTeacher: 'Guru / Wali Kelas',
    labelStudent: 'Siswa / Murid',
    labelClass: 'Rombongan Belajar (Rombel)',
    labelReportCard: 'Buku Rapor Siswa',
    labelHeadmaster: 'Kepala Sekolah',
  },
  higher_ed: {
    tier: 'higher_ed',
    labelGrade: 'Tahun / Semester',
    labelTeacher: 'Dosen / Profesor',
    labelStudent: 'Mahasiswa / Praja',
    labelClass: 'Kelas Perkuliahan / Seksi',
    labelReportCard: 'Kartu Hasil Studi (KHS) / Transkrip',
    labelHeadmaster: 'Rektor / Dekan',
  },
  pesantren: {
    tier: 'pesantren',
    labelGrade: 'Marhalah / Mustawa',
    labelTeacher: 'Ustadz / Asatidz / Pengasuh',
    labelStudent: 'Santriwan / Santriwati',
    labelClass: 'Halaqah / Jamiah',
    labelReportCard: 'Syahadah / Buku Nilai Pondok',
    labelHeadmaster: 'Kyai / Mudirul Ma\'had',
  },
  vocational: {
    tier: 'vocational',
    labelGrade: 'Tingkat Kejuruan',
    labelTeacher: 'Instruktur / Guru Produktif',
    labelStudent: 'Taruna / Siswa Praktik',
    labelClass: 'Bengkel / Studio / Rombel',
    labelReportCard: 'Sertifikat Kompetensi & Rapor',
    labelHeadmaster: 'Kepala SMK / Direktur Diklat',
  },
  adult_learning: {
    tier: 'adult_learning',
    labelGrade: 'Learning Level',
    labelTeacher: 'Trainer / Facilitator',
    labelStudent: 'Participant / Fellow',
    labelClass: 'Cohort / Workshop Group',
    labelReportCard: 'Certificate of Achievement',
    labelHeadmaster: 'Program Director / Lead',
  },
};

export class TerminologyEngine {
  private activeTier: SchoolTier = 'k12';
  private customOverrides: Partial<DynamicTerminology> = {};

  constructor(initialTier: SchoolTier = 'k12', overrides?: Partial<DynamicTerminology>) {
    this.activeTier = initialTier;
    if (overrides) this.customOverrides = overrides;
  }

  public setTier(tier: SchoolTier): void {
    this.activeTier = tier;
  }

  public getTier(): SchoolTier {
    return this.activeTier;
  }

  public setOverrides(overrides: Partial<DynamicTerminology>): void {
    this.customOverrides = overrides;
  }

  public getTerms(): DynamicTerminology {
    const base = standardTerminologyPresets[this.activeTier];
    return {
      ...base,
      ...this.customOverrides,
    };
  }
}
