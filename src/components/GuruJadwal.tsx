import React from 'react';
import { JadwalMengajar, Kelas, Mapel, User } from '../types';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';

interface GuruJadwalProps {
  jadwal: JadwalMengajar[];
  kelas: Kelas[];
  mapel: Mapel[];
  currentUser: User;
}

export default function GuruJadwal({
  jadwal,
  kelas,
  mapel,
  currentUser
}: GuruJadwalProps) {
  // Filter jadwal specifically for this teacher
  const filterJadwal = jadwal.filter(
    j => j.guruUsername.toLowerCase() === currentUser.username.toLowerCase()
  );

  const getKelasName = (id: string) => {
    return kelas.find(k => k.id === id)?.namaKelas || id;
  };

  const getMapelName = (id: string) => {
    return mapel.find(m => m.id === id)?.namaMapel || id;
  };

  const getMapelKode = (id: string) => {
    return mapel.find(m => m.id === id)?.kodeMapel || id;
  };

  // Group by day of the week
  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu')[] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu'
  ];

  return (
    <div id="jadwal-view" className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h4 className="font-semibold text-slate-800 text-sm">Jadwal Mengajar Mingguan</h4>
        <p className="text-slate-500 text-xs mt-1">
          Daftar jadwal mengajar aktif Anda pada semester aktif. Digunakan sebagai panduan agenda jurnal mengajar harian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map(day => {
          const itemsOnDay = filterJadwal.filter(j => j.hari === day);

          return (
            <div key={day} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-3.5 bg-slate-800 text-white font-bold text-sm tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-300" />
                  {day}
                </span>
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full font-normal">
                  {itemsOnDay.length} Sesi
                </span>
              </div>

              <div className="p-5 flex-grow space-y-4">
                {itemsOnDay.length > 0 ? (
                  itemsOnDay.map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 relative hover:border-slate-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100">
                          <BookOpen className="w-3 h-3" />
                          {getMapelKode(item.mapelId)}
                        </span>
                        <span className="text-slate-700 font-bold text-xs bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                          {getKelasName(item.kelasId)}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-800 text-xs truncate">
                          {getMapelName(item.mapelId)}
                        </h5>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pukul {item.jamMulai} - {item.jamSelesai} WIB</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    Tidak ada jadwal mengajar
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
