export type UserRole = 'wali_kelas' | 'kepala_sekolah' | 'tata_usaha' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  assignedClass?: number; // 1-6 for homeroom teachers
  nip?: string;
  signatureUrl?: string; // Data URL or SVG string
  email?: string;
}

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  nss: string;
  kodeSekolah: string;
  alamatSekolah: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  tahunPelajaran: string; // e.g. "2023 - 2024" or "2024 - 2025"
  kepalaSekolahNama: string;
  kepalaSekolahNip: string;
  kepalaSekolahTtd?: string;
  logoUrl?: string;
}

export type Gender = 'L' | 'P';

export type MutationType = 'masuk' | 'keluar';

export interface StudentMutation {
  id: string;
  type: MutationType;
  noUrut: number;
  tanggal: string; // YYYY-MM-DD
  namaSiswa: string;
  jenisKelamin: Gender;
  noInduk: string; // NIS
  nisn: string; // NISN
  kelas: number; // 1 to 6

  // Specific to Mutasi Keluar
  noSuratPindah?: string;
  keteranganPindah?: string; // Pindah ke mana & alasan

  // Specific to Mutasi Masuk
  asalSekolah?: string;
  noIndukAsal?: string;
  kelasAsal?: string;
  persetujuanKanwilTgl?: string;
  persetujuanKanwilNomor?: string;

  // Metadata
  bulan: number; // 1-12
  tahun: number;
  tahunPelajaran: string;
  createdById?: string;
  createdAt: string;
}

export interface PhysicalHealthRecord {
  tahunPelajaran: string;
  tinggiBadanGanjil?: number;
  tinggiBadanGenap?: number;
  beratBadanGanjil?: number;
  beratBadanGenap?: number;
  pendengaran?: string;
  penglihatan?: string;
  gigi?: string;
  lainnya?: string;
}

export interface SubjectGrade {
  mapelId: string;
  mapelNama: string;
  kategori: 'Agama' | 'Umum' | 'Muatan Lokal';
  nilaiGanjil?: number;
  capaianGanjil?: string;
  kktpGanjil?: number;
  nilaiGenap?: number;
  capaianGenap?: string;
  kktpGenap?: number;
}

export interface Extracurricular {
  nama: string; // e.g. Hizbul Wathan/Pramuka, Tapak Suci, Tahfidz
  nilaiGanjil?: string; // Sangat Baik, Baik, etc.
  keteranganGanjil?: string;
  nilaiGenap?: string;
  keteranganGenap?: string;
}

export interface AttendanceRecord {
  sakitSem1: number;
  izinSem1: number;
  alpaSem1: number;
  sakitSem2: number;
  izinSem2: number;
  alpaSem2: number;
}

export interface HistoricalSemesterScore {
  semesterLabel: string; // e.g. "Kelas 1 Sem 1", "Kelas 1 Sem 2"
  tahunPelajaran: string;
  nilaiRataRata: number;
  kehadiranPersen: number;
  scores: { [mapelNama: string]: number };
}

export interface CocurricularProject {
  id: string;
  tema: string; // e.g. "Kearifan Lokal", "Gaya Hidup Berkelanjutan", "Kewirausahaan"
  judulProjek: string;
  deskripsi: string;
  dimensi: string[]; // e.g. ["Beriman & Bertakwa", "Gotong Royong", "Kreatif"]
  capaian: 'Mulai Berkembang' | 'Sedang Berkembang' | 'Berkembang Sesuai Harapan' | 'Sangat Berkembang';
  keterangan: string;
}

export interface StudentContribution {
  id: string;
  tanggal: string;
  jenis: 'Prestasi Lomba' | 'Karya / Inovasi' | 'Kepemimpinan' | 'Sosial & Keagamaan' | 'Kontribusi Sekolah';
  judul: string;
  tingkat?: 'Sekolah' | 'Kecamatan' | 'Kota' | 'Provinsi' | 'Nasional';
  penghargaan?: string; // e.g. "Juara 1 Lomba Kaligrafi Pentas PAI", "Ketua Regu HW", "Duta Adiwiyata"
  deskripsi: string;
  fotoUrl?: string;
}

