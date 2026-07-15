import React, { useState } from 'react';
import { User } from '../types';
import { Plus, Trash2, Shield, UserCheck, ToggleLeft, ToggleRight, CheckCircle } from 'lucide-react';

interface AdminUsersProps {
  users: User[];
  onAddUser: (username: string, nama: string, role: 'Admin' | 'Guru') => void;
  onDeleteUser: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export default function AdminUsers({
  users,
  onAddUser,
  onDeleteUser,
  onToggleStatus
}: AdminUsersProps) {
  const [username, setUsername] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const [role, setRole] = useState<'Admin' | 'Guru'>('Guru');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !nama.trim()) {
      alert('Harap isi username dan nama lengkap terlebih dahulu!');
      return;
    }

    // Check duplicate username
    const isDup = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (isDup) {
      alert('Username sudah terdaftar! Harap pilih username lain.');
      return;
    }

    onAddUser(username.trim().toLowerCase(), nama.trim(), role);
    setUsername('');
    setNama('');
    setRole('Guru');
    setSuccessMsg('Akun pengguna baru berhasil ditambahkan!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div id="users-view" className="space-y-6">
      {successMsg && (
        <div id="success-user-msg" className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah User */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h5 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-600" />
              Tambah Akun Pengguna Baru
            </h5>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username Sistem</label>
              <input
                id="user-username-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="misal: budi, asrudin"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap &amp; Gelar</label>
              <input
                id="user-nama-input"
                type="text"
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="misal: Budi Santoso, S.Pd."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Hak Akses Sistem</label>
              <select
                id="user-role-select"
                value={role}
                onChange={e => setRole(e.target.value as 'Admin' | 'Guru')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              >
                <option value="Guru">Guru Biasa / Wali Kelas</option>
                <option value="Admin">Administrator Sekolah</option>
              </select>
            </div>

            <button
              id="btn-submit-user"
              type="submit"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Daftarkan Pengguna
            </button>
          </form>
        </div>

        {/* Tabel Daftar Users */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h5 className="font-bold text-slate-800 text-sm">Manajemen Akun Terdaftar</h5>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
                    <th className="px-6 py-3.5">Nama Lengkap</th>
                    <th className="px-6 py-3.5">Username</th>
                    <th className="px-6 py-3.5 text-center">Hak Akses</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 text-xs flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                            {u.nama.charAt(0).toUpperCase()}
                          </div>
                          {u.nama}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">
                        @{u.username}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'Admin' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          id={`btn-toggle-status-${u.id}`}
                          onClick={() => onToggleStatus && onToggleStatus(u.id)}
                          className="focus:outline-none"
                          title="Klik untuk mengubah status"
                        >
                          {u.status === 'Aktif' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                              Nonaktif
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {u.username !== 'admin' ? (
                          <button
                            id={`btn-delete-user-${u.id}`}
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus user @${u.username}?`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs font-medium italic">Sistem</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
