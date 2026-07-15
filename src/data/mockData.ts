import { SchoolConfig, User, Kelas, Mapel, Siswa, Absensi, Nilai, Agenda, BimbinganWali, JadwalMengajar } from '../types';

// Simple professional crest SVGs encoded as Base64 DataURLs
export const DEFAULT_LOGO_KIRI = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%232C3E50'><circle cx='50' cy='50' r='45' stroke='%23BDC3C7' stroke-width='3' fill='none'/><path d='M30,40 L50,25 L70,40 L70,75 L30,75 Z' fill='%232C3E50'/><polygon points='50,15 35,25 65,25' fill='%23E74C3C'/><rect x='45' y='50' width='10' height='25' fill='%23ECF0F1'/><circle cx='50' cy='38' r='5' fill='%23F1C40F'/></svg>";

export const DEFAULT_LOGO_KANAN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%2316A085'><polygon points='50,10 90,85 10,85' stroke='%23117A65' stroke-width='2' fill='none'/><circle cx='50' cy='55' r='20' fill='%2316A085'/><path d='M50,35 L40,70 L60,70 Z' fill='%23F1C40F'/><path d='M50,40 L45,65 L55,65 Z' fill='%23E67E22'/></svg>";

export const DEFAULT_TANDATANGAN = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 50' fill='none'><path d='M10,35 Q30,10 50,30 T90,20 T130,40' stroke='%232C3E50' stroke-width='2' fill='none'/><path d='M40,25 L50,45 M80,15 L90,35' stroke='%232C3E50' stroke-width='1.5'/><text x='10' y='48' font-family='cursive' font-size='8' fill='%237F8C8D'>Drs. H. Mulyadi, M.Pd.</text></svg>";

export const initialConfig: SchoolConfig = {
  namaSekolah: "SD Negeri 1 Gemblengaan",
  alamatSekolah: "Jl. Pendidikan Luhur No. 45, Kecamatan Sukamaju, Kota Jakarta Selatan",
  kepalaSekolah: "Drs. H. Mulyadi, M.Pd.",
  nipKepalaSekolah: "197508212002121003",
  logoKiri: DEFAULT_LOGO_KIRI,
  logoKanan: DEFAULT_LOGO_KANAN,
  tandaTanganKepsek: DEFAULT_TANDATANGAN,
  tahunAjaran: "2025/2026",
  semester: "Ganjil"
};

export const initialUsers: User[] = [
  { id: "U-001", username: "admin", nama: "Administrator Sistem", role: "Admin", status: "Aktif" },
  { id: "U-002", username: "asrudin", nama: "Asrudin, S.Pd.", role: "Guru", status: "Aktif" },
  { id: "U-003", username: "budi", nama: "Budi Santoso, S.Pd.", role: "Guru", status: "Aktif" },
  { id: "U-004", username: "siti", nama: "Siti Rahma, S.Pd.SD", role: "Guru", status: "Aktif" }
];

export const initialKelas: Kelas[] = [
  { id: "K-001", namaKelas: "Kelas I-A", waliKelas: "asrudin" },
  { id: "K-002", namaKelas: "Kelas II-A", waliKelas: "budi" },
  { id: "K-003", namaKelas: "Kelas III-A", waliKelas: "siti" }
];

export const initialMapel: Mapel[] = [
  { id: "M-001", kodeMapel: "IND", namaMapel: "Bahasa Indonesia" },
  { id: "M-002", kodeMapel: "MAT", namaMapel: "Matematika" },
  { id: "M-003", kodeMapel: "IPA", namaMapel: "Ilmu Pengetahuan Alam" },
  { id: "M-004", kodeMapel: "PPKN", namaMapel: "Pendidikan Pancasila dan Kewarganegaraan" },
  { id: "M-005", kodeMapel: "SBDP", namaMapel: "Seni Budaya dan Prakarya" }
];

export const initialSiswa: Siswa[] = [
  { id: "S-001", nis: "10201", nisn: "0123456701", namaSiswa: "Ahmad Fauzi", jenisKelamin: "L", kelasId: "K-001" },
  { id: "S-002", nis: "10202", nisn: "0123456702", namaSiswa: "Annisa Fitriani", jenisKelamin: "P", kelasId: "K-001" },
  { id: "S-003", nis: "10203", nisn: "0123456703", namaSiswa: "Bagus Setiawan", jenisKelamin: "L", kelasId: "K-001" },
  { id: "S-004", nis: "10204", nisn: "0123456704", namaSiswa: "Citra Lestari", jenisKelamin: "P", kelasId: "K-001" },
  { id: "S-005", nis: "10205", nisn: "0123456705", namaSiswa: "Daffa Ramadhan", jenisKelamin: "L", kelasId: "K-001" },
  { id: "S-006", nis: "10206", nisn: "0123456706", namaSiswa: "Eka Nurhaliza", jenisKelamin: "P", kelasId: "K-001" },
  
  { id: "S-007", nis: "10301", nisn: "0123456801", namaSiswa: "Fajar Nugraha", jenisKelamin: "L", kelasId: "K-002" },
  { id: "S-008", nis: "10302", nisn: "0123456802", namaSiswa: "Gita Amalia", jenisKelamin: "P", kelasId: "K-002" },
  { id: "S-009", nis: "10303", nisn: "0123456803", namaSiswa: "Hendra Wijaya", jenisKelamin: "L", kelasId: "K-002" },
  
  { id: "S-010", nis: "10401", nisn: "0123456901", namaSiswa: "Indah Permata", jenisKelamin: "P", kelasId: "K-003" },
  { id: "S-011", nis: "10402", nisn: "0123456902", namaSiswa: "Kevin Sanjaya", jenisKelamin: "L", kelasId: "K-003" }
];

