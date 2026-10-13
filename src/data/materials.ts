import { inclusiveThemeSeeds } from './inclusiveThemes'

export interface LessonSection {
  id: string
  title: string
  simpleSummary: string
  paragraphs: string[]
  keyPoints: string[]
  duration: number
}

export interface GlossaryTerm {
  term: string
  definition: string
  example: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  answer: string
  hint: string
  explanation: string
}

export interface Material {
  id: string
  categoryId: string
  title: string
  category: string
  description: string
  level: string
  totalDuration: number
  sections: LessonSection[]
  glossary: GlossaryTerm[]
  quiz: QuizQuestion[]
  accent: string
  icon: string
}

export interface LearningCategory {
  id: string
  title: string
  description: string
}

export const learningCategories: LearningCategory[] = [
  {
    id: 'inclusive-design',
    title: 'Desain Pembelajaran Inklusif',
    description: 'Rancang kegiatan belajar yang memberi ruang bagi kebutuhan dan cara belajar yang beragam.',
  },
  {
    id: 'digital-accessibility',
    title: 'Aksesibilitas Digital',
    description: 'Pahami dasar teknologi web dan cara membuat konten digital lebih mudah diakses.',
  },
  {
    id: 'assistive-support',
    title: 'Teknologi Bantu dan Akomodasi',
    description: 'Kenali pilihan alat bantu dan penyesuaian lingkungan belajar bersama penggunanya.',
  },
  {
    id: 'inclusive-communication',
    title: 'Komunikasi Inklusif',
    description: 'Gunakan bahasa yang jelas dan hormati beragam cara orang berkomunikasi.',
  },
  {
    id: 'adaptive-learning',
    title: 'Strategi Belajar Adaptif',
    description: 'Temukan strategi untuk mengatur fokus, energi, dan proses belajar diri sendiri.',
  },
  {
    id: 'digital-literacy',
    title: 'Literasi Digital dan Keamanan',
    description: 'Bangun kebiasaan digital yang kritis, aman, dan menghargai orang lain.',
  },
  {
    id: 'safe-community',
    title: 'Relasi dan Lingkungan Belajar Aman',
    description: 'Bangun rasa memiliki, kerja sama, dan lingkungan belajar yang menghormati semua orang.',
  },
  {
    id: 'agency-participation',
    title: 'Kemandirian dan Partisipasi',
    description: 'Dukung pilihan, suara, dan keterlibatan pelajar dalam pengalaman belajarnya.',
  },
]