export interface StudentMasterRecord {
  id: string;
  noUrutBukuInduk: number;
  noInduk: string; // NIS
  nisn: string;
  nik: string;
  noKk: string;
  kelas: number;
  tahunPelajaran: string;
  tahunMasuk: number;
  tahunKeluarLulus?: number;
  statusSiswa: 'Aktif' | 'Mutasi Masuk' | 'Mutasi Keluar' | 'Lulus';
  pasFotoUrl?: string;

  // A. Keterangan Pribadi
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: string;
  kewarganegaraan: string;
  anakKe: number;
  jumlahSaudaraKandung: number;
  jumlahSaudaraSambung: number;
  bahasaSehariHari: string;
  golonganDarah: string;
  alamatTinggal: {
    jalan: string;
    rtRw: string;
    desaKelurahan: string;
    kecamatan: string;
    kabupatenKota: string;
    provinsi: string;
    kodePos: string;
    noTelepon?: string;
  };
  bertempatTinggalPada: string; // 'Orang Tua' | 'Menumpang' | 'Asrama' | etc
  jarakKeSekolahKm?: string;

  // B. Keterangan Orang Tua / Wali
  orangTua: {
    namaAyah: string;
    namaIbu: string;
    pendidikanAyah: string;
    pendidikanIbu: string;
    pekerjaanAyah: string;
    pekerjaanIbu: string;
    namaWali?: string;
    hubunganWali?: string;
    pendidikanWali?: string;
    pekerjaanWali?: string;
  };

  // C. Perkembangan
  pendidikanSebelumnya: {
    jenisMasuk: 'Siswa Baru' | 'Pindahan';
    asalSekolah?: string;
    tanggalSttb?: string;
    noSttb?: string;
    dariTingkat?: string;
    diterimaTanggal?: string;
    noSuratKeterangan?: string;
  };

  // D. Beasiswa
  beasiswa?: string;

  // E. Meninggalkan Sekolah
  meninggalkanSekolah?: {
    alasan?: 'Lulus' | 'Pindah' | 'Keluar';
    tahunLulus?: string;
    noIjazah?: string;
    melanjutkanKe?: string;
    pindahKeSekolah?: string;
    pindahTingkat?: string;
    alasanKeluar?: string;
    tanggalKeluar?: string;
  };

  // F. Fisik & Kesehatan
  catatanKesehatan: PhysicalHealthRecord[];

  // Capaian Pembelajaran Kurikulum Merdeka (Rapor Lembar IV)
  grades: SubjectGrade[];
  extracurriculars: Extracurricular[];
  attendance: AttendanceRecord;
  kenaikanKelas?: {
    status: 'Naik' | 'Tinggal' | 'Belum Ditetapkan';
    keKelas?: number;
    tanggalKetetapan?: string;
    waliKelasNama?: string;
    waliKelasNip?: string;
  };

  // Live Comprehensive Student Profile & School Hall Public Record
  historicalScores: HistoricalSemesterScore[];
  cocurriculars: CocurricularProject[];
  contributions: StudentContribution[];
}

export interface MonthlyClassRekap {
  kelas: number;
  awalL: number;
  awalP: number;
  awalTotal: number;
  masukL: number;
  masukP: number;
  masukTotal: number;
  keluarL: number;
  keluarP: number;
  keluarTotal: number;
  akhirL: number;
  akhirP: number;
  akhirTotal: number;
  keterangan?: string;
}

export interface MonthlyRekapitulasi {
  bulan: number; // 1-12 (Juli=7 ... Juni=6)
  tahun: number;
  tahunPelajaran: string;
  items: MonthlyClassRekap[];
  totalAwalL: number;
  totalAwalP: number;
  totalAwal: number;
  totalMasukL: number;
  totalMasukP: number;
  totalMasuk: number;
  totalKeluarL: number;
  totalKeluarP: number;
  totalKeluar: number;
  totalAkhirL: number;
  totalAkhirP: number;
  totalAkhir: number;
}
