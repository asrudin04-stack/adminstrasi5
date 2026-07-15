import React, { useState, useEffect } from 'react';
import { Kelas, Mapel, Siswa, Nilai } from '../types';
import { Save, Award, Info, FileSpreadsheet, Percent, CheckCircle } from 'lucide-react';

interface GuruPenilaianProps {
  kelas: Kelas[];
  mapel: Mapel[];
  siswa: Siswa[];
  nilai: Nilai[];
  onSaveNilai: (newNilaiList: Nilai[]) => void;
}

export default function GuruPenilaian({
  kelas,
  mapel,
  siswa,
  nilai,
  onSaveNilai
}: GuruPenilaianProps) {
  const [selectedKelas, setSelectedKelas] = useState<string>('');
  const [selectedMapel, setSelectedMapel] = useState<string>('');
  const [daftarNilai, setDaftarNilai] = useState<Nilai[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Set default filters
  useEffect(() => {
    if (kelas.length > 0) setSelectedKelas(kelas[0].id);
    if (mapel.length > 0) setSelectedMapel(mapel[0].id);
  }, [kelas, mapel]);

  // Load / Merge Grades
  useEffect(() => {
    if (!selectedKelas || !selectedMapel) return;

    const kelasSiswa = siswa.filter(s => s.kelasId === selectedKelas);
    const existingNilai = nilai.filter(
      n => n.kelasId === selectedKelas && n.mapelId === selectedMapel
    );

    const merged = kelasSiswa.map(s => {
      const match = existingNilai.find(n => n.siswaId === s.id);
      return {
        id: match ? match.id : `N-LOCAL-${Date.now()}-${s.id}`,
        siswaId: s.id,
        namaSiswa: s.namaSiswa,
        kelasId: selectedKelas,
        mapelId: selectedMapel,
        tugas1: match ? match.tugas1 : 0,
        tugas2: match ? match.tugas2 : 0,
        uts: match ? match.uts : 0,
        uas: match ? match.uas : 0,
        nilaiAkhir: match ? match.nilaiAkhir : 0,
        predikat: match ? match.predikat : 'E'
      };
    });

    setDaftarNilai(merged);
  }, [selectedKelas, selectedMapel, siswa, nilai]);

  // Handle score change and re-evaluate Final Score & Predicate on the fly
  const handleScoreChange = (
    siswaId: string,
    field: 'tugas1' | 'tugas2' | 'uts' | 'uas',
    valueStr: string
  ) => {
    let num = parseFloat(valueStr) || 0;
    if (num < 0) num = 0;
    if (num > 100) num = 100;

    setDaftarNilai(prev =>
      prev.map(item => {
        if (item.siswaId === siswaId) {
          const updated = { ...item, [field]: num };
          
          // Calculate average of Tugas 1 and Tugas 2
          const avgTugas = (updated.tugas1 + updated.tugas2) / 2;
          // Weighted sum
          const finalScore = (avgTugas * 0.3) + (updated.uts * 0.3) + (updated.uas * 0.4);
          const roundedFinal = Math.round(finalScore * 10) / 10;

          let predikat = 'E';
          if (roundedFinal >= 90) predikat = 'A';
          else if (roundedFinal >= 80) predikat = 'B';
          else if (roundedFinal >= 70) predikat = 'C';
          else if (roundedFinal >= 60) predikat = 'D';

          return {
            ...updated,
            nilaiAkhir: roundedFinal,
            predikat
          };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    onSaveNilai(daftarNilai);
    setSuccessMsg('Penilaian Leger berhasil disimpan di penyimpanan lokal!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const currentKelasObj = kelas.find(k => k.id === selectedKelas);
  const currentMapelObj = mapel.find(m => m.id === selectedMapel);

  return (
    <div id="penilaian-view" className="space-y-6">
      {/* Filter panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Rombongan Belajar</label>
            <select
              id="select-kelas-penilaian"
              value={selectedKelas}
              onChange={e => setSelectedKelas(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-800 focus:bg-white outline-none transition-all"
            >
              {kelas.map(k => (
                <option key={k.id} value={k.id}>
                  {k.namaKelas}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Mata Pelajaran</label>
            <select
              id="select-mapel-penilaian"
              value={selectedMapel}
              onChange={e => setSelectedMapel(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-slate-800 focus:bg-white outline-none transition-all"
            >
              {mapel.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.kodeMapel}] {m.namaMapel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap gap-4 justify-between items-center text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-slate-400" />
          <span>Formula Nilai Akhir: </span>
          <strong className="text-slate-800">30% (Rerata Tugas) + 30% UTS + 40% UAS</strong>
        </div>
        <div className="flex gap-4 font-semibold text-slate-500">
          <span>A: &ge;90</span>
          <span>B: &ge;80</span>
          <span>C: &ge;70</span>
          <span>D: &ge;60</span>
          <span>E: &lt;60</span>
        </div>
      </div>

      {successMsg && (
        <div id="success-penilaian-msg" className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Main Leger Table */}
      {daftarNilai.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-slate-500" />
                Leger Nilai Dinamis
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentKelasObj?.namaKelas} • {currentMapelObj?.namaMapel}
              </p>
            </div>
            <button
              id="btn-save-penilaian"
              onClick={handleSave}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              Simpan Penilaian
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
                  <th className="px-6 py-3.5 w-12 text-center">No</th>
                  <th className="px-6 py-3.5">Nama Siswa</th>
                  <th className="px-4 py-3.5 w-24 text-center">Tugas 1 (30%)</th>
                  <th className="px-4 py-3.5 w-24 text-center">Tugas 2 (30%)</th>
                  <th className="px-4 py-3.5 w-24 text-center">UTS (30%)</th>
                  <th className="px-4 py-3.5 w-24 text-center">UAS (40%)</th>
                  <th className="px-6 py-3.5 w-28 text-center">Nilai Akhir</th>
                  <th className="px-6 py-3.5 w-24 text-center">Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daftarNilai.map((item, index) => (
                  <tr key={item.siswaId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-xs">{item.namaSiswa}</div>
                      <div className="text-slate-400 font-mono text-[10px] mt-0.5">NISN: {item.siswaId}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        id={`input-nilai-tugas1-${item.siswaId}`}
                        type="number"
                        min="0"
                        max="100"
                        value={item.tugas1}
                        onChange={e => handleScoreChange(item.siswaId, 'tugas1', e.target.value)}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-mono text-xs font-semibold focus:bg-white outline-none focus:ring-1 focus:ring-slate-800"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        id={`input-nilai-tugas2-${item.siswaId}`}
                        type="number"
                        min="0"
                        max="100"
                        value={item.tugas2}
                        onChange={e => handleScoreChange(item.siswaId, 'tugas2', e.target.value)}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-mono text-xs font-semibold focus:bg-white outline-none focus:ring-1 focus:ring-slate-800"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        id={`input-nilai-uts-${item.siswaId}`}
                        type="number"
                        min="0"
                        max="100"
                        value={item.uts}
                        onChange={e => handleScoreChange(item.siswaId, 'uts', e.target.value)}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-mono text-xs font-semibold focus:bg-white outline-none focus:ring-1 focus:ring-slate-800"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        id={`input-nilai-uas-${item.siswaId}`}
                        type="number"
                        min="0"
                        max="100"
                        value={item.uas}
                        onChange={e => handleScoreChange(item.siswaId, 'uas', e.target.value)}
                        className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-mono text-xs font-semibold focus:bg-white outline-none focus:ring-1 focus:ring-slate-800"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                        {item.nilaiAkhir}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                        item.predikat === 'A' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.predikat === 'B' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        item.predikat === 'C' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        item.predikat === 'D' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.predikat}
                      </span>
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
            Kelas ini belum memiliki daftar siswa. Lakukan import siswa terlebih dahulu di menu Admin.
          </p>
        </div>
      )}
    </div>
  );
}
