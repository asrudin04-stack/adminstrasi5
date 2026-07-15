import React, { useState, useEffect } from 'react';
import { Kelas, Siswa, Absensi, User } from '../types';
import { Save, ClipboardList, CheckCircle, Info, Calendar } from 'lucide-react';

interface GuruAbsensiProps {
  kelas: Kelas[];
  siswa: Siswa[];
  absensi: Absensi[];
  currentUser: User;
  onSaveAbsensi: (newAbsensi: Absensi[]) => void;
}

export default function GuruAbsensi({
  kelas,
  siswa,
  absensi,
  currentUser,
  onSaveAbsensi
}: GuruAbsensiProps) {
  const [selectedKelas, setSelectedKelas] = useState<string>('');
  const [selectedTanggal, setSelectedTanggal] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [daftarAbsen, setDaftarAbsen] = useState<Omit<Absensi, 'id'>[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Set default kelas
  useEffect(() => {
    if (kelas.length > 0) {
      // Prioritize kelas where this guru is wali kelas, otherwise pick first
      const preferred = kelas.find(k => k.waliKelas === currentUser.username);
      setSelectedKelas(preferred ? preferred.id : kelas[0].id);
    }
  }, [kelas, currentUser]);

  // Load students and matching attendance records when kelas or tanggal changes
  useEffect(() => {
    if (!selectedKelas) return;

    const kelasSiswa = siswa.filter(s => s.kelasId === selectedKelas);
    
    // Find matching attendance for selected kelas and tanggal
    const matchingAbsensi = absensi.filter(
      a => a.kelasId === selectedKelas && a.tanggal === selectedTanggal
    );

    const merged = kelasSiswa.map(s => {
      const match = matchingAbsensi.find(a => a.siswaId === s.id);
      return {
        tanggal: selectedTanggal,
        kelasId: selectedKelas,
        siswaId: s.id,
        namaSiswa: s.namaSiswa,
        status: match ? match.status : ('H' as const),
        keterangan: match ? (match.keterangan || '') : '',
        guruUsername: currentUser.username
      };
    });

    setDaftarAbsen(merged);
  }, [selectedKelas, selectedTanggal, siswa, absensi, currentUser]);

  const handleStatusChange = (siswaId: string, status: 'H' | 'I' | 'S' | 'A') => {
    setDaftarAbsen(prev =>
      prev.map(item => (item.siswaId === siswaId ? { ...item, status } : item))
    );
  };

  const handleKeteranganChange = (siswaId: string, keterangan: string) => {
    setDaftarAbsen(prev =>
      prev.map(item => (item.siswaId === siswaId ? { ...item, keterangan } : item))
    );
  };

  const handleSave = () => {
    const recordsToSave: Absensi[] = daftarAbsen.map((item, idx) => ({
      id: `A-LOCAL-${Date.now()}-${idx}`,
      ...item
    }));
    onSaveAbsensi(recordsToSave);
    setSuccessMsg('Absensi berhasil disimpan di penyimpanan lokal!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const selectedKelasObj = kelas.find(k => k.id === selectedKelas);

  return (
    <div id="absensi-view" className="space-y-6">
      {/* Filter panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Rombongan Belajar</label>
            <select
              id="select-kelas-absensi"
              value={selectedKelas}
              onChange={e => setSelectedKelas(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-800 focus:bg-white outline-none transition-all"
            >
              {kelas.map(k => (
                <option key={k.id} value={k.id}>
                  {k.namaKelas} (Wali: @{k.waliKelas})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Absensi</label>
            <div className="relative">
              <input
                id="input-tanggal-absensi"
                type="date"
                value={selectedTanggal}
                onChange={e => setSelectedTanggal(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-800 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
              <span>Siswa Terdaftar:</span>
              <strong className="text-slate-800">{daftarAbsen.length} Anak</strong>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div id="success-absensi-msg" className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Main Checklist */}
      {daftarAbsen.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-slate-500" />
                Lembar Kehadiran Siswa
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedKelasObj?.namaKelas} • Tanggal: {selectedTanggal}
              </p>
            </div>
            <button
              id="btn-save-absensi"
              onClick={handleSave}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              Simpan Presensi
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
                  <th className="px-6 py-3.5 w-12 text-center">No</th>
                  <th className="px-6 py-3.5">Nama Lengkap Siswa</th>
                  <th className="px-6 py-3.5 w-72 text-center">Status Presensi</th>
                  <th className="px-6 py-3.5">Keterangan Khusus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daftarAbsen.map((item, index) => (
                  <tr key={item.siswaId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-xs">
                        {item.namaSiswa}
                      </div>
                      <div className="text-slate-400 font-mono text-[10px] mt-0.5">
                        Siswa ID: {item.siswaId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {(['H', 'I', 'S', 'A'] as const).map(status => {
                          const statusColors = {
                            H: 'border-emerald-200 text-emerald-700 bg-emerald-50 checked:bg-emerald-600 checked:border-emerald-600',
                            I: 'border-blue-200 text-blue-700 bg-blue-50 checked:bg-blue-600 checked:border-blue-600',
                            S: 'border-amber-200 text-amber-700 bg-amber-50 checked:bg-amber-600 checked:border-amber-600',
                            A: 'border-rose-200 text-rose-700 bg-rose-50 checked:bg-rose-600 checked:border-rose-600'
                          };

                          const labelText = {
                            H: 'Hadir',
                            I: 'Izin',
                            S: 'Sakit',
                            A: 'Alfa'
                          };

                          const isChecked = item.status === status;

                          return (
                            <button
                              key={status}
                              id={`btn-absensi-status-${item.siswaId}-${status}`}
                              onClick={() => handleStatusChange(item.siswaId, status)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                                isChecked
                                  ? status === 'H' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                    : status === 'I' ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : status === 'S' ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                    : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {labelText[status]}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        id={`input-absensi-ket-${item.siswaId}`}
                        type="text"
                        placeholder={item.status === 'H' ? 'Hadir tepat waktu' : 'Tulis alasan...'}
                        value={item.keterangan || ''}
                        onChange={e => handleKeteranganChange(item.siswaId, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none transition-all"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center space-y-3">
          <Info className="w-12 h-12 text-amber-500 mx-auto" />
          <h5 className="font-semibold text-slate-800">Tidak ada siswa ditemukan</h5>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Kelas ini belum memiliki daftar siswa. Anda dapat melakukan import siswa massal terlebih dahulu di menu Admin.
          </p>
        </div>
      )}
    </div>
  );
}
