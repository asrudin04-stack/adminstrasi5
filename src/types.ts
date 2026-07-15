export interface SchoolConfig {
  namaSekolah: string;
  alamatSekolah: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  logoKiri: string; // Base64 or URL
  logoKanan: string; // Base64 or URL
  tandaTanganKepsek: string; // Base64 or URL
  tahunAjaran: string;
  semester: string;
}

export interface User {
  id: string;
  username: string;
  nama: string;
  role: 'Admin' | 'Guru';
  status: 'Aktif' | 'Nonaktif';
}

export interface Kelas {
  id: string;
  namaKelas: string;
  waliKelas: string; // Username of teacher
}

export interface Mapel {
  id: string;
  kodeMapel: string;
  namaMapel: string;
}

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  namaSiswa: string;
  jenisKelamin: 'L' | 'P';
  kelasId: string;
}

export interface Absensi {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelasId: string;
  siswaId: string;
  namaSiswa: string;
  status: 'H' | 'I' | 'S' | 'A'; // Hadir, Izin, Sakit, Alfa
  keterangan?: string;
  guruUsername: string;
}

export interface Nilai {
  id: string;
  siswaId: string;
  namaSiswa: string;
  kelasId: string;
  mapelId: string;
  tugas1: number;
  tugas2: number;
  uts: number;
  uas: number;
  nilaiAkhir: number;
  predikat: string;
}

export interface Agenda {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelasId: string;
  mapelId: string;
  jamKe: string;
  materi: string;
  pencapaian: string; // % or text
  hambatan?: string;
  solusi?: string;
  guruUsername: string;
}

export interface BimbinganWali {
  id: string;
  tanggal: string; // YYYY-MM-DD
  siswaId: string;
  namaSiswa: string;
  kelasId: string;
  masalah: string;
  solusi: string;
  tindakLanjut: string;
  guruUsername: string;
}

export interface JadwalMengajar {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamMulai: string;
  jamSelesai: string;
  kelasId: string;
  mapelId: string;
  guruUsername: string;
}
