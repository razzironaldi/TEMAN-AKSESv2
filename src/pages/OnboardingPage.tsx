import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, User } from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { ModeSelector } from '../components/ModeSelector'
import { useStore } from '../store'

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const { userName, setUserName, setOnboardingComplete } = useStore()
  const navigate = useNavigate()

  const finish = () => {
    setOnboardingComplete(true)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12">
      <div data-scroll-reveal className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-8">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary-500' : 'bg-surface-muted'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Selamat datang di TemanAkses
            </h1>
            <p className="mt-2 text-text-secondary">
              Siapa nama kamu? Kami akan menggunakannya untuk menyapa.
            </p>
            <div className="mt-6 relative">
              <label htmlFor="name-input" className="sr-only">Nama</label>
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="name-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Masukkan nama kamu"
                className="w-full rounded-xl border border-border bg-surface pl-11 pr-4 py-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                autoFocus
              />
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setStep(1)}
                disabled={!userName.trim()}
              >
                Lanjutkan
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Pilih preferensi belajarmu
            </h1>
            <p className="mt-2 text-text-secondary">
              Pilih satu atau beberapa cara yang membantumu belajar. Semuanya bisa diubah kapan saja.
            </p>
            <div className="mt-6">
              <ModeSelector />
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ArrowLeft size={18} />
                Kembali
              </Button>
              <Button onClick={finish}>
                Mulai Belajar
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
