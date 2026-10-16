import type { StudentMasterRecord, SubjectGrade } from '../types';

/**
 * Exact student record for SYAUQI HAFIDZ MUJAHIDDIN
 * Perfectly transcribed from the official reference PDF (Pages 1-11)
 */
export const syauqiMasterRecord: StudentMasterRecord = {
  id: 'std-syauqi',
  noUrutBukuInduk: 115,
  noInduk: '2526060115',
  nisn: '3139330030',
  nik: '3273160612130001',
  noKk: '3273161205100002',
  kelas: 6,
  fase: 'C',
  tahunPelajaran: '2025/2026',
  tahunMasuk: 2020,
  statusSiswa: 'Aktif',
  namaLengkap: 'SYAUQI HAFIDZ MUJAHIDDIN',
  namaPanggilan: 'Syauqi',
  jenisKelamin: 'L',
  tempatLahir: 'Bandung',
  tanggalLahir: '2013-12-06', // 06 Desember 2013
  agama: 'Islam',
  kewarganegaraan: 'Indonesia',
  statusDalamKeluarga: 'Anak Kandung',
  anakKe: 1,
  jumlahSaudaraKandung: 1,
  jumlahSaudaraSambung: 0,
  bahasaSehariHari: 'Indonesia',
  golonganDarah: 'O',
  alamatTinggal: {
    jalan: 'Jl. Parahyangan No. 18 RT.01 RW. 08',
    rtRw: '01 / 08',
    desaKelurahan: 'Cipadung Kulon',
    kecamatan: 'Panyileukan',
    kabupatenKota: 'Kota Bandung',
    provinsi: 'Prov. Jawa Barat',
    kodePos: '40614',
    noTelepon: '6285720502217',
  },
  bertempatTinggalPada: 'Orang Tua',
  jarakKeSekolahKm: '6',
  orangTua: {
    namaAyah: 'Arti Hikmatullah Perbawana Sakti Buana',
    namaIbu: 'Astrid Nurul Falah',
    pendidikanAyah: 'S1',
    pendidikanIbu: 'S1',
    pekerjaanAyah: 'Karyawan Swasta',
    pekerjaanIbu: 'Karyawan Swasta',
  },
  pendidikanSebelumnya: {
    jenisMasuk: 'Siswa Baru',
    asalSekolah: '-',
    diterimaTanggal: '2025-07-15', // 15 Juli 2025
    dariTingkat: '-',
  },
  catatanKesehatan: [
    {
      tahunPelajaran: '2025/2026',
      tinggiBadanGanjil: 148,
      tinggiBadanGenap: 151,
      beratBadanGanjil: 41,
      beratBadanGenap: 43,
      pendengaran: 'Baik',
      penglihatan: 'Baik (Normal)',
      gigi: 'Baik',
    },
  ],
  attendance: {
    sakitSem1: 0,
    izinSem1: 1,
    alpaSem1: 0,
    sakitSem2: 0,
    izinSem2: 0,
    alpaSem2: 0,
  },
  catatanWaliKelasSem1:
    'Ananda memiliki potensi yang baik, namun disiplin belajar masih perlu ditingkatkan. Guru melihat bahwa ketika Ananda benar-benar fokus, hasilnya sangat memuaskan. Oleh karena itu, pembiasaan mencatat tugas, mengatur jadwal, dan menyelesaikan pekerjaan tepat waktu akan sangat membantu perkembangan akademik Ananda. Dengan sedikit perubahan kebiasaan, kemampuan Ananda akan menonjol dengan sendirinya',
  catatanWaliKelasSem2:
    'Alhamdulillah ananda telah menjalani semester akhirnya dengan baik, bersemangatlah dalam kebaikan dengan mempertahankannya sampai di tahap berikutnya dan jadilah pribadi yang lebih baik di jenjang selanjutnya, terutama dalam masalah adab.',
  kokurikulerSem1:
    'Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan, yang ditunjukkan melalui kegiatan kokurikuler Proyek Tidur Cepat dan Bangun Pagi. Pada dimensi keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa, ananda berkembang dalam subdimensi hubungan dengan Tuhan Yang Maha Esa. Pada dimensi penalaran kritis, ananda cakap dalam subdimensi penyelesaian masalah. Pada dimensi kesehatan, ananda cakap dalam subdimensi kebugaran, kesehatan fisik, dan kesehatan mental.',
  kokurikulerSem2:
    'Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan, yang ditunjukkan melalui kegiatan kokurikuler Gerakan Mencintai Tradisi dan Budaya Nusantara. Pada dimensi kewargaan, ananda cakap dalam subdimensi kewargaan lokal. Pada dimensi kemandirian, ananda cakap dalam subdimensi pengembangan diri. Pada dimensi kolaborasi, ananda cakap dalam subdimensi kerja sama.',
  ekskulSem1: [
    {
      nama: 'Attiera',
      predikat: 'Baik',
      keterangan:
        'Baik, Ananda menunjukkan penguasaan dalam kegiatan pengenalan alat camping, survival, dan pembuatan tenda; baris-berbaris; tali-temali; navigasi; serta hiking, botani zoologi, dan pembuatan api menggunakan kayu bakar.',
    },
  ],
  ekskulSem2: [
    {
      nama: 'Attiera',
      predikat: 'Baik',
      keterangan:
        'Baik, Ananda menunjukkan penguasaan dalam kegiatan cara menangani luka di alam dan membuat bidai; belajar sandi morse; membuat tenda; camping; serta outbond.',
    },
    {
      nama: 'Hizbul Wathan',
      predikat: 'Sangat Baik',
      keterangan:
        'Menunjukkan perkembangan yang sangat baik dalam kegiatan kepanduan Hizbul Wathan. Siswa mampu bekerja sama dengan kelompok, memahami esensi kepanduan, serta memiliki kedisiplinan dan rasa tanggung jawab yang tinggi dalam menuntaskan tugas-tugas latihan.',
    },
  ],
  kelulusanStatus: 'Lulus',
  tglRaporSem1: 'Kota Bandung, 22 Desember 2025',
  tglRaporSem2: 'Kota Bandung, 02 Juni 2026',
  waliKelasNama: 'Syamsul Bahri, S.Pd.I., Gr.',
  waliKelasNuptk: '7035768669130423',
  waliKelasNip: 'NUPTK. 7035768669130423',
  kepalaSekolahNama: 'Tete Rohaeni, S.Pd., M.M.',
  kepalaSekolahNip: '-',
  extracurriculars: [
    {
      nama: 'Attiera (Survival & Camping)',
      nilaiGanjil: 'Baik',
      nilaiGenap: 'Baik',
    },
    {
      nama: 'Hizbul Wathan (Kepanduan)',
      nilaiGanjil: 'Baik',
      nilaiGenap: 'Sangat Baik',
    },
  ],
  grades: [
    {
      mapelId: 'm-pai',
      mapelNama: 'Pendidikan Agama Islam dan Budi Pekerti',
      kategori: 'Agama',
      kelompok: 'Kelompok A',
      nilaiGanjil: 90,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal mampu memahami hukum halal dan haram, dapat mengklasifikasikan hal-hal yang halal dan haram, mampu mengemukakan pesan pokok Q.S. ad-Dhuha, as-Syarh dan hukum bacaan, mampu mengklasifikasikan perilaku meminta maaf dan memberi maaf, mampu menganalisis jasa-jasa Khalifah Abu Bakar As-Sidiq dan Umar bin Khattab.',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal mampu mengemukakan arti Asmaul Husna al-Ghaffar, al-\'Afuww, al-Wahid dan ash-Shomad.',
      nilaiGenap: 91,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal Iman kepada Qada Qadar: Menjelaskan pengertian, hikmah, dan perilaku tawakal dalam hidup., Baca Al-Qur\'an: Membaca surah Al-Insyirah, At-Tin lancar sesuai tajwid dan adab membaca., Fikih Ibadah: Memahami haji, umrah, kurban, syarat rukunnya serta hikmah beribadah..',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal Akhlak terpuji: Meneladani akhlak Nabi, menjaga persatuan, toleransi antar umat beragama.',
    },
    {
      mapelId: 'm-pancasila',
      mapelNama: 'Pendidikan Pancasila',
      kategori: 'Umum',
      kelompok: 'Kelompok A',
      nilaiGanjil: 93,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal menganalisis penerapan nilai-nilai luhur dari sila Pancasila dalam kehidupan sehari-hari di lingkungan sekolah, keluarga, dan masyarakat., mengidentifikasi keberagaman karakteristik individu di lingkungan sekitar (suku, agama, budaya, gender, dll.), menunjukkan sikap tanggung jawab dan kepedulian terhadap lingkungan alam dan sosial sebagai cerminan nilai-nilai sila pertama dan kedua..',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal contoh tindakan yang menunjukkan perilaku gotong royong dan musyawarah sebagai bentuk pengamalan sila.',
      nilaiGenap: 95,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal peranan penting gotong royong dalam kehidupan bermasyarakat di lingkungan sekolah atau rumah., hubungan antara hak dan kewajiban sebagai warga negara perilaku bertanggungjawab dalam kehidupan, cara menjaga persatuan dan kesatuan bangsa di tengah keragaman budaya Nusantara..',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal penerapan nilai-nilai Pancasila dalam kehidupan digital (seperti bermedia sosial).',
    },
    {
      mapelId: 'm-indo',
      mapelNama: 'Bahasa Indonesia',
      kategori: 'Umum',
      kelompok: 'Kelompok A',
      nilaiGanjil: 95,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal menyimpulkan ide pokok dan informasi penting dari berbagai teks lisan (pidato, wawancara, atau paparan berita) yang disajikan dengan jelas, mengidentifikasi pesan moral, nilai-nilai, atau amanat yang terkandung dalam cerita atau dongeng, menemukan informasi tersurat dan tersirat dari dua atau lebih teks nonfiksi (misalnya, teks eksplanasi atau laporan ilmiah sederhana)..',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal menganalisis unsur intrinsik (tokoh, latar, alur, tema) dan ekstrinsik (nilai moral/budaya) dalam teks fiksi.',
      nilaiGenap: 93,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal menyimpulkan pesan moral, tokoh, dan latar dari teks narasi/fiksi yang kompleks secara mandiri, membedakan fakta dan opini dari teks nonfiksi, berita, atau artikel ilmiah ramah anak., menyusun sebuah karya tulis ilmiah sederhana atau laporan hasil pengamatan dengan struktur teks yang benar dan ejaan yang disempurnakan',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal mampu berpartisipasi aktif dalam diskusi formal (debat sederhana atau musyawarah kelas) dengan menyampaikan pendapat yang disertai alasan logis.',
    },
    {
      mapelId: 'm-mtk',
      mapelNama: 'Matematika (Umum)',
      kategori: 'Umum',
      kelompok: 'Kelompok A',
      nilaiGanjil: 88,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal menjelaskan pengertian, membandingkan, dan mengurutkan bilangan bulat positif dan negatif (termasuk nol) pada garis bilangan, menghitung luas permukaan bangun ruang (kubus, balok, prisma, dan limas) dengan menggunakan rumus yang relevan.',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal melakukan operasi hitung campuran yang melibatkan bilangan bulat, sesuai dengan urutan operasi hitung yang benar, menghitung volume berbagai bangun ruang (kubus, balok, prisma, limas, tabung) dan membandingkan volume dua bangun ruang atau lebih.',
      nilaiGenap: 92,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal menghitung volume dan luas permukaan gabungan dari beberapa bangun ruang., mampu menyelesaikan masalah yang berkaitan dengan rasio, perbandingan senilai, dan penerapan skala, mengumpulkan, mengolah, dan menyajikan data acak ke dalam bentuk tabel frekuensi, diagram batang.',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal menganalisis data dengan menentukan nilai rata-rata (mean), nilai tengah (median).',
    },
    {
      mapelId: 'm-ipas',
      mapelNama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      kategori: 'Umum',
      kelompok: 'Kelompok A',
      nilaiGanjil: 92,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal mengidentifikasi komponen utama sistem gerak manusia (tulang, sendi, dan otot) serta menjelaskan fungsi spesifik dari masing-masing komponen., menjelaskan makna penting dari warisan sejarah sebagai fondasi pembentukan bangsa Indonesia., mengidentifikasi kondisi geografis, iklim, dan bentang alam utama di beberapa benua dan negara yang berbeda.',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal menjelaskan latar belakang, tujuan, dan struktur organisasi ASEAN sebagai bentuk kerja sama regional Indonesia..',
      nilaiGenap: 95,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal mampu membuat model atau simulasi sistem tata surya, menganalisis peristiwa-peristiwa penting dalam mempertahankan kemerdekaan Indonesia mengidentifikasi ciri-ciri era globalisasi dan menganalisis dampaknya terhadap kehidupan.',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal merancang solusi atau aksi nyata berskala kecil untuk melestarikan budaya lokal..',
    },
    {
      mapelId: 'm-seni',
      mapelNama: 'Seni Budaya',
      kategori: 'Umum',
      kelompok: 'Kelompok A',
      nilaiGanjil: 88,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal menjelaskan unsur-unsur penting dalam pembuatan reklame visual yang efektif, merancang dan membuat produk kerajinan fungsional atau hiasan dari bahan serat dengan rapi dan teliti.',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal mendesain dan membuat karya seni rupa tiga dimensi dengan memperhatikan proporsi dan detail, mempraktikkan minimal tiga teknik simpul dasar makrame, seperti: Simpul Kepala, Simpul Mati,dan Simpul Setengah dengan benar dan rapi.',
      nilaiGenap: 91,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal menganalisis makna dan teknik pembuatan karya seni rupa atau musik tradisional, menciptakan karya seni dua/tiga dimensi (Seni Rupa) atau mengaransemen musik/vokal sederhana, merencanakan dan mengorganisasi sebuah pameran karya seni rupa kelas, pertunjukan seni musik/tari.',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal memberikan apresiasi dan kritik seni yang santun serta konstruktif terhadap karya.',
    },
    {
      mapelId: 'm-pjok',
      mapelNama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
      kategori: 'Umum',
      kelompok: 'Kelompok A',
      nilaiGanjil: 96,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal Mempraktikan dan memahami variasi dengan kontrol yang baik dalam permainan bola kecil sederhana, Mempraktikan dan memahami variasi dan kombinasi untuk membentuk gerak dasar seni bela diri, Mempraktikan dan memahami variasi gerak dasar jalan cepat, lari jarak pendek/jauh, dan tolak peluru.',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal Mempraktikan dan memahami variasi dengan kontrol yang baik dalam permainan bola besar sederhana.',
      nilaiGenap: 91,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal Menerapkan kombinasi gerak dasar permainan bola besar & kecil sesuai peraturan, Menguasai teknik dasar atletik lari estafet, lompat tinggi gaya gunting, lempar lembing, Mempraktikkan rangkaian senam lantai & aerobik dengan keseimbangan dan kelentukan.',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal Menunjukkan sikap tanggung jawab, kerja sama, percaya diri, dan sportivitas dalam lomba.',
    },
    {
      mapelId: 'm-inggris',
      mapelNama: 'Bahasa Inggris',
      kategori: 'Umum',
      kelompok: 'Kelompok A',
      nilaiGanjil: 94,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal menggunakan to be masa lampau was dan were secara tepat sesuai dengan subjek kalimat menyatakan keadaan atau lokasi di masa lampau, menjelaskan fungsi Simple Past Tense untuk menceritakan kegiatan sehari-hari, menemukan kata kerja bentuk kedua (Verb 2) baik regular maupun irregular dalam teks naratif.',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal menggunakan Was dan were secara tepat sesuai kalimat.',
      nilaiGenap: 93,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal mampu menceritakan pengalaman masa lalu yang sederhana (simple past experience) secara lisan dan tulisan menggunakan kosakata yang tepat, mengungkapkan rencana masa depan (future plans) atau cita-cita mereka setelah lulus SD dengan struktur kalimat sederhana yang benar.',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal memberikan instruksi mengenai arah lokasi suatu tempat dalam situasi percakapan sehari-hari..',
    },
    {
      mapelId: 'm-sunda',
      mapelNama: 'Sastra dan Bahasa Sunda',
      kategori: 'Muatan Lokal',
      kelompok: 'Kelompok B',
      nilaiGanjil: 96,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal membaca dan menulis kata-kata sederhana dalam Aksara Sunda secara lengkap (menggabungkan rarakén dan ngalagena)., menulis teks narasi atau laporan pengalaman (pengalaman liburan, kegiatan sekolah) secara kreatif dan sesuai kaidah kebahasaan., menganalisis unsur-unsur intrinsik (tema, alur, amanat) dari teks fiksi (misalnya: dongéng atau legenda) dan menyimpulkan pesannya..',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal menggunakan ragam bahasa Sunda (Lemes dan Loma) secara tepat dan santun dalam berbagai situasi komunikasi lisan.',
      nilaiGenap: 93,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal menceritakan kembali teks biografi tokoh Sunda, peristiwa sejarah lokal menggunakan Basa yang santun, mengidentifikasi jenis-jenis kesenian tradisional Sunda, menerapkan kosakata budaya Sunda.',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal pembiasaan bercakap lisan dengan undak-usuk basa Sunda halus (Lemes) pada orang yang lebih tua.',
    },
    {
      mapelId: 'm-plh',
      mapelNama: 'Pendidikan Lingkungan Hidup',
      kategori: 'Muatan Lokal',
      kelompok: 'Kelompok B',
      nilaiGanjil: 93,
      capaianTinggiGanjil:
        'Mencapai Kompetensi dengan sangat baik dalam hal pengetahuan lingkungan saat dihadapkan pada pilihan yang merusak alam (misalnya: memilih produk ramah lingkungan)., mengevaluasi peran diri sendiri sebagai bagian dari ekosistem dan mempengaruhi teman-teman untuk terlibat aktif dalam pelestarian lingkungan., menilai pentingnya keberlanjutan sumber daya alam bagi generasi mendatang.',
      capaianPerluPeningkatanGanjil:
        'Perlu peningkatan dalam hal menerapkan proyek aksi nyata sederhana (misalnya: kampanye 3R, penanaman pohon) untuk menyelesaikan satu masalah lingkungan.',
      nilaiGenap: 89,
      capaianTinggiGenap:
        'Mencapai Kompetensi dengan sangat baik dalam hal mengidentifikasi jenis-jenis bencana alam yang sering terjadi di Indonesia, mengevaluasi menerapkan Pola Hidup Bersih dan Sehat (PHBS) di lingkungan sekolah.',
      capaianPerluPeningkatanGenap:
        'Perlu peningkatan dalam hal merancang dan melaksanakan aksi nyata pemanfaatan barang bekas.',
    },
  ],
  historicalScores: [
    {
      semesterLabel: 'Kelas 6 Sem 1',
      tahunPelajaran: '2025/2026',
      nilaiRataRata: 92.2,
      kehadiranPersen: 98.5,
      scores: {
        PAI: 90,
        Pancasila: 93,
        'B. Indo': 95,
        Matematika: 88,
        IPAS: 92,
        Seni: 88,
        PJOK: 96,
        English: 94,
        Sunda: 96,
        PLH: 93,
      },
    },
    {
      semesterLabel: 'Kelas 6 Sem 2',
      tahunPelajaran: '2025/2026',
      nilaiRataRata: 92.8,
      kehadiranPersen: 100,
      scores: {
        PAI: 91,
        Pancasila: 95,
        'B. Indo': 93,
        Matematika: 92,
        IPAS: 95,
        Seni: 91,
        PJOK: 91,
        English: 93,
        Sunda: 93,
        PLH: 89,
      },
    },
  ],
  cocurriculars: [
    {
      id: 'coc-syauqi-1',
      tema: 'Bangun Jiwa dan Raga',
      judulProjek: 'Proyek Tidur Cepat dan Bangun Pagi',
      deskripsi:
        'Penguatan kebiasaan disiplin waktu tidur, ibadah subuh tepat waktu, dan kebugaran jasmani.',
      dimensi: ['Beriman & Bertakwa', 'Penalaran Kritis', 'Kesehatan'],
      capaian: 'Sangat Berkembang',
      keterangan: 'Ananda sangat konsisten dan memimpin kelompok dengan baik.',
    },
    {
      id: 'coc-syauqi-2',
      tema: 'Kearifan Lokal & Bhinneka Tunggal Ika',
      judulProjek: 'Gerakan Mencintai Tradisi dan Budaya Nusantara',
      deskripsi:
        'Eksplorasi budaya daerah, tari tradisional, serta pembuatan kerajinan etnik.',
      dimensi: ['Kewargaan', 'Kemandirian', 'Kolaborasi'],
      capaian: 'Sangat Berkembang',
      keterangan: 'Ananda aktif mempresentasikan kebudayaan Sunda dan Nusantara.',
    },
  ],
  contributions: [
    {
      id: 'ctb-syauqi-1',
      tanggal: '2025-11-10',
      jenis: 'Prestasi Lomba',
      judul: 'Juara 1 Lomba Ketangkasan Kepanduan Attiera se-Bandung Raya',
      tingkat: 'Kota',
      penghargaan: 'Piala Bergilir & Medali Emas',
      deskripsi:
        'Memimpin regu putra dalam lomba navigasi alam bebas dan pembuatan bivak darurat.',
    },
  ],
};

