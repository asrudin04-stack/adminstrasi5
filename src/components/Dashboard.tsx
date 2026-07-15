import React from 'react';
import { SchoolConfig, User, Kelas, Siswa, Absensi, Nilai } from '../types';
import { School, Users, GraduationCap, ClipboardCheck, TrendingUp, Calendar, AlertTriangle, Upload } from 'lucide-react';

interface DashboardProps {
  config: SchoolConfig;
  user: User;
  users: User[];
  kelas: Kelas[];
  siswa: Siswa[];
  absensi: Absensi[];
  nilai: Nilai[];
  onNavigate: (view: string) => void;
  onUpdateLogo?: (newLogo: string) => void;
}

export default function Dashboard({
  config,
  user,
  users,
  kelas,
  siswa,
  absensi,
  nilai,
  onNavigate,
  onUpdateLogo
}: DashboardProps) {
  // Calculations
  const totalRombel = kelas.length;
  const totalGuru = users.filter(u => u.role === 'Guru').length;
  const totalSiswa = siswa.length;

  // Calculate today's attendance rate
  const today = new Date().toISOString().split('T')[0];
  const todayAbsensi = absensi.filter(a => a.tanggal === today);
  const presentCount = todayAbsensi.filter(a => a.status === 'H').length;
  const attendanceRate = todayAbsensi.length > 0 
    ? Math.round((presentCount / todayAbsensi.length) * 100) 
    : 100;

  // Calculate average class size
  const avgClassSize = totalRombel > 0 ? Math.round(totalSiswa / totalRombel) : 0;

  // Class distribution list
  const classDist = kelas.map(k => {
    const count = siswa.filter(s => s.kelasId === k.id).length;
    return { name: k.namaKelas, count };
  });

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Banner Selamat Datang */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none flex items-center justify-center p-8">
          <School className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-grow">
            <div className="inline-flex items-center gap-2 bg-slate-700/50 backdrop-blur px-3 py-1 rounded-full text-xs text-indigo-300 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Sistem Administrasi Guru Platinum v1.0
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Selamat Datang, {user.nama}!</h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl">
              Anda login sebagai <strong className="text-white">{user.role}</strong> untuk {config.namaSekolah}. Kelola absensi siswa, leger nilai, jurnal harian mengajar, dan bimbingan wali secara praktis dengan sinkronisasi Google Sheets.
            </p>
          </div>
          
          {/* Logo Sekolah yang Bisa Diinput / Diunggah Langsung */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 w-full md:w-44 text-center flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-inner relative">
              <img src={config.logoKiri} alt="School Logo" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="space-y-1">
              <label className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-1 px-2.5 rounded-lg transition-all cursor-pointer shadow-sm select-none">
                <Upload className="w-3 h-3" />
                Ganti Logo
                <input 
                  id="input-logo-dashboard"
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (uploadEvent) => {
                      if (uploadEvent.target?.result && onUpdateLogo) {
                        onUpdateLogo(uploadEvent.target.result as string);
                      }
                    };
                    reader.readAsDataURL(file);
                  }} 
                  className="hidden" 
                />
              </label>
              <p className="text-[9px] text-slate-300 leading-tight">Input Logo Sekolah Baru</p>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="p-3.5 bg-slate-100 text-slate-800 rounded-xl">
            <School className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Jumlah Rombel</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalRombel} Kelas</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Jumlah Guru</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalGuru} Orang</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Jumlah Siswa</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalSiswa} Siswa</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Kehadiran Hari Ini</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{attendanceRate}% Rate</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribusi Rombel & Keterangan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <School className="w-5 h-5 text-slate-500" />
              Distribusi Siswa per Rombongan Belajar
            </h4>
            <div className="space-y-3">
              {classDist.map((item, index) => {
                const percentage = totalSiswa > 0 ? (item.count / totalSiswa) * 100 : 0;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{item.name}</span>
                      <span className="text-slate-500">{item.count} Siswa ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-slate-700 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info & Guidelines */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-slate-500" />
              Siklus Administrasi Harian &amp; Cetak
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                id="btn-quick-absensi"
                onClick={() => onNavigate('absensi')}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl cursor-pointer transition-colors space-y-1.5"
              >
                <div className="text-xs font-semibold text-slate-800">1. Input Absensi</div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Catat kehadiran siswa secara harian di kelas Anda untuk rekap absensi berkala.
                </p>
              </div>
              <div 
                id="btn-quick-penilaian"
                onClick={() => onNavigate('penilaian')}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl cursor-pointer transition-colors space-y-1.5"
              >
                <div className="text-xs font-semibold text-slate-800">2. Input Penilaian (Leger)</div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Masukkan nilai tugas dan ujian untuk menghasilkan nilai akhir dan predikat rapor secara instan.
                </p>
              </div>
              <div 
                id="btn-quick-agenda"
                onClick={() => onNavigate('agenda')}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl cursor-pointer transition-colors space-y-1.5"
              >
                <div className="text-xs font-semibold text-slate-800">3. Jurnal Agenda</div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Tulis jurnal harian mengajar beserta ketercapaian materi dan hambatan pembelajaran.
                </p>
              </div>
              <div 
                id="btn-quick-rekap"
                onClick={() => onNavigate(user.role === 'Admin' ? 'rekap' : 'bimbingan')}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl cursor-pointer transition-colors space-y-1.5"
              >
                <div className="text-xs font-semibold text-slate-800">
                  {user.role === 'Admin' ? '4. Rekap Wali (PDF)' : '4. Bimbingan Wali'}
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {user.role === 'Admin' 
                    ? 'Rekapleger nilai dan cetak dokumen PDF resmi dengan KOP Surat, barcode, dan TTD Kepsek.'
                    : 'Catat pembimbingan wali murid/konseling siswa yang mengalami masalah di kelas.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar info di dashboard */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-sm">Status Sinkronisasi</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Koneksi Database:</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Lokal Terkoneksi (Simulasi)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Penyimpanan:</span>
                <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                  LocalStorage Browser
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tahun Ajaran:</span>
                <span className="font-medium text-slate-700">{config.tahunAjaran}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Semester:</span>
                <span className="font-medium text-slate-700">{config.semester}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button 
                id="btn-view-code-dashboard"
                onClick={() => onNavigate('code-exporter')}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-xs transition-colors text-center"
              >
                Lihat &amp; Ambil Kode Produksi (GAS/Blogger)
              </button>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-200/80 p-5 rounded-2xl space-y-3">
            <h5 className="font-bold text-amber-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Saran Integrasi
            </h5>
            <p className="text-amber-700 text-xs leading-relaxed">
              Anda dapat mengunduh <strong>Kode.gs</strong> dan memasukkannya ke Google Apps Script Anda. Setelah disebarkan (deploy), masukkan URL Apps Script yang Anda buat ke menu Login di aplikasi ini untuk mengubah mode dari simulasi lokal menjadi database Google Sheets asli!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
