# TemanAkses

> Belajar dengan cara yang sesuai denganmu.

README ini adalah pengenalan produk sekaligus **dokumen handoff untuk pengembang atau AI berikutnya**. Status fitur di bawah mengacu pada source saat ini, bukan sekadar rancangan.

## Ringkasan Produk

TemanAkses adalah prototipe platform belajar adaptif berbahasa Indonesia, dibuat untuk **International Innovation 4 Force Batch II 2026 — Web Design Competition** dengan subtema **Human-Centered Technology**.

Platform ini membantu pelajar mengatur cara membaca dan berinteraksi dengan materi. Prinsip produknya sejalan dengan pendidikan inklusif dan Universal Design for Learning (UDL): sediakan berbagai cara untuk memahami informasi dan berpartisipasi, tanpa mengasumsikan semua pengguna memiliki kebutuhan yang sama.

**Kondisi saat ini:** aplikasi frontend dengan materi statis dan penyimpanan per browser. Belum ada akun, backend, sinkronisasi perangkat, atau layanan AI.

## Prinsip Produk dan UX

- Preferensi dapat digabung dan dikendalikan pengguna; jangan mengasumsikan kebutuhan berdasarkan diagnosis atau identitas.
- Navigasi utama dan jalan keluar Focus Mode harus selalu mudah ditemukan.
- Materi audio tetap memiliki alternatif teks. Dukungan Web Speech API berbeda antarbrowser/perangkat.
- Jawaban quiz yang keliru harus memberi petunjuk dan kesempatan mencoba lagi, tanpa timer wajib atau label gagal.
- Kontrol perlu berlabel jelas, dapat digunakan dengan keyboard, memiliki fokus terlihat, serta target sentuh memadai.
- Hormati `prefers-reduced-motion`. Jangan menjadikan animasi, warna, atau suara sebagai satu-satunya penanda informasi.
- Uji perubahan pada desktop dan mobile; jangan mengklaim kepatuhan WCAG penuh tanpa audit terukur.

## Fitur yang Sudah Ada

### Preferensi dan akses membaca

- Onboarding meminta nama dan preferensi.
- Preferensi mode dapat digabung: **Fokus**, **Audio**, dan **Sederhana**. Pilihan **Visual** menghapus mode tambahan dan menjadi tampilan dasar.
- **Ruang Baca Adaptif / Reading Studio** mengatur ukuran teks, jarak baris, jarak huruf, dan tema Terang, Lembut, atau Kontras Tinggi.
- Focus Mode menyederhanakan tampilan tanpa menyembunyikan navigasi atau kontrol keluar.

### Materi

- Tiga modul statis: Dasar Pemrograman Web, Literasi Digital Sehari-hari, dan Strategi Belajar Efektif; total 10 bagian.
- Setiap bagian memiliki ringkasan sederhana yang ditulis khusus, poin utama, dan opsi untuk membuka penjelasan lengkap.
- Audio Reader mendukung putar/jeda/berhenti, kecepatan 0,75×–1,5×, dan highlight kata melalui event batas kata Web Speech API jika tersedia di browser.
- Kamus istilah inline menyediakan definisi, contoh, dan pengucapan istilah.
- Katalog materi memiliki pencarian lokal berdasarkan judul, deskripsi, kategori, dan tingkat.
- Bagian aktif dapat ditautkan melalui `?section=<id>`.

### Progres dan latihan

- Progres bagian, waktu terakhir diakses, dan bookmark disimpan lokal.
- Pusat Bookmark menyediakan pencarian, hapus penanda, serta tautan ke bagian tertentu.
- **Lanjutkan Belajar** membuka bagian terakhir yang dibaca.
- Setiap modul memiliki tiga soal Mini Quiz dengan petunjuk positif dan kesempatan mencoba lagi tanpa batas.
- Review quiz tersimpan per soal. Jawaban salah dijadwalkan setelah 1 hari; jawaban benar pertama setelah 3 hari; jawaban benar setelah sebelumnya salah setelah 2 hari; jawaban benar berturut-turut menggandakan interval sampai maksimum 14 hari.
- Soal review yang jatuh tempo tampil di dashboard sebagai latihan opsional.

## Peta Source

```text
src/
  App.tsx                  Routing dan reset scroll saat navigasi
  store.ts                 Zustand, persist localStorage, migrasi state
  components/              Komponen bersama, audio, quiz, kamus, Reading Studio
  data/materials.ts        Materi, ringkasan, istilah, dan data quiz
  data/modes.ts            Definisi preferensi dan label tampilan
  pages/                   Halaman aplikasi
  index.css                Token Tailwind v4 dan tema global
public/                    Aset statis
```

## Route

| Route | Fungsi |
|---|---|
| `/` | Landing page |
| `/onboarding` | Onboarding preferensi |
| `/dashboard` | Progres, lanjutkan belajar, review quiz jatuh tempo |
| `/materials` | Katalog dan pencarian materi |
| `/materials/:id?section=<id>` | Materi, Audio Reader, glosarium, dan Mini Quiz |
| `/bookmarks` | Bagian tersimpan dan bacaan terakhir |
| `/progress` | Ringkasan progres belajar |
| `/settings` | Preferensi dan Reading Studio |
| `/profile` | Ringkasan aktivitas dan preferensi |

