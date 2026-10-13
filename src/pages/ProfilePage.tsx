import { User, GearSix, Palette, BookmarkSimple, CheckCircle } from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { Card, CardBody } from '../components/Card'

import { useStore } from '../store'
import { getModeSummary } from '../data/modes'
import { totalLessons } from '../data/materials'

export function ProfilePage() {
  const { userName, learningModes, fontSize, lineHeight, letterSpacing, pageTheme, lessonProgress } = useStore()
  const preferenceSummary = getModeSummary(learningModes, pageTheme)
  const completedCount = Object.values(lessonProgress).filter((l) => l.completed).length
  const bookmarkedCount = Object.values(lessonProgress).filter((l) => l.bookmarked).length

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">Profil</h1>

      <Card scrollReveal className="mb-6">
        <CardBody className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
            <User size={32} weight="bold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">{userName || 'Pelajar'}</h2>
            <p className="text-sm text-text-secondary">Pengguna TemanAkses</p>
          </div>
        </CardBody>
      </Card>

      <Card scrollReveal className="mb-6">
        <CardBody>
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Palette size={18} className="text-primary-600" />
            Preferensi Aktif
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-muted p-3">
              <p className="text-xs text-text-muted">Preferensi aktif</p>
              <p className="font-medium text-text-primary mt-0.5">{preferenceSummary}</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-3">
              <p className="text-xs text-text-muted">Ukuran teks</p>
              <p className="font-medium text-text-primary mt-0.5">{fontSize} px</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-3">
              <p className="text-xs text-text-muted">Jarak baris</p>
              <p className="font-medium text-text-primary mt-0.5">{lineHeight.toFixed(1)}×</p>
            </div>
            <div className="rounded-lg bg-surface-muted p-3">
              <p className="text-xs text-text-muted">Jarak huruf</p>
              <p className="font-medium text-text-primary mt-0.5">{letterSpacing === 0 ? 'Normal' : `${Math.round(letterSpacing * 100)}%`}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card scrollReveal className="mb-6">
        <CardBody>
          <h3 className="font-semibold text-text-primary mb-4">Ringkasan Aktivitas</h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" weight="bold" />
              <span className="text-sm text-text-secondary">{completedCount}/{totalLessons} selesai</span>
            </div>
            <div className="flex items-center gap-2">
              <BookmarkSimple size={18} className="text-accent-500" weight="bold" />
              <span className="text-sm text-text-secondary">{bookmarkedCount} ditandai</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <div data-scroll-reveal className="flex gap-3">
        <Button to="/settings" variant="outline" size="sm">
          <GearSix size={16} />
          Ubah Pengaturan
        </Button>
      </div>
    </div>
  )
}
