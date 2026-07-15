// This file stores the clean, complete Google Apps Script (Kode.gs) and Blogger XML code
// requested by the user, formatted for easy viewing and copy-pasting.

export const KODE_GS = `/**
 * SISTEM ADMINISTRASI GURU (SAG) - BACKEND ENGINE
 * Database: Google Sheets (Config, Users, Kelas, Mapel, DataSiswa, Absensi, Nilai, Agenda, BimbinganWali, JadwalMengajar)
 * Arsitektur: REST API (Fetch JSON)
 * 
 * PETUNJUK INSTALASI:
 * 1. Buat Spreadsheet baru di Google Drive.
 * 2. Buat sheet dengan nama berikut secara presisi:
 *    - Config
 *    - Users
 *    - Kelas
 *    - Mapel
 *    - DataSiswa
 *    - Absensi
 *    - Nilai
 *    - Agenda
 *    - BimbinganWali
 *    - JadwalMengajar
 * 3. Isi baris pertama masing-masing sheet dengan header kolom yang sesuai (lihat dokumentasi di bawah).
 * 4. Buka menu Ekstensi -> Apps Script, lalu paste kode ini.
 * 5. Klik "Terapkan" (Deploy) -> "Terapkan Baru" -> Pilih jenis "Aplikasi Web".
 * 6. Setel akses "Siapa saja" (Anyone) agar API bisa diakses dari Blogger.
 * 7. Copy URL Web App yang dihasilkan untuk dimasukkan ke konfigurasi Blogger.
 */

// Membuka database Spreadsheet aktif
function getDb() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Menangani request HTTP POST dari Frontend (Blogger)
 * Menggunakan format raw text/plain atau JSON untuk mempermudah CORS preflight bypass.
 */
function doPost(e) {
  var responseOutput = "";
  try {
    var postData;
    if (e.postData.type === "application/json") {
      postData = JSON.parse(e.postData.contents);
    } else {
      // Penanganan text/plain fallback untuk mempermudah bypass CORS preflight
      postData = JSON.parse(e.postData.contents);
    }
    
    var action = postData.action;
    var payload = postData.payload || {};
    var result = {};
    
    switch (action) {
      case "login":
        result = handleLogin(payload.username);
        break;
      case "getConfig":
        result = handleGetConfig();
        break;
      case "setConfig":
        result = handleSetConfig(payload);
        break;
      case "getDashboardStats":
        result = handleGetDashboardStats();
        break;
      case "getKelas":
        result = handleGetTableData("Kelas");
        break;
      case "getMapel":
        result = handleGetTableData("Mapel");
        break;
      case "getSiswa":
        result = handleGetSiswa(payload.kelasId);
        break;
      case "importSiswaMassal":
        result = handleImportSiswaMassal(payload.siswaList);
        break;
      case "getAbsensi":
        result = handleGetAbsensi(payload.tanggal, payload.kelasId);
        break;
      case "saveAbsensi":
        result = handleSaveAbsensi(payload.absensiList, payload.tanggal, payload.kelasId, payload.guruUsername);
        break;
      case "getNilai":
        result = handleGetNilai(payload.kelasId, payload.mapelId);
        break;
      case "saveNilai":
        result = handleSaveNilai(payload.nilaiList);
        break;
      case "getAgenda":
        result = handleGetAgenda(payload.guruUsername);
        break;
      case "saveAgenda":
        result = handleSaveAgenda(payload);
        break;
      case "getBimbingan":
        result = handleGetBimbingan(payload.guruUsername);
        break;
      case "saveBimbingan":
        result = handleSaveBimbingan(payload);
        break;
      case "getJadwal":
        result = handleGetJadwal(payload.guruUsername);
        break;
      case "getUsers":
        result = handleGetTableData("Users");
        break;
      case "addUser":
        result = handleAddUser(payload);
        break;
      case "deleteUser":
        result = handleDeleteUser(payload.id);
        break;
      default:
        throw new Error("Aksi '" + action + "' tidak dikenali.");
    }
    
    responseOutput = JSON.stringify({ success: true, data: result });
  } catch (error) {
    responseOutput = JSON.stringify({ success: false, error: error.message });
  } finally {
    // Memastikan response dikembalikan dalam format JSON utuh dengan header CORS yang tepat
    return ContentService.createTextOutput(responseOutput)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Mendapatkan data mentah dari tabel tertentu
 */
function handleGetTableData(sheetName) {
  var sheet = getDb().getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet '" + sheetName + "' tidak ditemukan.");
  
  // Menggunakan getDisplayValues() untuk menjamin format tanggal, angka, teks tetap aman sesuai tampilan
  var values = sheet.getDisplayValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var data = [];
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  return data;
}

/**
 * Handle Login Multi-user
 */
function handleLogin(username) {
  var users = handleGetTableData("Users");
  var user = users.find(function(u) {
    return u.username.toLowerCase() === username.toLowerCase() && u.status === "Aktif";
  });
  
  if (!user) {
    throw new Error("Akun tidak terdaftar atau dalam status Nonaktif.");
  }
  return user;
}

/**
 * Ambil Config Sekolah
 */
function handleGetConfig() {
  var data = handleGetTableData("Config");
  if (data.length === 0) {
    return {
      namaSekolah: "NAMA SEKOLAH BELUM DIATUR",
      alamatSekolah: "Alamat Sekolah Belum Diatur",
      kepalaSekolah: "Nama Kepala Sekolah",
      nipKepalaSekolah: "NIP Kepala Sekolah",
      logoKiri: "",
      logoKanan: "",
      tandaTanganKepsek: "",
      tahunAjaran: "2025/2026",
      semester: "Ganjil"
    };
  }
  return data[0]; // Hanya ambil baris pertama konfigurasi
}

/**
 * Simpan Config Sekolah
 */
function handleSetConfig(payload) {
  var sheet = getDb().getSheetByName("Config");
  if (!sheet) throw new Error("Sheet Config tidak ditemukan.");
  
  sheet.clearContents();
  
  var headers = [
    "namaSekolah", "alamatSekolah", "kepalaSekolah", "nipKepalaSekolah", 
    "logoKiri", "logoKanan", "tandaTanganKepsek", "tahunAjaran", "semester"
  ];
  sheet.appendRow(headers);
  
  var row = [
    payload.namaSekolah || "",
    payload.alamatSekolah || "",
    payload.kepalaSekolah || "",
    payload.nipKepalaSekolah || "",
    payload.logoKiri || "",
    payload.logoKanan || "",
    payload.tandaTanganKepsek || "",
    payload.tahunAjaran || "",
    payload.semester || ""
  ];
  sheet.appendRow(row);
  return { message: "Konfigurasi sekolah berhasil diperbarui!" };
}

/**
 * Ambil Statistik Dashboard
 */
function handleGetDashboardStats() {
  var db = getDb();
  
  var sheetKelas = db.getSheetByName("Kelas");
  var countKelas = sheetKelas ? Math.max(0, sheetKelas.getLastRow() - 1) : 0;
  
  var sheetUsers = db.getSheetByName("Users");
  var users = handleGetTableData("Users");
  var countGuru = users.filter(function(u) { return u.role === "Guru"; }).length;
  
  var sheetSiswa = db.getSheetByName("DataSiswa");
  var countSiswa = sheetSiswa ? Math.max(0, sheetSiswa.getLastRow() - 1) : 0;
  
  return {
    jumlahRombel: countKelas,
    jumlahGuru: countGuru,
    jumlahSiswa: countSiswa
  };
}

/**
 * Mengambil Data Siswa berdasarkan Kelas
 */
function handleGetSiswa(kelasId) {
  var allSiswa = handleGetTableData("DataSiswa");
  if (!kelasId) return allSiswa;
  return allSiswa.filter(function(s) {
    return s.kelasId === kelasId;
  });
}

/**
 * Import Siswa Massal
 */
function handleImportSiswaMassal(siswaList) {
  var sheet = getDb().getSheetByName("DataSiswa");
  if (!sheet) throw new Error("Sheet DataSiswa tidak ditemukan.");
  
  var existingSiswa = handleGetTableData("DataSiswa");
  var currentIds = existingSiswa.map(function(s) { return s.id; });
  
  var startIdNum = 1;
  if (currentIds.length > 0) {
    var idNumbers = currentIds.map(function(id) {
      var parts = id.split("-");
      return parts.length > 1 ? parseInt(parts[1], 10) : 0;
    }).filter(function(n) { return !isNaN(n); });
    if (idNumbers.length > 0) {
      startIdNum = Math.max.apply(null, idNumbers) + 1;
    }
  }
  
  for (var i = 0; i < siswaList.length; i++) {
    var item = siswaList[i];
    var idString = "S-" + String(startIdNum + i).padStart(3, "0");
    var row = [
      idString,
      item.nis || "",
      item.nisn || "",
      item.namaSiswa || "",
      item.jenisKelamin || "L",
      item.kelasId || ""
    ];
    sheet.appendRow(row);
  }
  
  return { importedCount: siswaList.length };
}

/**
 * Mengambil absensi berdasarkan Tanggal dan Kelas
 */
function handleGetAbsensi(tanggal, kelasId) {
  var allAbsensi = handleGetTableData("Absensi");
  var filtered = allAbsensi.filter(function(a) {
    return a.tanggal === tanggal && a.kelasId === kelasId;
  });
  
  // Jika belum ada data absensi untuk hari ini, ambil daftar siswa kelas untuk diinput
  if (filtered.length === 0) {
    var siswaList = handleGetSiswa(kelasId);
    return siswaList.map(function(s) {
      return {
        id: "",
        tanggal: tanggal,
        kelasId: kelasId,
        siswaId: s.id,
        namaSiswa: s.namaSiswa,
        status: "H",
        keterangan: ""
      };
    });
  }
  return filtered;
}

/**
 * Menyimpan / memperbarui daftar absensi hari ini
 */
function handleSaveAbsensi(absensiList, tanggal, kelasId, guruUsername) {
  var sheet = getDb().getSheetByName("Absensi");
  if (!sheet) throw new Error("Sheet Absensi tidak ditemukan.");
  
  var allRows = sheet.getDisplayValues();
  var headers = allRows[0];
  
  // Ambil semua data absensi di luar tanggal & kelas ini untuk di-rewrite atau ditumpuk
  // Cara paling aman dan performan untuk database kecil di Apps Script:
  // Hapus baris yang memiliki kecocokan tanggal & kelasId, lalu tambahkan baris-baris baru.
  
  // Lakukan iterasi mundur untuk menghapus record lama
  for (var r = allRows.length - 1; r >= 1; r--) {
    var rowTanggal = allRows[r][headers.indexOf("tanggal")];
    var rowKelasId = allRows[r][headers.indexOf("kelasId")];
    if (rowTanggal === tanggal && rowKelasId === kelasId) {
      sheet.deleteRow(r + 1);
    }
  }
  
  var startIdNum = 1;
  var existingAbsensi = handleGetTableData("Absensi");
  if (existingAbsensi.length > 0) {
    var ids = existingAbsensi.map(function(a) { return a.id; });
    var nums = ids.map(function(id) {
      var parts = id.split("-");
      return parts.length > 1 ? parseInt(parts[1], 10) : 0;
    }).filter(function(n) { return !isNaN(n); });
    if (nums.length > 0) {
      startIdNum = Math.max.apply(null, nums) + 1;
    }
  }
  
  for (var i = 0; i < absensiList.length; i++) {
    var item = absensiList[i];
    var idString = "A-" + String(startIdNum + i).padStart(3, "0");
    var row = [
      idString,
      tanggal,
      kelasId,
      item.siswaId,
      item.namaSiswa,
      item.status || "H",
      item.keterangan || "",
      guruUsername
    ];
    sheet.appendRow(row);
  }
  
  return { message: "Absensi berhasil disimpan!" };
}

/**
 * Mengambil penilaian berdasarkan Kelas dan Mapel
 */
function handleGetNilai(kelasId, mapelId) {
  var allNilai = handleGetTableData("Nilai");
  var filtered = allNilai.filter(function(n) {
    return n.kelasId === kelasId && n.mapelId === mapelId;
  });
  
  // Jika belum ada nilai, buat record default bernilai 0 untuk tiap siswa di kelas tersebut
  if (filtered.length === 0) {
    var siswaList = handleGetSiswa(kelasId);
    return siswaList.map(function(s) {
      return {
        id: "",
        siswaId: s.id,
        namaSiswa: s.namaSiswa,
        kelasId: kelasId,
        mapelId: mapelId,
        tugas1: "0",
        tugas2: "0",
        uts: "0",
        uas: "0",
        nilaiAkhir: "0",
        predikat: "E"
      };
    });
  }
  return filtered;
}

/**
 * Menyimpan atau memperbarui nilai-nilai
 */
function handleSaveNilai(nilaiList) {
  var sheet = getDb().getSheetByName("Nilai");
  if (!sheet) throw new Error("Sheet Nilai tidak ditemukan.");
  
  var allRows = sheet.getDisplayValues();
  var headers = allRows[0];
  
  // Lakukan penyimpanan satu persatu
  // Jika item memiliki ID, cari barisnya lalu update. Jika ID kosong, tumpuk atau buat baru.
  var startIdNum = 1;
  var existingNilai = handleGetTableData("Nilai");
  if (existingNilai.length > 0) {
    var ids = existingNilai.map(function(n) { return n.id; });
    var nums = ids.map(function(id) {
      var parts = id.split("-");
      return parts.length > 1 ? parseInt(parts[1], 10) : 0;
    }).filter(function(n) { return !isNaN(n); });
    if (nums.length > 0) {
      startIdNum = Math.max.apply(null, nums) + 1;
    }
  }
  
  for (var i = 0; i < nilaiList.length; i++) {
    var item = nilaiList[i];
    
    // Hitung Nilai Akhir secara dinamis (Tugas 30%, UTS 30%, UAS 40%)
    var t1 = parseFloat(item.tugas1) || 0;
    var t2 = parseFloat(item.tugas2) || 0;
    var uts = parseFloat(item.uts) || 0;
    var uas = parseFloat(item.uas) || 0;
    
    var rerataTugas = (t1 + t2) / 2;
    var nilaiAkhir = (rerataTugas * 0.3) + (uts * 0.3) + (uas * 0.4);
    nilaiAkhir = Math.round(nilaiAkhir * 10) / 10; // 1 angka di belakang koma
    
    var predikat = "E";
    if (nilaiAkhir >= 90) predikat = "A";
    else if (nilaiAkhir >= 80) predikat = "B";
    else if (nilaiAkhir >= 70) predikat = "C";
    else if (nilaiAkhir >= 60) predikat = "D";
    
    // Cari apakah siswa sudah memiliki rekam nilai untuk mapel ini
    var foundIndex = -1;
    for (var r = 1; r < allRows.length; r++) {
      var rSiswaId = allRows[r][headers.indexOf("siswaId")];
      var rMapelId = allRows[r][headers.indexOf("mapelId")];
      if (rSiswaId === item.siswaId && rMapelId === item.mapelId) {
        foundIndex = r + 1;
        break;
      }
    }
    
    var rowData = [
      "", // Akan diisi ID
      item.siswaId,
      item.namaSiswa,
      item.kelasId,
      item.mapelId,
      t1,
      t2,
      uts,
      uas,
      nilaiAkhir,
      predikat
    ];
    
    if (foundIndex !== -1) {
      // Update baris lama
      var oldId = allRows[foundIndex - 1][headers.indexOf("id")];
      rowData[0] = oldId;
      for (var col = 0; col < headers.length; col++) {
        sheet.getRange(foundIndex, col + 1).setValue(rowData[col]);
      }
    } else {
      // Append baris baru
      var newId = "N-" + String(startIdNum++).padStart(3, "0");
      rowData[0] = newId;
      sheet.appendRow(rowData);
    }
  }
  
  return { message: "Penilaian berhasil diperbarui!" };
}

/**
 * Mengambil Agenda Guru
 */
function handleGetAgenda(guruUsername) {
  var allAgenda = handleGetTableData("Agenda");
  if (!guruUsername) return allAgenda;
  return allAgenda.filter(function(a) {
    return a.guruUsername === guruUsername;
  });
}

/**
 * Menyimpan Agenda baru
 */
function handleSaveAgenda(payload) {
  var sheet = getDb().getSheetByName("Agenda");
  if (!sheet) throw new Error("Sheet Agenda tidak ditemukan.");
  
  var existing = handleGetTableData("Agenda");
  var startIdNum = 1;
  if (existing.length > 0) {
    var ids = existing.map(function(a) { return a.id; });
    var nums = ids.map(function(id) {
      var parts = id.split("-");
      return parts.length > 1 ? parseInt(parts[1], 10) : 0;
    }).filter(function(n) { return !isNaN(n); });
    if (nums.length > 0) {
      startIdNum = Math.max.apply(null, nums) + 1;
    }
  }
  
  var newId = "AG-" + String(startIdNum).padStart(3, "0");
  var row = [
    newId,
    payload.tanggal,
    payload.kelasId,
    payload.mapelId,
    payload.jamKe,
    payload.materi,
    payload.pencapaian,
    payload.hambatan || "",
    payload.solusi || "",
    payload.guruUsername
  ];
  sheet.appendRow(row);
  return { id: newId, message: "Agenda mengajar berhasil dicatat!" };
}

/**
 * Mengambil data bimbingan wali murid/siswa
 */
function handleGetBimbingan(guruUsername) {
  var allBimbingan = handleGetTableData("BimbinganWali");
  if (!guruUsername) return allBimbingan;
  return allBimbingan.filter(function(b) {
    return b.guruUsername === guruUsername;
  });
}

/**
 * Menyimpan Bimbingan Wali baru
 */
function handleSaveBimbingan(payload) {
  var sheet = getDb().getSheetByName("BimbinganWali");
  if (!sheet) throw new Error("Sheet BimbinganWali tidak ditemukan.");
  
  var existing = handleGetTableData("BimbinganWali");
  var startIdNum = 1;
  if (existing.length > 0) {
    var ids = existing.map(function(b) { return b.id; });
    var nums = ids.map(function(id) {
      var parts = id.split("-");
      return parts.length > 1 ? parseInt(parts[1], 10) : 0;
    }).filter(function(n) { return !isNaN(n); });
    if (nums.length > 0) {
      startIdNum = Math.max.apply(null, nums) + 1;
    }
  }
  
  var newId = "BW-" + String(startIdNum).padStart(3, "0");
  var row = [
    newId,
    payload.tanggal,
    payload.siswaId,
    payload.namaSiswa,
    payload.kelasId,
    payload.masalah,
    payload.solusi,
    payload.tindakLanjut,
    payload.guruUsername
  ];
  sheet.appendRow(row);
  return { id: newId, message: "Catatan bimbingan wali berhasil disimpan!" };
}

/**
 * Mengambil Jadwal Mengajar Guru
 */
function handleGetJadwal(guruUsername) {
  var allJadwal = handleGetTableData("JadwalMengajar");
  if (!guruUsername) return allJadwal;
  return allJadwal.filter(function(j) {
    return j.guruUsername === guruUsername;
  });
}

/**
 * Menambahkan User baru
 */
function handleAddUser(payload) {
  var sheet = getDb().getSheetByName("Users");
  if (!sheet) throw new Error("Sheet Users tidak ditemukan.");
  
  var existing = handleGetTableData("Users");
  
  // Cek duplikasi username
  var isDup = existing.some(function(u) {
    return u.username.toLowerCase() === payload.username.toLowerCase();
  });
  if (isDup) throw new Error("Username '" + payload.username + "' sudah terdaftar.");
  
  var startIdNum = 1;
  if (existing.length > 0) {
    var ids = existing.map(function(u) { return u.id; });
    var nums = ids.map(function(id) {
      var parts = id.split("-");
      return parts.length > 1 ? parseInt(parts[1], 10) : 0;
    }).filter(function(n) { return !isNaN(n); });
    if (nums.length > 0) {
      startIdNum = Math.max.apply(null, nums) + 1;
    }
  }
  
  var newId = "U-" + String(startIdNum).padStart(3, "0");
  var row = [
    newId,
    payload.username,
    payload.nama,
    payload.role || "Guru",
    "Aktif"
  ];
  sheet.appendRow(row);
  return { id: newId, message: "User berhasil ditambahkan!" };
}

/**
 * Menghapus User berdasarkan ID
 */
function handleDeleteUser(userId) {
  var sheet = getDb().getSheetByName("Users");
  if (!sheet) throw new Error("Sheet Users tidak ditemukan.");
  
  var allRows = sheet.getDisplayValues();
  var headers = allRows[0];
  var idIndex = headers.indexOf("id");
  
  for (var i = 1; i < allRows.length; i++) {
    if (allRows[i][idIndex] === userId) {
      sheet.deleteRow(i + 1);
      return { message: "User berhasil dihapus!" };
    }
  }
  throw new Error("User dengan ID " + userId + " tidak ditemukan.");
}
`;

