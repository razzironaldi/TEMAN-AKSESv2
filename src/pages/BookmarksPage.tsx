import { useState } from 'react'
import { BookmarkSimple, BookOpen, Clock, MagnifyingGlass, ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, CardBody } from '../components/Card'
import { useStore } from '../store'
import { allLessons, materials } from '../data/materials'

const formatAccessedAt = (timestamp: number) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp)

export function BookmarksPage() {
  const [search, setSearch] = useState('')
  const { lessonProgress, toggleBookmark } = useStore()

  const lessonsWithProgress = allLessons
    .map((lesson) => ({ ...lesson, progress: lessonProgress[lesson.id] }))

  const accessedLessons = lessonsWithProgress
    .filter((lesson) => typeof lesson.progress?.lastAccessed === 'number')
    .sort((a, b) => (b.progress?.lastAccessed ?? 0) - (a.progress?.lastAccessed ?? 0))

  const query = search.trim().toLocaleLowerCase('id-ID')
  const bookmarkedLessons = lessonsWithProgress
    .filter((lesson) => lesson.progress?.bookmarked)
    .filter((lesson) =>
      !query || `${lesson.materialTitle} ${lesson.title}`.toLocaleLowerCase('id-ID').includes(query)
    )

  const mostRecentLesson = accessedLessons[0]
  const mostRecentMaterial = mostRecentLesson
    ? materials.find((material) => material.id === mostRecentLesson.materialId)
    : undefined
  const resumeUrl = mostRecentLesson
    ? `/materials/${mostRecentLesson.materialId}?section=${encodeURIComponent(mostRecentLesson.id)}`
    : '/materials'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Pusat Bookmark</h1>
        <p className="mt-2 text-text-secondary">Bagian tersimpan dan bacaan terakhirmu ada di sini.</p>
      </div>

      <section data-scroll-reveal aria-labelledby="resume-heading" className="mb-8">
        <h2 id="resume-heading" className="mb-3 text-lg font-bold text-text-primary">Lanjutkan belajar</h2>
        {mostRecentLesson && mostRecentMaterial ? (
          <Card>
            <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-text-muted">Terakhir dibuka</p>
                <h3 className="mt-1 text-lg font-semibold text-text-primary">{mostRecentLesson.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{mostRecentMaterial.title}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock size={14} />
                  {formatAccessedAt(mostRecentLesson.progress?.lastAccessed ?? 0)}
                </p>
              </div>
              <Button to={resumeUrl} className="shrink-0">
                Lanjutkan Belajar
                <ArrowRight size={18} />
              </Button>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text-secondary">Belum ada bagian yang dibuka. Pilih materi untuk memulai.</p>
              <Button to="/materials" variant="outline" size="sm">Jelajahi Materi</Button>
            </CardBody>
          </Card>
        )}
      </section>

      <section data-scroll-reveal aria-labelledby="saved-heading">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="saved-heading" className="text-lg font-bold text-text-primary">Bagian tersimpan</h2>
            <p className="mt-1 text-sm text-text-secondary">{bookmarkedLessons.length} bagian</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Cari materi tersimpan</span>
            <MagnifyingGlass size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari materi atau bagian"
              className="min-h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </label>
        </div>

        {bookmarkedLessons.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {bookmarkedLessons.map((lesson) => (
              <li key={lesson.id} data-scroll-reveal>
                <Card scrollReveal className="h-full">
                  <CardBody className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Badge variant="neutral" size="sm">{lesson.materialTitle}</Badge>
                        <h3 className="mt-3 font-semibold text-text-primary">{lesson.title}</h3>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                          <BookOpen size={14} />
                          Durasi {lesson.duration} menit
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(lesson.id)}
                        aria-label={`Hapus penanda ${lesson.title}`}
                        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-accent-700 hover:bg-accent-50"
                      >
                        <BookmarkSimple size={20} weight="fill" />
                      </button>
                    </div>
                    <div className="mt-auto pt-4">
                      <Button
                        to={`/materials/${lesson.materialId}?section=${encodeURIComponent(lesson.id)}`}
                        variant="outline"
                        size="sm"
                        fullWidth
                      >
                        Buka bagian
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <div data-scroll-reveal className="rounded-xl border border-dashed border-border-strong px-5 py-10 text-center">
            <BookmarkSimple size={28} className="mx-auto text-text-muted" />
            <p className="mt-3 font-semibold text-text-primary">
              {search ? 'Tidak ada bagian yang cocok' : 'Belum ada bookmark'}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {search ? 'Coba kata pencarian lain.' : 'Tandai bagian saat belajar untuk menyimpannya di sini.'}
            </p>
            {search ? (
              <button type="button" onClick={() => setSearch('')} className="mt-3 text-sm font-semibold text-primary-700 underline underline-offset-4">
                Hapus pencarian
              </button>
            ) : (
              <Link to="/materials" className="mt-3 inline-block text-sm font-semibold text-primary-700 underline underline-offset-4">
                Jelajahi materi
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  )
}