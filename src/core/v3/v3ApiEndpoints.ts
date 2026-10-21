import type { V3ApiEndpointDefinition } from '../../types/v3';

export const v3ApiEndpointCatalog: V3ApiEndpointDefinition[] = [
  // 1. SIS
  {
    method: 'GET',
    path: '/api/v3/sis/students',
    pillar: 'SIS',
    summary: 'Daftar Lengkap Siswa & Status Siklus Hidup',
    description: 'Mengambil data siswa per kampus/cabang dengan filter status siklus (APPLICANT, ENROLLED, ACTIVE, ALUMNUS).',
    requiredRole: ['super_admin', 'school_admin', 'teacher', 'accountant'],
    responseSample: {
      count: 24,
      students: [
        {
          id: 'std_v3_001',
          fullName: 'Ahmad Syauqi Ramadhan',
          nisn: '0123456789',
          cohort: '6-A',
          status: 'ACTIVE',
          medicalAlerts: ['Alergi Kacang'],
          guardians: [{ name: 'Ir. H. Ridwan Kamil', relation: 'Ayah' }]
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v3/sis/students/:id/lifecycle',
    pillar: 'SIS',
    summary: 'Transisi Status Siklus Hidup Siswa (Lifecycle Update)',
    description: 'Memperbarui tahapan status siswa dari ENROLLED menjadi ACTIVE, ON_LEAVE, atau GRADUATED.',
    requiredRole: ['super_admin', 'school_admin'],
    requestSample: {
      targetStatus: 'GRADUATED',
      graduationDate: '2026-06-25',
      alumniNotes: 'Lulus dengan predikat cumlaude'
    },
    responseSample: {
      success: true,
      message: 'Status siklus hidup siswa berhasil diperbarui ke GRADUATED.'
    }
  },
  {
    method: 'GET',
    path: '/api/v3/sis/staff',
    pillar: 'SIS',
    summary: 'Direktori Staf, Dosen & Beban Mengajar',
    description: 'Menampilkan data kualifikasi gelar, jenis kontrak kerja (Permanent/Full-time/Honorer), dan alokasi jam mengajar per minggu.',
    requiredRole: ['super_admin', 'school_admin'],
    responseSample: {
      count: 12,
      staff: [
        {
          nip: '197508202005012003',
          name: 'Syamsul Bahri, S.Pd.I., Gr.',
          contractType: 'PERMANENT',
          teachingHoursWeekly: 24,
          departments: ['Pendidikan Agama Islam']
        }
      ]
    }
  },

  // 2. Academics
  {
    method: 'GET',
    path: '/api/v3/academics/timetable',
    pillar: 'Academics',
    summary: 'Jadwal Pelajaran & Deteksi Tabrakan (Conflict Engine)',
    description: 'Mengembalikan slot jadwal mingguan beserta hasil kalkulasi bentrok waktu guru (Teacher Collision) dan ruang (Room Collision).',
    requiredRole: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
    responseSample: {
      totalSlots: 45,
      conflictsDetected: 0,
      slots: [
        {
          day: 1,
          time: '07:30 - 09:00',
          subject: 'Matematika Terapan',
          teacher: 'Ahmad Fauzi, S.Pd.',
          room: 'R. 601',
          cohort: '6-A'
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v3/academics/attendance/log',
    pillar: 'Academics',
    summary: 'Pencatatan Presensi & Pemicu Notifikasi Ketidakhadiran',
    description: 'Mencatat status Hadir/Sakit/Izin/Alpa. Secara otomatis memicu notifikasi instan ke nomor WhatsApp/Email wali murid jika siswa tidak hadir.',
    requiredRole: ['super_admin', 'school_admin', 'teacher'],
    requestSample: {
      date: '2026-10-21',
      studentId: 'std_v3_001',
      status: 'ALPA',
      sendParentAlert: true
    },
    responseSample: {
      success: true,
      alertDispatched: true,
      channel: 'SMS_WA_GATEWAY',
      recipientPhone: '08122334455'
    }
  },

  // 3. Assessment & Grading
  {
    method: 'GET',
    path: '/api/v3/assessment/gradebook',
    pillar: 'Assessment',
    summary: 'Buku Nilai Multi-Skala (GPA 4.0, Persentase, Deskriptif Merdeka)',
    description: 'Mengambil rekapitulasi penilaian tugas, UTS, UAS, konversi bobot otomatis, dan deskripsi capaian kompetensi.',
    requiredRole: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'],
    responseSample: {
      gradingScale: 'GPA_4',
      passingGrade: 75,
      entries: [
        {
          studentName: 'Ahmad Syauqi Ramadhan',
          subject: 'Matematika',
          weightedScore: 89.5,
          letterGrade: 'A',
          gpa: 3.85,
          competency: 'Sangat terampil dalam operasi matriks dan penalaran logika numerik.'
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v3/assessment/reports/bulk-generate',
    pillar: 'Assessment',
    summary: 'Penerbitan Rapor & Transkrip Massal Sekali Klik',
    description: 'Menghasilkan transkrip nilai digital siap cetak yang dilengkapi stempel sekolah, QR Code verifikasi otentisitas, dan analisis grafik capaian.',
    requiredRole: ['super_admin', 'school_admin', 'teacher'],
    requestSample: {
      cohortId: 'cohort_6a',
      academicTerm: 'Semester 1 Ganjil 2026/2027',
      includeRankings: true
    },
    responseSample: {
      generatedCount: 28,
      downloadArchiveUrl: 'https://cdn.buana.school/transcripts/cohort_6a_2026_sem1.pdf'
    }
  },

  // 4. Finance & Operations
  {
    method: 'GET',
    path: '/api/v3/finance/invoices',
    pillar: 'Finance',
    summary: 'Manajemen Faktur Tagihan Siswa & Multi-Mata Uang',
    description: 'Daftar faktur SPP bulanan, uang gedung, transportasi, beserta denda keterlambatan otomatis dan status pembayaran.',
    requiredRole: ['super_admin', 'school_admin', 'accountant', 'parent'],
    responseSample: {
      currency: 'IDR',
      totalUnpaid: 4500000,
      invoices: [
        {
          invoiceNo: 'INV-2026-10-0081',
          student: 'Ahmad Syauqi Ramadhan',
          category: 'TUITION_SPP',
          amount: 650000,
          status: 'UNPAID',
          dueDate: '2026-10-10',
          latePenalty: 32500
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v3/finance/payments/checkout',
    pillar: 'Finance',
    summary: 'Payment Gateway White-Label (Stripe, Midtrans VA, Bank Transfer)',
    description: 'Inisialisasi checkout pembayaran tagihan sekolah secara online dengan gateway multi-kanal.',
    requiredRole: ['super_admin', 'accountant', 'parent'],
    requestSample: {
      invoiceId: 'inv_881',
      gateway: 'MIDTRANS_VA',
      customerEmail: 'wali.syauqi@gmail.com'
    },
    responseSample: {
      paymentUrl: 'https://app.midtrans.com/snap/v2/vtweb/demo-token-123',
      virtualAccountNumber: '8888012345678901',
      expiresInMinutes: 1440
    }
  },
  {
    method: 'GET',
    path: '/api/v3/finance/payroll',
    pillar: 'Finance',
    summary: 'Penggajian Karyawan & Guru Berdasarkan Kehadiran/Kontrak',
    description: 'Perhitungan gaji pokok, insentif jam mengajar, dan potongan absensi secara transparan.',
    requiredRole: ['super_admin', 'accountant'],
    responseSample: {
      monthYear: 'Oktober 2026',
      totalDisbursed: 48500000,
      staffCount: 14
    }
  },

  // 5. Communication
  {
    method: 'GET',
    path: '/api/v3/communication/notices',
    pillar: 'Communication',
    summary: 'Papan Pengumuman Multi-Kanal (Web, Email, SMS/WA)',
    description: 'Menampilkan pengumuman resmi institusi dengan segmentasi target audiens (Seluruh Civitas, Khusus Guru, Wali Murid, Siswa).',
    requiredRole: ['super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant'],
    responseSample: {
      count: 5,
      notices: [
        {
          id: 'ntc_01',
          title: 'Pelaksanaan Asesmen Sumatif Tengah Semester Ganjil',
          priority: 'HIGH',
          channels: ['IN_APP', 'EMAIL', 'SMS_WA'],
          publishedAt: '2026-10-20'
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v3/communication/messages',
    pillar: 'Communication',
    summary: 'Kirim Pesan Terenkripsi & Termonitor (Guru - Orang Tua)',
    description: 'Saluran komunikasi aman antar guru dan wali murid terkait perkembangan akademik dan kepribadian siswa.',
    requiredRole: ['super_admin', 'school_admin', 'teacher', 'parent'],
    requestSample: {
      recipientId: 'parent_syauqi',
      relatedStudent: 'Ahmad Syauqi Ramadhan',
      messageContent: 'Bapak, mohon konfirmasi keikutsertaan Syauqi pada Olimpiade Sains pekan depan.'
    },
    responseSample: {
      messageId: 'msg_9981',
      status: 'SENT',
      deliveredAt: '2026-10-21T07:45:00Z'
    }
  },

  // 6. Addons
  {
    method: 'GET',
    path: '/api/v3/addons/admissions/pipeline',
    pillar: 'Addons',
    summary: 'CRM Penerimaan Siswa Baru (PPDB Pipeline)',
    description: 'Melacak konversi calon siswa dari Inquiry -> Pendaftar -> Tes Akademik -> Wawancara -> Diterima -> Daftar Ulang.',
    requiredRole: ['super_admin', 'school_admin'],
    responseSample: {
      activeIntakeYear: '2027/2028',
      stages: {
        INQUIRY: 42,
        APPLIED: 28,
        INTERVIEW: 15,
        ENROLLED: 12
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v3/addons/assets-and-library',
    pillar: 'Addons',
    summary: 'Inventaris Sarpras & Sirkulasi Perpustakaan',
    description: 'Pencatatan aset proyektor/komputer/alat lab dan sirkulasi peminjaman buku perpustakaan dengan penghitung denda otomatis.',
    requiredRole: ['super_admin', 'school_admin', 'teacher', 'student'],
    responseSample: {
      totalCampusAssets: 128,
      activeBookLoans: 14,
      totalBooksInCatalogue: 2450
    }
  },

  // 7. White-Label & Multi-Campus
  {
    method: 'PATCH',
    path: '/api/v3/governance/whitelabel/branding',
    pillar: 'WhiteLabel',
    summary: 'Kustomisasi Tema, Logo, Domain & Terminologi Institusi',
    description: 'Menyetel warna primer/aksen, favicon, domain mandiri, footer, dan kamus istilah sekolah (K-12, Kampus, Pesantren, SMK).',
    requiredRole: ['super_admin'],
    requestSample: {
      tenantId: 'tenant-sd-muh-2',
      primaryColor: '#135bec',
      customDomain: 'portal.sdmuhammadiyah2bdg.sch.id',
      activeTier: 'k12'
    },
    responseSample: {
      success: true,
      message: 'Konfigurasi white-label berhasil disimpan dan diterapkan secara instan.'
    }
  }
];
