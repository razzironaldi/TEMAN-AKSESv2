# TemanAkses Bugfix & Debug Report

## Ringkasan

Pada tahap ini, dua bug utama berhasil diidentifikasi dan diperbaiki:

1. Widget Aksa / StudyCompanion menempel di bagian atas saat tampil di layar mobile.
2. Halaman Dashboard kehilangan seluruh kontennya karena animasi reveal gagal mengamati elemen yang muncul dari lazy-loaded route.

---

## Bug 1: Aksa tertahan di bagian atas

### Root cause

Perhitungan `bottomPosition` menggunakan `visualViewport` dibuat dengan asumsi bahwa `bottom` harus bernilai jarak dari bawah layar ke bagian paling bawah viewport. Sayangnya, logika yang digunakan menghasilkan nilai yang berlawanan arah saat keyboard virtual muncul.

Pada kondisi keyboard terbuka, formula yang semula menghasilkan nilai `visualViewport.height` sebagai komponen utama, sehingga `bottom` dapat menjadi angka besar seperti 832px. Nilai ini justru membuat widget bergeser ke bagian atas layar.

### Perbaikan

- Logika sekarang menghitung selisih ruang kosong yang tersisa di bawah viewport.
- Fallback default dibuat aman untuk mode normal tanpa keyboard.
- Saat keyboard tampil, posisi widget diatur agar muncul tepat di atas keyboard dengan margin kecil.

### File yang terlibat
- `src/components/StudyCompanion.tsx`

---

## Bug 2: Dashboard kehilangan isi

### Root cause

Dashboard memuat konten yang menggunakan atribut `[data-scroll-reveal]`. Observer animasi reveal berjalan saat route berubah, tetapi komponen dashboard datang dari lazy-loaded `Suspense`.

Akibatnya, observer mengecek DOM sebelum elemen dashboard selesai dimuat, sehingga tidak ada target yang ditemukan dan seluruh konten tetap dalam keadaan tersembunyi karena CSS default `opacity: 0`.

### Perbaikan

- Observer dire-run setelah route selesai mount dan DOM baru muncul.
- Mutasi DOM dipantau ulang untuk menunggu elemen baru hadir.
- Penjadwalan dengan `requestAnimationFrame` dipakai agar observer berjalan tepat setelah render baru selesai.

### File yang terlibat
- `src/App.tsx`
- `src/index.css`
- `src/pages/DashboardPage.tsx`

---

## Verifikasi runtime

### Browser validation

Validasi dilakukan langsung melalui browser pada route:

- `/`
- `/dashboard`

Hasilnya:

- halaman dashboard berhasil tampil dengan isi lengkap
- tombol Aksa tampil di posisi yang benar
- teks dan kartu materi muncul normal, bukan blank atau terkunci

### Build validation

Perintah yang dijalankan:

```bash
npm run lint && npm run build
```

Hasil:

- lint berhasil
- build berhasil
- output terakhir: `✓ built in 2.42s`

---

## File utama yang berubah

- `src/App.tsx`
- `src/components/StudyCompanion.tsx`
- `src/pages/DashboardPage.tsx`
- `src/index.css`

---

## Hotfix tambahan: tombol “Periksa jawaban” di mobile

Pada pengujian di viewport mobile, area tombol aksi kuis bisa tertutup di bawah fold saat dialog kuis dibuat dalam layout yang bergantung pada `margin-top: auto` dan tinggi viewport yang berubah saat browser tab aktif/di-background.

### Solusi yang diterapkan

- Footer aksi kuis dipindah menjadi area `sticky` di bagian bawah dialog.
- Area tombol diberi padding bawah yang memperhitungkan `safe-area-inset-bottom` agar aman di iPhone dan browser mobile modern.
- Background footer dibuat semi-transparan agar tetap terlihat tanpa tertutup oleh konten scrollable.

### File terlibat
- `src/components/QuizSection.tsx`

---

## Catatan akhir

Perbaikan ini fokus pada akar masalah, bukan hanya patch visual. Dengan pendekatan seperti ini, bug yang berkaitan dengan lazy load, viewport mobile, dialog, dan observer DOM dapat dicegah kembali di masa depan.
