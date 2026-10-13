# TemanAkses

> Belajar dengan cara yang sesuai denganmu.

README ini memperkenalkan tujuan, fitur, teknologi, dan cara mencoba TemanAkses. Untuk arsitektur, state, keamanan, batasan implementasi, dan panduan pengembangan, lihat [HANDOFF.md](HANDOFF.md).

## Ringkasan Produk

TemanAkses adalah prototipe platform belajar adaptif berbahasa Indonesia, dibuat untuk **International Innovation 4 Force Batch II 2026 — Web Design Competition** dengan subtema **Human-Centered Technology**.

Platform ini membantu pelajar mengatur cara membaca dan berinteraksi dengan materi. Prinsip produknya sejalan dengan pendidikan inklusif dan Universal Design for Learning (UDL): sediakan berbagai cara untuk memahami informasi dan berpartisipasi, tanpa mengasumsikan semua pengguna memiliki kebutuhan yang sama.

**Kondisi saat ini:** aplikasi dengan materi statis dan penyimpanan per browser. Belum ada akun atau sinkronisasi perangkat. Server Node dapat menyajikan frontend sekaligus proxy Groq untuk deployment prototipe; backend produksi yang hardened belum tersedia.

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

- Katalog memiliki 8 kategori, 17 tema, dan 52 subtema. Tema dasar yang sudah ada mencakup Dasar Pemrograman Web, Literasi Digital Sehari-hari, dan Strategi Belajar Efektif.
- Setiap bagian memiliki ringkasan sederhana yang ditulis khusus, poin utama, dan opsi untuk membuka penjelasan lengkap.
- Audio Reader mendukung putar/jeda/berhenti, kecepatan 0,75×–1,5×, dan highlight kata melalui event batas kata Web Speech API jika tersedia di browser.
- Kamus istilah inline menyediakan definisi, contoh, dan pengucapan istilah.
- Katalog materi memiliki pencarian lokal berdasarkan judul, deskripsi, kategori, dan tingkat.
- Bagian aktif dapat ditautkan melalui `?section=<id>`.

### Progres dan latihan

- Progres bagian, waktu terakhir diakses, dan bookmark disimpan lokal.
- Pusat Bookmark menyediakan pencarian, hapus penanda, serta tautan ke bagian tertentu.
- **Lanjutkan Belajar** membuka bagian terakhir yang dibaca.
- Latihan kuis memberi petunjuk positif; mode Santai mengizinkan pengguna mencoba lagi tanpa batas.
- Review quiz tersimpan per soal. Jawaban salah dijadwalkan setelah 1 hari; jawaban benar pertama setelah 3 hari; jawaban benar setelah sebelumnya salah setelah 2 hari; jawaban benar berturut-turut menggandakan interval sampai maksimum 14 hari.
- Soal review yang jatuh tempo tampil di dashboard sebagai latihan opsional.
- Tema dasar memiliki tiga soal; tema inklusif tambahan saat ini memiliki satu soal cek pemahaman.
- Kuis menyediakan mode Santai tanpa timer dan mode Hard dengan hitung mundur 20 detik per soal. State sesi kuis tidak disimpan ke localStorage.
- Aksa disembunyikan selama sesi kuis aktif; jawaban salah menampilkan petunjuk dan maskot yang mendukung.

### Teman belajar Aksa

- Karakter animasi Aksa tersedia di halaman belajar dan membuka panel tanya-jawab.
- Jika server dan `GROQ_API_KEY` tersedia, pertanyaan dan konteks bagian aktif dikirim ke Groq untuk dijawab. Jangan masukkan kata sandi atau informasi pribadi.
- Di luar halaman materi, Aksa mencari subtema yang paling relevan dan mengirim ringkasan serta detailnya sebagai konteks jawaban.
- Kunci API disimpan di `.env.local` dan hanya dibaca server Node lokal; jangan pernah menaruhnya pada source frontend atau mengunggahnya ke Git.
- Tanpa koneksi AI, Aksa memakai pencocokan lokal dari ringkasan, istilah, dan kuis di `src/data/materials.ts`.
- Jawaban AI bisa keliru; Aksa bukan sumber medis atau layanan konseling. Animasi menghormati `prefers-reduced-motion`.
- Panel dapat ditutup atau disembunyikan. Animasi menghormati `prefers-reduced-motion`.

## Route

| Route | Fungsi |
|---|---|
| `/` | Landing page |
| `/onboarding` | Onboarding preferensi |
| `/dashboard` | Progres, lanjutkan belajar, review quiz jatuh tempo |
| `/materials` | Katalog kategori, tema, subtema, filter, dan pencarian |
| `/materials/:id?section=<id>` | Materi, Audio Reader, glosarium, dan kuis Santai/Hard |
| `/bookmarks` | Bagian tersimpan dan bacaan terakhir |
| `/progress` | Ringkasan progres belajar |
| `/settings` | Preferensi dan Reading Studio |
| `/profile` | Ringkasan aktivitas dan preferensi |

## Teknologi

- React 19, TypeScript 6, Vite 8
- Tailwind CSS v4
- React Router DOM v7
- Zustand 5 dengan persist localStorage
- Phosphor Icons
- Web Speech API bawaan browser
- Node.js HTTP server untuk proxy Groq lokal (opsional saat pengembangan)

Penyimpanan progres berlangsung di browser. Server Node melayani frontend dan proxy Groq dalam satu proses saat deployment prototipe; belum ada akun atau sinkronisasi.

## Mulai Mencoba

Prasyarat: Node.js yang kompatibel dengan Vite 8 dan npm.

```bash
npm install
npm run dev
```

Mode jawaban lokal Aksa tersedia tanpa konfigurasi tambahan. Setup Groq untuk prototipe dan perintah validasi pengembang dijelaskan di [HANDOFF.md](HANDOFF.md).

## Deploy Prototipe

Konfigurasi [railway.json](railway.json) menetapkan `npm run build`, `npm start`, dan healthcheck API. Tambahkan `GROQ_API_KEY` pada Variables service Railway; `GROQ_MODEL` bersifat opsional. Setelah deploy, tanpa variable server tersebut aplikasi tetap terbuka tetapi Aksa hanya memakai jawaban lokal.

## Status

TemanAkses adalah prototipe untuk kompetisi desain web. Materi masih statis dan katalog belum memiliki editor konten. Aksa dapat memakai Groq secara opsional; jawabannya dapat keliru dan pertanyaan hanya dikirim ke Groq ketika server lokal dikonfigurasi. Progres lokal belum tersinkron antarperangkat.

Konten inklusif, ringkasan, latihan, dan pengalaman aksesibilitas masih perlu ditinjau serta diuji bersama pendidik dan pelajar dengan kebutuhan yang beragam. Catatan batasan teknis lengkap tersedia di [HANDOFF.md](HANDOFF.md).

## Demo, Tim, dan Pengungkapan AI

- Live demo: belum dicantumkan.
- Informasi tim: belum dicantumkan.
- AI digunakan untuk membantu eksplorasi ide, pengembangan kode, debugging, dan penyempurnaan konten. Keputusan desain, struktur solusi, implementasi akhir, dan validasi karya dilakukan oleh tim peserta.
