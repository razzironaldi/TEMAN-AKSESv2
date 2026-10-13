# Handoff Pengembang TemanAkses

> Dokumen ini adalah panduan teknis untuk pengembang atau AI berikutnya. Ringkasan produk dan pengenalan fitur ada di [README.md](README.md). Cocokkan semua catatan dengan source sebelum mengubah implementasi.

## Gambaran Teknis

TemanAkses adalah prototipe frontend berbahasa Indonesia untuk **International Innovation 4 Force Batch II 2026 — Web Design Competition**, subtema **Human-Centered Technology**. Aplikasi memakai materi statis dan penyimpanan lokal browser. Belum ada akun, sinkronisasi antarperangkat, backend produksi, atau editor konten.

Prinsip implementasi:

- Pengguna memilih dan menggabungkan preferensi sendiri; jangan menyimpulkan kebutuhan dari diagnosis atau identitas.
- Navigasi dan cara keluar Focus Mode/kuis harus selalu tersedia.
- Audio selalu memiliki alternatif teks; dukungan Web Speech API berbeda antarbrowser.
- Jawaban keliru diberi petunjuk tanpa label gagal atau tekanan waktu wajib.
- Semua kontrol dapat digunakan dengan keyboard, memiliki fokus terlihat, dan menghormati `prefers-reduced-motion`.
- Jangan mengklaim kepatuhan WCAG formal tanpa audit terukur.

## Peta Source

```text
src/
  App.tsx                       Routing dan reset scroll saat navigasi
  store.ts                      Zustand, persist localStorage, migrasi, dan sesi kuis
  components/
    AudioPlayer.tsx             Web Speech API, kontrol laju, highlight kata
    ReadingStudio.tsx           Preferensi tipografi dan tema baca
    GlossaryPopover.tsx          Definisi dan pengucapan istilah
    GlossaryText.tsx             Penanda istilah inline
    QuizSection.tsx              Mode Santai/Hard, timer, skor, modal kuis
    QuizMascot.tsx               Maskot dan respons animasi kuis
    StudyCompanion.tsx           Panel Aksa dan fallback jawaban lokal
  data/
    materials.ts                 Taksonomi, materi dasar, helper data materi
    inclusiveThemes.ts           Tema inklusif tambahan, subtema, dan kuis
    modes.ts                     Definisi preferensi belajar
  pages/                         Halaman aplikasi
  index.css                      Token, aksesibilitas, dan animasi
server/
  index.mjs                      Proxy Node lokal ke Groq
```

## Route

| Route | Fungsi |
|---|---|
| `/` | Landing page |
| `/onboarding` | Onboarding preferensi |
| `/dashboard` | Progres, tema awal, dan review kuis jatuh tempo |
| `/materials` | Katalog kategori, tema, subtema, filter, dan pencarian |
| `/materials/:id?section=<id>` | Materi, audio, glosarium, latihan, dan Aksa |
| `/bookmarks` | Bagian tersimpan dan bacaan terakhir |
| `/progress` | Ringkasan progres belajar |
| `/settings` | Preferensi dan Reading Studio |
| `/profile` | Ringkasan aktivitas dan preferensi |

## Katalog dan Konten

- Katalog saat ini memiliki 8 kategori, 17 tema, dan 52 subtema.
- Tema disimpan di `materials`; kategori didefinisikan oleh `categoryId` dan `learningCategories`.
- Materi dasar dan ID bagian lamanya dipertahankan agar progres serta bookmark lama tidak hilang.
- Tema inklusif tambahan dirakit dari `inclusiveThemeSeeds` di `inclusiveThemes.ts`. Setiap tema tambahan saat ini memiliki tiga subtema dan satu soal cek pemahaman.
- Materi dasar memiliki tiga soal Mini Quiz per tema.
- Isi adalah materi awal statis, bukan kurikulum tervalidasi. Tinjau akurasi dan dampak bersama pendidik serta pelajar dengan pengalaman aksesibilitas yang beragam.

## Kuis Interaktif

- `QuizSection` menyediakan mode **Santai** tanpa batas waktu dan mode **Hard** dengan 20 detik per soal.
- Santai mengizinkan mencoba ulang tanpa batas. Hard mencatat jawaban salah dan mengizinkan lanjut; timeout juga dihitung sebagai jawaban salah.
- Skor dihitung dari jawaban benar, petunjuk dan penjelasan tetap ditampilkan, dan hasil maskot menyesuaikan skor.
- `QuizMascot` menggunakan kelas state untuk idle, benar, salah, selesai, sempurna, dan dukungan. Gerak menghormati reduced motion.
- Kuis aktif memakai elemen dialog modal, fokus diarahkan ke pertanyaan, `Escape` dan tombol keluar mengakhiri sesi.
- `StudyCompanion` disembunyikan selama `isQuizActive`.
- Sesi kuis hanya di Zustand selama sesi berjalan; field transient dikecualikan dari persist. `quizReview` tetap disimpan untuk latihan pengulangan.
- Review per soal: jawaban salah dijadwalkan 1 hari; benar pertama 3 hari; benar sesudah salah 2 hari; jawaban benar beruntun menggandakan interval hingga maksimum 14 hari.

## Aksa dan Groq

Aksa dapat berjalan dalam dua cara:

- Tanpa server/kunci: jawaban lokal dicocokkan dari glosarium, ringkasan, soal, dan subtema yang tersedia.
- Dengan server Node dan `GROQ_API_KEY`: pertanyaan dan konteks materi terkait dikirim ke Groq melalui proxy server. Jangan mengirim kata sandi, data pribadi, atau informasi sensitif.

Pengaturan teknis:

- `.env.example` adalah contoh konfigurasi; buat `.env.local` lokal dengan `GROQ_API_KEY` dan, bila perlu, `GROQ_MODEL`.
- `.env.local` diabaikan Git oleh aturan `*.local`. Jangan masukkan kunci API ke source frontend, commit, atau percakapan. Cabut kunci yang pernah terekspos.
- Model default saat ini `openai/gpt-oss-20b`; model dapat diganti lewat `GROQ_MODEL` jika akun mendukungnya.
- Dalam development, `npm run dev:api` menjalankan API-only di `127.0.0.1:8787`; Vite mem-proxy `/api` ke server tersebut.
- Dalam production, `npm start` menjalankan server yang bind ke `0.0.0.0:$PORT`, melayani frontend SPA dari `dist`, serta endpoint API pada origin yang sama.
- `server/index.mjs` membatasi body, panjang konteks, waktu request, dan request per alamat klien. Log hanya mencatat status/kode error; jangan menambah log kunci atau body berisi data pengguna.
- `railway.json` menetapkan build command `npm run build`, start command `npm start`, dan healthcheck `/api/companion/status`.
- Set `GROQ_API_KEY` pada Variables service Railway. Variable `.env.local` lokal tidak dikirim saat deploy; setelah variable ditambah, redeploy service.
- Prompt membatasi Aksa ke materi yang diberikan, tetapi model masih dapat keliru. Hasil AI bukan nasihat medis atau konseling.

Menjalankan mode AI lokal:

```text
GROQ_API_KEY=masukkan_kunci_baru_di_lingkungan_lokal
GROQ_MODEL=openai/gpt-oss-20b
```

Simpan nilai tersebut hanya di `.env.local`, kemudian jalankan pada terminal terpisah:

```bash
npm run dev:api
npm run dev
```

`GET /api/companion/status` hanya melaporkan status konfigurasi dan model, tidak mengembalikan kunci. Tanpa konfigurasi Groq, Aksa seharusnya tetap memakai jawaban lokal.

## State dan Persistensi

State aplikasi memakai Zustand `persist` dengan key `temanakses-storage`, versi 3.

- `learningModes`: gabungan `focus`, `audio`, `simple`.
- `fontSize`, `lineHeight`, `letterSpacing`, `pageTheme`: pengaturan baca.
- `lessonProgress[sectionId]`: selesai, bookmark, dan waktu akses.
- `quizReview[questionId]`: percobaan dan jadwal review.
- State sesi kuis: `isQuizActive`, `quizMode`, `currentQuestionIndex`, `score`, `mascotState`; dikeluarkan dari `partialize` agar tidak tersimpan.
- Reset preferensi harus mempertahankan nama, status onboarding, progres, bookmark, dan review.

Perubahan schema persisted harus mempertahankan state lama dan disertai validasi migrasi. Jangan menaikkan versi persist untuk state transient yang tidak disimpan.

## Menjalankan dan Validasi

Node.js kompatibel dengan Vite 8 dan npm diperlukan.

```bash
npm install
npm run dev
npm run build
npm run lint
```

Script `npm run dev:api` diperlukan untuk mode Groq lokal saat Vite berjalan. Untuk deployment Node gunakan `npm run build` lalu `npm start`. Belum ada test suite otomatis; uji interaksi, keyboard, reduced motion, dan viewport mobile pada alur yang berubah.

## Status dan Batasan

- Materi statis, belum ada editor konten atau moderasi konten.
- `localStorage` hanya berlaku di browser/perangkat tersebut; belum ada akun atau sinkronisasi.
- Belum ada service worker, manifest PWA, atau dukungan offline.
- Ketersediaan suara dan event batas kata Web Speech bergantung browser/perangkat.
- Kuis tema inklusif tambahan masih memiliki satu soal per tema.
- Pencocokan lokal Aksa berbasis kata kunci dan terbatas pada konten yang tersedia.
- Integrasi Groq melalui Node untuk prototipe, bukan backend produksi yang hardened; pertanyaan/konteks dikirim ke layanan Groq jika variable server aktif.
- Konten BISINDO hanya memberi arahan belajar dari komunitas/pengajar kompeten; tidak memuat video atau klaim kosakata isyarat yang belum diverifikasi.

Roadmap offline/PWA, konten BISINDO tervalidasi, dan sinkronisasi akun perlu perencanaan serta validasi pengguna. Pomodoro wajib, generator materi/kuis AI, dan pemecahan suku kata otomatis belum menjadi prioritas.

## Panduan untuk Pengembang atau AI Berikutnya

1. Baca README dan handoff ini sebelum mengubah perilaku.
2. Periksa pemilik fitur dan seluruh pemanggil sebelum mengedit; source adalah acuan kondisi aktual.
3. Pertahankan React, Tailwind, Zustand, React Router, dan Web Speech API tanpa alasan kuat untuk mengubah arsitektur.
4. Jaga kontrol keluar Focus Mode/kuis, alternatif teks audio, keyboard, fokus terlihat, dan reduced motion.
5. Materi, kategori, subtema, istilah, dan kuis dikelola dari `src/data/materials.ts` serta `src/data/inclusiveThemes.ts`.
6. Jangan menambah akun, backend produksi, atau pengiriman data keluar tanpa keputusan kebutuhan dan privasi.
7. Jangan mengklaim audit aksesibilitas formal tanpa pengujian terukur.
8. Perubahan kode perlu `npm run build`, `npm run lint`, serta uji perilaku/viewport yang relevan.

## Kompetisi dan Penggunaan AI

- Live demo dan informasi tim belum dicantumkan.
- AI digunakan untuk membantu eksplorasi ide, pengembangan kode, debugging, dan penyempurnaan konten. Keputusan desain, struktur solusi, implementasi akhir, dan validasi karya dilakukan oleh tim peserta.