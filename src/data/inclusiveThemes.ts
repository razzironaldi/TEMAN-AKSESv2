interface SubtopicSeed {
  title: string
  summary: string
  detail: string
  keyPoints: string[]
}

interface QuizSeed {
  question: string
  options: [string, string, string]
  answer: string
  hint: string
  explanation: string
}

interface InclusiveThemeSeed {
  id: string
  categoryId: string
  category: string
  title: string
  description: string
  level: string
  icon: string
  sections: [SubtopicSeed, SubtopicSeed, SubtopicSeed]
  quiz: QuizSeed
}

export const inclusiveThemeSeeds: InclusiveThemeSeed[] = [
  {
    id: 'udl-praktis',
    categoryId: 'inclusive-design',
    category: 'Desain Pembelajaran Inklusif',
    title: 'Desain Universal untuk Pembelajaran (UDL)',
    description: 'Kenali cara merancang tujuan, bahan, dan kegiatan belajar dengan pilihan yang fleksibel sejak awal.',
    level: 'Pemula',
    icon: 'UsersThree',
    sections: [
      {
        title: 'Mulai dari tujuan dan hambatan',
        summary: 'Tetapkan tujuan belajar yang penting, lalu cari bagian kegiatan yang mungkin menghalangi sebagian pelajar untuk berpartisipasi.',
        detail: 'Hambatan bisa muncul dari instruksi yang kurang jelas, bahan yang hanya tersedia dalam satu format, atau cara menjawab yang terlalu terbatas. Periksa rancangan kegiatan, bukan memberi label pada kemampuan seseorang.',
        keyPoints: ['Tujuan belajar tetap jelas', 'Hambatan dapat berasal dari rancangan', 'Tanyakan pengalaman pelajar'],
      },
      {
        title: 'Sajikan informasi dengan beberapa cara',
        summary: 'Gabungkan teks yang terstruktur dengan contoh, gambar berlabel, demonstrasi, atau audio yang memiliki alternatif setara.',
        detail: 'Pilihan format membantu lebih banyak orang mengakses ide yang sama. Pastikan informasi penting tidak hanya disampaikan melalui warna, suara, atau gambar tanpa penjelasan teks.',
        keyPoints: ['Gunakan struktur dan bahasa yang jelas', 'Sediakan alternatif untuk media', 'Jaga makna tetap setara antarformat'],
      },
      {
        title: 'Beri pilihan untuk berpartisipasi',
        summary: 'Izinkan pelajar menunjukkan pemahaman melalui cara yang sesuai dengan tujuan, misalnya tulisan, presentasi, atau demonstrasi.',
        detail: 'Pilihan bukan berarti menurunkan tujuan. Tentukan kriteria pemahaman yang sama, lalu beri lebih dari satu jalur untuk mencapai atau memperlihatkannya.',
        keyPoints: ['Kriteria belajar tetap konsisten', 'Pilihan cara dapat meningkatkan partisipasi', 'Minta masukan sebelum menetapkan pilihan'],
      },
    ],
    quiz: {
      question: 'Apa langkah awal saat merancang kegiatan belajar yang lebih inklusif?',
      options: ['Memperjelas tujuan dan memeriksa hambatan', 'Meminta semua pelajar memakai cara yang sama', 'Menghapus tantangan dari semua tugas'],
      answer: 'Memperjelas tujuan dan memeriksa hambatan',
      hint: 'Mulailah dengan memahami apa yang harus dipelajari dan apa yang menghalangi akses.',
      explanation: 'Tepat. Tujuan yang jelas membantu kita memilih beberapa cara yang tetap mengarah pada hasil belajar yang sama.',
    },
  },
  {
    id: 'asesmen-inklusif',
    categoryId: 'inclusive-design',
    category: 'Desain Pembelajaran Inklusif',
    title: 'Asesmen yang Adil dan Beragam',
    description: 'Rancang pemeriksaan pemahaman yang mengukur tujuan belajar, bukan hambatan format yang tidak relevan.',
    level: 'Pemula',
    icon: 'ClipboardText',
    sections: [
      {
        title: 'Selaraskan soal dengan tujuan',
        summary: 'Pastikan tugas benar-benar mengukur kemampuan yang ingin diketahui, bukan keterampilan tambahan yang tidak menjadi tujuan.',
        detail: 'Jika tujuannya memahami konsep, format jawaban yang kaku dapat menambah hambatan yang tidak perlu. Sebaliknya, jika tujuan memang menulis, kualitas tulisan tetap menjadi bagian penilaian.',
        keyPoints: ['Tuliskan tujuan asesmen', 'Pisahkan kompetensi inti dan format', 'Jelaskan kriteria sejak awal'],
      },
      {
        title: 'Berikan format dan waktu yang aksesibel',
        summary: 'Sampaikan instruksi dalam struktur yang mudah dipindai dan pertimbangkan format atau waktu yang sesuai dengan tujuan.',
        detail: 'Pilihan dapat mencakup dokumen digital yang terstruktur, instruksi tertulis, atau jeda yang disepakati. Penyesuaian sebaiknya dibicarakan bersama, bukan ditebak dari penampilan seseorang.',
        keyPoints: ['Instruksi jelas dan berurutan', 'Format dapat dibaca dengan alat bantu', 'Penyesuaian dibicarakan dengan pelajar'],
      },
      {
        title: 'Gunakan umpan balik untuk langkah berikutnya',
        summary: 'Jelaskan bagian yang sudah dikuasai dan langkah konkret yang dapat dicoba selanjutnya.',
        detail: 'Umpan balik yang spesifik membantu belajar lebih baik daripada label umum. Berikan waktu untuk bertanya, memperbaiki, atau menunjukkan pemahaman kembali jika sesuai dengan kegiatan.',
        keyPoints: ['Sebutkan bukti yang terlihat', 'Pilih satu langkah perbaikan yang jelas', 'Beri kesempatan untuk menanggapi'],
      },
    ],
    quiz: {
      question: 'Apa yang sebaiknya diukur oleh asesmen?',
      options: ['Tujuan belajar yang sudah dijelaskan', 'Kecepatan semua pelajar dengan cara yang sama', 'Kepatuhan pada format yang tidak berkaitan'],
      answer: 'Tujuan belajar yang sudah dijelaskan',
      hint: 'Pikirkan kompetensi yang memang sedang diperiksa.',
      explanation: 'Benar. Format asesmen perlu mendukung pengukuran tujuan, bukan menambahkan hambatan yang tidak relevan.',
    },
  },
  {
    id: 'konten-digital-aksesibel',
    categoryId: 'digital-accessibility',
    category: 'Aksesibilitas Digital',
    title: 'Membuat Konten Digital Aksesibel',
    description: 'Pelajari struktur, teks alternatif, dan media yang membantu lebih banyak orang mengakses konten.',
    level: 'Pemula',
    icon: 'Globe',
    sections: [
      {
        title: 'Susun struktur dokumen yang bermakna',
        summary: 'Gunakan judul berurutan, paragraf singkat, daftar, dan tautan yang menjelaskan tujuannya.',
        detail: 'Struktur semantik membantu pembaca memindai isi dan mendukung teknologi bantu menavigasi dokumen. Hindari membuat teks tampak seperti judul hanya dengan memperbesar atau menebalkannya.',
        keyPoints: ['Pakai tingkat heading secara berurutan', 'Beri nama tautan yang deskriptif', 'Jangan mengandalkan tampilan visual saja'],
      },
      {
        title: 'Tulis teks alternatif yang berguna',
        summary: 'Jelaskan informasi penting dari gambar secara ringkas; gambar dekoratif tidak perlu mengulang isi di sekitarnya.',
        detail: 'Teks alternatif bergantung pada tujuan gambar dalam konteks. Untuk grafik, sampaikan pola atau kesimpulan utama dan berikan data rinci dalam teks yang dapat diakses.',
        keyPoints: ['Pahami fungsi gambar di halaman', 'Hindari awalan yang berulang', 'Sediakan uraian data penting'],
      },
      {
        title: 'Sediakan alternatif untuk audio dan video',
        summary: 'Tambahkan takarir untuk ujaran dalam video dan transkrip atau ringkasan teks untuk konten audio.',
        detail: 'Takarir yang baik mencakup informasi ujaran dan suara penting. Periksa sinkronisasi, ketepatan nama, dan keterbacaan; jangan jadikan warna sebagai satu-satunya pembeda pembicara.',
        keyPoints: ['Takarir perlu akurat dan sinkron', 'Transkrip memberi jalur baca', 'Informasi visual penting dijelaskan'],
      },
    ],
    quiz: {
      question: 'Mengapa struktur heading yang berurutan membantu aksesibilitas?',
      options: ['Membantu pembaca dan teknologi bantu menavigasi isi', 'Membuat semua teks otomatis lebih besar', 'Menggantikan kebutuhan menulis judul'],
      answer: 'Membantu pembaca dan teknologi bantu menavigasi isi',
      hint: 'Pikirkan cara menemukan bagian tertentu dalam dokumen.',
      explanation: 'Betul. Heading yang semantik membentuk peta dokumen yang dapat dipindai dan dinavigasi.',
    },
  },
  {
    id: 'teknologi-bantu',
    categoryId: 'assistive-support',
    category: 'Teknologi Bantu dan Akomodasi',
    title: 'Mengenal Teknologi Bantu',
    description: 'Kenali contoh teknologi bantu dan cara memastikan alat tersebut cocok dengan pilihan penggunanya.',
    level: 'Pemula',
    icon: 'DesktopTower',
    sections: [
      {
        title: 'Apa fungsi teknologi bantu?',
        summary: 'Teknologi bantu dapat mendukung seseorang mengakses informasi, berkomunikasi, atau berinteraksi dengan perangkat.',
        detail: 'Contohnya dapat berupa pembaca layar, pembesaran, input suara, sakelar, atau alat komunikasi. Kebutuhan dan pilihan setiap orang berbeda, jadi jangan mengasumsikan satu alat cocok untuk semua.',
        keyPoints: ['Alat mendukung aktivitas tertentu', 'Pilihan pengguna menjadi acuan', 'Teknologi bukan pengganti aksesibilitas'],
      },
      {
        title: 'Pahami pembaca layar dan navigasi',
        summary: 'Pembaca layar menyampaikan informasi antarmuka sebagai suara atau braille dan dapat menavigasi struktur halaman.',
        detail: 'Judul, label tombol, nama tautan, dan urutan fokus yang jelas membuat interaksi lebih mudah dipahami. Pembaca layar bekerja lebih baik ketika konten dibuat dengan struktur semantik.',
        keyPoints: ['Struktur halaman perlu bermakna', 'Kontrol harus memiliki nama jelas', 'Urutan fokus harus dapat diprediksi'],
      },
      {
        title: 'Dukung berbagai cara input',
        summary: 'Pastikan tugas digital dapat dilakukan lewat keyboard dan pertimbangkan input suara atau perangkat alternatif.',
        detail: 'Uji apakah semua kontrol dapat dijangkau tanpa mouse, fokus terlihat jelas, dan tidak ada batas waktu yang tidak perlu. Tanyakan alat apa yang biasa digunakan pelajar.',
        keyPoints: ['Sediakan jalur keyboard', 'Tampilkan fokus aktif', 'Tanyakan preferensi alat bantu'],
      },
    ],
    quiz: {
      question: 'Apa prinsip yang tepat saat memilih teknologi bantu?',
      options: ['Sesuaikan dengan pilihan dan aktivitas penggunanya', 'Pilih satu alat yang sama untuk semua orang', 'Anggap alat bantu menghapus semua hambatan'],
      answer: 'Sesuaikan dengan pilihan dan aktivitas penggunanya',
      hint: 'Teknologi bantu seharusnya mendukung tujuan orang yang menggunakannya.',
      explanation: 'Tepat. Kecocokan alat perlu dinilai bersama pengguna dan konteks aktivitasnya.',
    },
  },
  {
    id: 'akomodasi-belajar',
    categoryId: 'assistive-support',
    category: 'Teknologi Bantu dan Akomodasi',
    title: 'Akomodasi Belajar Sehari-hari',
    description: 'Pahami penyesuaian praktis yang membantu akses dan partisipasi tanpa mengubah tujuan belajar.',
    level: 'Pemula',
    icon: 'HandHeart',
    sections: [
      {
        title: 'Bedakan tujuan dan cara mengaksesnya',
        summary: 'Akomodasi mengubah kondisi atau cara mengakses kegiatan agar pelajar dapat menunjukkan tujuan belajar yang sama.',
        detail: 'Contohnya dapat berupa materi lebih awal, instruksi tertulis, pilihan tempat, atau waktu jeda. Kebutuhan harus dibicarakan secara pribadi dan mengikuti aturan lembaga yang berlaku.',
        keyPoints: ['Tujuan belajar tetap transparan', 'Penyesuaian mengurangi hambatan', 'Jaga privasi saat berdiskusi'],
      },
      {
        title: 'Tawarkan pilihan yang wajar',
        summary: 'Sediakan alternatif yang menjaga tujuan, seperti membaca instruksi sendiri atau mendengarkannya dalam format audio.',
        detail: 'Pilihan yang sederhana sering dapat disiapkan sejak awal untuk seluruh kelas. Jika penyesuaian khusus diperlukan, libatkan pelajar dan pihak pendukung yang relevan dengan persetujuan mereka.',
        keyPoints: ['Berikan beberapa pilihan yang jelas', 'Pastikan semua pilihan setara', 'Jangan meminta diagnosis di ruang publik'],
      },
      {
        title: 'Tinjau apakah penyesuaian membantu',
        summary: 'Tanyakan apakah penyesuaian membuat kegiatan lebih dapat diakses dan apakah ada hambatan lain yang masih tersisa.',
        detail: 'Penyesuaian dapat berubah seiring tugas dan situasi. Evaluasi bersama pelajar dengan pertanyaan terbuka, bukan menilai kebutuhan dari asumsi atau satu pengalaman saja.',
        keyPoints: ['Minta umpan balik langsung', 'Catat hambatan yang masih muncul', 'Ubah pendekatan bersama'],
      },
    ],
    quiz: {
      question: 'Akomodasi belajar yang baik berfokus pada apa?',
      options: ['Mengurangi hambatan akses sambil menjaga tujuan', 'Memberi keistimewaan tanpa alasan belajar', 'Membuka informasi pribadi pelajar'],
      answer: 'Mengurangi hambatan akses sambil menjaga tujuan',
      hint: 'Pikirkan hubungan antara tujuan dan cara untuk mencapainya.',
      explanation: 'Benar. Akomodasi mendukung akses dan partisipasi tanpa otomatis mengubah tujuan belajar.',
    },
  },
  {
    id: 'bahasa-jelas',
    categoryId: 'inclusive-communication',
    category: 'Komunikasi Inklusif',
    title: 'Bahasa Jelas dan Mudah Dipahami',
    description: 'Susun instruksi dan materi dengan bahasa langsung, struktur yang konsisten, dan contoh yang membantu.',
    level: 'Pemula',
    icon: 'TextAa',
    sections: [
      {
        title: 'Sampaikan satu gagasan dalam satu langkah',
        summary: 'Gunakan kalimat langsung dan pecah instruksi panjang menjadi beberapa langkah yang dapat diikuti.',
        detail: 'Letakkan kata kerja utama di depan, hindari istilah yang tidak dijelaskan, dan gunakan urutan yang konsisten. Bahasa jelas tetap dapat menyampaikan gagasan kompleks dengan tepat.',
        keyPoints: ['Pilih kata yang umum bila maknanya sama', 'Pecah langkah yang panjang', 'Pertahankan ketepatan makna'],
      },
      {
        title: 'Jelaskan istilah dengan contoh',
        summary: 'Kenalkan istilah baru dengan definisi singkat dan contoh yang dekat dengan topik pelajaran.',
        detail: 'Contoh membantu menghubungkan istilah dan penggunaannya. Hindari contoh yang memperkuat stereotip; pilih situasi yang beragam dan menghormati pengalaman orang.',
        keyPoints: ['Tandai istilah baru', 'Berikan definisi ringkas', 'Pilih contoh yang relevan dan menghormati'],
      },
      {
        title: 'Periksa keterbacaan bersama pembaca',
        summary: 'Minta pembaca mencoba mengikuti instruksi dan menunjukkan bagian yang membingungkan.',
        detail: 'Membaca ulang saja tidak selalu menemukan hambatan. Uji bahan dengan orang yang akan menggunakannya, beri waktu, dan revisi berdasarkan hal yang mereka alami.',
        keyPoints: ['Uji instruksi dengan pengguna', 'Amati bagian yang perlu diulang', 'Perbaiki berdasarkan umpan balik'],
      },
    ],
    quiz: {
      question: 'Apa yang membuat instruksi lebih mudah diikuti?',
      options: ['Langkah langsung dengan urutan yang jelas', 'Kalimat panjang berisi banyak tugas sekaligus', 'Istilah teknis tanpa definisi'],
      answer: 'Langkah langsung dengan urutan yang jelas',
      hint: 'Bayangkan seseorang sedang melakukan tugas sambil membaca instruksi.',
      explanation: 'Betul. Langkah yang terurut dan langsung mengurangi beban menafsirkan instruksi.',
    },
  },
  {
    id: 'komunikasi-beragam',
    categoryId: 'inclusive-communication',
    category: 'Komunikasi Inklusif',
    title: 'Menghormati Beragam Cara Berkomunikasi',
    description: 'Pelajari praktik komunikasi yang memberi waktu, pilihan, dan kendali kepada setiap orang.',
    level: 'Pemula',
    icon: 'ChatsCircle',
    sections: [
      {
        title: 'Dengarkan dan beri waktu merespons',
        summary: 'Gunakan pertanyaan yang jelas, beri jeda untuk menjawab, dan hindari menyelesaikan kalimat orang lain tanpa izin.',
        detail: 'Sebagian orang berkomunikasi dengan tempo atau cara yang berbeda. Tanyakan apakah mereka menginginkan pertanyaan diulang, ditulis, atau dijelaskan dengan cara lain.',
        keyPoints: ['Jangan terburu-buru mengisi jeda', 'Tanyakan cara komunikasi yang disukai', 'Bicara langsung kepada orang tersebut'],
      },
      {
        title: 'Hormati alat komunikasi alternatif',
        summary: 'Tulisan, papan komunikasi, perangkat, gerak tubuh, atau bantuan lain dapat menjadi cara seseorang menyampaikan pesan.',
        detail: 'Jangan menganggap seseorang tidak memahami karena ia menggunakan cara komunikasi yang berbeda. Beri waktu untuk menyusun pesan dan pastikan lawan bicara memiliki akses ke alatnya.',
        keyPoints: ['Beri waktu untuk menyampaikan pesan', 'Jangan mengambil alih alat komunikasi', 'Konfirmasi pemahaman dengan sopan'],
      },
      {
        title: 'Pelajari bahasa isyarat dengan hormat',
        summary: 'Bahasa isyarat adalah bahasa yang digunakan komunitas; pelajari BISINDO dari pengajar dan komunitas Tuli yang kompeten.',
        detail: 'Bahasa isyarat memiliki tata bahasa dan variasi. Materi pengantar tidak menggantikan belajar langsung dari pengguna atau pengajar yang kompeten; jangan mengarang atau menebak bentuk isyarat.',
        keyPoints: ['Rujuk pengajar dan komunitas Tuli', 'Hormati variasi bahasa dan pengguna', 'Jangan menyajikan tebakan sebagai materi'],
      },
    ],
    quiz: {
      question: 'Bagaimana cara mendukung percakapan yang inklusif?',
      options: ['Tanyakan cara komunikasi yang nyaman dan beri waktu', 'Anggap semua orang berkomunikasi dengan cara sama', 'Ambil alih alat komunikasi agar percakapan cepat'],
      answer: 'Tanyakan cara komunikasi yang nyaman dan beri waktu',
      hint: 'Utamakan pilihan dan kendali orang yang sedang berkomunikasi.',
      explanation: 'Tepat. Cara yang disukai sebaiknya ditanyakan, bukan diasumsikan.',
    },
  },
  {
    id: 'fokus-energi-belajar',
    categoryId: 'adaptive-learning',
    category: 'Strategi Belajar Adaptif',
    title: 'Mengatur Fokus dan Energi Belajar',
    description: 'Coba strategi yang dapat disesuaikan untuk memulai tugas, menjaga perhatian, dan beristirahat.',
    level: 'Pemula',
    icon: 'Timer',
    sections: [
      {
        title: 'Pecah tugas menjadi langkah kecil',
        summary: 'Ubah tugas besar menjadi langkah pertama yang jelas dan cukup kecil untuk dimulai.',
        detail: 'Contohnya, buka materi, baca satu bagian, lalu catat satu pertanyaan. Ukuran langkah dapat disesuaikan; strategi ini adalah pilihan, bukan aturan yang harus cocok untuk semua orang.',
        keyPoints: ['Tentukan aksi pertama', 'Buat langkah terukur', 'Sesuaikan ukuran tugas'],
      },
      {
        title: 'Atur jeda sesuai kebutuhan',
        summary: 'Coba blok waktu dan jeda singkat, lalu amati ritme yang terasa membantu untuk kegiatanmu.',
        detail: 'Tidak ada durasi jeda yang cocok untuk semua situasi. Gunakan pengingat bila membantu, dan ubah pola jika membuat belajar terasa lebih berat.',
        keyPoints: ['Jeda dapat direncanakan', 'Pola waktu boleh berbeda', 'Periksa apakah strategi benar-benar membantu'],
      },
      {
        title: 'Kurangi gangguan yang dapat dikendalikan',
        summary: 'Pilih satu gangguan yang dapat dikurangi, misalnya mematikan notifikasi yang tidak diperlukan selama belajar.',
        detail: 'Lingkungan tenang tidak selalu tersedia atau nyaman untuk semua orang. Pilihan lain dapat berupa tempat duduk berbeda, instruksi tertulis, atau penggunaan pelindung suara jika aman dan sesuai.',
        keyPoints: ['Ubah satu hal terlebih dahulu', 'Sediakan alternatif yang realistis', 'Jangan menganggap satu lingkungan cocok untuk semua'],
      },
    ],
    quiz: {
      question: 'Apa cara yang dapat membantu memulai tugas besar?',
      options: ['Menentukan satu langkah pertama yang kecil', 'Menunggu sampai seluruh tugas terasa mudah', 'Mengerjakan banyak bagian sekaligus'],
      answer: 'Menentukan satu langkah pertama yang kecil',
      hint: 'Pilih tindakan awal yang jelas dan dapat dilakukan sekarang.',
      explanation: 'Benar. Langkah kecil dapat membuat titik awal lebih jelas; ukurannya tetap bisa disesuaikan.',
    },
  },
  {
    id: 'belajar-mandiri',
    categoryId: 'adaptive-learning',
    category: 'Strategi Belajar Adaptif',
    title: 'Merencanakan dan Meninjau Belajar',
    description: 'Gunakan tujuan sederhana, pemeriksaan pemahaman, dan refleksi untuk memilih langkah belajar berikutnya.',
    level: 'Pemula',
    icon: 'CompassTool',
    sections: [
      {
        title: 'Pilih tujuan yang spesifik',
        summary: 'Tentukan apa yang ingin dipahami atau dilakukan setelah sesi belajar selesai.',
        detail: 'Tujuan seperti “memahami CSS” masih luas. Tujuan dapat dibuat lebih jelas, misalnya menjelaskan fungsi CSS dan memberi satu contoh penggunaannya.',
        keyPoints: ['Gunakan tindakan yang dapat diamati', 'Pilih tujuan sesuai waktu', 'Mulai dari prioritas utama'],
      },
      {
        title: 'Periksa pemahaman dengan cara aktif',
        summary: 'Coba menjelaskan kembali, menjawab pertanyaan, atau membuat contoh tanpa langsung melihat catatan.',
        detail: 'Jika jawaban terasa sulit, lihat kembali bagian yang dibutuhkan dan coba lagi. Pemeriksaan ini membantu menemukan topik yang perlu diulang, bukan memberi label pada kemampuan diri.',
        keyPoints: ['Coba mengingat sebelum membaca ulang', 'Periksa bagian yang belum jelas', 'Gunakan kesalahan sebagai petunjuk belajar'],
      },
      {
        title: 'Tinjau dan ubah rencana',
        summary: 'Setelah belajar, catat apa yang membantu, apa yang menghambat, dan satu perubahan untuk sesi berikutnya.',
        detail: 'Rencana adalah alat yang boleh disesuaikan. Jika strategi tidak cocok, pilih cara lain dan pertimbangkan meminta dukungan dari orang yang dipercaya.',
        keyPoints: ['Catat strategi yang terasa membantu', 'Ubah satu hal yang menghambat', 'Minta dukungan saat diperlukan'],
      },
    ],
    quiz: {
      question: 'Apa tujuan meninjau strategi belajar setelah sesi?',
      options: ['Menentukan langkah berikutnya berdasarkan pengalaman', 'Membuktikan bahwa satu strategi wajib untuk semua', 'Menghindari perubahan rencana'],
      answer: 'Menentukan langkah berikutnya berdasarkan pengalaman',
      hint: 'Refleksi membantu memilih tindakan yang berguna pada sesi berikutnya.',
      explanation: 'Tepat. Rencana belajar dapat disesuaikan berdasarkan apa yang dialami pelajar.',
    },
  },
  {
    id: 'privasi-dan-jejak-digital',
    categoryId: 'digital-literacy',
    category: 'Literasi Digital dan Keamanan',
    title: 'Privasi, Jejak Digital, dan Interaksi Aman',
    description: 'Kenali pilihan privasi, jejak digital, dan langkah saat menghadapi interaksi online yang tidak nyaman.',
    level: 'Pemula',
    icon: 'ShieldCheck',
    sections: [
      {
        title: 'Pahami informasi yang dibagikan',
        summary: 'Sebelum mengunggah, periksa apakah sebuah kiriman mengandung lokasi, identitas, atau informasi pribadi.',
        detail: 'Pengaturan privasi dapat membatasi siapa yang melihat konten, tetapi tidak menjamin konten tidak disalin. Hindari membagikan data sensitif dan minta izin sebelum mengunggah informasi orang lain.',
        keyPoints: ['Periksa audiens sebelum membagikan', 'Minta izin untuk informasi orang lain', 'Gunakan kata sandi dan kode verifikasi secara rahasia'],
      },
      {
        title: 'Kenali jejak digital',
        summary: 'Komentar, gambar, dan profil dapat tersimpan atau dibagikan ulang setelah dipublikasikan.',
        detail: 'Jejak digital tidak selalu mudah dihapus sepenuhnya. Berhenti sejenak sebelum mengirim, periksa sumber, dan gunakan pengaturan pelaporan atau bantuan platform saat diperlukan.',
        keyPoints: ['Pikirkan dampak sebelum mengirim', 'Periksa kebenaran informasi', 'Ketahui cara melaporkan konten'],
      },
      {
        title: 'Cari bantuan untuk interaksi tidak aman',
        summary: 'Jika menerima ancaman atau tekanan, simpan bukti dengan aman, hentikan interaksi bila memungkinkan, dan hubungi orang tepercaya.',
        detail: 'Jangan menyalahkan orang yang menjadi sasaran. Gunakan fitur blokir atau lapor, dan ikuti prosedur perlindungan yang berlaku di sekolah atau layanan terkait.',
        keyPoints: ['Utamakan keselamatan', 'Hubungi orang dewasa tepercaya', 'Gunakan kanal laporan yang tersedia'],
      },
    ],
    quiz: {
      question: 'Apa langkah yang bijak sebelum membagikan informasi pribadi?',
      options: ['Periksa jenis informasi dan siapa yang dapat melihatnya', 'Anggap semua unggahan langsung hilang', 'Bagikan kode verifikasi kepada orang yang meminta'],
      answer: 'Periksa jenis informasi dan siapa yang dapat melihatnya',
      hint: 'Pertimbangkan isi kiriman dan jangkauan audiensnya.',
      explanation: 'Benar. Memeriksa informasi dan audiens membantu membuat keputusan berbagi yang lebih aman.',
    },
  },
  {
    id: 'kelas-ramah-semua',
    categoryId: 'safe-community',
    category: 'Relasi dan Lingkungan Belajar Aman',
    title: 'Membangun Lingkungan Belajar yang Ramah',
    description: 'Bangun kesepakatan kelas, rasa memiliki, dan respons yang jelas terhadap perilaku yang merendahkan.',
    level: 'Pemula',
    icon: 'HouseLine',
    sections: [
      {
        title: 'Buat kesepakatan yang menghormati semua',
        summary: 'Susun aturan bersama tentang bergiliran, penggunaan bahasa, privasi, dan cara menyampaikan keberatan.',
        detail: 'Kesepakatan lebih bermakna bila dijelaskan dengan bahasa yang dapat dipahami dan diterapkan secara konsisten. Beri ruang untuk meninjau aturan bersama anggota kelas.',
        keyPoints: ['Libatkan anggota kelas', 'Nyatakan perilaku yang diharapkan', 'Tinjau penerapan secara konsisten'],
      },
      {
        title: 'Ciptakan rasa memiliki',
        summary: 'Pastikan nama, contoh, bahan, dan kegiatan tidak menggambarkan satu kelompok sebagai standar untuk semua.',
        detail: 'Representasi yang beragam dapat membantu orang merasa diakui. Hindari meminta satu orang berbicara mewakili seluruh kelompok atau menceritakan pengalaman pribadi.',
        keyPoints: ['Gunakan contoh yang beragam', 'Jangan menunjuk seseorang sebagai wakil kelompok', 'Berikan pilihan untuk berbagi'],
      },
      {
        title: 'Tanggapi perilaku yang merendahkan',
        summary: 'Hentikan perilaku yang tidak aman dengan jelas, dukung orang yang terdampak, dan ikuti prosedur bantuan yang tersedia.',
        detail: 'Respons perlu menjaga keselamatan dan tidak membebankan penyelesaian pada orang yang menjadi sasaran. Dokumentasikan kejadian sesuai aturan dan libatkan pihak yang bertanggung jawab.',
        keyPoints: ['Dahulukan keselamatan', 'Dengarkan orang yang terdampak', 'Ikuti prosedur perlindungan'],
      },
    ],
    quiz: {
      question: 'Apa yang membantu kesepakatan kelas terasa adil?',
      options: ['Melibatkan kelas dan menerapkannya konsisten', 'Membuat aturan tersembunyi', 'Meminta satu pelajar mewakili semua kelompok'],
      answer: 'Melibatkan kelas dan menerapkannya konsisten',
      hint: 'Pikirkan bagaimana aturan dibuat dan diterapkan.',
      explanation: 'Tepat. Keterlibatan dan penerapan konsisten membantu membangun lingkungan yang dapat diprediksi.',
    },
  },
  {
    id: 'dukungan-teman-sebaya',
    categoryId: 'safe-community',
    category: 'Relasi dan Lingkungan Belajar Aman',
    title: 'Dukungan Teman Sebaya yang Menghormati',
    description: 'Belajar menawarkan bantuan, bekerja sama, dan menjaga batas pribadi dalam kegiatan kelompok.',
    level: 'Pemula',
    icon: 'Handshake',
    sections: [
      {
        title: 'Tawarkan bantuan, jangan berasumsi',
        summary: 'Tanyakan apakah bantuan dibutuhkan dan dengarkan jawaban sebelum melakukan sesuatu.',
        detail: 'Bantuan yang tidak diminta dapat mengurangi kendali seseorang. Jika tawaran ditolak, hormati jawaban tersebut dan beri ruang untuk meminta bantuan nanti.',
        keyPoints: ['Tawarkan dengan sopan', 'Tunggu persetujuan', 'Hormati jawaban dan batas pribadi'],
      },
      {
        title: 'Bagi peran dalam kerja kelompok',
        summary: 'Bicarakan peran berdasarkan minat, tujuan tugas, dan pilihan anggota, bukan berdasarkan asumsi.',
        detail: 'Berikan beberapa cara untuk berkontribusi dan pastikan semua anggota dapat mengakses bahan serta komunikasi kelompok.',
        keyPoints: ['Sepakati peran bersama', 'Bagikan informasi dalam format yang dapat diakses', 'Periksa kesempatan kontribusi'],
      },
      {
        title: 'Jaga privasi saat memberi dukungan',
        summary: 'Jangan membagikan informasi pribadi atau kebutuhan seseorang kepada kelompok tanpa izin.',
        detail: 'Jika ada masalah keselamatan, hubungi orang dewasa atau pihak yang bertanggung jawab sesuai prosedur. Hindari menyebarkan cerita atau foto untuk “membantu” tanpa persetujuan.',
        keyPoints: ['Minta izin sebelum berbagi', 'Batasi informasi pada pihak yang perlu tahu', 'Ikuti jalur bantuan untuk isu keselamatan'],
      },
    ],
    quiz: {
      question: 'Bagaimana sebaiknya menawarkan bantuan kepada teman?',
      options: ['Tanyakan dahulu dan hormati jawabannya', 'Langsung mengambil alih tugasnya', 'Ceritakan kebutuhannya ke seluruh kelas'],
      answer: 'Tanyakan dahulu dan hormati jawabannya',
      hint: 'Dukungan yang baik tetap memberi kendali kepada orang yang dibantu.',
      explanation: 'Benar. Menawarkan dan menunggu persetujuan menjaga pilihan dan batas pribadi.',
    },
  },
  {
    id: 'advokasi-diri',
    categoryId: 'agency-participation',
    category: 'Kemandirian dan Partisipasi',
    title: 'Mengenali Kebutuhan dan Meminta Dukungan',
    description: 'Latih cara menyampaikan preferensi, meminta penyesuaian, dan memilih siapa yang perlu dilibatkan.',
    level: 'Pemula',
    icon: 'MegaphoneSimple',
    sections: [
      {
        title: 'Kenali hal yang membantu',
        summary: 'Amati kondisi, format, atau strategi yang membuat kegiatan lebih mudah diakses dan dipahami.',
        detail: 'Catatan sederhana tentang hal yang membantu dapat dipakai untuk memulai percakapan. Tidak perlu memberi label atau menjelaskan hal pribadi yang tidak ingin dibagikan.',
        keyPoints: ['Catat pilihan yang terasa membantu', 'Perhatikan situasi yang menjadi hambatan', 'Kamu berhak menjaga privasi'],
      },
      {
        title: 'Sampaikan permintaan dengan jelas',
        summary: 'Jelaskan kegiatan, hambatan, dan perubahan spesifik yang mungkin membantu, jika kamu merasa nyaman.',
        detail: 'Contoh kalimat: “Saya lebih mudah mengikuti instruksi jika langkahnya ditulis.” Permintaan dapat dibicarakan dengan guru atau orang tepercaya sesuai prosedur setempat.',
        keyPoints: ['Sebutkan situasi yang dimaksud', 'Ajukan perubahan yang spesifik', 'Minta bantuan menyampaikan bila dibutuhkan'],
      },
      {
        title: 'Tentukan siapa yang dilibatkan',
        summary: 'Pilih orang tepercaya dan ruang percakapan yang sesuai untuk membahas kebutuhan belajar.',
        detail: 'Untuk pelajar anak, dukungan dapat melibatkan keluarga, guru, atau staf yang bertanggung jawab. Informasi pribadi sebaiknya dibagikan seperlunya dan mengikuti kebijakan perlindungan.',
        keyPoints: ['Pilih pendamping yang dipercaya', 'Tanyakan bagaimana informasi digunakan', 'Cari bantuan segera untuk risiko keselamatan'],
      },
    ],
    quiz: {
      question: 'Apa contoh permintaan dukungan yang jelas?',
      options: ['Meminta instruksi tertulis karena itu membantu mengikuti langkah', 'Membagikan semua informasi pribadi ke publik', 'Menganggap orang lain harus menebak kebutuhan'],
      answer: 'Meminta instruksi tertulis karena itu membantu mengikuti langkah',
      hint: 'Permintaan yang spesifik menyebutkan situasi dan hal yang dapat membantu.',
      explanation: 'Tepat. Menyampaikan pilihan secara jelas dapat membantu orang lain memahami dukungan yang diminta.',
    },
  },
  {
    id: 'partisipasi-pelajar',
    categoryId: 'agency-participation',
    category: 'Kemandirian dan Partisipasi',
    title: 'Memberi Ruang untuk Suara Pelajar',
    description: 'Libatkan pelajar dalam pilihan kegiatan, bahan, dan cara menunjukkan pemahaman.',
    level: 'Pemula',
    icon: 'ChatsTeardrop',
    sections: [
      {
        title: 'Tawarkan pilihan yang bermakna',
        summary: 'Berikan pilihan yang benar-benar dapat digunakan, seperti memilih topik contoh atau format respons.',
        detail: 'Pilihan sebaiknya memiliki kriteria dan hasil belajar yang jelas. Batasi jumlah opsi bila terlalu banyak pilihan justru membingungkan.',
        keyPoints: ['Pilihan tetap terkait tujuan', 'Jelaskan perbedaan antar opsi', 'Sediakan cara meminta bantuan'],
      },
      {
        title: 'Dengarkan masukan dengan aman',
        summary: 'Sediakan beberapa cara untuk memberi masukan, seperti percakapan, tulisan, atau formulir yang dapat diakses.',
        detail: 'Jelaskan siapa yang akan membaca masukan dan bagaimana tindak lanjutnya. Jangan meminta seseorang membuka pengalaman pribadi di depan kelompok.',
        keyPoints: ['Sediakan jalur masukan yang beragam', 'Jelaskan privasi dan tindak lanjut', 'Berikan pilihan untuk tidak berbagi'],
      },
      {
        title: 'Tunjukkan bahwa masukan ditindaklanjuti',
        summary: 'Sampaikan perubahan yang dibuat atau alasan ketika sebuah usulan belum dapat diterapkan.',
        detail: 'Tindak lanjut membangun kepercayaan dan menunjukkan bahwa suara pelajar diperhitungkan. Tinjau kembali dampaknya setelah perubahan dilakukan.',
        keyPoints: ['Jelaskan keputusan dengan terbuka', 'Sebutkan perubahan yang dilakukan', 'Tinjau hasil bersama pelajar'],
      },
    ],
    quiz: {
      question: 'Apa yang membuat partisipasi pelajar bermakna?',
      options: ['Masukan didengar dan ditindaklanjuti dengan jelas', 'Pelajar diminta berbagi hal pribadi di depan kelas', 'Pilihan diberikan tanpa tujuan yang diketahui'],
      answer: 'Masukan didengar dan ditindaklanjuti dengan jelas',
      hint: 'Partisipasi bukan hanya mengumpulkan pendapat; pertimbangkan apa yang terjadi sesudahnya.',
      explanation: 'Benar. Tindak lanjut yang jelas memperlihatkan bagaimana suara pelajar dipertimbangkan.',
    },
  },
]