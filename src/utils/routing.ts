/**
 * Generates clean student URL e.g. /siswa/2425010009
 * Dynamically handles root hosting (localhost:5173/siswa/2425010009)
 * as well as repository subpath hosting on GitHub Pages (e.g. /buana-school/siswa/2425010009)
 */
export const getStudentUrl = (nis: string): string => {
  if (typeof window === 'undefined') return `/siswa/${encodeURIComponent(nis)}`;
  const path = window.location.pathname;
  // Check if hosted under a subfolder e.g. /buana-school/
  const match = path.match(
    /^(.*?)(?:\/(?:index|buku-induk|mutasi|kegiatan|cetak-buku|pengaturan|siswa|rapor)(?:\.html)?|\/siswa\/[^/]+|\/?)$/
  );
  const base = match && match[1] ? match[1].replace(/\/+$/, '') : '';
  return `${base}/siswa/${encodeURIComponent(nis)}`;
};

/**
 * Returns absolute full URL e.g. http://localhost:5173/siswa/2425010009
 */
export const getFullStudentUrl = (nis: string): string => {
  if (typeof window === 'undefined') {
    return `http://localhost:5173/siswa/${encodeURIComponent(nis)}`;
  }
  return `${window.location.origin}${getStudentUrl(nis)}`;
};

/**
 * Returns URL to Rapor page with optional student NIS and semester
 */
export const getRaporUrl = (nis?: string, semester?: number): string => {
  const query = new URLSearchParams();
  if (nis) query.set('nis', nis);
  if (semester) query.set('sem', semester.toString());
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return `rapor.html${queryString}`;
};