export const initialAbsensi: Absensi[] = [
  { id: "A-001", tanggal: "2026-06-29", kelasId: "K-001", siswaId: "S-001", namaSiswa: "Ahmad Fauzi", status: "H", guruUsername: "asrudin" },
  { id: "A-002", tanggal: "2026-06-29", kelasId: "K-001", siswaId: "S-002", namaSiswa: "Annisa Fitriani", status: "H", guruUsername: "asrudin" },
  { id: "A-003", tanggal: "2026-06-29", kelasId: "K-001", siswaId: "S-003", namaSiswa: "Bagus Setiawan", status: "I", keterangan: "Keluarga hajatan", guruUsername: "asrudin" },
  { id: "A-004", tanggal: "2026-06-29", kelasId: "K-001", siswaId: "S-004", namaSiswa: "Citra Lestari", status: "S", keterangan: "Demam", guruUsername: "asrudin" },
  { id: "A-005", tanggal: "2026-06-29", kelasId: "K-001", siswaId: "S-005", namaSiswa: "Daffa Ramadhan", status: "H", guruUsername: "asrudin" },
  { id: "A-006", tanggal: "2026-06-29", kelasId: "K-001", siswaId: "S-006", namaSiswa: "Eka Nurhaliza", status: "A", guruUsername: "asrudin" }
];

export const initialNilai: Nilai[] = [
  { id: "N-001", siswaId: "S-001", namaSiswa: "Ahmad Fauzi", kelasId: "K-001", mapelId: "M-001", tugas1: 85, tugas2: 80, uts: 78, uas: 82, nilaiAkhir: 81.1, predikat: "B" },
  { id: "N-002", siswaId: "S-002", namaSiswa: "Annisa Fitriani", kelasId: "K-001", mapelId: "M-001", tugas1: 90, tugas2: 95, uts: 88, uas: 92, nilaiAkhir: 91.1, predikat: "A" },
  { id: "N-003", siswaId: "S-003", namaSiswa: "Bagus Setiawan", kelasId: "K-001", mapelId: "M-001", tugas1: 70, tugas2: 75, uts: 72, uas: 70, nilaiAkhir: 71.3, predikat: "C" },
  { id: "N-004", siswaId: "S-004", namaSiswa: "Citra Lestari", kelasId: "K-001", mapelId: "M-001", tugas1: 80, tugas2: 82, uts: 85, uas: 80, nilaiAkhir: 81.5, predikat: "B" },
  { id: "N-005", siswaId: "S-005", namaSiswa: "Daffa Ramadhan", kelasId: "K-001", mapelId: "M-001", tugas1: 65, tugas2: 60, uts: 68, uas: 70, nilaiAkhir: 66.1, predikat: "D" },
  { id: "N-006", siswaId: "S-006", namaSiswa: "Eka Nurhaliza", kelasId: "K-001", mapelId: "M-001", tugas1: 75, tugas2: 78, uts: 80, uas: 85, nilaiAkhir: 80.3, predikat: "B" }
];

export const initialAgenda: Agenda[] = [
  { id: "AG-001", tanggal: "2026-06-29", kelasId: "K-001", mapelId: "M-001", jamKe: "1-2", materi: "Membaca teks cerita rakyat daerah", pencapaian: "90%", hambatan: "Beberapa siswa belum lancar intonasi", solusi: "Latihan membaca nyaring berpasangan", guruUsername: "asrudin" },
  { id: "AG-002", tanggal: "2026-06-29", kelasId: "K-001", mapelId: "M-002", jamKe: "3-4", materi: "Penjumlahan bilangan bulat bersusun", pencapaian: "80%", hambatan: "Siswa bingung dengan teknik menyimpan", solusi: "Memberikan visualisasi dengan manik-manik warna", guruUsername: "asrudin" }
];

export const initialBimbinganWali: BimbinganWali[] = [
  { id: "BW-001", tanggal: "2026-06-29", siswaId: "S-006", namaSiswa: "Eka Nurhaliza", kelasId: "K-001", masalah: "Sering datang terlambat dan absen tanpa keterangan", solusi: "Memanggil siswa untuk konseling personal dan mengidentifikasi penyebab terlambat", tindakLanjut: "Akan menghubungi orang tua apabila terulang minggu ini", guruUsername: "asrudin" }
];

export const initialJadwalMengajar: JadwalMengajar[] = [
  { id: "J-001", hari: "Senin", jamMulai: "07:30", jamSelesai: "09:00", kelasId: "K-001", mapelId: "M-001", guruUsername: "asrudin" },
  { id: "J-002", hari: "Senin", jamMulai: "09:15", jamSelesai: "10:45", kelasId: "K-001", mapelId: "M-002", guruUsername: "asrudin" },
  { id: "J-003", hari: "Selasa", jamMulai: "07:30", jamSelesai: "09:00", kelasId: "K-001", mapelId: "M-003", guruUsername: "asrudin" },
  { id: "J-004", hari: "Rabu", jamMulai: "10:45", jamSelesai: "12:00", kelasId: "K-001", mapelId: "M-004", guruUsername: "asrudin" }
];

// Utility function to load data from LocalStorage or initialize with defaults
export function getStoredData<T>(key: string, defaultValue: T): T {
  const stored = localStorage.getItem(`SAG_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

export function saveStoredData<T>(key: string, data: T): void {
  localStorage.setItem(`SAG_${key}`, JSON.stringify(data));
}
