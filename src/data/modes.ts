import type { LearningMode, ReadingTheme } from '../store'

export interface ModeDefinition {
  id: LearningMode | 'visual'
  name: string
  short: string
  description: string
  icon: string
  color: string
}

export const learningModes: ModeDefinition[] = [
  {
    id: 'visual',
    name: 'Visual',
    short: 'Hapus pilihan tambahan',
    description:
      'Gunakan tampilan standar tanpa preferensi tambahan.',
    icon: 'Palette',
    color: 'primary',
  },
  {
    id: 'focus',
    name: 'Fokus',
    short: 'Minim gangguan',
    description:
      'Menyembunyikan elemen sekunder dan memperbesar area baca agar kamu bisa berkonsentrasi penuh.',
    icon: 'Target',
    color: 'primary',
  },
  {
    id: 'audio',
    name: 'Audio',
    short: 'Belajar sambil mendengar',
    description:
      'Pemutar audio untuk mendengarkan materi, cocok jika kamu lebih mudah memahami lewat suara.',
    icon: 'SpeakerHigh',
    color: 'accent',
  },
  {
    id: 'simple',
    name: 'Sederhana',
    short: 'Poin penting dulu',
    description:
      'Poin penting ditampilkan lebih dulu. Penjelasan lengkap bisa dibuka saat dibutuhkan.',
    icon: 'ListChecks',
    color: 'primary',
  },
]

export const getModeSummary = (selectedModes: LearningMode[], theme: ReadingTheme) => {
  const names = selectedModes.length === 0
    ? ['Visual']
    : learningModes.filter((mode) => mode.id !== 'visual' && selectedModes.includes(mode.id)).map((mode) => mode.name)

  if (theme === 'soft') names.push('Tema lembut')
  if (theme === 'high-contrast') names.push('Kontras tinggi')

  return names.join(' + ')
}