/**
 * Standard Kurikulum Merdeka Elementary School Subject List
 */
export const defaultSchoolSubjects: Omit<SubjectGrade, 'nilaiGanjil' | 'nilaiGenap'>[] = [
  {
    mapelId: 'm-pai',
    mapelNama: 'Pendidikan Agama Islam dan Budi Pekerti',
    kategori: 'Agama',
    kelompok: 'Kelompok A',
  },
  {
    mapelId: 'm-pancasila',
    mapelNama: 'Pendidikan Pancasila',
    kategori: 'Umum',
    kelompok: 'Kelompok A',
  },
  {
    mapelId: 'm-indo',
    mapelNama: 'Bahasa Indonesia',
    kategori: 'Umum',
    kelompok: 'Kelompok A',
  },
  {
    mapelId: 'm-mtk',
    mapelNama: 'Matematika (Umum)',
    kategori: 'Umum',
    kelompok: 'Kelompok A',
  },
  {
    mapelId: 'm-ipas',
    mapelNama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    kategori: 'Umum',
    kelompok: 'Kelompok A',
  },
  {
    mapelId: 'm-seni',
    mapelNama: 'Seni Budaya',
    kategori: 'Umum',
    kelompok: 'Kelompok A',
  },
  {
    mapelId: 'm-pjok',
    mapelNama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
    kategori: 'Umum',
    kelompok: 'Kelompok A',
  },
  {
    mapelId: 'm-inggris',
    mapelNama: 'Bahasa Inggris',
    kategori: 'Umum',
    kelompok: 'Kelompok A',
  },
  {
    mapelId: 'm-sunda',
    mapelNama: 'Sastra dan Bahasa Sunda',
    kategori: 'Muatan Lokal',
    kelompok: 'Kelompok B',
  },
  {
    mapelId: 'm-plh',
    mapelNama: 'Pendidikan Lingkungan Hidup',
    kategori: 'Muatan Lokal',
    kelompok: 'Kelompok B',
  },
];

