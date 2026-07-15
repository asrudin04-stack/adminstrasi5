import React, { useState } from 'react';
import { BimbinganWali, Kelas, Siswa, User } from '../types';
import { HelpCircle, Calendar, Plus, Save, ClipboardCheck, ArrowUpRight, CheckCircle } from 'lucide-react';

interface GuruBimbinganProps {
  bimbingan: BimbinganWali[];
  kelas: Kelas[];
  siswa: Siswa[];
  currentUser: User;
  onSaveBimbingan: (newBimbingan: BimbinganWali) => void;
}

export default function GuruBimbingan({
  bimbingan,
  kelas,
  siswa,
  currentUser,
  onSaveBimbingan
}: GuruBimbinganProps) {
  const [selectedSiswa, setSelectedSiswa] = useState<string>('');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [masalah, setMasalah] = useState<string>('');
  const [solusi, setSolusi] = useState<string>('');
  const [tindakLanjut, setTindakLanjut] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Find classes where current user is Wali Kelas
  const myKelas = kelas.filter(
    k => k.waliKelas.toLowerCase() === currentUser.username.toLowerCase()
  );

  // Get matching student list
  const mySiswa = siswa.filter(s => myKelas.some(k => k.id === s.kelasId));

  // Set default student
  React.useEffect(() => {
    if (mySiswa.length > 0) {
      setSelectedSiswa(mySiswa[0].id);
    }
  }, [siswa, kelas, currentUser]);

  const filterBimbingan = bimbingan.filter(
    b => b.guruUsername.toLowerCase() === currentUser.username.toLowerCase()
  );

  const getSiswaName = (id: string) => siswa.find(s => s.id === id)?.namaSiswa || id;
  const getKelasName = (id: string) => kelas.find(k => k.id === id)?.namaKelas || id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) {
      alert('Silakan pilih nama siswa terlebih dahulu!');
      return;
    }
    if (!masalah.trim() || !solusi.trim() || !tindakLanjut.trim()) {
      alert('Mohon lengkapi seluruh kolom masalah, solusi, dan rencana tindak lanjut!');
      return;
    }

    const siswaObj = siswa.find(s => s.id === selectedSiswa);
    const newRecord: BimbinganWali = {
      id: `BW-LOCAL-${Date.now()}`,
      tanggal,
      siswaId: selectedSiswa,
      namaSiswa: siswaObj?.namaSiswa || '',
      kelasId: siswaObj?.kelasId || '',
      masalah,
      solusi,
      tindakLanjut,
      guruUsername: currentUser.username
    };

    onSaveBimbingan(newRecord);
    setMasalah('');
    setSolusi('');
    setTindakLanjut('');
    setShowForm(false);
    setSuccessMsg('Catatan bimbingan wali berhasil disimpan!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div id="bimbingan-view" className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-lg">Bimbingan Wali Murid &amp; Konseling</h4>
          <p className="text-slate-500 text-xs">
            Halaman rekam konseling personal untuk guru wali kelas mencatat penanganan akademis maupun perilaku siswa.
          </p>
        </div>
        {mySiswa.length > 0 && (
          <button
            id="btn-toggle-bimbingan-form"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Sembunyikan Formulir' : 'Catat Konseling Wali'}
          </button>
        )}
      </div>

      {successMsg && (
        <div id="success-bimbingan-msg" className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Jika bukan wali kelas atau tidak punya siswa */}
      {myKelas.length === 0 && (
        <div className="bg-amber-50/50 border border-amber-200 p-6 rounded-2xl text-center space-y-2 text-xs">
          <HelpCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h5 className="font-bold text-amber-800">Bukan Guru Wali Kelas</h5>
          <p className="text-amber-700 max-w-md mx-auto">
            Halaman ini dikhususkan bagi guru yang ditugaskan sebagai wali kelas. Akun Anda saat ini tidak tercatat sebagai Wali Kelas di sheet 'Kelas'.
          </p>
        </div>
      )}

      {/* Form Input */}
      {showForm && mySiswa.length > 0 && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-5">
          <h5 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-slate-600" />
            Rekam Bimbingan Konseling Baru
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Nama Siswa (Wali Kelas Anda)</label>
              <select
                id="bimbingan-siswa-select"
                value={selectedSiswa}
                onChange={e => setSelectedSiswa(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              >
                {mySiswa.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.namaSiswa} ({getKelasName(s.kelasId)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Bimbingan</label>
              <input
                id="bimbingan-tanggal-input"
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Detail Permasalahan / Kendala Siswa</label>
              <textarea
                id="bimbingan-masalah-input"
                rows={2}
                value={masalah}
                onChange={e => setMasalah(e.target.value)}
                placeholder="Contoh: Siswa sering absen di kelas Matematika karena takut menghadapi kuis lisan"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Solusi / Rekomendasi Guru Wali Kelas</label>
              <textarea
                id="bimbingan-solusi-input"
                rows={2}
                value={solusi}
                onChange={e => setSolusi(e.target.value)}
                placeholder="Contoh: Memberikan penguatan konsep dasar sebelum kelas dimulai, serta merundingkan kuis tertulis dengan guru Mapel"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rencana Tindak Lanjut Pasca Konseling</label>
              <textarea
                id="bimbingan-tindaklanjut-input"
                rows={2}
                value={tindakLanjut}
                onChange={e => setTindakLanjut(e.target.value)}
                placeholder="Contoh: Melakukan pengecekan berkala pada nilai Matematika dan mengontak orang tua jika kehadiran tidak membaik dalam 2 minggu"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              id="btn-cancel-bimbingan"
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              id="btn-submit-bimbingan"
              type="submit"
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Simpan Catatan
            </button>
          </div>
        </form>
      )}

      {/* Riwayat Konseling */}
      {myKelas.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h5 className="font-bold text-slate-800 text-sm">Log Bimbingan Wali Murid Aktif</h5>
          </div>

          {filterBimbingan.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filterBimbingan.map((item, idx) => (
                <div key={item.id || idx} className="p-6 hover:bg-slate-50/50 transition-colors space-y-4">
                  <div className="flex flex-wrap gap-3 justify-between items-start">
                    <div className="space-y-1">
                      <h6 className="font-bold text-slate-800 text-sm">{getSiswaName(item.siswaId)}</h6>
                      <div className="flex gap-4 text-slate-500 text-xs">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{item.tanggal}</span>
                        <span>Kelas: {getKelasName(item.kelasId)}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">ID: {item.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-red-50/40 border border-red-100/50 rounded-xl space-y-1">
                      <div className="font-bold text-red-800">Masalah / Kendala:</div>
                      <p className="text-red-700 leading-relaxed">{item.masalah}</p>
                    </div>
                    <div className="p-3 bg-indigo-50/30 border border-indigo-100/50 rounded-xl space-y-1">
                      <div className="font-bold text-indigo-800">Solusi / Konseling Wali:</div>
                      <p className="text-indigo-700 leading-relaxed">{item.solusi}</p>
                    </div>
                    <div className="p-3 bg-emerald-50/30 border border-emerald-100/50 rounded-xl space-y-1">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">Tindak Lanjut <ArrowUpRight className="w-3.5 h-3.5" /></div>
                      <p className="text-emerald-700 leading-relaxed">{item.tindakLanjut}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              Belum ada rekam catatan bimbingan konseling kelas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
