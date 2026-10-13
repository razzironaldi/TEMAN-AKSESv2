import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { Card, CardBody } from '../components/Card'
import { ModeSelector } from '../components/ModeSelector'
import { ReadingStudio } from '../components/ReadingStudio'
import { useStore } from '../store'

export function SettingsPage() {
  const { resetPreferences } = useStore()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Pengaturan</h1>
      <p className="text-text-secondary mb-8">Sesuaikan pengalaman belajarmu.</p>

      <div className="space-y-6">
        <Card scrollReveal>
          <CardBody>
            <h2 className="font-semibold text-text-primary mb-1">Preferensi Belajar</h2>
            <p className="text-sm text-text-secondary mb-4">
              Preferensi dapat digabung. Pilih Visual untuk menghapus pilihan Fokus, Audio, dan Sederhana.
            </p>
            <ModeSelector />
          </CardBody>
        </Card>

        <Card scrollReveal>
          <CardBody>
            <ReadingStudio />
          </CardBody>
        </Card>

        <div data-scroll-reveal className="flex justify-end">
          <Button variant="ghost" onClick={resetPreferences} className="text-error">
            <ArrowCounterClockwise size={16} />
            Reset Semua Preferensi
          </Button>
        </div>
      </div>
    </div>
  )
}
