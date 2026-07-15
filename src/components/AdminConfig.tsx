import React, { useState, useEffect } from 'react';
import { SchoolConfig } from '../types';
import { DEFAULT_LOGO_KIRI, DEFAULT_LOGO_KANAN, DEFAULT_TANDATANGAN } from '../data/mockData';
import { Settings, Save, RotateCcw, CheckCircle, Upload, Eye } from 'lucide-react';

interface AdminConfigProps {
  config: SchoolConfig;
  onSaveConfig: (updatedConfig: SchoolConfig) => void;
}

export default function AdminConfig({
  config,
  onSaveConfig
}: AdminConfigProps) {
  const [namaSekolah, setNamaSekolah] = useState<string>('');
  const [alamatSekolah, setAlamatSekolah] = useState<string>('');
  const [kepalaSekolah, setKepalaSekolah] = useState<string>('');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState<string>('');
  const [logoKiri, setLogoKiri] = useState<string>('');
  const [logoKanan, setLogoKanan] = useState<string>('');
  const [tandaTanganKepsek, setTandaTanganKepsek] = useState<string>('');
  const [tahunAjaran, setTahunAjaran] = useState<string>('');
  const [semester, setSemester] = useState<string>('Ganjil');
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (config) {
      setNamaSekolah(config.namaSekolah);
      setAlamatSekolah(config.alamatSekolah);
      setKepalaSekolah(config.kepalaSekolah);
      setNipKepalaSekolah(config.nipKepalaSekolah);
      setLogoKiri(config.logoKiri);
      setLogoKanan(config.logoKanan);
      setTandaTanganKepsek(config.tandaTanganKepsek);
      setTahunAjaran(config.tahunAjaran);
      setSemester(config.semester);
    }
  }, [config]);

  // Image Upload helper (FileReader to base64)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setter(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SchoolConfig = {
      namaSekolah,
      alamatSekolah,
      kepalaSekolah,
      nipKepalaSekolah,
      logoKiri,
      logoKanan,
      tandaTanganKepsek,
      tahunAjaran,
      semester
    };
    onSaveConfig(updated);
    setSuccessMsg('Konfigurasi sekolah berhasil disimpan!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetDefaults = () => {
    if (confirm('Apakah Anda ingin memulihkan logo dan tanda tangan default bawaan?')) {
      setLogoKiri(DEFAULT_LOGO_KIRI);
      setLogoKanan(DEFAULT_LOGO_KANAN);
      setTandaTanganKepsek(DEFAULT_TANDATANGAN);
    }
  };

  return (
    <div id="school-config-view" className="space-y-6">
      {successMsg && (
        <div id="success-config-msg" className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h5 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-600" />
            Konfigurasi Instansi Sekolah &amp; Pejabat
          </h5>
          <button
            id="btn-reset-config-defaults"
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Gunakan Default Logo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Resmi Sekolah (KOP)</label>
              <input
                id="config-nama-sekolah"
                type="text"
                value={namaSekolah}
                onChange={e => setNamaSekolah(e.target.value)}
                placeholder="misal: SDN BERKARAKTER UNGGUL"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Alamat Lengkap Sekolah (KOP)</label>
              <textarea
                id="config-alamat-sekolah"
                rows={2}
                value={alamatSekolah}
                onChange={e => setAlamatSekolah(e.target.value)}
                placeholder="Alamat sekolah..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tahun Ajaran</label>
                <input
                  id="config-tahun-ajaran"
                  type="text"
                  value={tahunAjaran}
                  onChange={e => setTahunAjaran(e.target.value)}
                  placeholder="Contoh: 2025/2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Semester Aktif</label>
                <select
                  id="config-semester"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Kepala Sekolah (Penandatangan)</label>
              <input
                id="config-kepsek-nama"
                type="text"
                value={kepalaSekolah}
                onChange={e => setKepalaSekolah(e.target.value)}
                placeholder="Nama Lengkap Beserta Gelar..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">NIP Kepala Sekolah</label>
              <input
                id="config-kepsek-nip"
                type="text"
                value={nipKepalaSekolah}
                onChange={e => setNipKepalaSekolah(e.target.value)}
                placeholder="NIP..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-slate-800 focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Visual Assets and uploads */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h6 className="text-xs font-bold text-slate-700 uppercase">Logo &amp; Tanda Tangan Dokumen (KOP Resmi)</h6>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Kiri */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-between gap-3 text-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Logo Instansi (Kiri KOP)</span>
                <p className="text-slate-400 text-[10px]">Tinggi ideal 80px</p>
              </div>
              <div className="w-16 h-16 border bg-white rounded-lg p-2 flex items-center justify-center">
                <img src={logoKiri || 'https://via.placeholder.com/150'} alt="Logo Kiri" className="max-w-full max-h-full object-contain" />
              </div>
              <label className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                Ganti Logo
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setLogoKiri)} className="hidden" />
              </label>
            </div>

            {/* Logo Kanan */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-between gap-3 text-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Logo Tut Wuri (Kanan KOP)</span>
                <p className="text-slate-400 text-[10px]">Tinggi ideal 80px</p>
              </div>
              <div className="w-16 h-16 border bg-white rounded-lg p-2 flex items-center justify-center">
                <img src={logoKanan || 'https://via.placeholder.com/150'} alt="Logo Kanan" className="max-w-full max-h-full object-contain" />
              </div>
              <label className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                Ganti Logo
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setLogoKanan)} className="hidden" />
              </label>
            </div>

            {/* Tanda Tangan Kepsek */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-between gap-3 text-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Tanda Tangan &amp; Cap Kepsek</span>
                <p className="text-slate-400 text-[10px]">Format disarankan PNG transparan</p>
              </div>
              <div className="w-32 h-16 border bg-white rounded-lg p-1.5 flex items-center justify-center">
                <img src={tandaTanganKepsek || 'https://via.placeholder.com/150'} alt="Tanda Tangan" className="max-w-full max-h-full object-contain" />
              </div>
              <label className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                Ganti TTD
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setTandaTanganKepsek)} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            id="btn-submit-config"
            type="submit"
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan Konfigurasi Sekolah
          </button>
        </div>
      </form>
    </div>
  );
}
