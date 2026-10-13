import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Bookmark,
} from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { Card, CardBody } from '../components/Card'
import { Badge } from '../components/Badge'
import { ProgressBar } from '../components/ProgressBar'
import { ModeSelector } from '../components/ModeSelector'
import { useStore } from '../store'
import { materials, totalLessons } from '../data/materials'
import { getModeSummary } from '../data/modes'

export function DashboardPage() {
  const [reviewClock, setReviewClock] = useState(0)
  const { userName, learningModes, pageTheme, lessonProgress, quizReview } = useStore()
  const preferenceSummary = getModeSummary(learningModes, pageTheme)

  useEffect(() => {
    const timeout = window.setTimeout(() => setReviewClock(Date.now()), 0)
    return () => window.clearTimeout(timeout)
  }, [])

  const completedCount = Object.values(lessonProgress).filter((l) => l.completed).length
  const bookmarkedCount = Object.values(lessonProgress).filter((l) => l.bookmarked).length
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const mostRecentLessonId = Object.entries(lessonProgress)
    .filter(([, v]) => v.lastAccessed)
    .sort(([, a], [, b]) => (b.lastAccessed ?? 0) - (a.lastAccessed ?? 0))
    .map(([id]) => id)[0]

  const recentMaterial = mostRecentLessonId
    ? materials.find((m) => m.sections.some((s) => s.id === mostRecentLessonId)) ?? materials[0]
    : materials[0]
  const recentSection = recentMaterial?.sections.find((s) => s.id === mostRecentLessonId)
  const resumeUrl = recentMaterial
    ? `/materials/${recentMaterial.id}${recentSection ? `?section=${encodeURIComponent(recentSection.id)}` : ''}`
    : '/materials'
  const dueQuizReviews = materials.flatMap((material) =>
    material.quiz
      .filter((question) => (quizReview[question.id]?.nextReviewAt ?? Infinity) <= reviewClock)
      .map((question) => ({
        material,
        question,
        section: material.sections[material.sections.length - 1],
      }))
  )

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Halo, {userName || 'Pelajar'}!
          </h1>
          <p className="mt-1 text-text-secondary">
            Preferensi aktif: <strong className="text-primary-700">{preferenceSummary}</strong>
          </p>
        </div>
        <Button to="/settings" variant="outline" size="sm">
          Ubah Preferensi
        </Button>
      </div>

      <div data-scroll-reveal className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card scrollReveal className="lg:col-span-2">
          <CardBody className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-text-primary">Progres Keseluruhan</h2>
              <p className="text-sm text-text-secondary mt-0.5">
                {completedCount} dari {totalLessons} pelajaran selesai
              </p>
              <ProgressBar value={overallPct} className="mt-3" />
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{overallPct}%</p>
                <p className="text-xs text-text-muted">Selesai</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-600">{bookmarkedCount}</p>
                <p className="text-xs text-text-muted">Ditandai</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {recentMaterial && (
          <Card interactive scrollReveal>
            <CardBody>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                {recentSection ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
              </p>
              <h3 className="mt-2 font-semibold text-text-primary">{recentMaterial.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{recentMaterial.level}</Badge>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Clock size={12} /> {recentMaterial.totalDuration} menit
                </span>
              </div>
              <Button
                to={resumeUrl}
                size="sm"
                className="mt-4"
                fullWidth
              >
                {recentSection ? 'Lanjutkan' : 'Mulai Belajar'}
                <ArrowRight size={16} />
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {dueQuizReviews.length > 0 && (
        <section data-scroll-reveal aria-labelledby="review-heading" className="mb-8">
          <div className="mb-4">
            <h2 id="review-heading" className="text-lg font-bold text-text-primary">Latihan pengulangan</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {dueQuizReviews.length} soal siap diulang. Kerjakan dengan santai, tanpa batas waktu.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dueQuizReviews.map(({ material, question, section }) => (
              <Card key={question.id} scrollReveal>
                <CardBody>
                  <p className="text-xs font-semibold text-text-muted">{material.title}</p>
                  <h3 className="mt-2 font-semibold text-text-primary">{question.question}</h3>
                  <Button
                    to={`/materials/${material.id}?section=${encodeURIComponent(section.id)}&review=${encodeURIComponent(question.id)}`}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    fullWidth
                  >
                    Ulangi soal
                    <ArrowRight size={16} />
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section data-scroll-reveal aria-labelledby="materials-heading" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 id="materials-heading" className="text-lg font-bold text-text-primary">Materi Tersedia</h2>
          <Link to="/materials" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Lihat semua
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => {
            const done = m.sections.filter((s) => lessonProgress[s.id]?.completed).length
            const pct = Math.round((done / m.sections.length) * 100)
            return (
              <Link key={m.id} to={`/materials/${m.id}`} className="group">
                <Card interactive scrollReveal className="h-full">
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <Badge variant={m.accent === 'accent' ? 'accent' : 'primary'}>{m.category}</Badge>
                      {done === m.sections.length && (
                        <CheckCircle size={20} className="text-green-500" weight="fill" />
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary line-clamp-2">{m.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} /> {m.sections.length} bagian
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {m.totalDuration} menit
                      </span>
                      {lessonProgress[m.sections[0]?.id]?.bookmarked && (
                        <Bookmark size={13} weight="fill" className="text-accent-500" />
                      )}
                    </div>
                    {pct > 0 && <ProgressBar value={pct} size="sm" className="mt-3" />}
                  </CardBody>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section data-scroll-reveal aria-labelledby="mode-heading" className="focus-hide">
        <h2 id="mode-heading" className="text-lg font-bold text-text-primary mb-4">Mode Belajar</h2>
        <ModeSelector compact />
      </section>
    </div>
  )
}