## State dan Persistensi

State global dikelola Zustand melalui `persist` dengan key localStorage **`temanakses-storage`**, versi saat ini **3**.

- `learningModes`: gabungan `focus`, `audio`, `simple`.
- `fontSize`, `lineHeight`, `letterSpacing`, `pageTheme`: preferensi Reading Studio.
- `lessonProgress[sectionId]`: `completed`, `bookmarked`, `lastAccessed`.
- `quizReview[questionId]`: jumlah percobaan, jawaban salah, streak benar, interval, waktu jawab, dan jadwal berikutnya.

Reset preferensi mengembalikan tampilan dan mode, tetapi **harus mempertahankan** nama, progres/baca terakhir, bookmark, dan jadwal review quiz. Perubahan skema localStorage harus mempertahankan data pengguna dan diuji dengan state versi lama.

## Tech Stack

- React 19, TypeScript 6, Vite 8
- Tailwind CSS v4
- React Router DOM v7
- Zustand 5 dengan persist localStorage
- Phosphor Icons
- Web Speech API bawaan browser

Backend Laravel belum ada. Jangan menambah backend untuk fitur yang dapat berjalan dari data lokal.

## Menjalankan dan Memvalidasi

Prasyarat: Node.js yang kompatibel dengan Vite 8 dan npm.

```bash
npm install
npm run dev
```

Script yang tersedia:

```bash
npm run dev       # server pengembangan
npm run build     # pemeriksaan TypeScript dan production build
npm run preview   # preview hasil build
npm run lint      # Oxlint
```

Belum ada test suite otomatis di `package.json`. Setelah mengubah fitur, jalankan build dan lint; uji alur relevan di browser, keyboard, serta viewport desktop dan mobile.

## Roadmap dan Status

Roadmap produk mengikuti audit `readmet-temanakses.md`:

| Tahap | Target | Status repo |
|---|---|---|
| 1 | Preferensi gabungan, Reading Studio, Focus Mode yang mudah ditinggalkan | Sudah diterapkan |
| 2 | Audio Reader 2.0, Simple Mode sesungguhnya, kamus istilah | Sudah diterapkan; timing highlight bergantung dukungan browser |
| 3 | Pusat Bookmark, Lanjutkan Belajar, Mini Quiz | Sudah diterapkan; pencarian katalog dan review lokal juga ada |
| 4 | Offline/PWA, konten BISINDO, sinkronisasi akun bila dibutuhkan | Belum diterapkan; perlu rencana dan validasi pengguna |

Pomodoro wajib, generator materi/quiz AI, dan pemecahan suku kata otomatis belum menjadi prioritas roadmap. Evaluasi akurasi konten, dampak aksesibilitas, privasi, dan beban UX sebelum mengusulkannya.

## Panduan Handoff untuk AI/Pengembang Berikutnya

1. Baca README ini dan `readmet-temanakses.md` sebelum mengubah fitur. Dokumen audit tersebut menjadi acuan roadmap; README ini mencatat kondisi implementasi terkini.
2. Periksa source pemilik fitur dan seluruh pemanggilnya sebelum mengedit. Jangan menyimpulkan implementasi dari mockup atau dokumentasi lama.
3. Pertahankan React, Tailwind, Zustand, React Router, dan Web Speech API kecuali ada alasan kuat serta persetujuan untuk mengubah arsitektur.
4. Jaga navigasi tetap tersedia pada Focus Mode, pertahankan alternatif teks untuk audio, dan berikan jalur keyboard untuk semua aksi.
5. Materi, ringkasan, glossary, dan quiz dikelola di `src/data/materials.ts`; pastikan ringkasan dan feedback tidak mengubah makna materi.
6. Jangan menambahkan backend, akun, atau pengiriman data keluar tanpa kebutuhan roadmap dan keputusan privasi yang jelas.
7. Jelaskan keterbatasan API browser yang belum dapat dijamin lintas perangkat. Jangan mengklaim uji aksesibilitas formal tanpa pelaksanaannya.
8. Kerjakan perubahan sekecil mungkin, lalu jalankan `npm run build`, `npm run lint`, dan uji perilaku serta responsivitas yang terdampak.

## Batasan yang Diketahui

- Materi dan soal statis, belum ada editor konten.
- localStorage hanya berlaku pada browser/perangkat yang sama; belum ada akun atau sinkronisasi.
- Belum ada service worker, manifest PWA, atau dukungan offline.
- Pengucapan dan event batas kata Web Speech berbeda antarbrowser dan suara sistem.
- Review quiz tersimpan lokal; belum sinkron antardevice.
- Dampak ringkasan, quiz, dan kontrol aksesibilitas tetap perlu diuji bersama calon pengguna yang beragam.

## Demo, Tim, dan Pengungkapan AI

- Live demo: belum dicantumkan.
- Informasi tim: belum dicantumkan.
- AI digunakan untuk membantu eksplorasi ide, pengembangan kode, debugging, dan penyempurnaan konten. Keputusan desain, struktur solusi, implementasi akhir, dan validasi karya dilakukan oleh tim peserta.
