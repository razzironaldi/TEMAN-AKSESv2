import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowLeft,
  BookmarkSimple,
  CheckCircle,
  Clock,
  CaretDown,
  CaretUp,
  ListChecks,
} from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { ProgressBar } from '../components/ProgressBar'
import { ModeSelector } from '../components/ModeSelector'
import { AudioPlayer } from '../components/AudioPlayer'
import type { AudioHighlightRange } from '../components/AudioPlayer'
import { GlossaryPopover } from '../components/GlossaryPopover'
import { GlossaryText } from '../components/GlossaryText'
import { QuizSection } from '../components/QuizSection'
import { ReadingStudio } from '../components/ReadingStudio'
import { useStore } from '../store'
import { getMaterial } from '../data/materials'
import type { GlossaryTerm } from '../data/materials'
import { cn } from '../lib/cn'

export function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>()
  const material = getMaterial(id ?? '')
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSectionId = searchParams.get('section')
  const requestedReviewId = searchParams.get('review')
  const requestedIndex = material?.sections.findIndex((s) => s.id === requestedSectionId) ?? -1
  const activeSection = requestedIndex >= 0 ? requestedIndex : 0
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null)
  const [showModes, setShowModes] = useState(false)
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<GlossaryTerm | null>(null)
  const [audioHighlight, setAudioHighlight] = useState<(AudioHighlightRange & { source: string }) | null>(null)
  const articleRef = useRef<HTMLElement>(null)
  const {
    learningModes,
    fontSize,
    lineHeight,
    letterSpacing,
    lessonProgress,
    toggleLessonComplete,
    toggleBookmark,
    accessLesson,
  } = useStore()

  const section = material?.sections[activeSection]
  const reviewQuestionId = material?.quiz.some((question) => question.id === requestedReviewId)
    ? requestedReviewId ?? undefined
    : undefined

  useEffect(() => {
    if (section) accessLesson(section.id)
  }, [section, accessLesson])

  const selectSection = (index: number) => {
    if (!material) return

    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('section', material.sections[index].id)
    if (index !== material.sections.length - 1) nextSearchParams.delete('review')
    setSearchParams(nextSearchParams, { replace: true })

    if (window.matchMedia('(max-width: 1023px)').matches) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      articleRef.current?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    }
  }

  if (!material || !section) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-text-primary">Materi tidak ditemukan</h1>
        <Button to="/materials" variant="outline" className="mt-4">
          <ArrowLeft size={16} />
          Kembali ke Materi
        </Button>
      </div>
    )
  }

  const sectionProgress = lessonProgress[section.id]
  const isCompleted = sectionProgress?.completed ?? false
  const isBookmarked = sectionProgress?.bookmarked ?? false
  const doneSections = material.sections.filter((s) => lessonProgress[s.id]?.completed).length
  const overallPct = Math.round((doneSections / material.sections.length) * 100)

  const isFocus = learningModes.includes('focus')
  const isSimple = learningModes.includes('simple')
  const isAudio = learningModes.includes('audio')
  const showFullExplanation = isSimple && expandedSectionId === section.id

  const spokenSegments = isSimple && !showFullExplanation
    ? [section.simpleSummary, ...section.keyPoints]
    : section.paragraphs
  const audioText = spokenSegments.join(' ')
  const activeHighlight = audioHighlight?.source === audioText ? audioHighlight : null

  const renderSpokenText = (text: string, segmentIndex: number) => {
    const glossaryText = (value: string) => (
      <GlossaryText text={value} terms={material.glossary} onSelect={setSelectedGlossaryTerm} />
    )
    if (!activeHighlight) return glossaryText(text)

    const segmentStart = spokenSegments
      .slice(0, segmentIndex)
      .reduce((offset, segment) => offset + segment.length + 1, 0)
    const start = Math.max(0, activeHighlight.start - segmentStart)
    const end = Math.min(text.length, activeHighlight.end - segmentStart)
    if (start >= end) return glossaryText(text)

    return (
      <>
        {glossaryText(text.slice(0, start))}
        <mark className="audio-word-highlight">{text.slice(start, end)}</mark>
        {glossaryText(text.slice(end))}
      </>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/materials"
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Materi
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-sm text-text-primary font-medium truncate">{material.title}</span>
      </div>

      <details data-scroll-reveal className="mb-6 rounded-xl border border-border bg-surface">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
          <span className="font-semibold text-sm text-text-primary">Ruang Baca Adaptif</span>
          <span className="text-xs text-text-muted">Ukuran, jarak, dan tema</span>
        </summary>
        <div className="border-t border-border p-4 sm:p-5">
          <ReadingStudio compact />
        </div>
      </details>

      <div className={cn('grid gap-6', isFocus ? '' : 'lg:grid-cols-[280px_1fr]')}>
        {!isFocus && (
          <aside data-scroll-reveal className="order-2 space-y-4 focus-hide lg:order-1" aria-label="Daftar bagian">
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="font-semibold text-sm text-text-primary mb-1">{material.title}</h2>
              <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                <Badge size="sm">{material.level}</Badge>
                <span className="flex items-center gap-1"><Clock size={12} /> {material.totalDuration} menit</span>
              </div>
              <ProgressBar value={overallPct} size="sm" label={`${overallPct}% selesai`} />
              <p className="text-[10px] text-text-muted mt-1">{doneSections}/{material.sections.length} selesai</p>
            </div>

            <nav className="rounded-xl border border-border bg-surface overflow-hidden">
              {material.sections.map((s, i) => {
                const done = lessonProgress[s.id]?.completed
                const active = i === activeSection
                return (
                  <button
                    key={s.id}
                    onClick={() => selectSection(i)}
                    className={cn(
                      'flex items-center gap-2 w-full px-4 py-3 text-left text-sm transition-colors border-b border-border last:border-b-0 cursor-pointer',
                      active
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-text-secondary hover:bg-surface-muted'
                    )}
                    aria-current={active ? 'step' : undefined}
                  >
                    {done ? (
                      <CheckCircle size={18} className="text-green-500 shrink-0" weight="fill" />
                    ) : (
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                          active ? 'border-primary-500 text-primary-600 bg-primary-100' : 'border-border text-text-muted'
                        )}
                      >
                        {i + 1}
                      </span>
                    )}
                    <span className="truncate">{s.title}</span>
                  </button>
                )
              })}
            </nav>

            <div className="rounded-xl border border-border bg-surface p-4">
              <button
                onClick={() => setShowModes(!showModes)}
                className="flex items-center justify-between w-full text-sm font-semibold text-text-primary cursor-pointer"
                aria-expanded={showModes}
              >
                Mode Belajar
                {showModes ? <CaretUp size={14} /> : <CaretDown size={14} />}
              </button>
              {showModes && (
                <div className="mt-3">
                  <ModeSelector compact stacked />
                </div>
              )}
            </div>
          </aside>
        )}

        <article
          ref={articleRef}
          data-scroll-reveal
          className="reading-content order-1 min-w-0 scroll-mt-20 lg:order-2"
          style={{
            '--reader-font-size': `${fontSize}px`,
            '--reader-line-height': lineHeight,
            '--reader-letter-spacing': `${letterSpacing}em`,
          } as CSSProperties}
        >
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary">{section.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-text-muted">
                  <span className="flex items-center gap-1"><Clock size={14} /> {section.duration} menit</span>
                  <span>Bagian {activeSection + 1}/{material.sections.length}</span>
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(section.id)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer',
                  isBookmarked
                    ? 'bg-accent-100 text-accent-600'
                    : 'bg-surface-muted text-text-muted hover:text-text-secondary'
                )}
                aria-label={isBookmarked ? 'Hapus penanda' : 'Tandai'}
                aria-pressed={isBookmarked}
              >
                <BookmarkSimple size={20} weight={isBookmarked ? 'fill' : 'regular'} />
              </button>
            </div>

            {isAudio && (
              <AudioPlayer
                key={`${section.id}-${isSimple && !showFullExplanation ? 'simple' : 'full'}`}
                text={audioText}
                onHighlightChange={(range) => setAudioHighlight(range ? { ...range, source: audioText } : null)}
                className="mb-6"
              />
            )}

            {isFocus && (
              <div className="mb-4">
                <ModeSelector compact />
              </div>
            )}

            <div className="prose max-w-none">
              {isSimple ? (
                <div className="space-y-4">
                  <div className="rounded-xl bg-primary-50 border border-primary-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <ListChecks size={18} className="text-primary-600" weight="bold" />
                      <h3 className="font-semibold text-primary-800 text-sm">Ringkasan</h3>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-text-primary">
                      {renderSpokenText(section.simpleSummary, 0)}
                    </p>
                    <h4 className="mb-2 font-semibold text-primary-800 text-sm">Poin utama</h4>
                    <ul className="space-y-2">
                      {section.keyPoints.map((kp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                          <CheckCircle size={16} className="text-primary-500 shrink-0 mt-0.5" weight="bold" />
                          {renderSpokenText(kp, i + 1)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedSectionId(showFullExplanation ? null : section.id)}
                    aria-expanded={showFullExplanation}
                    className="text-sm font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800"
                  >
                    {showFullExplanation ? 'Sembunyikan penjelasan lengkap' : 'Baca penjelasan lengkap'}
                  </button>
                  {showFullExplanation && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-text-primary">Penjelasan lengkap</h3>
                      {section.paragraphs.map((p, i) => (
                        <p key={i} className="text-sm text-text-secondary leading-relaxed">
                          {renderSpokenText(p, i)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-text-secondary leading-relaxed">
                      {renderSpokenText(p, i)}
                    </p>
                  ))}
                  <div className="rounded-xl bg-surface-elevated border border-border p-5 mt-6">
                    <h3 className="font-semibold text-sm text-text-primary mb-3">Poin Penting</h3>
                    <ul className="space-y-2">
                      {section.keyPoints.map((kp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle size={16} className="text-primary-500 shrink-0 mt-0.5" weight="bold" />
                          {kp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 pt-6 border-t border-border">
              <Button
                onClick={() => toggleLessonComplete(section.id)}
                variant={isCompleted ? 'secondary' : 'primary'}
                className={isCompleted ? 'text-green-700' : ''}
              >
                <CheckCircle size={18} weight={isCompleted ? 'fill' : 'regular'} />
                {isCompleted ? 'Selesai' : 'Tandai Selesai'}
              </Button>

              {activeSection < material.sections.length - 1 && (
                <Button
                  variant="outline"
                  onClick={() => selectSection(activeSection + 1)}
                >
                  Bagian Berikutnya
                </Button>
              )}

              {activeSection > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => selectSection(activeSection - 1)}
                >
                  Sebelumnya
                </Button>
              )}
            </div>

            {activeSection === material.sections.length - 1 && (
              <QuizSection
                key={`${material.id}-${reviewQuestionId ?? 'all-questions'}`}
                questions={material.quiz}
                reviewQuestionId={reviewQuestionId}
              />
            )}
          </div>
        </article>
      </div>
      <GlossaryPopover
        term={selectedGlossaryTerm}
        onClose={() => setSelectedGlossaryTerm(null)}
      />
    </div>
  )
}
