import {
  ArrowRight,
  Eye,
  Target,
  SpeakerHigh,
  TextAa,
  Sparkle,
  Users,
  GraduationCap,
  Devices,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { useStore } from '../store'

const benefits = [
  {
    icon: Eye,
    title: 'Tampilan Adaptif',
    desc: 'Antarmuka menyesuaikan preferensi belajarmu.',
  },
  {
    icon: Target,
    title: 'Mode Fokus',
    desc: 'Hilangkan gangguan, fokus pada konten.',
  },
  {
    icon: SpeakerHigh,
    title: 'Dukungan Audio',
    desc: 'Dengarkan materi kapan saja dibutuhkan.',
  },
  {
    icon: TextAa,
    title: 'Teks Fleksibel',
    desc: 'Sesuaikan ukuran teks dan kontras sesukamu.',
  },
]

const steps = [
  { num: '01', title: 'Kenali Kebutuhanmu', desc: 'Pilih preferensi belajar yang paling nyaman.' },
  { num: '02', title: 'Akses Materi', desc: 'Jelajahi materi yang sudah disiapkan untukmu.' },
  { num: '03', title: 'Sesuaikan Pengalaman', desc: 'Ganti mode kapan saja saat belajar.' },
]

export function LandingPage() {
  const { onboardingComplete } = useStore()

  return (
    <div className="flex flex-col">
      <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border" aria-label="Navigasi utama">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="TemanAkses Beranda">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
              TA
            </div>
            <span className="font-bold text-lg text-text-primary tracking-tight">TemanAkses</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button to={onboardingComplete ? '/dashboard' : '/onboarding'} size="sm">
              {onboardingComplete ? 'Ke Dashboard' : 'Mulai Belajar'}
            </Button>
          </div>
        </div>
      </nav>

      <section data-scroll-reveal className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-surface to-surface">
        <div className="absolute inset-0 pointer-events-none select-none opacity-30">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent-200 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-6">
                <Sparkle size={14} weight="fill" />
                Platform Belajar Adaptif
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
                Belajar dengan cara yang{' '}
                <span className="text-primary-600">sesuai denganmu</span>
              </h1>
              <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-[50ch]">
                TemanAkses membantu kamu mendapatkan pengalaman belajar yang lebih
                nyaman, fokus, dan mudah dipahami.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to={onboardingComplete ? '/dashboard' : '/onboarding'} size="lg">
                  Mulai Belajar
                  <ArrowRight size={18} />
                </Button>
                <Button to="/onboarding" variant="outline" size="lg">
                  Kenali Kebutuhan Saya
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="rounded-2xl border border-border bg-surface shadow-elevated p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <div className="h-3 w-3 rounded-full bg-primary-400" />
                    <div className="h-3 w-3 rounded-full bg-accent-400" />
                    <div className="h-3 w-3 rounded-full bg-surface-hover" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Eye size={20} className="text-primary-600" />
                      </div>
                      <div>
                        <div className="h-3 w-24 rounded bg-surface-muted" />
                        <div className="h-2 w-32 rounded bg-surface-muted mt-1.5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent-100 flex items-center justify-center">
                        <Target size={20} className="text-accent-600" />
                      </div>
                      <div>
                        <div className="h-3 w-20 rounded bg-surface-muted" />
                        <div className="h-2 w-28 rounded bg-surface-muted mt-1.5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-primary-50 p-3 border border-primary-200">
                      <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
                        <SpeakerHigh size={20} className="text-white" weight="bold" />
                      </div>
                      <div>
                        <div className="h-3 w-16 rounded bg-primary-200" />
                        <div className="h-2 w-24 rounded bg-primary-100 mt-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-scroll-reveal className="py-20 sm:py-24" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="benefits-heading" className="text-2xl sm:text-3xl font-bold text-text-primary text-center">
            Satu tujuan belajar, berbagai cara mengalaminya
          </h2>
          <p className="mt-3 text-text-secondary text-center max-w-2xl mx-auto">
            Setiap orang belajar dengan cara berbeda. TemanAkses menyesuaikan
            antarmuka agar cocok dengan kebutuhanmu.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-start rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
                  <b.icon size={22} weight="bold" />
                </div>
                <h3 className="font-semibold text-text-primary">{b.title}</h3>
                <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-reveal className="py-20" aria-labelledby="modes-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="modes-heading" className="text-2xl sm:text-3xl font-bold text-text-primary text-center">
            Lima mode belajar, satu platform
          </h2>
          <p className="mt-3 text-text-secondary text-center max-w-2xl mx-auto">
            Ganti mode kapan saja untuk menyesuaikan pengalaman belajar.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Visual', desc: 'Tampilan lengkap dengan visual dan warna', color: 'bg-primary-50 border-primary-200 text-primary-700' },
              { name: 'Fokus', desc: 'Antarmuka minimal tanpa gangguan', color: 'bg-teal-50 border-teal-200 text-teal-700' },
              { name: 'Audio', desc: 'Dengarkan materi secara langsung', color: 'bg-accent-50 border-accent-200 text-accent-700' },
              { name: 'Sederhana', desc: 'Poin penting dulu, penjelasan lengkap tersedia', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { name: 'Kontras Tinggi', desc: 'Warna tegas, teks lebih jelas', color: 'bg-zinc-100 border-zinc-300 text-zinc-800' },
            ].map((m) => (
              <div key={m.name} className={`rounded-2xl border p-5 ${m.color}`}>
                <h3 className="font-bold text-sm">{m.name}</h3>
                <p className="mt-1 text-xs opacity-80">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-reveal className="py-20 bg-surface-elevated" aria-labelledby="how-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold text-text-primary text-center">
            Bagaimana TemanAkses bekerja?
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-start">
                <span className="text-4xl font-extrabold text-primary-200">{s.num}</span>
                <h3 className="mt-3 font-semibold text-lg text-text-primary">{s.title}</h3>
                <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-reveal className="py-20" aria-labelledby="impact-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl bg-primary-600 p-8 sm:p-12 text-white">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <h2 id="impact-heading" className="text-2xl sm:text-3xl font-bold">
                  Teknologi yang Berpusat pada Manusia
                </h2>
                <p className="mt-3 text-primary-100 leading-relaxed max-w-lg">
                  TemanAkses dirancang dengan prinsip desain yang mengutamakan
                  kebutuhan pengguna. Platform ini bukan sekadar teknologi, melainkan
                  solusi yang peduli dengan pengalaman setiap individu.
                </p>
                <Button
                  to={onboardingComplete ? '/dashboard' : '/onboarding'}
                  variant="secondary"
                  size="lg"
                  className="mt-6 bg-white text-primary-700 hover:bg-primary-50 border-0"
                >
                  Coba Sekarang
                  <ArrowRight size={18} />
                </Button>
              </div>
              <div className="flex justify-center gap-6 sm:gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                    <Users size={28} weight="bold" />
                  </div>
                  <span className="text-sm font-medium text-primary-100">Inklusif</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                    <GraduationCap size={28} weight="bold" />
                  </div>
                  <span className="text-sm font-medium text-primary-100">Edukatif</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                    <Devices size={28} weight="bold" />
                  </div>
                  <span className="text-sm font-medium text-primary-100">Responsif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-white font-bold text-xs">
                TA
              </div>
              <span className="font-semibold text-text-primary">TemanAkses</span>
            </div>
            <p className="text-sm text-text-muted">
              Dibuat untuk Innovation 4 Force 2026 Web Design Competition
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
