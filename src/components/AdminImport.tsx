import React, { useState, useEffect } from 'react';
import { Kelas, Siswa, User } from '../types';
import { 
  Upload, Info, CheckCircle, School, Users, FileText, Sparkles, Plus, AlertCircle, Trash2 
} from 'lucide-react';

interface AdminImportProps {
  kelas: Kelas[];
  users: User[];
  onImportSiswa: (siswaList: Omit<Siswa, 'id'>[]) => void;
  onImportUsers: (usersList: Omit<User, 'id'>[]) => void;
  onImportKelas: (kelasList: Omit<Kelas, 'id'>[]) => void;
  onBulkInitializeSD?: (
    newKelas: Omit<Kelas, 'id'>[],
    newUsers: Omit<User, 'id'>[],
    newSiswa: Omit<Siswa, 'id'>[]
  ) => void;
}

interface SDGradePreset {
  grade: string;
  waliUsername: string;
  waliNama: string;
  students: string;
}

export default function AdminImport({
  kelas,
  users,
  onImportSiswa,
  onImportUsers,
  onImportKelas,
  onBulkInitializeSD
}: AdminImportProps) {
  // Current active tab
  const [activeTab, setActiveTab] = useState<'siswa' | 'guru' | 'kelas' | 'preset-sd'>('preset-sd');

  // Input states for each tab
  const [selectedKelas, setSelectedKelas] = useState<string>('');
  const [pasteSiswa, setPasteSiswa] = useState<string>('');
  const [pasteGuru, setPasteGuru] = useState<string>('');
  const [pasteKelas, setPasteKelas] = useState<string>('');

  // Status and feedback states
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // SD Grade Presets (Wizards for Grades 1 - 6)
  const [sdPresets, setSdPresets] = useState<SDGradePreset[]>([
    { 
      grade: "Kelas I-A", 
      waliUsername: "asrudin", 
      waliNama: "Asrudin, S.Pd.", 
      students: "Ahmad Fauzi, L\nAnnisa Fitriani, P\nBagus Setiawan, L\nCitra Lestari, P\nDaffa Ramadhan, L\nEka Nurhaliza, P" 
    },
    { 
      grade: "Kelas II-A", 
      waliUsername: "budi", 
      waliNama: "Budi Santoso, S.Pd.", 
      students: "Fajar Nugraha, L\nGita Amalia, P\nHendra Wijaya, L\nImron Rosyadi, L\nKiki Amelia, P" 
    },
    { 
      grade: "Kelas III-A", 
      waliUsername: "siti", 
      waliNama: "Siti Rahma, S.Pd.SD", 
      students: "Indah Permata, P\nKevin Sanjaya, L\nLia Wardani, P\nMuhammad Rafli, L\nNadia Safira, P" 
    },
    { 
      grade: "Kelas IV-A", 
      waliUsername: "hartono", 
      waliNama: "Drs. Hartono, M.Pd.", 
      students: "Oki Saputra, L\nPutri Rahayu, P\nQorina Hanifah, P\nRian Hermawan, L\nSalsa Bila, P" 
    },
    { 
      grade: "Kelas V-A", 
      waliUsername: "erika", 
      waliNama: "Erika Wijaya, S.Pd.", 
      students: "Teguh Prasetyo, L\nUlya Salsabila, P\nVino Bastian, L\nWulan Suci, P\nXander Wijaya, L" 
    },
    { 
      grade: "Kelas VI-A", 
      waliUsername: "zulkifli", 
      waliNama: "Zulkifli, S.Pd.I", 
      students: "Yudha Pratama, L\nZahra Kamila, P\nAditya Pratama, L\nBella Safira, P\nCandra Wijaya, L" 
    }
  ]);

  useEffect(() => {
    if (kelas.length > 0 && !selectedKelas) {
      setSelectedKelas(kelas[0].id);
    }
  }, [kelas, selectedKelas]);

  // Tab 1: Handle Student Import
  const handleImportSiswaSubmit = () => {
    if (!selectedKelas) {
      alert('Silakan pilih kelas tujuan terlebih dahulu!');
      return;
    }
    if (!pasteSiswa.trim()) {
      alert('Harap paste data daftar nama siswa terlebih dahulu!');
      return;
    }

    const lines = pasteSiswa.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const parsedSiswaList: Omit<Siswa, 'id'>[] = [];

    lines.forEach((line, index) => {
      let parts = line.split('\t');
      if (parts.length < 2) parts = line.split(';');
      if (parts.length < 2) parts = line.split(',');

      let nis = '';
      let nisn = '';
      let namaSiswa = '';
      let jenisKelamin: 'L' | 'P' = 'L';

      if (parts.length >= 3) {
        nis = parts[0]?.trim() || '';
        nisn = parts[1]?.trim() || '';
        namaSiswa = parts[2]?.trim() || '';
        const jkRaw = parts[3]?.trim().toUpperCase() || 'L';
        jenisKelamin = jkRaw.startsWith('P') ? 'P' : 'L';
      } else if (parts.length === 2) {
        namaSiswa = parts[0]?.trim() || '';
        const jkRaw = parts[1]?.trim().toUpperCase() || 'L';
        jenisKelamin = jkRaw.startsWith('P') ? 'P' : 'L';
        nis = String(10500 + index + Math.floor(Math.random() * 100));
        nisn = '01234' + nis;
      } else {
        namaSiswa = line;
        nis = String(10500 + index + Math.floor(Math.random() * 100));
        nisn = '01234' + nis;
        jenisKelamin = 'L';
      }

      if (namaSiswa) {
        parsedSiswaList.push({
          nis,
          nisn,
          namaSiswa,
          jenisKelamin,
          kelasId: selectedKelas
        });
      }
    });

    if (parsedSiswaList.length > 0) {
      onImportSiswa(parsedSiswaList);
      setSuccessMsg(`Berhasil mengimpor massal ${parsedSiswaList.length} siswa ke Rombel yang dipilih!`);
      setPasteSiswa('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      alert('Format data tidak valid atau kosong.');
    }
  };

  // Tab 2: Handle Teacher/User Import
  const handleImportGuruSubmit = () => {
    if (!pasteGuru.trim()) {
      alert('Harap paste data daftar guru terlebih dahulu!');
      return;
    }

    const lines = pasteGuru.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const parsedUsers: Omit<User, 'id'>[] = [];

    lines.forEach((line, index) => {
      let parts = line.split('\t');
      if (parts.length < 2) parts = line.split(';');
      if (parts.length < 2) parts = line.split(',');

      let username = '';
      let nama = '';
      let role: 'Admin' | 'Guru' = 'Guru';

      if (parts.length >= 3) {
        username = parts[0]?.trim().toLowerCase() || '';
        nama = parts[1]?.trim() || '';
        const roleRaw = parts[2]?.trim().toLowerCase() || 'guru';
        role = roleRaw.includes('admin') ? 'Admin' : 'Guru';
      } else if (parts.length === 2) {
        username = parts[0]?.trim().toLowerCase() || '';
        nama = parts[1]?.trim() || '';
      } else {
        nama = line;
        username = line.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
        if (!username) username = `guru_${Date.now()}_${index}`;
      }

      if (nama && username) {
        parsedUsers.push({
          username,
          nama,
          role,
          status: 'Aktif'
        });
      }
    });

    if (parsedUsers.length > 0) {
      onImportUsers(parsedUsers);
      setSuccessMsg(`Berhasil mengimpor massal ${parsedUsers.length} Guru / Akun Pengguna baru!`);
      setPasteGuru('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      alert('Format data tidak valid atau kosong.');
    }
  };

  // Tab 3: Handle Class Import
  const handleImportKelasSubmit = () => {
    if (!pasteKelas.trim()) {
      alert('Harap paste data daftar Rombel/Kelas terlebih dahulu!');
      return;
    }

    const lines = pasteKelas.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const parsedKelas: Omit<Kelas, 'id'>[] = [];

    lines.forEach(line => {
      let parts = line.split('\t');
      if (parts.length < 2) parts = line.split(';');
      if (parts.length < 2) parts = line.split(',');

      let namaKelas = '';
      let waliKelas = '';

      if (parts.length >= 2) {
        namaKelas = parts[0]?.trim() || '';
        waliKelas = parts[1]?.trim().toLowerCase() || '';
      } else {
        namaKelas = line;
        waliKelas = 'asrudin'; // fallback
      }

      if (namaKelas) {
        parsedKelas.push({
          namaKelas,
          waliKelas
        });
      }
    });

    if (parsedKelas.length > 0) {
      onImportKelas(parsedKelas);
      setSuccessMsg(`Berhasil mengimpor massal ${parsedKelas.length} Rombongan Belajar (Kelas)!`);
      setPasteKelas('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      alert('Format data tidak valid.');
    }
  };

  // Tab 4: Execute Bulk SD Level Initializer (1-Click)
  const handleBulkInitializeSDExecute = () => {
    if (!onBulkInitializeSD) {
      alert('Fungsi inisialisasi massal tidak tersedia pada sistem.');
      return;
    }

    const confirmAction = confirm(
      'Apakah Anda yakin ingin melakukan Inisialisasi Massal Jenjang SD ini?\n\n' +
      'Tindakan ini akan mendaftarkan Kelas I s.d VI, membuat Akun Guru yang didefinisikan, dan mengimpor seluruh daftar siswa setiap kelas.'
    );

    if (!confirmAction) return;

    try {
      const finalKelas: Omit<Kelas, 'id'>[] = [];
      const finalUsers: Omit<User, 'id'>[] = [];
      const finalSiswa: Omit<Siswa, 'id'>[] = [];

      sdPresets.forEach((preset, presetIdx) => {
        // Prepare Teacher/User
        finalUsers.push({
          username: preset.waliUsername.trim().toLowerCase(),
          nama: preset.waliNama,
          role: 'Guru',
          status: 'Aktif'
        });

        // Prepare Class/Rombel
        finalKelas.push({
          namaKelas: preset.grade,
          waliKelas: preset.waliUsername.trim().toLowerCase()
        });

        // Parse Student text roster
        const studentLines = preset.students.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        studentLines.forEach((sLine, sIdx) => {
          let sParts = sLine.split(',');
          if (sParts.length < 2) sParts = sLine.split('\t');

          let name = '';
          let jk: 'L' | 'P' = 'L';

          if (sParts.length >= 2) {
            name = sParts[0].trim();
            const jkRaw = sParts[1].trim().toUpperCase();
            jk = jkRaw.startsWith('P') ? 'P' : 'L';
          } else {
            name = sLine;
            jk = 'L';
          }

          if (name) {
            // Auto generate standard NIS and NISN based on Grade Index and Student Index
            const gradeNum = presetIdx + 1;
            const nis = `${100 + gradeNum}${sIdx < 10 ? '0' + sIdx : sIdx}`;
            const nisn = `012356${nis}`;

            finalSiswa.push({
              nis,
              nisn,
              namaSiswa: name,
              jenisKelamin: jk,
              kelasId: preset.grade // We pass Grade name temporarily; App.tsx resolves it to actual Class ID
            });
          }
        });
      });

      // Execute Bulk API Mutation
      onBulkInitializeSD(finalKelas, finalUsers, finalSiswa);

      setSuccessMsg(
        `SUKSES INSALASI JENJANG SD! Berhasil mengimpor: \n` +
        `- ${finalKelas.length} Rombel SD (Kelas I s.d VI)\n` +
        `- ${finalUsers.length} Akun Guru / Wali Kelas Baru\n` +
        `- ${finalSiswa.length} Peserta Didik Baru Tersebar di Setiap Kelas.`
      );
      setTimeout(() => setSuccessMsg(''), 10000);
    } catch (err: any) {
      setErrorMsg('Gagal melakukan inisialisasi: ' + err?.message);
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  // Helper to update preset config line in Grade Wizard
  const handlePresetChange = (index: number, field: keyof SDGradePreset, value: string) => {
    setSdPresets(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div id="school-import-dashboard" className="space-y-6">
      {/* Top Banner & Header Description */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <School className="w-5 h-5 text-indigo-600" />
            Pusat Impor &amp; Inisiasi Data Sekolah (SD)
          </h4>
          <p className="text-slate-500 text-xs">
            Kelola migrasi massal dari spreadsheet Excel, atau gunakan asisten cerdas untuk inisialisasi cepat seluruh kelas tingkat SD (Kelas 1 s.d 6) secara instan.
          </p>
        </div>
      </div>

      {/* Success and Error Feedback */}
      {successMsg && (
        <div id="import-success-alert" className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl flex items-start gap-3 text-xs whitespace-pre-line font-medium animate-fade-in shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div id="import-error-alert" className="bg-rose-50 border border-rose-200 text-rose-800 px-6 py-4 rounded-xl flex items-center gap-3 text-xs font-semibold shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        <button
          id="tab-btn-preset-sd"
          onClick={() => setActiveTab('preset-sd')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'preset-sd'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Inisialisasi Otomatis SD (Kelas 1-6)
        </button>

        <button
          id="tab-btn-siswa"
          onClick={() => setActiveTab('siswa')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'siswa'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Impor Siswa Massal
        </button>

        <button
          id="tab-btn-guru"
          onClick={() => setActiveTab('guru')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'guru'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Impor Guru Massal
        </button>

        <button
          id="tab-btn-kelas"
          onClick={() => setActiveTab('kelas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'kelas'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <School className="w-4 h-4" />
          Impor Rombel (Kelas)
        </button>
      </div>

      {/* TAB CONTENT: 1-CLICK SD PRESET INITIALIZER */}
      {activeTab === 'preset-sd' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-sky-50 p-6 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">Jenjang Sekolah Dasar</span>
              <h5 className="font-bold text-slate-800 text-sm">Asisten Cerdas Inisialisasi Massal Jenjang SD</h5>
              <p className="text-slate-600 text-xs">
                Sistem akan membuat struktur rombel standar (Kelas I-A s.d Kelas VI-A), mendaftarkan akun guru pendidik masing-masing kelas, dan mengisi daftar nama siswa dalam sekali tekan.
              </p>
            </div>
            <button
              id="btn-run-sd-initializer"
              onClick={handleBulkInitializeSDExecute}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Inisialisasi Kelas SD (1 - 6) Sekarang
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdPresets.map((preset, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                    <span className="font-bold text-slate-800 text-xs">{preset.grade}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Rombel SD</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Wali Kelas (Guru)</label>
                    <input
                      type="text"
                      value={preset.waliNama}
                      onChange={e => handlePresetChange(index, 'waliNama', e.target.value)}
                      placeholder="Nama Wali Kelas..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Username Login Guru</label>
                    <input
                      type="text"
                      value={preset.waliUsername}
                      onChange={e => handlePresetChange(index, 'waliUsername', e.target.value)}
                      placeholder="Username..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Daftar Roster Siswa (Nama, L/P)</label>
                      <span className="text-[9px] font-bold text-slate-400">1 baris = 1 siswa</span>
                    </div>
                    <textarea
                      rows={5}
                      value={preset.students}
                      onChange={e => handlePresetChange(index, 'students', e.target.value)}
                      placeholder="Nama Siswa, L/P..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BULK STUDENT IMPORT */}
      {activeTab === 'siswa' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h5 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                Panduan Salin / Copy Siswa
              </h5>
              <p className="text-slate-600 text-xs leading-relaxed">
                Salin baris siswa dari Microsoft Excel atau Google Sheets Anda, lalu tempelkan ke form di samping.
              </p>

              <div className="space-y-3 font-mono text-[10px] bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-1.5">Format Opsi 1: Lengkap</div>
                <div>NIS [TAB] NISN [TAB] NAMA [TAB] JK (L/P)</div>
                <div className="text-slate-400 mt-1 italic">Contoh:</div>
                <div className="text-indigo-600">
                  10501	012356701	Ahmad Zaelani	L<br />
                  10502	012356702	Siti Halimah	P
                </div>
              </div>

              <div className="space-y-3 font-mono text-[10px] bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-1.5">Format Opsi 2: Simpel</div>
                <div>Nama Siswa, Jenis Kelamin (L/P)</div>
                <div className="text-slate-400 mt-1 italic">Contoh:</div>
                <div className="text-indigo-600">
                  Rian Hermawan, L<br />
                  Kiki Amelia, P
                </div>
              </div>

              <p className="text-slate-400 text-[10px] leading-relaxed">
                *Sistem akan mendeteksi pembatas tab/koma secara otomatis dan membuat NIS/NISN berurutan secara cerdas jika dikosongkan.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Rombongan Belajar Tujuan (Target Kelas)</label>
                <select
                  id="import-siswa-kelas-select"
                  value={selectedKelas}
                  onChange={e => setSelectedKelas(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
                >
                  {kelas.map(k => (
                    <option key={k.id} value={k.id}>{k.namaKelas}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tempelkan (Paste) Baris Data Siswa</label>
                <textarea
                  id="import-siswa-textarea"
                  rows={10}
                  value={pasteSiswa}
                  onChange={e => setPasteSiswa(e.target.value)}
                  placeholder="Paste daftar nama siswa dari Excel / Google Sheets di sini..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  id="btn-execute-import-siswa"
                  onClick={handleImportSiswaSubmit}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Impor Data Siswa Massal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BULK TEACHER/USER IMPORT */}
      {activeTab === 'guru' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h5 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                Panduan Salin / Copy Guru
              </h5>
              <p className="text-slate-600 text-xs leading-relaxed">
                Daftarkan akun login guru dalam jumlah besar sekaligus dengan cara menyalin data tabel guru Anda dari spreadsheet Excel.
              </p>

              <div className="space-y-3 font-mono text-[10px] bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-1.5">Format Baris Teratur</div>
                <div>username [TAB] nama_lengkap_guru [TAB] role (Guru/Admin)</div>
                <div className="text-slate-400 mt-1 italic">Contoh:</div>
                <div className="text-indigo-600">
                  asrudin	Asrudin, S.Pd.	Guru<br />
                  hartono	Drs. Hartono, M.Pd.	Guru<br />
                  admin_utama	Hendra Wijaya, S.Kom.	Admin
                </div>
              </div>

              <div className="space-y-3 font-mono text-[10px] bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-1.5">Format Sederhana (Hanya Nama)</div>
                <div>Cukup paste daftar nama guru per baris. Sistem akan otomatis men-generate username login bernilai huruf kecil.</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tempelkan (Paste) Baris Data Guru / Pengguna</label>
                <textarea
                  id="import-guru-textarea"
                  rows={12}
                  value={pasteGuru}
                  onChange={e => setPasteGuru(e.target.value)}
                  placeholder="asrudin	Asrudin, S.Pd.	Guru&#10;hartono	Drs. Hartono, M.Pd.	Guru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  id="btn-execute-import-guru"
                  onClick={handleImportGuruSubmit}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Impor Data Guru &amp; Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BULK CLASS/ROMBEL IMPORT */}
      {activeTab === 'kelas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h5 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                Panduan Salin / Copy Rombel
              </h5>
              <p className="text-slate-600 text-xs leading-relaxed">
                Tambahkan Rombongan Belajar (Kelas) baru ke dalam sistem dalam hitungan detik.
              </p>

              <div className="space-y-3 font-mono text-[10px] bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-600">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 mb-1.5">Format Baris Teratur</div>
                <div>nama_kelas [TAB] username_wali_kelas</div>
                <div className="text-slate-400 mt-1 italic">Contoh:</div>
                <div className="text-indigo-600">
                  Kelas IV-A	asrudin<br />
                  Kelas V-A	budi<br />
                  Kelas VI-B	siti
                </div>
              </div>

              <p className="text-slate-500 text-[10px] leading-relaxed">
                *Harap pastikan username wali kelas yang dimasukkan sudah terdaftar dalam modul akun pengguna/guru agar wali kelas dapat masuk ke sistem.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tempelkan (Paste) Baris Data Rombel / Kelas</label>
                <textarea
                  id="import-kelas-textarea"
                  rows={12}
                  value={pasteKelas}
                  onChange={e => setPasteKelas(e.target.value)}
                  placeholder="Kelas IV-A	asrudin&#10;Kelas V-A	budi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  id="btn-execute-import-kelas"
                  onClick={handleImportKelasSubmit}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Impor Daftar Rombel / Kelas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
