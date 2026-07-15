import React, { useState } from 'react';
import { KODE_GS, BLOGGER_XML } from '../data/gencode';
import { Clipboard, Check, Code, FileCode, Info } from 'lucide-react';

export default function CodeExporter() {
  const [activeTab, setActiveTab] = useState<'gs' | 'xml'>('gs');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="code-exporter-section" className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 text-lg">Pusat Integrasi Kode Produksi</h4>
          <p className="text-slate-600 text-sm mt-1">
            Gunakan kode di bawah ini untuk menghubungkan database Google Sheets Anda (via Google Apps Script) dengan template website Blogger Anda. Sistem ini didesain menggunakan REST API Fetch text/plain untuk melompati pembatasan CORS (Cross-Origin Resource Sharing).
          </p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          id="btn-tab-gs"
          onClick={() => setActiveTab('gs')}
          className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'gs'
              ? 'border-slate-800 text-slate-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          Kode.gs (Google Apps Script)
        </button>
        <button
          id="btn-tab-xml"
          onClick={() => setActiveTab('xml')}
          className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'xml'
              ? 'border-slate-800 text-slate-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          Tema Blogger (XML Template)
        </button>
      </div>

      <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
        <div className="flex justify-between items-center bg-slate-800 px-6 py-3 border-b border-slate-700">
          <span className="text-slate-400 font-mono text-xs">
            {activeTab === 'gs' ? 'Kode.gs - Backend API' : 'Theme.xml - Blogger Template'}
          </span>
          <button
            id="btn-copy-code"
            onClick={() => handleCopy(activeTab === 'gs' ? KODE_GS : BLOGGER_XML)}
            className="flex items-center gap-2 text-xs font-medium text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5" />
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>

        <div className="p-6 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
          <pre>{activeTab === 'gs' ? KODE_GS : BLOGGER_XML}</pre>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        <h5 className="font-semibold text-slate-800 text-sm">Langkah Penyebaran (Deployment):</h5>
        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
          <li>
            Buat Google Spreadsheet baru di Drive Anda, lalu namai 10 sheet persis sesuai database: 
            <span className="font-mono bg-slate-100 text-slate-800 px-1 py-0.5 rounded ml-1">Config, Users, Kelas, Mapel, DataSiswa, Absensi, Nilai, Agenda, BimbinganWali, JadwalMengajar</span>.
          </li>
          <li>Isi baris pertama pada tiap sheet dengan nama kolom parameter yang sesuai seperti yang didefinisikan pada <span className="font-semibold text-slate-800">Kode.gs</span>.</li>
          <li>Buka menu <span className="font-semibold">Ekstensi &gt; Apps Script</span>, hapus kode bawaan, lalu tempel kode <span className="font-semibold">Kode.gs</span> di atas.</li>
          <li>Klik tombol <span className="font-semibold">Terapkan &gt; Terapkan Baru</span>. Pilih jenis <span className="font-semibold">Aplikasi Web</span>, isi deskripsi bebas, lalu ubah opsi akses menjadi <span className="font-semibold">"Siapa Saja" (Anyone)</span>.</li>
          <li>Salin URL Web App yang disediakan Google Apps Script (berformat <span className="font-mono text-xs text-slate-500">https://script.google.com/.../exec</span>).</li>
          <li>Buka Blogger, pilih menu <span className="font-semibold">Tema</span>, klik tanda panah di samping "Sesuaikan" &gt; <span className="font-semibold">Edit HTML</span>. Salin semua isi <span className="font-semibold">Tema Blogger (XML Template)</span> di atas dan paste menimpa semua kode XML asli Blogger Anda. Simpan tema.</li>
          <li>Buka situs Blogger Anda. Saat muncul dialog login, masukkan URL Apps Script yang disalin pada langkah 5 dan ketik username guru Anda (contoh: <span className="font-semibold">admin</span> atau <span className="font-semibold">asrudin</span>) untuk sinkronisasi instan!</li>
        </ol>
      </div>
    </div>
  );
}
