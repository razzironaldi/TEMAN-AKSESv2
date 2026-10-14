import { ArrowCounterClockwise, MagicWand } from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { Card, CardBody } from '../components/Card'
import { ModeSelector } from '../components/ModeSelector'
import { ReadingStudio } from '../components/ReadingStudio'
import { useStore } from '../store'

export function SettingsPage() {
  const { resetPreferences, characterAnimationsEnabled, setCharacterAnimationsEnabled } = useStore()

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

        <Card scrollReveal>
          <CardBody>
            <h2 className="font-semibold text-text-primary mb-1">Animasi Karakter</h2>
            <p className="text-sm text-text-secondary mb-4">
              Aktifkan/deaktifkan animasi Aksa (avatar & maskot kuis). Menonaktifkan bisa menghemat baterai dan memperlancar performa di perangkat lama.
            </p>
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <MagicWand size={20} weight="bold" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Animasi Karakter</p>
                  <p className="text-xs text-text-muted">Float, blink, breathe, clap, dance pada maskot & avatar</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={characterAnimationsEnabled}
                onClick={() => setCharacterAnimationsEnabled(!characterAnimationsEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border-2 transition-colors focus-visible:outline-offset-2 ${
                  characterAnimationsEnabled
                    ? 'bg-primary-600 border-primary-600'
                    : 'bg-surface-muted border-border'
                }`}
                aria-label={characterAnimationsEnabled ? 'Nonaktifkan animasi karakter' : 'Aktifkan animasi karakter'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    characterAnimationsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
              </button>
            </label>
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