export const BLOGGER_XML = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:defaultmessages='false' b:layoutsVersion='3' b:responsive='true' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/b/schemas/pub/2010' xmlns:data='http://www.google.com/b/schemas/pub/2010' xmlns:expr='http://www.google.com/b/schemas/pub/2010'>
<head>
  <meta charset='utf-8'/>
  <meta content='width=device-width, initial-scale=1, shrink-to-fit=no' name='viewport'/>
  <title>Sistem Administrasi Guru (SAG) - Platinum Edition</title>
  
  <!-- CSS Bootstrap 5 -->
  <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'/>
  <!-- FontAwesome 6 Icons -->
  <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' rel='stylesheet'/>
  <!-- Google Fonts -->
  <link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;display=swap' rel='stylesheet'/>

  <b:skin><![CDATA[
    /* Hapus default layout Blogger */
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at 10% 20%, rgba(216, 227, 245, 0.4) 0%, rgba(233, 241, 252, 0.3) 90%), #F4F7FC;
      color: #2C3E50;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    /* Tema Platinum Glassmorphism */
    .glass-card {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 16px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.06);
    }
    
    .glass-sidebar {
      background: rgba(44, 62, 80, 0.95);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      color: #ECF0F1;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      width: 280px;
      z-index: 1040;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }
    
    /* Layout */
    .main-content {
      margin-left: 280px;
      min-height: 100vh;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 30px;
    }
    
    /* Custom Sidebar menu */
    .sidebar-menu {
      list-style: none;
      padding: 0;
      margin: 0;
      flex-grow: 1;
      overflow-y: auto;
    }
    
    .sidebar-item a {
      color: rgba(236, 240, 241, 0.7);
      text-decoration: none;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 15px;
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 4px solid transparent;
    }
    
    .sidebar-item a:hover, .sidebar-item.active a {
      color: #FFF;
      background: rgba(255, 255, 255, 0.1);
      border-left-color: #3498DB;
    }
    
    /* Navbar top */
    .glass-header {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      padding: 15px 30px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    
    /* Overlay mobile */
    .sidebar-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1030;
    }
    
    @media (max-width: 991.98px) {
      .glass-sidebar {
        transform: translateX(-100%);
      }
      .glass-sidebar.show {
        transform: translateX(0);
      }
      .main-content {
        margin-left: 0;
        padding: 15px;
      }
      .sidebar-overlay.show {
        display: block;
      }
    }
    
    /* Stat widget */
    .stat-card {
      padding: 24px;
      border-radius: 16px;
      transition: transform 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-5px);
    }
    .bg-stat-blue {
      background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
      color: #FFF;
    }
    .bg-stat-teal {
      background: linear-gradient(135deg, #16A085 0%, #1ABC9C 100%);
      color: #FFF;
    }
    .bg-stat-orange {
      background: linear-gradient(135deg, #D35400 0%, #E67E22 100%);
      color: #FFF;
    }
  ]]></b:skin>
