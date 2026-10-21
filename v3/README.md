# Buana School - Digitalisasi Buku Mutasi & Buku Induk Siswa

Aplikasi manajemen sekolah resmi berbasis web statis (Single Page Application) yang dapat di-hosting secara gratis di **GitHub Pages (`github.io`)**. Dirancang dengan prinsip **Mobile-First UI/UX** untuk smartphone dan tablet bagi setiap **Wali Kelas**, **Kepala Sekolah**, dan **Tata Usaha**.

---

## 📸 Dokumen Fisik yang Telah Didigitalkan

Berdasarkan format buku resmi Kementerian Pendidikan & Kebudayaan Republik Indonesia (SD Muhammadiyah 2 Bandung):

1. **Buku Mutasi Murid (Masuk & Keluar)**:
   - **Halaman Sampul Resmi**: Nomor Pokok Sekolah Nasional (NPSN), NSS, Kode Sekolah, Logo Tut Wuri Handayani, Identitas Lengkap Sekolah.
   - **Lembar Penjelasan & Identitas**: Format kata pengantar resmi penelusuran mutasi murid.
   - **Halaman KIRI (Mutasi Keluar)**: No. Urut, Tanggal, Nama Siswa, L/P, No. Induk, NISN, Kelas, No. Surat Pindah, Keterangan Pindah ke.
   - **Tabel Rekapitulasi Bulanan**: Rekapitulasi per kelas (Kelas 1 s/d 6) otomatis: Awal Bulan (L, P, Jml), Masuk (L, P, Jml), Keluar (L, P, Jml), Akhir Bulan (L, P, Jml).
   - **Halaman KANAN (Mutasi Masuk)**: No. Urut, Tanggal, Nama Siswa, L/P, No. Induk, NISN, Kelas, Berasal dari (Sekolah, No. Induk, Kelas), Persetujuan Kanwil/Kanko (Tanggal & Nomor).
   - **Pengesahan Kepala Sekolah**: Kolom tanda tangan digital dan NIP Kepala Sekolah.

2. **Buku Induk Register Peserta Didik (Kurikulum Merdeka SD)**:
   - **I. Lembar Pemeriksaan Buku Induk**: Catatan inspeksi berkala Pengawas Pembina / Dinas Pendidikan.
   - **II. Nomor Urut Peserta Didik**: Register induk siswa lengkap dengan tahun masuk, tahun keluar/lulus, dan status siswa.
   - **III. Petunjuk Pengisian Buku Induk Register**: 14 butir panduan resmi pengisian.
   - **IV. Lembar Buku Induk Siswa (Individual Dossier)**:
     - Keterangan Pribadi Siswa (Nama, TTL, Agama, Saudara, Alamat, Jarak).
     - Keterangan Orang Tua / Wali (Nama, Pendidikan, Pekerjaan).
     - Perkembangan & Pendidikan Sebelumnya.
     - Riwayat Fisik & Kesehatan (Tinggi/Berat badan per semester, Penglihatan, Pendengaran, Gigi).
     - Pas Foto 3x4 digital & Tanda Tangan Siswa.
   - **Laporan Capaian Pembelajaran Kurikulum Merdeka (Rapor Lembar IV)**: Nilai akhir, capaian pembelajaran, KKTP, ekstrakurikuler, absensi (sakit/izin/alpa), dan keputusan kenaikan kelas.

3. **Fitur Cetak Buku On-Demand (Print as a Book)**:
   - Cetak bukan hanya 1 halaman, melainkan **seluruh buku lengkap** (Sampul, Kata Pengantar, Halaman Berhadapan 12 Bulan / Semester) langsung ke printer atau disimpan sebagai PDF.
   - Layout halaman berpasangan (spreads) dengan margin cetak presisi A4 Landscape / Portrait.
   - Pengesahan otomatis dengan tanda tangan digital Kepala Sekolah.

---

## 👥 Manajemen Pengguna & Alur Kerja Wali Kelas

- **Wali Kelas (Homeroom Teachers)**:
  - Tersedia akun untuk setiap wali kelas (Kelas 1 s/d Kelas 6).
  - Tampilan otomatis memfilter data sesuai kelas binaan masing-masing.
  - Form pencatatan siswa mutasi masuk dan siswa mutasi keluar dengan 1 tap.
  - Pengisian rapor capaian pembelajaran dan biodata buku induk siswa.
- **Kepala Sekolah**:
  - Memantau rekapitulasi seluruh kelas (1 s/d 6).
  - Melakukan tanda tangan digital resmi melalui canvas stylus/sentuh atau upload gambar.
  - Mengesahkan dan mencetak Buku Mutasi Murid kapan saja sesuai kebutuhan (akreditasi/pemeriksaan dinas).
- **Tata Usaha / Admin**:
  - Mengelola profil identitas sekolah (NPSN, Alamat, Tahun Pelajaran).
  - Mengunduh cadangan lengkap (JSON Backup) atau memulihkan data (JSON Restore).

---

## 📱 Mobile-First UI/UX untuk Smartphone & Tablet

- **Navigasi Bawah (Bottom Navigation Bar)** memudahkan jempol guru saat menggunakan smartphone.
- **Pills Filter Cepat**: Filter kelas (1-6) dan bulan (Juli-Juni) dalam 1 sentuhan.
- **Formulir Responsif**: Disesuaikan untuk input cepat di lapangan dengan validasi otomatis.
- **Canvas Tanda Tangan Sentuh**: Kepala sekolah dapat menandatangani dokumen menggunakan jari atau pena stylus tablet.

---

## 🚀 Hosting di GitHub Pages (`github.io`)

Proyek ini menggunakan arsitektur web statis mandiri (**Vite + React + TypeScript + Tailwind CSS**) tanpa backend berbayar:

1. **Deploy Otomatis via GitHub Actions**:
   - File workflow telah tersedia di `.github/workflows/deploy.yml`.
   - Cukup buat repositori baru di GitHub (misal: `buana-school`).
   - Push kode ke branch `main`:
     ```bash
     git init
     git add .
     git commit -m "feat: digitalisasi buku mutasi dan buku induk sekolah"
     git branch -M main
     git remote add origin https://github.com/USERNAME/buana-school.git
     git push -u origin main
     ```
   - Masuk ke **Settings > Pages** di GitHub, pada bagian *Build and deployment* pilih **GitHub Actions**.
   - Website akan aktif di: `https://USERNAME.github.io/buana-school/`.

2. **Jalankan Secara Lokal di Komputer**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di peramban web Anda.

---

## 💾 Keamanan & Cadangan Data Offline

- Seluruh data tersimpan secara aman di peramban perangkat (`LocalStorage`).
- Fitur **Ekspor Cadangan (JSON)** memungkinkan guru atau tata usaha mencadangkan basis data ke file lokal komputer/flashdisk.
- Fitur **Impor Cadangan (JSON)** memungkinkan sinkronisasi data antar komputer tanpa koneksi internet.