/**
 * Presets for Quick AI / Suggestion generation of Capaian Kompetensi
 */
export const subjectCompetencyPresets: Record<
  string,
  {
    tinggi: string[];
    peningkatan: string[];
  }
> = {
  'm-pai': {
    tinggi: [
      'mampu memahami hukum halal dan haram serta mengklasifikasikan hal-hal yang halal dan haram dalam kehidupan sehari-hari.',
      'Iman kepada Qada Qadar: Menjelaskan pengertian, hikmah, dan perilaku tawakal dalam hidup.',
      'mampu membaca ayat-ayat Al-Qur\'an pilihan dengan makhraj dan tajwid yang tepat serta menghafalkan doa sehari-hari.',
    ],
    peningkatan: [
      'mampu mengemukakan arti Asmaul Husna secara rinci dan menerapkannya dalam akhlak pribadi.',
      'meneladani akhlak Nabi dalam menjaga persatuan dan toleransi antar umat beragama.',
      'ketertiban dalam pelaksanaan shalat berjamaah dan hafalan doa qunut.',
    ],
  },
  'm-pancasila': {
    tinggi: [
      'menganalisis penerapan nilai-nilai luhur dari sila Pancasila dalam kehidupan sehari-hari di lingkungan sekolah, keluarga, dan masyarakat.',
      'mengidentifikasi keberagaman karakteristik individu di lingkungan sekitar serta menunjukkan toleransi yang tinggi.',
      'memahami peranan penting gotong royong dan musyawarah dalam kehidupan berbangsa.',
    ],
    peningkatan: [
      'menunjukkan contoh tindakan gotong royong dan musyawarah secara konsisten.',
      'penerapan nilai-nilai etika Pancasila dalam kehidupan digital dan penggunaan teknologi.',
      'kedisiplinan mematuhi tata tertib sekolah tanpa perlu diingatkan berkali-kali.',
    ],
  },
  'm-indo': {
    tinggi: [
      'menyimpulkan ide pokok dan informasi penting dari berbagai teks lisan dan bacaan dengan tepat.',
      'menemukan informasi tersurat dan tersirat serta menyusun teks narasi sederhana dengan ejaan yang disempurnakan.',
      'membedakan fakta dan opini dari artikel ilmiah ramah anak serta teks nonfiksi.',
    ],
    peningkatan: [
      'menganalisis unsur intrinsik (tokoh, latar, alur, tema) dan ekstrinsik dalam teks fiksi.',
      'berpartisipasi aktif dalam diskusi formal kelas dengan menyampaikan pendapat yang disertai alasan logis.',
      'pengayaan kosakata baku dalam menulis laporan hasil pengamatan.',
    ],
  },
  'm-mtk': {
    tinggi: [
      'menjelaskan pengertian, membandingkan, dan mengurutkan bilangan bulat positif dan negatif pada garis bilangan.',
      'menghitung luas permukaan dan volume berbagai bangun ruang (kubus, balok, prisma, tabung) dengan rumus yang relevan.',
      'menyelesaikan masalah berkaitan dengan pecahan, rasio perbandingan senilai, dan skala peta.',
    ],
    peningkatan: [
      'melakukan operasi hitung campuran bilangan bulat dengan ketelitian tinggi dan urutan operasi yang tepat.',
      'menganalisis penyajian data statistik dasar (mean, median, modus).',
      'kecepatan dalam menuntaskan soal cerita kontekstual bertingkat.',
    ],
  },
  'm-ipas': {
    tinggi: [
      'mengidentifikasi komponen utama sistem organ gerak manusia dan menjelaskan fungsinya dengan runtut.',
      'menjelaskan keterkaitan kondisi geografis bumi, tata surya, dan pemanfaatan sumber daya alam secara lestari.',
      'menganalisis peran sejarah bangsa Indonesia dan kerja sama regional ASEAN.',
    ],
    peningkatan: [
      'menjelaskan latar belakang, tujuan, dan struktur organisasi kerja sama regional.',
      'merancang solusi aksi nyata berskala kecil untuk pelestarian keanekaragaman hayati.',
      'ketepatan menyajikan bagan rantai makanan dalam ekosistem perairan.',
    ],
  },
  'm-seni': {
    tinggi: [
      'merancang dan membuat produk kerajinan fungsional dari bahan serat dan alam dengan rapi dan teliti.',
      'menganalisis makna karya seni rupa dua dimensi dan ornamen visual dekoratif Nusantara.',
      'mengekspresikan kreativitas melalui teknik warna dan komposisi gambar secara proporsional.',
    ],
    peningkatan: [
      'mendesain karya seni rupa tiga dimensi dengan detail dan kerapian teknik simpul makrame.',
      'memberikan apresiasi dan kritik seni yang santun serta membangun terhadap karya teman.',
      'kesabaran dalam menyelesaikan proses pengeringan dan pewarnaan karya kriya.',
    ],
  },
  'm-pjok': {
    tinggi: [
      'mempraktikkan dan memahami variasi gerak dasar permainan bola kecil dan bela diri dengan kontrol yang baik.',
      'menguasai teknik dasar atletik, kebugaran jasmani, serta senam lantai dengan keseimbangan prima.',
      'menerapkan sportivitas, kekompakan tim, dan kepatuhan pada peraturan olahraga.',
    ],
    peningkatan: [
      'mempraktikkan variasi manipulatif dalam permainan bola besar sederhana (sepak bola / bola voli).',
      'menjaga daya tahan fisik dan konsistensi peregangan sebelum beraktivitas berat.',
      'pemberian dukungan suportif kepada rekan satu tim saat tertinggal poin.',
    ],
  },
  'm-inggris': {
    tinggi: [
      'menggunakan kalimat past tense dan to be was/were secara tepat dalam menceritakan pengalaman lampau.',
      'mengungkapkan cita-cita masa depan (future plans) dengan tata bahasa dan pengucapan yang percaya diri.',
      'memahami kosakata fungsional teks naratif pendek dan dialog sehari-hari.',
    ],
    peningkatan: [
      'memberikan instruksi petunjuk arah jalan (giving directions) dalam situasi percakapan lisan.',
      'membedakan regular dan irregular verb bentuk kedua (V2) saat menulis cerita singkat.',
      'keberanian berbicara tanpa ragu dalam sesi speaking conversation.',
    ],
  },
  'm-sunda': {
    tinggi: [
      'maca jeung nulis kalimah basajan ngagunakeun Aksara Sunda kalawan merenah (rarakén & ngalagena).',
      'nyaritakeun deui dongéng, carita babad, atawa biografi pahlawan Jawa Barat make basa anu santun.',
      'ngalarapkeun undak-usuk basa Sunda dina paguneman sapopoé di sakola.',
    ],
    peningkatan: [
      'ngabiasakeun ngagunakeun ragam basa lemes nalika nyarios ka guru sareng sepuh.',
      'ngajembaran kawih Sunda jeung istilah kekecapan tradisional.',
      'kacapetan nulis rumpaka pupuh Maskumambang atawa Sinom.',
    ],
  },
  'm-plh': {
    tinggi: [
      'menunjukkan kepedulian tinggi terhadap pelestarian lingkungan hidup dan memilih produk ramah lingkungan.',
      'menerapkan Pola Hidup Bersih dan Sehat (PHBS) serta mitigasi bencana lingkungan di sekolah.',
      'memahami pentingnya konservasi air dan penghijauan sekolah adiwiyata.',
    ],
    peningkatan: [
      'merancang dan mengimplementasikan karya nyata pemanfaatan limbah organik dan daur ulang plastik (3R).',
      'mengajak dan memotivasi rekan sebaya untuk memilah sampah sesuai kategorinya.',
      'pemeliharaan tanaman obat keluarga (TOGA) secara berkelanjutan.',
    ],
  },
};

export const homeroomNotesPresets = [
  'Ananda memiliki potensi yang sangat baik. Tingkatkan fokus dan disiplin belajar untuk meraih prestasi yang lebih gemilang.',
  'Ananda menunjukkan kemajuan yang membanggakan dalam adab, ibadah, dan tanggung jawab belajar. Pertahankan dan terus berkembang!',
  'Kemampuan berpikir kritis dan kerja sama Ananda sangat menonjol. Tetaplah rendah hati dan rajin mengulang pelajaran di rumah.',
  'Ananda aktif, berbakat, dan memiliki jiwa kepemimpinan. Terus asah ketelitian dalam mengerjakan tugas akademik.',
  'Alhamdulillah Ananda telah menyelesaikan proses pembelajaran dengan baik. Semoga menjadi anak yang sholeh, berbakti, dan berguna bagi nusa bangsa.',
];
