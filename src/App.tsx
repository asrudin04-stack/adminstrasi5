import React, { useState, useEffect } from 'react';
import { 
  SchoolConfig, User, Kelas, Mapel, Siswa, Absensi, Nilai, Agenda, BimbinganWali, JadwalMengajar 
} from './types';
import { 
  getStoredData, saveStoredData, 
  initialConfig, initialUsers, initialKelas, initialMapel, initialSiswa, initialAbsensi, initialNilai, initialAgenda, initialBimbinganWali, initialJadwalMengajar 
} from './data/mockData';

// Component Imports
import Dashboard from './components/Dashboard';
import GuruAbsensi from './components/GuruAbsensi';
import GuruPenilaian from './components/GuruPenilaian';
import GuruJadwal from './components/GuruJadwal';
import GuruAgenda from './components/GuruAgenda';
import GuruBimbingan from './components/GuruBimbingan';
import AdminRekap from './components/AdminRekap';
import AdminUsers from './components/AdminUsers';
import AdminImport from './components/AdminImport';
import AdminConfig from './components/AdminConfig';
import CodeExporter from './components/CodeExporter';

// Lucide Icons
import { 
  School, LayoutDashboard, ClipboardList, Star, BookOpen, Handshake, CalendarDays, 
  FileSpreadsheet, UserCheck, FileInput, Settings, Code, Menu, X, LogOut, Clock, HelpCircle 
} from 'lucide-react';

