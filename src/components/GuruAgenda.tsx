import React, { useState } from 'react';
import { Agenda, Kelas, Mapel, User } from '../types';
import { BookOpen, Calendar, Clock, Plus, HelpCircle, ClipboardCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface GuruAgendaProps {
  agenda: Agenda[];
  kelas: Kelas[];
  mapel: Mapel[];
  currentUser: User;
  onSaveAgenda: (newAgenda: Agenda) => void;
}

export default function GuruAgenda({
  agenda,
  kelas,
  mapel,
  currentUser,
  onSaveAgenda
}: GuruAgendaProps) {
  const [selectedKelas, setSelectedKelas] = useState<string>(kelas[0]?.id || '');
  const [selectedMapel, setSelectedMapel] = useState<string>(mapel[0]?.id || '');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [jamKe, setJamKe] = useState<string>('1-2');
  const [materi, setMateri] = useState<string>('');
  const [pencapaian, setPencapaian] = useState<string>('100%');
  const [hambatan, setHambatan] = useState<string>('');
  const [solusi, setSolusi] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const filterAgenda = agenda.filter(
    a => a.guruUsername.toLowerCase() === currentUser.username.toLowerCase()
  );

  const getKelasName = (id: string) => kelas.find(k => k.id === id)?.namaKelas || id;
  const getMapelName = (id: string) => mapel.find(m => m.id === id)?.namaMapel || id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materi.trim()) {
      alert('Harap masukkan isi materi pembelajaran!');
      return;
    }

    const newRecord: Agenda = {
      id: `AG-LOCAL-${Date.now()}`,
      tanggal,
      kelasId: selectedKelas,
      mapelId: selectedMapel,
      jamKe,
      materi,
      pencapaian,
      hambatan,
      solusi,
      guruUsername: currentUser.username
    };

    onSaveAgenda(newRecord);
    setMateri('');
    setHambatan('');
    setSolusi('');
    setShowForm(false);
    setSuccessMsg('Agenda harian mengajar berhasil dicatat!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div id="agenda-view" className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-lg">Jurnal Agenda Mengajar Guru</h4>
          <p className="text-slate-500 text-xs">
            Catat semua materi pengajaran harian Anda untuk pelaporan berkala bagi kepala sekolah.
          </p>
        </div>
        <button
          id="btn-toggle-agenda-form"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Sembunyikan Formulir' : 'Catat Agenda Baru'}
        </button>
      </div>

      {successMsg && (
        <div id="success-agenda-msg" className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Formulir Input Agenda Baru */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-5">
          <h5 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-slate-600" />
            Catat Agenda Pembelajaran Hari Ini
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Kelas</label>
              <select
                id="agenda-kelas-select"
                value={selectedKelas}
                onChange={e => setSelectedKelas(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              >
                {kelas.map(k => (
                  <option key={k.id} value={k.id}>{k.namaKelas}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Mata Pelajaran</label>
              <select
                id="agenda-mapel-select"
                value={selectedMapel}
                onChange={e => setSelectedMapel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              >
                {mapel.map(m => (
                  <option key={m.id} value={m.id}>{m.namaMapel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tanggal Kegiatan</label>
              <input
                id="agenda-tanggal-input"
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jam Ke (Contoh: 1-2)</label>
              <input
                id="agenda-jam-input"
                type="text"
                value={jamKe}
                onChange={e => setJamKe(e.target.value)}
                placeholder="misal: 1-2, 3-4"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Materi / Sub-Materi Pelajaran</label>
              <input
                id="agenda-materi-input"
                type="text"
                value={materi}
                onChange={e => setMateri(e.target.value)}
                placeholder="Contoh: Mengukur volume bangun ruang balok dengan kubus satuan"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ketercapaian Materi (%)</label>
              <input
                id="agenda-pencapaian-input"
                type="text"
                value={pencapaian}
                onChange={e => setPencapaian(e.target.value)}
                placeholder="misal: 90% atau Lancar"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Hambatan / Kendala Kelas (Opsional)</label>
              <textarea
                id="agenda-hambatan-input"
                rows={2}
                value={hambatan}
                onChange={e => setHambatan(e.target.value)}
                placeholder="misal: Beberapa siswa kesulitan memahami rumus perkalian dasar..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Solusi / Rencana Tindak Lanjut</label>
              <textarea
                id="agenda-solusi-input"
                rows={2}
                value={solusi}
                onChange={e => setSolusi(e.target.value)}
                placeholder="misal: Memberikan bimbingan personal pasca pelajaran..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              id="btn-cancel-agenda"
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              id="btn-submit-agenda"
              type="submit"
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Catat Agenda
            </button>
          </div>
        </form>
      )}

      {/* Riwayat Agenda Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h5 className="font-bold text-slate-800 text-sm">Riwayat Jurnal Mengajar Anda</h5>
        </div>

        {filterAgenda.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filterAgenda.map((item, idx) => (
              <div key={item.id || idx} className="p-6 hover:bg-slate-50/50 transition-colors space-y-4">
                <div className="flex flex-wrap gap-3 justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{getMapelName(item.mapelId)}</span>
                      <span className="text-slate-400 font-mono text-[10px]">({item.id})</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-xs font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />{item.tanggal}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" />Jam Ke: {item.jamKe}</span>
                      <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-slate-400" />Kelas: {getKelasName(item.kelasId)}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-full">
                    Ketercapaian: {item.pencapaian}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <div className="font-bold text-slate-700">Materi yang diajarkan:</div>
                    <p className="text-slate-600 leading-relaxed">{item.materi}</p>
                  </div>
                  <div className="p-3 bg-amber-50/30 border border-amber-100/60 rounded-xl space-y-1">
                    <div className="font-bold text-amber-800 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />Hambatan Kelas:</div>
                    <p className="text-amber-700 leading-relaxed">{item.hambatan || 'Tidak ada hambatan kelas yang berarti.'}</p>
                  </div>
                  <div className="p-3 bg-indigo-50/30 border border-indigo-100/60 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-800 flex items-center gap-1"><ArrowRight className="w-3.5 h-3.5" />Rencana Solusi:</div>
                    <p className="text-indigo-700 leading-relaxed">{item.solusi || 'Materi dilanjutkan sesuai silabus.'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            Belum ada rekam agenda jurnal yang dicatat.
          </div>
        )}
      </div>
    </div>
  );
}