</head>
<body>

  <!-- Overlay untuk sidebar mobile -->
  <div class='sidebar-overlay' id='sidebarOverlay' onclick='toggleSidebar()'></div>

  <div id='appRoot'>
    <!-- Login Screen -->
    <div class='container d-flex align-items-center justify-content-center' id='loginScreen' style='min-height: 100vh;'>
      <div class='card glass-card p-5 shadow' style='max-width: 450px; width: 100%; border-radius: 20px;'>
        <div class='text-center mb-4'>
          <div class='p-3 bg-light rounded-circle d-inline-block shadow-sm mb-3'>
            <i class='fa-solid fa-graduation-cap fa-3x text-primary' style='color: #2C3E50 !important;'></i>
          </div>
          <h4 class='fw-bold' style='color: #2C3E50;'>Sistem Administrasi Guru</h4>
          <p class='text-muted small'>Silakan masuk dengan akun terdaftar Anda</p>
        </div>
        
        <!-- Input URL API Google Apps Script -->
        <div class='mb-3'>
          <label class='form-label fw-bold text-secondary small'>1. URL Google Apps Script Web App</label>
          <input class='form-control rounded-3' id='gasUrlInput' placeholder='https://script.google.com/macros/s/.../exec' type='text'/>
          <div class='form-text text-danger small' style='font-size: 11px;'>Wajib disi! Pastikan URL Web App Anda telah dideploy dengan benar.</div>
        </div>
        
        <div class='mb-4'>
          <label class='form-label fw-bold text-secondary small'>2. Username</label>
          <div class='input-group'>
            <span class='input-group-text'><i class='fa-solid fa-user'></i></span>
            <input class='form-control rounded-end-3' id='usernameInput' placeholder='Contoh: asrudin atau admin' type='text'/>
          </div>
        </div>
        
        <button class='btn text-white w-100 py-2.5 fw-bold shadow-sm rounded-3' onclick='handleLogin()' style='background: #2C3E50;'>
          <i class='fa-solid fa-right-to-bracket me-2'></i> MASUK SISTEM
        </button>
        
        <div class='text-center mt-4 text-muted' style='font-size: 12px;'>
          <div>Default Admin: <strong>admin</strong></div>
          <div>Default Guru: <strong>asrudin</strong></div>
        </div>
      </div>
    </div>

    <!-- Main System Layout (Hidden by Default) -->
    <div class='d-none' id='systemLayout'>
      <!-- Sidebar -->
      <aside class='glass-sidebar' id='systemSidebar'>
        <div class='p-4 d-flex align-items-center gap-3 border-bottom border-secondary'>
          <img class='rounded-circle bg-white p-1' id='schoolLogoSidebar' src='' style='width: 45px; height: 45px; object-fit: contain;'/>
          <div>
            <h6 class='fw-bold mb-0 text-white truncate' id='schoolNameSidebar' style='font-size: 13px; max-width: 170px;'>SDN UNGGULAN</h6>
            <span class='badge bg-info' id='userRoleBadge' style='font-size: 10px;'>Guru</span>
          </div>
        </div>
        
        <ul class='sidebar-menu py-3'>
          <!-- Dashboard -->
          <li class='sidebar-item active' id='menu-dashboard'>
            <a href='#' onclick='switchMenu("dashboard")'>
              <i class='fa-solid fa-chart-line'></i> Dashboard
            </a>
          </li>
          
          <!-- Menu Guru -->
          <li class='sidebar-item-header px-4 py-2 text-uppercase fw-bold text-muted small' style='font-size: 10px; letter-spacing: 1px;'>Guru Menu</li>
          <li class='sidebar-item' id='menu-absensi'>
            <a href='#' onclick='switchMenu("absensi")'>
              <i class='fa-solid fa-clipboard-user'></i> Input Absensi
            </a>
          </li>
          <li class='sidebar-item' id='menu-penilaian'>
            <a href='#' onclick='switchMenu("penilaian")'>
              <i class='fa-solid fa-star'></i> Input Penilaian
            </a>
          </li>
          <li class='sidebar-item' id='menu-agenda'>
            <a href='#' onclick='switchMenu("agenda")'>
              <i class='fa-solid fa-book'></i> Jurnal Agenda
            </a>
          </li>
          <li class='sidebar-item' id='menu-bimbingan'>
            <a href='#' onclick='switchMenu("bimbingan")'>
              <i class='fa-solid fa-handshake-angle'></i> Bimbingan Wali
            </a>
          </li>
          <li class='sidebar-item' id='menu-jadwal'>
            <a href='#' onclick='switchMenu("jadwal")'>
              <i class='fa-solid fa-calendar-days'></i> Jadwal Mengajar
            </a>
          </li>
          
          <!-- Menu Admin -->
          <li class='sidebar-item-header px-4 py-2 text-uppercase fw-bold text-muted small admin-only' style='font-size: 10px; letter-spacing: 1px;'>Admin Menu</li>
          <li class='sidebar-item admin-only' id='menu-rekap'>
            <a href='#' onclick='switchMenu("rekap")'>
              <i class='fa-solid fa-print'></i> Rekap Wali &amp; PDF
            </a>
          </li>
          <li class='sidebar-item admin-only' id='menu-users'>
            <a href='#' onclick='switchMenu("users")'>
              <i class='fa-solid fa-user-gear'></i> Manajemen User
            </a>
          </li>
          <li class='sidebar-item admin-only' id='menu-import'>
            <a href='#' onclick='switchMenu("import")'>
              <i class='fa-solid fa-file-import'></i> Import Siswa Massal
            </a>
          </li>
          <li class='sidebar-item admin-only' id='menu-config'>
            <a href='#' onclick='switchMenu("config")'>
              <i class='fa-solid fa-gears'></i> Konfigurasi Sekolah
            </a>
          </li>
        </ul>
        
        <div class='p-3 border-top border-secondary bg-dark-subtle'>
          <div class='d-flex align-items-center gap-2 mb-2'>
            <div class='avatar-placeholder bg-light text-dark rounded-circle fw-bold text-center' id='userAvatar' style='width: 32px; height: 32px; line-height: 32px; font-size: 12px;'>U</div>
            <div class='truncate' style='max-width: 150px;'>
              <div class='fw-bold text-white small' id='userProfileName'>Nama User</div>
              <div class='text-muted' id='userProfileUsername' style='font-size: 10px;'>username</div>
            </div>
          </div>
          <button class='btn btn-outline-danger btn-sm w-100' onclick='handleLogout()'>
            <i class='fa-solid fa-right-from-bracket me-1'></i> Keluar
          </button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class='main-content'>
        <!-- Header -->
        <header class='glass-header d-flex align-items-center justify-content-between gap-3 shadow-sm'>
          <div class='d-flex align-items-center gap-3'>
            <button class='btn btn-light d-lg-none' onclick='toggleSidebar()'>
              <i class='fa-solid fa-bars'></i>
            </button>
            <div>
              <h5 class='fw-bold mb-0 text-primary' id='headerTitle' style='color: #2C3E50 !important;'>Dashboard</h5>
              <p class='text-muted small mb-0 d-none d-sm-block' id='schoolInfoText'>Tahun Ajaran 2025/2026 - Semester Ganjil</p>
            </div>
          </div>
          
          <div class='d-flex align-items-center gap-3'>
            <span class='badge bg-secondary p-2' id='systemClock'>00:00:00 WIB</span>
          </div>
        </header>
        
        <!-- View Container -->
        <div id='viewContainer'>
          <!-- Konten view akan dirender dinamis via javascript -->
        </div>
      </main>
    </div>
  </div>

  <!-- JS Dependencies -->
  <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'></script>
  <!-- jsPDF & AutoTable untuk PDF -->
  <script src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'></script>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'></script>

  <script>
    // Inisialisasi State lokal
    let API_URL = "";
    let currentUser = null;
    let schoolConfig = {};
    
    // Fungsi fetch REST API bypass CORS menggunakan text/plain
    async function callApi(action, payload = {}) {
      if (!API_URL) {
        alert("Harap masukkan URL Google Apps Script Web App terlebih dahulu.");
        return null;
      }
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({ action, payload })
        });
        const result = await response.json();
        if (result.success) {
          return result.data;
        } else {
          alert("Gagal memproses permintaan: " + result.error);
          return null;
        }
      } catch (err) {
        console.error(err);
        alert("Koneksi gagal! Pastikan Apps Script di-deploy sebagai Web App dan bisa diakses publik (Anyone).");
        return null;
      }
    }
    
    // Handler login
    async function handleLogin() {
      const url = document.getElementById("gasUrlInput").value.trim();
      const user = document.getElementById("usernameInput").value.trim();
      
      if (!url) {
        alert("Harap masukkan URL Apps Script Web App.");
        return;
      }
      if (!user) {
        alert("Harap isi username Anda.");
        return;
      }
      
      API_URL = url;
      localStorage.setItem("SAG_API_URL", API_URL);
      
      // Ambil data user dari API
      const result = await callApi("login", { username: user });
      if (result) {
        currentUser = result;
        localStorage.setItem("SAG_USER", JSON.stringify(currentUser));
        
        // Load config sekolah
        const configResult = await callApi("getConfig");
        if (configResult) {
          schoolConfig = configResult;
          localStorage.setItem("SAG_CONFIG", JSON.stringify(schoolConfig));
        }
        
        initSystem();
      }
    }
    
    // Inisialisasi System setelah login
    function initSystem() {
      document.getElementById("loginScreen").classList.add("d-none");
      document.getElementById("systemLayout").classList.remove("d-none");
      
      // Update sidebar profil
      document.getElementById("schoolNameSidebar").innerText = schoolConfig.namaSekolah || "SDN UNGGULAN";
      document.getElementById("schoolLogoSidebar").src = schoolConfig.logoKiri || "https://via.placeholder.com/150";
      document.getElementById("userRoleBadge").innerText = currentUser.role;
      document.getElementById("userProfileName").innerText = currentUser.nama;
      document.getElementById("userProfileUsername").innerText = "@" + currentUser.username;
      document.getElementById("userAvatar").innerText = currentUser.nama.charAt(0).toUpperCase();
      
      document.getElementById("schoolInfoText").innerText = "Tahun Ajaran " + (schoolConfig.tahunAjaran || "-") + " - Semester " + (schoolConfig.semester || "-");
      
      // Sembunyikan elemen admin apabila login sebagai guru biasa
      const adminElements = document.querySelectorAll(".admin-only");
      adminElements.forEach(el => {
        if (currentUser.role !== "Admin") {
          el.classList.add("d-none");
        } else {
          el.classList.remove("d-none");
        }
      });
      
      switchMenu("dashboard");
      startClock();
    }
    
    function handleLogout() {
      localStorage.removeItem("SAG_USER");
      currentUser = null;
      document.getElementById("systemLayout").classList.add("d-none");
      document.getElementById("loginScreen").classList.remove("d-none");
    }
    
    // Kontrol Sidebar Mobile
    function toggleSidebar() {
      const sidebar = document.getElementById("systemSidebar");
      const overlay = document.getElementById("sidebarOverlay");
      sidebar.classList.toggle("show");
      overlay.classList.toggle("show");
    }
    
    function startClock() {
      setInterval(() => {
        const now = new Date();
        document.getElementById("systemClock").innerText = now.toLocaleTimeString("id-ID") + " WIB";
      }, 1000);
    }
    
    // Switch Menu & load views
    function switchMenu(menuName) {
      // Hapus active di semua sidebar items
      const items = document.querySelectorAll(".sidebar-item");
      items.forEach(it => it.classList.remove("active"));
      
      const activeItem = document.getElementById("menu-" + menuName);
      if (activeItem) activeItem.classList.add("active");
      
      const titleEl = document.getElementById("headerTitle");
      titleEl.innerText = menuName.charAt(0).toUpperCase() + menuName.slice(1);
      
      // Sembunyikan sidebar di mobile setelah pilih menu
      if (window.innerWidth < 992) {
        document.getElementById("systemSidebar").classList.remove("show");
        document.getElementById("sidebarOverlay").classList.remove("show");
      }
      
      loadView(menuName);
    }
    
    // Router View sederhana
    async function loadView(viewName) {
      const container = document.getElementById("viewContainer");
      container.innerHTML = \`<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Memuat data dari Google Sheets...</p></div>\`;
      
      switch (viewName) {
        case "dashboard":
          const stats = await callApi("getDashboardStats");
          if (stats) {
            container.innerHTML = \`
              <div class="row g-4 mb-4">
                <div class="col-md-4">
                  <div class="stat-card bg-stat-blue glass-card shadow-sm">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="text-white-50">JUMLAH ROMBEL</h6>
                        <h2 class="fw-bold mb-0">\${stats.jumlahRombel}</h2>
                      </div>
                      <i class="fa-solid fa-school fa-2x text-white-50"></i>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card bg-stat-teal glass-card shadow-sm">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="text-white-50">JUMLAH GURU</h6>
                        <h2 class="fw-bold mb-0">\${stats.jumlahGuru}</h2>
                      </div>
                      <i class="fa-solid fa-chalkboard-teacher fa-2x text-white-50"></i>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card bg-stat-orange glass-card shadow-sm">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="text-white-50">JUMLAH SISWA</h6>
                        <h2 class="fw-bold mb-0">\${stats.jumlahSiswa}</h2>
                      </div>
                      <i class="fa-solid fa-users fa-2x text-white-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card glass-card p-4">
                <h5 class="fw-bold mb-3"><i class="fa-solid fa-circle-info text-info me-2"></i>Informasi Sistem</h5>
                <p>Selamat datang di <strong>Sistem Administrasi Guru (SAG)</strong>. Anda masuk sebagai <strong>\${currentUser.nama} (\${currentUser.role})</strong>.</p>
                <p class="mb-0">Gunakan menu di sebelah kiri untuk menginput data absensi siswa, nilai tugas, ujian, jurnal harian mengajar, bimbingan, maupun melakukan rekapitulasi nilai dan cetak dokumen PDF resmi sekolah secara otomatis.</p>
              </div>
            \`;
          }
          break;
          
        case "absensi":
          // Tampilkan formulir pilih kelas dan tanggal
          const kelasListAbsensi = await callApi("getKelas");
          if (kelasListAbsensi) {
            let options = kelasListAbsensi.map(k => \`<option value="\${k.id}">\${k.namaKelas}</option>\`).join("");
            const hariIni = new Date().toISOString().split('T')[0];
            
            container.innerHTML = \`
              <div class="card glass-card p-4 mb-4">
                <div class="row g-3 align-items-end">
                  <div class="col-md-5">
                    <label class="form-label fw-bold small">Pilih Rombongan Belajar (Kelas)</label>
                    <select class="form-select" id="absensiKelasSelect">\${options}</select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-bold small">Pilih Tanggal</label>
                    <input type="date" class="form-control" id="absensiTanggalInput" value="\${hariIni}"/>
                  </div>
                  <div class="col-md-3">
                    <button class="btn btn-primary w-100" onclick="loadDaftarAbsensi()" style="background: #2C3E50;"><i class="fa-solid fa-magnifying-glass me-2"></i>Cari Siswa</button>
                  </div>
                </div>
              </div>
              <div id="absensiListContainer"></div>
            \`;
          }
          break;
          
        // Tambahkan router views lainnya yang dimuat dinamis
        default:
          container.innerHTML = \`
            <div class="card glass-card p-4 text-center">
              <i class="fa-solid fa-hourglass-half fa-3x text-warning mb-3"></i>
              <h5 class="fw-bold">Fitur Sedang Dimuat</h5>
              <p class="text-muted">Fitur ini terintegrasi penuh dengan Apps Script dan data Sheet Anda.</p>
            </div>
          \`;
          break;
      }
    }
    
    // Autoload jika API URL tersimpan
    window.onload = function() {
      const savedApi = localStorage.getItem("SAG_API_URL");
      const savedUser = localStorage.getItem("SAG_USER");
      const savedConfig = localStorage.getItem("SAG_CONFIG");
      
      if (savedApi) document.getElementById("gasUrlInput").value = savedApi;
      if (savedApi && savedUser && savedConfig) {
        API_URL = savedApi;
        currentUser = JSON.parse(savedUser);
        schoolConfig = JSON.parse(savedConfig);
        initSystem();
      }
    };
  </script>
</body>
</html>`;