export default function App() {
  // Authentication & Webapp state
  const [gasUrl, setGasUrl] = useState<string>(() => localStorage.getItem('SAG_API_URL') || '');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('SAG_USER');
    return saved ? JSON.parse(saved) : null;
  });

  // Core Database States (loaded from localStorage or defaults)
  const [config, setConfig] = useState<SchoolConfig>(() => getStoredData('config', initialConfig));
  const [users, setUsers] = useState<User[]>(() => getStoredData('users', initialUsers));
  const [kelas, setKelas] = useState<Kelas[]>(() => getStoredData('kelas', initialKelas));
  const [mapel, setMapel] = useState<Mapel[]>(() => getStoredData('mapel', initialMapel));
  const [siswa, setSiswa] = useState<Siswa[]>(() => getStoredData('siswa', initialSiswa));
  const [absensi, setAbsensi] = useState<Absensi[]>(() => getStoredData('absensi', initialAbsensi));
  const [nilai, setNilai] = useState<Nilai[]>(() => getStoredData('nilai', initialNilai));
  const [agenda, setAgenda] = useState<Agenda[]>(() => getStoredData('agenda', initialAgenda));
  const [bimbingan, setBimbingan] = useState<BimbinganWali[]>(() => getStoredData('bimbingan', initialBimbinganWali));
  const [jadwal, setJadwal] = useState<JadwalMengajar[]>(() => getStoredData('jadwal', initialJadwalMengajar));

  // UI States
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loginUsername, setLoginUsername] = useState<string>('asrudin');
  const [loginError, setLoginError] = useState<string>('');

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID') + ' WIB');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // One-time auto migration of school name to SD Negeri 1 Gemblengaan
  useEffect(() => {
    if (config.namaSekolah === "SDN BERKARAKTER UNGGUL UTAMA") {
      setConfig(prev => ({ ...prev, namaSekolah: "SD Negeri 1 Gemblengaan" }));
    }
  }, [config.namaSekolah]);

  // Save states to localstorage whenever they change
  useEffect(() => { saveStoredData('config', config); }, [config]);
  useEffect(() => { saveStoredData('users', users); }, [users]);
  useEffect(() => { saveStoredData('kelas', kelas); }, [kelas]);
  useEffect(() => { saveStoredData('mapel', mapel); }, [mapel]);
  useEffect(() => { saveStoredData('siswa', siswa); }, [siswa]);
  useEffect(() => { saveStoredData('absensi', absensi); }, [absensi]);
  useEffect(() => { saveStoredData('nilai', nilai); }, [nilai]);
  useEffect(() => { saveStoredData('agenda', agenda); }, [agenda]);
  useEffect(() => { saveStoredData('bimbingan', bimbingan); }, [bimbingan]);
  useEffect(() => { saveStoredData('jadwal', jadwal); }, [jadwal]);

  // Auth Functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username.toLowerCase() === loginUsername.trim().toLowerCase());
    
    if (user) {
      if (user.status === 'Nonaktif') {
        setLoginError('Akun ini dinonaktifkan oleh administrator.');
        return;
      }
      setCurrentUser(user);
      localStorage.setItem('SAG_USER', JSON.stringify(user));
      localStorage.setItem('SAG_API_URL', gasUrl);
      setLoginError('');
    } else {
      setLoginError('Username tidak ditemukan atau salah. Coba: admin atau asrudin.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('SAG_USER');
    setActiveView('dashboard');
  };

  // State manipulation handlers (Simulating GAS mutations on local storage)
  const handleSaveAbsensi = (newAbsensiList: Absensi[]) => {
    setAbsensi(prev => {
      // Remove any previous entries for the same date and class to avoid duplicates
      const filtered = prev.filter(
        a => !(a.tanggal === newAbsensiList[0].tanggal && a.kelasId === newAbsensiList[0].kelasId)
      );
      return [...filtered, ...newAbsensiList];
    });
  };

  const handleSaveNilai = (newNilaiList: Nilai[]) => {
    setNilai(prev => {
      const updated = [...prev];
      newNilaiList.forEach(item => {
        const idx = updated.findIndex(n => n.siswaId === item.siswaId && n.mapelId === item.mapelId);
        if (idx !== -1) {
          updated[idx] = item;
        } else {
          updated.push(item);
        }
      });
      return updated;
    });
  };

  const handleSaveAgenda = (newRecord: Agenda) => {
    setAgenda(prev => [newRecord, ...prev]);
  };

  const handleSaveBimbingan = (newRecord: BimbinganWali) => {
    setBimbingan(prev => [newRecord, ...prev]);
  };

  const handleAddUser = (username: string, nama: string, role: 'Admin' | 'Guru') => {
    const newUser: User = {
      id: `U-LOCAL-${Date.now()}`,
      username,
      nama,
      role,
      status: 'Aktif'
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : u));
  };

  const handleImportSiswa = (newSiswaList: Omit<Siswa, 'id'>[]) => {
    const formatted: Siswa[] = newSiswaList.map((item, index) => ({
      id: `S-LOCAL-${Date.now()}-${index}`,
      ...item
    }));
    setSiswa(prev => [...prev, ...formatted]);
  };

  const handleImportUsers = (newUsersList: Omit<User, 'id'>[]) => {
    setUsers(prev => {
      const filtered = prev.filter(u => !newUsersList.some(n => n.username.toLowerCase() === u.username.toLowerCase()));
      const formatted: User[] = newUsersList.map((u, i) => ({
        id: `U-LOCAL-${Date.now()}-${i}`,
        username: u.username.toLowerCase(),
        nama: u.nama,
        role: u.role || 'Guru',
        status: u.status || 'Aktif'
      }));
      return [...filtered, ...formatted];
    });
  };

  const handleImportKelas = (newKelasList: Omit<Kelas, 'id'>[]) => {
    setKelas(prev => {
      const filtered = prev.filter(k => !newKelasList.some(n => n.namaKelas.toLowerCase() === k.namaKelas.toLowerCase()));
      const formatted: Kelas[] = newKelasList.map((k, i) => ({
        id: `K-LOCAL-${Date.now()}-${i}`,
        namaKelas: k.namaKelas,
        waliKelas: k.waliKelas
      }));
      return [...filtered, ...formatted];
    });
  };

  const handleBulkInitializeSD = (
    newKelas: Omit<Kelas, 'id'>[],
    newUsers: Omit<User, 'id'>[],
    newSiswa: Omit<Siswa, 'id'>[]
  ) => {
    // 1. Add Users
    let updatedUsers = [...users];
    const userMapUsernameToId = new Map<string, string>();
    updatedUsers.forEach(u => userMapUsernameToId.set(u.username.toLowerCase(), u.id));

    newUsers.forEach((nu, idx) => {
      const usernameLower = nu.username.toLowerCase();
      if (!userMapUsernameToId.has(usernameLower)) {
        const id = `U-LOCAL-${Date.now()}-${idx}`;
        updatedUsers.push({
          id,
          username: usernameLower,
          nama: nu.nama,
          role: nu.role,
          status: nu.status
        });
        userMapUsernameToId.set(usernameLower, id);
      }
    });
    setUsers(updatedUsers);

    // 2. Add Classes
    let updatedKelas = [...kelas];
    const kelasMapNameToId = new Map<string, string>();
    updatedKelas.forEach(k => kelasMapNameToId.set(k.namaKelas.toLowerCase(), k.id));

    newKelas.forEach((nk, idx) => {
      const key = nk.namaKelas.toLowerCase();
      if (!kelasMapNameToId.has(key)) {
        const id = `K-LOCAL-${Date.now()}-${idx}`;
        updatedKelas.push({
          id,
          namaKelas: nk.namaKelas,
          waliKelas: nk.waliKelas.toLowerCase()
        });
        kelasMapNameToId.set(key, id);
      }
    });
    setKelas(updatedKelas);

    // 3. Add Students
    const formattedSiswa: Siswa[] = [];
    newSiswa.forEach((ns, idx) => {
      const clsName = ns.kelasId; // The generator holds class name in kelasId temporarily
      const actualKelasId = kelasMapNameToId.get(clsName.toLowerCase()) || updatedKelas[0]?.id || 'K-001';
      
      formattedSiswa.push({
        id: `S-LOCAL-${Date.now()}-${idx}`,
        nis: ns.nis,
        nisn: ns.nisn,
        namaSiswa: ns.namaSiswa,
        jenisKelamin: ns.jenisKelamin,
        kelasId: actualKelasId
      });
    });
    setSiswa(prev => [...prev, ...formattedSiswa]);
  };

  // Render navigation lists
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'All' },
    { id: 'absensi', label: 'Input Absensi', icon: ClipboardList, role: 'All' },
    { id: 'penilaian', label: 'Input Penilaian', icon: Star, role: 'All' },
    { id: 'agenda', label: 'Jurnal Agenda', icon: BookOpen, role: 'All' },
    { id: 'bimbingan', label: 'Bimbingan Wali', icon: Handshake, role: 'All' },
    { id: 'jadwal', label: 'Jadwal Mengajar', icon: CalendarDays, role: 'All' },
    // Admin only
    { id: 'rekap', label: 'Rekap Wali & PDF', icon: FileSpreadsheet, role: 'Admin' },
    { id: 'users', label: 'Manajemen User', icon: UserCheck, role: 'Admin' },
    { id: 'import', label: 'Import Siswa Massal', icon: FileInput, role: 'Admin' },
    { id: 'config', label: 'Konfigurasi Sekolah', icon: Settings, role: 'Admin' },
    // Code center
    { id: 'code-exporter', label: 'Integrasi GAS/Blogger', icon: Code, role: 'All' }
  ];

  const handleNavigate = (view: string) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  // Render View Selector
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            config={config} 
            user={currentUser!} 
            users={users} 
            kelas={kelas} 
            siswa={siswa} 
            absensi={absensi} 
            nilai={nilai} 
            onNavigate={handleNavigate}
            onUpdateLogo={(newLogo) => setConfig(prev => ({ ...prev, logoKiri: newLogo }))}
          />
        );
      case 'absensi':
        return (
          <GuruAbsensi 
            kelas={kelas} 
            siswa={siswa} 
            absensi={absensi} 
            currentUser={currentUser!} 
            onSaveAbsensi={handleSaveAbsensi}
          />
        );
      case 'penilaian':
        return (
          <GuruPenilaian 
            kelas={kelas} 
            mapel={mapel} 
            siswa={siswa} 
            nilai={nilai} 
            onSaveNilai={handleSaveNilai}
          />
        );
      case 'agenda':
        return (
          <GuruAgenda 
            agenda={agenda} 
            kelas={kelas} 
            mapel={mapel} 
            currentUser={currentUser!} 
            onSaveAgenda={handleSaveAgenda}
          />
        );
      case 'bimbingan':
        return (
          <GuruBimbingan 
            bimbingan={bimbingan} 
            kelas={kelas} 
            siswa={siswa} 
            currentUser={currentUser!} 
            onSaveBimbingan={handleSaveBimbingan}
          />
        );
      case 'jadwal':
        return (
          <GuruJadwal 
            jadwal={jadwal} 
            kelas={kelas} 
            mapel={mapel} 
            currentUser={currentUser!}
          />
        );
      case 'rekap':
        return (
          <AdminRekap 
            kelas={kelas} 
            mapel={mapel} 
            siswa={siswa} 
            nilai={nilai} 
            config={config}
          />
        );
      case 'users':
        return (
          <AdminUsers 
            users={users} 
            onAddUser={handleAddUser} 
            onDeleteUser={handleDeleteUser} 
            onToggleStatus={handleToggleStatus}
          />
        );
      case 'import':
        return (
          <AdminImport 
            kelas={kelas} 
            users={users}
            onImportSiswa={handleImportSiswa}
            onImportUsers={handleImportUsers}
            onImportKelas={handleImportKelas}
            onBulkInitializeSD={handleBulkInitializeSD}
          />
        );
      case 'config':
        return (
          <AdminConfig 
            config={config} 
            onSaveConfig={setConfig}
          />
        );
      case 'code-exporter':
        return <CodeExporter />;
      default:
        return <div className="p-8 text-center text-slate-500">View Not Found</div>;
    }
  };

  // Render Login Panel
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 selection:bg-slate-800 selection:text-white">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 translate-x-12 -translate-y-12 select-none pointer-events-none">
            <School className="w-64 h-64" />
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-slate-900 text-white rounded-2xl shadow-sm mb-4">
              <School className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Sistem Administrasi Guru</h3>
            <p className="text-slate-500 text-xs mt-1">Sistem Administrasi Guru (SAG) Platinum</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">1. URL Google Apps Script Web App</label>
              <input
                id="login-gas-url"
                type="text"
                value={gasUrl}
                onChange={e => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:bg-white"
              />
              <p className="text-[10px] text-slate-400 mt-1 italic">
                *Opsional. Kosongkan saja untuk menggunakan Mode Simulasi Database Lokal.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">2. Pilih Pengguna Sistem</label>
              <select
                id="login-username-select"
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                {users.map(u => (
                  <option key={u.id} value={u.username}>
                    {u.nama} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {loginError && (
              <div id="login-error-alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {loginError}
              </div>
            )}

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              MASUK KE SISTEM
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
            <span>Platinum Edition v1.0</span>
            <span>REST API / JSON Engine</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-800 font-sans flex antialiased">
      {/* Sidebar Overlay (Mobile) */}
      {isMobileOpen && (
        <div 
          id="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside 
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 bg-[#2C3E50] text-slate-200 w-72 transform lg:transform-none lg:opacity-100 transition-all duration-300 z-50 flex flex-col justify-between border-r border-slate-700/50 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-grow">
          {/* School Brand Header */}
          <div className="p-5 border-b border-slate-700/50 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img src={config.logoKiri} alt="School Emblem" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="truncate">
              <h5 className="font-bold text-xs text-white leading-tight truncate">{config.namaSekolah}</h5>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Tahun: {config.tahunAjaran}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <ul className="space-y-1">
              {navItems.map(item => {
                // Role filter
                if (item.role === 'Admin' && currentUser.role !== 'Admin') return null;

                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <li key={item.id}>
                    <button
                      id={`nav-menu-${item.id}`}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-slate-700 text-white shadow-sm font-bold border-l-4 border-indigo-400 pl-3'
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase shadow-inner">
              {currentUser.nama.charAt(0)}
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-white truncate">{currentUser.nama}</div>
              <div className="text-[10px] text-slate-400 font-medium">@{currentUser.username} ({currentUser.role})</div>
            </div>
          </div>
          <button
            id="btn-logout"
            onClick={handleLogout}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow lg:pl-72 flex flex-col min-h-screen">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              id="btn-mobile-menu"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 id="header-view-title" className="text-base md:text-lg font-bold text-slate-800 capitalize">
                {activeView.replace('-', ' ')}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Sistem Administrasi Guru • Semester {config.semester}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span id="header-clock">{currentTime || '00:00:00 WIB'}</span>
            </span>
          </div>
        </header>

        {/* View Content Wrapper */}
        <main className="p-6 flex-grow max-w-7xl w-full mx-auto space-y-6">
          {renderActiveView()}
        </main>

        {/* Humble Footer */}
        <footer className="py-4 border-t border-slate-200/50 bg-white text-center text-[10px] text-slate-400 font-medium">
          Sistem Administrasi Guru (SAG) Platinum • Drs. H. Mulyadi, M.Pd. &copy; 2026. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