const baseMaterials: Material[] = [
  {
    id: 'dasar-web',
    categoryId: 'digital-accessibility',
    title: 'Dasar Pemrograman Web',
    category: 'Aksesibilitas Digital',
    description:
      'Pelajari fondasi HTML, CSS, dan JavaScript untuk membangun halaman web pertamamu.',
    level: 'Pemula',
    totalDuration: 45,
    glossary: [
      { term: 'HTML', definition: 'Bahasa penanda untuk menyusun bagian dan isi halaman web.', example: 'Judul dan paragraf dibuat sebagai elemen HTML.' },
      { term: 'CSS', definition: 'Bahasa untuk mengatur tampilan halaman, seperti warna, ukuran, dan tata letak.', example: 'CSS dapat memberi warna pada judul.' },
      { term: 'JavaScript', definition: 'Bahasa pemrograman yang membuat halaman merespons tindakan pengguna.', example: 'JavaScript dapat menjalankan aksi saat tombol diklik.' },
      { term: 'atribut', definition: 'Informasi tambahan yang ditulis pada sebuah elemen HTML.', example: 'Atribut dapat menentukan tujuan sebuah tautan.' },
      { term: 'peramban', definition: 'Aplikasi untuk membuka dan melihat halaman web.', example: 'Chrome dan Firefox adalah peramban.' },
    ],
    quiz: [
      {
        id: 'web-quiz-1',
        question: 'Apa tugas utama HTML pada halaman web?',
        options: ['Menyusun struktur dan isi halaman', 'Mengatur warna halaman', 'Menyimpan kata sandi pengguna'],
        answer: 'Menyusun struktur dan isi halaman',
        hint: 'Pikirkan teknologi yang menjadi kerangka sebuah halaman.',
        explanation: 'Tepat. HTML menandai struktur seperti judul, paragraf, dan gambar.',
      },
      {
        id: 'web-quiz-2',
        question: 'Teknologi apa yang mengatur warna dan tata letak?',
        options: ['HTML', 'CSS', 'JavaScript'],
        answer: 'CSS',
        hint: 'Teknologi ini bekerja pada tampilan, bukan struktur atau aksi.',
        explanation: 'Betul. CSS mengatur warna, ukuran, jarak, dan tata letak.',
      },
      {
        id: 'web-quiz-3',
        question: 'Apa yang dapat dilakukan JavaScript pada halaman?',
        options: ['Menambahkan interaksi', 'Mengganti peramban', 'Membuat kabel jaringan'],
        answer: 'Menambahkan interaksi',
        hint: 'Bayangkan apa yang terjadi ketika tombol diklik.',
        explanation: 'Benar. JavaScript membuat halaman merespons tindakan pengguna.',
      },
    ],
    accent: 'primary',
    icon: 'Code',
    sections: [
      {
        id: 'web-1',
        title: 'Apa itu Halaman Web?',
        simpleSummary: 'Halaman web dibuka melalui peramban. HTML menyusun isi, CSS mengatur tampilan, dan JavaScript menambahkan interaksi.',
        duration: 10,
        paragraphs: [
          'Halaman web adalah dokumen yang dapat kamu lihat melalui peramban seperti Chrome, Firefox, atau Safari. Setiap halaman web dibangun dari tiga teknologi utama yang bekerja bersama.',
          'HTML menyusun struktur konten, seperti judul, paragraf, dan gambar. CSS mengatur tampilan visual, seperti warna, ukuran, dan tata letak. JavaScript menambahkan interaksi, sehingga halaman dapat merespons tindakan pengguna.',
        ],
        keyPoints: [
          'HTML = struktur konten',
          'CSS = tampilan visual',
          'JavaScript = interaksi',
        ],
      },
      {
        id: 'web-2',
        title: 'Menyusun Struktur dengan HTML',
        simpleSummary: 'HTML memakai elemen untuk menyusun judul dan paragraf. Atribut memberi informasi tambahan pada elemen.',
        duration: 12,
        paragraphs: [
          'HTML menggunakan elemen untuk menandai bagian-bagian konten. Elemen ditulis dengan tanda kurung sudut, misalnya untuk membuat paragraf atau untuk judul.',
          'Setiap elemen dapat memiliki atribut yang memberi informasi tambahan. Struktur yang rapi membuat konten mudah dibaca oleh manusia maupun mesin pencari.',
        ],
        keyPoints: [
          'Elemen HTML membentuk struktur',
          'Atribut memberi informasi tambahan',
          'Struktur yang baik membantu aksesibilitas',
        ],
      },
      {
        id: 'web-3',
        title: 'Mengatur Tampilan dengan CSS',
        simpleSummary: 'CSS mengatur warna, ukuran, jarak, dan tata letak tanpa mengubah isi halaman. Aturan yang sama dapat menjaga tampilan tetap konsisten.',
        duration: 13,
        paragraphs: [
          'CSS memisahkan tampilan dari struktur. Kamu dapat mengubah warna, jarak, ukuran huruf, dan tata letak tanpa mengubah isi konten.',
          'Dengan CSS, satu perubahan dapat memengaruhi seluruh halaman. Ini membuat situs lebih konsisten dan mudah dipelihara.',
        ],
        keyPoints: [
          'CSS mengatur tampilan',
          'Tampilan terpisah dari struktur',
          'Konsistensi lebih mudah dijaga',
        ],
      },
      {
        id: 'web-4',
        title: 'Menambah Interaksi dengan JavaScript',
        simpleSummary: 'JavaScript membuat halaman merespons tindakan. Contohnya, tombol dapat menjalankan aksi saat diklik.',
        duration: 10,
        paragraphs: [
          'JavaScript membuat halaman web menjadi hidup. Dengan JavaScript, tombol dapat merespons klik, formulir dapat divalidasi, dan konten dapat berubah tanpa memuat ulang halaman.',
          'Mulailah dari interaksi sederhana, lalu tingkatkan seiring pemahamanmu bertambah.',
        ],
        keyPoints: [
          'JavaScript menambah interaksi',
          'Halaman dapat berubah tanpa reload',
          'Mulai dari yang sederhana',
        ],
      },
    ],
  },
  {
    id: 'literasi-digital',
    categoryId: 'digital-literacy',
    title: 'Literasi Digital Sehari-hari',
    category: 'Literasi Digital dan Keamanan',
    description:
      'Cara mengenali informasi yang dapat dipercaya dan menjaga keamanan data pribadi saat online.',
    level: 'Pemula',
    totalDuration: 30,
    glossary: [
      { term: 'sumber informasi', definition: 'Orang, organisasi, atau dokumen yang menjadi asal sebuah informasi.', example: 'Periksa siapa yang menulis berita.' },
      { term: 'fakta', definition: 'Pernyataan yang dapat diperiksa kebenarannya dengan bukti.', example: 'Tanggal terbit dapat diverifikasi dari halaman sumber.' },
      { term: 'opini', definition: 'Pendapat atau penilaian seseorang, bukan fakta yang sudah dibuktikan.', example: 'Kalimat “menurut saya” biasanya menunjukkan opini.' },
      { term: 'data pribadi', definition: 'Informasi yang dapat mengenali atau berkaitan dengan seseorang.', example: 'Alamat dan nomor telepon termasuk data pribadi.' },
      { term: 'kata sandi', definition: 'Rangkaian rahasia untuk melindungi akses ke akun.', example: 'Gunakan kata sandi berbeda untuk akun penting.' },
      { term: 'kode verifikasi', definition: 'Kode sementara untuk memastikan bahwa seseorang memiliki akses ke akun atau perangkat.', example: 'Jangan berikan kode verifikasi kepada orang lain.' },
    ],
    quiz: [
      {
        id: 'lit-quiz-1',
        question: 'Apa yang sebaiknya diperiksa saat menilai informasi online?',
        options: ['Penulis, tanggal, dan sumber pembanding', 'Jumlah komentar saja', 'Warna halaman web'],
        answer: 'Penulis, tanggal, dan sumber pembanding',
        hint: 'Cari petunjuk yang membantu memeriksa asal dan waktu informasi.',
        explanation: 'Tepat. Penulis, tanggal, dan sumber lain membantu memeriksa keandalan informasi.',
      },
      {
        id: 'lit-quiz-2',
        question: 'Manakah contoh data pribadi yang perlu dijaga?',
        options: ['Nomor telepon dan alamat', 'Warna favorit sebuah situs', 'Nama kategori berita'],
        answer: 'Nomor telepon dan alamat',
        hint: 'Pilih informasi yang berkaitan langsung dengan identitas seseorang.',
        explanation: 'Benar. Nomor telepon dan alamat dapat mengidentifikasi atau menghubungi seseorang.',
      },
      {
        id: 'lit-quiz-3',
        question: 'Apa yang perlu dilakukan terhadap kode verifikasi?',
        options: ['Simpan sendiri dan jangan bagikan', 'Kirim kepada orang yang meminta', 'Tulis di kolom komentar publik'],
        answer: 'Simpan sendiri dan jangan bagikan',
        hint: 'Kode ini membantu melindungi akses akunmu.',
        explanation: 'Betul. Kode verifikasi bersifat rahasia dan tidak boleh dibagikan.',
      },
    ],
    accent: 'accent',
    icon: 'ShieldCheck',
    sections: [
      {
        id: 'lit-1',
        title: 'Menilai Sumber Informasi',
        simpleSummary: 'Informasi online belum tentu benar. Periksa penulis dan tanggalnya, lalu bandingkan dengan sumber lain.',
        duration: 10,
        paragraphs: [
          'Tidak semua informasi di internet akurat. Sebelum mempercayai sebuah informasi, periksa siapa yang menulisnya, kapan dipublikasikan, dan apakah ada sumber lain yang mendukungnya.',
          'Membandingkan beberapa sumber membantu kamu membedakan fakta dari opini yang belum terverifikasi.',
        ],
        keyPoints: [
          'Periksa penulis dan tanggal',
          'Bandingkan beberapa sumber',
          'Bedakan fakta dan opini',
        ],
      },
      {
        id: 'lit-2',
        title: 'Menjaga Data Pribadi',
        simpleSummary: 'Jaga nomor telepon, alamat, dan kata sandi. Gunakan kata sandi berbeda untuk akun penting dan periksa pengaturan privasi.',
        duration: 10,
        paragraphs: [
          'Data pribadi seperti nomor telepon, alamat, dan kata sandi harus dijaga. Gunakan kata sandi yang kuat dan berbeda untuk setiap akun penting.',
          'Berhati-hatilah saat membagikan informasi di platform publik dan selalu periksa pengaturan privasi akunmu.',
        ],
        keyPoints: [
          'Gunakan kata sandi kuat dan unik',
          'Periksa pengaturan privasi',
          'Hati-hati saat berbagi data',
        ],
      },
      {
        id: 'lit-3',
        title: 'Mengenali Penipuan Online',
        simpleSummary: 'Penipuan sering membuat orang panik atau terburu-buru. Periksa tawaran dan tautan, serta jangan bagikan kode verifikasi.',
        duration: 10,
        paragraphs: [
          'Penipuan online sering memanfaatkan rasa panik atau ketergesaan. Tawaran yang terlalu bagus, permintaan mendesak, atau tautan mencurigakan adalah tanda peringatan.',
          'Jangan pernah membagikan kode verifikasi kepada siapa pun, bahkan jika mereka mengaku dari layanan resmi.',
        ],
        keyPoints: [
          'Waspadai tawaran terlalu bagus',
          'Jangan bagikan kode verifikasi',
          'Verifikasi sebelum bertindak',
        ],
      },
    ],
  },
  {
    id: 'belajar-efektif',
    categoryId: 'adaptive-learning',
    title: 'Strategi Belajar Efektif',
    category: 'Strategi Belajar Adaptif',
    description:
      'Teknik belajar yang terbukti membantu memahami materi lebih dalam dan bertahan lama.',
    level: 'Menengah',
    totalDuration: 35,
    glossary: [
      { term: 'ingatan jangka panjang', definition: 'Ingatan yang dapat menyimpan informasi dalam waktu lama.', example: 'Mengulang materi pada hari yang berbeda membantu mengingatnya lebih lama.' },
      { term: 'jeda', definition: 'Waktu istirahat singkat di antara kegiatan belajar.', example: 'Berhenti sejenak setelah satu blok belajar.' },
      { term: 'menguji diri', definition: 'Mencoba mengingat atau menjelaskan materi tanpa langsung melihat jawabannya.', example: 'Tutup catatan lalu jelaskan kembali ide utama.' },
      { term: 'blok waktu', definition: 'Rentang waktu yang ditetapkan untuk fokus pada satu kegiatan.', example: 'Belajar selama 25 menit lalu mengambil jeda.' },
      { term: 'konsentrasi', definition: 'Kemampuan memusatkan perhatian pada satu kegiatan.', example: 'Mematikan notifikasi dapat membantu menjaga konsentrasi.' },
    ],
    quiz: [
      {
        id: 'bel-quiz-1',
        question: 'Mengapa materi sebaiknya diulang dengan jeda?',
        options: ['Agar informasi lebih lama diingat', 'Agar tidak perlu memahami materi', 'Agar semua sesi berlangsung tanpa berhenti'],
        answer: 'Agar informasi lebih lama diingat',
        hint: 'Pikirkan manfaat mengulang informasi pada waktu yang berbeda.',
        explanation: 'Tepat. Pengulangan dengan jeda membantu informasi bertahan lebih lama.',
      },
      {
        id: 'bel-quiz-2',
        question: 'Bagaimana cara sederhana menguji pemahaman diri?',
        options: ['Menjelaskan materi tanpa melihat catatan', 'Membaca judul berulang kali', 'Membuka banyak tab sekaligus'],
        answer: 'Menjelaskan materi tanpa melihat catatan',
        hint: 'Coba ingat kembali dengan kata-katamu sendiri.',
        explanation: 'Benar. Mengingat dan menjelaskan tanpa catatan menunjukkan bagian yang sudah dipahami.',
      },
      {
        id: 'bel-quiz-3',
        question: 'Apa yang dapat membantu menjaga fokus saat belajar?',
        options: ['Blok waktu belajar dan jeda pendek', 'Membiarkan semua notifikasi terbuka', 'Mengerjakan banyak hal sekaligus'],
        answer: 'Blok waktu belajar dan jeda pendek',
        hint: 'Pilih cara yang memberi waktu khusus untuk satu kegiatan.',
        explanation: 'Tepat. Blok waktu dan jeda pendek membantu mengatur perhatian dan energi.',
      },
    ],
    accent: 'primary',
    icon: 'Brain',
    sections: [
      {
        id: 'bel-1',
        title: 'Belajar dengan Jeda',
        simpleSummary: 'Belajar sedikit demi sedikit dan ulangi pada waktu berbeda. Jeda membantu informasi bertahan lebih lama dalam ingatan.',
        duration: 12,
        paragraphs: [
          'Otak menyerap informasi lebih baik ketika belajar dilakukan secara bertahap dan diulang dalam beberapa sesi, bukan dalam satu waktu panjang.',
          'Cobalah mengulang materi setelah satu hari, lalu satu minggu, lalu satu bulan. Pola ini membantu memindahkan informasi ke ingatan jangka panjang.',
        ],
        keyPoints: [
          'Belajar bertahap lebih efektif',
          'Ulangi dengan jeda waktu',
          'Hindari belajar menumpuk',
        ],
      },
      {
        id: 'bel-2',
        title: 'Menguji Diri Sendiri',
        simpleSummary: 'Coba jawab pertanyaan atau jelaskan materi tanpa melihat catatan. Cara ini menunjukkan bagian yang masih perlu dipelajari.',
        duration: 11,
        paragraphs: [
          'Mencoba menjelaskan materi dengan kata sendiri atau menjawab pertanyaan tanpa melihat catatan memperkuat pemahaman.',
          'Metode ini menunjukkan bagian yang belum kamu kuasai, sehingga kamu tahu apa yang perlu dipelajari lebih lanjut.',
        ],
        keyPoints: [
          'Uji diri tanpa melihat catatan',
          'Jelaskan dengan kata sendiri',
          'Temukan celah pemahaman',
        ],
      },
      {
        id: 'bel-3',
        title: 'Mengatur Fokus',
        simpleSummary: 'Fokus dapat dilatih dengan belajar dalam blok waktu dan mengambil jeda pendek. Kurangi notifikasi agar perhatian tidak mudah teralihkan.',
        duration: 12,
        paragraphs: [
          'Fokus adalah keterampilan, bukan bakat. Bekerja dalam blok waktu yang jelas dengan jeda pendek membantu menjaga energi dan konsentrasi.',
          'Kurangi gangguan dengan menutup notifikasi dan menyiapkan ruang belajar yang tenang.',
        ],
        keyPoints: [
          'Fokus dapat dilatih',
          'Gunakan blok waktu dan jeda',
          'Kurangi sumber gangguan',
        ],
      },
    ],
  },
]

const additionalMaterials: Material[] = inclusiveThemeSeeds.map((theme) => ({
  id: theme.id,
  categoryId: theme.categoryId,
  title: theme.title,
  category: theme.category,
  description: theme.description,
  level: theme.level,
  totalDuration: theme.sections.length * 8,
  sections: theme.sections.map((section, index) => ({
    id: `${theme.id}-${index + 1}`,
    title: section.title,
    simpleSummary: section.summary,
    paragraphs: [section.summary, section.detail],
    keyPoints: section.keyPoints,
    duration: 8,
  })),
  glossary: [],
  quiz: [{ id: `${theme.id}-quiz`, ...theme.quiz }],
  accent: 'primary',
  icon: theme.icon,
}))

export const materials: Material[] = [...baseMaterials, ...additionalMaterials]

export const getMaterial = (id: string) => materials.find((m) => m.id === id)

export const allLessons = materials.flatMap((m) =>
  m.sections.map((s) => ({ ...s, materialId: m.id, materialTitle: m.title }))
)

export const totalLessons = allLessons.length
