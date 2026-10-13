import { Link } from 'react-router-dom'
import { useState } from 'react'
import { BookOpen, Clock, CheckCircle, MagnifyingGlass, X } from '@phosphor-icons/react'
import { Card, CardBody } from '../components/Card'
import { Badge } from '../components/Badge'
import { ProgressBar } from '../components/ProgressBar'
import { learningCategories, materials } from '../data/materials'
import { useStore } from '../store'

export function MaterialsListPage() {
  const [search, setSearch] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const { lessonProgress } = useStore()
  const query = search.trim().toLocaleLowerCase('id-ID')
  const filteredMaterials = materials.filter((material) =>
    `${material.title} ${material.description} ${material.category} ${material.level} ${material.sections.map((section) => `${section.title} ${section.simpleSummary} ${section.keyPoints.join(' ')}`).join(' ')}`
      .toLocaleLowerCase('id-ID')
      .includes(query)
  )
  const visibleCategories = learningCategories.filter((category) =>
    (selectedCategoryId === 'all' || category.id === selectedCategoryId) &&
    filteredMaterials.some((material) => material.categoryId === category.id)
  )
  const themeCount = new Set(materials.map((material) => material.title)).size
  const subtopicCount = materials.reduce((total, material) => total + material.sections.length, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Jelajahi Materi Inklusif</h1>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Pilih kategori, lanjutkan ke tema, lalu buka subtema yang ingin kamu pelajari.
        </p>
        <p className="mt-3 text-sm font-medium text-primary-800" aria-label={`${learningCategories.length} kategori, ${themeCount} tema, ${subtopicCount} subtema`}>
          {learningCategories.length} kategori <span className="px-1 text-text-muted">/</span> {themeCount} tema <span className="px-1 text-text-muted">/</span> {subtopicCount} subtema
        </p>
      </div>

      <label data-scroll-reveal className="relative mb-6 block max-w-xl">
        <span className="sr-only">Cari materi</span>
        <MagnifyingGlass size={19} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari judul, topik, atau tingkat materi"
          className="min-h-12 w-full rounded-lg border border-border bg-surface pl-10 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Hapus pencarian"
            className="absolute right-1 top-1/2 flex min-h-10 min-w-10 -translate-y-1/2 items-center justify-center rounded-md text-text-muted hover:bg-surface-muted hover:text-text-primary"
          >
            <X size={18} />
          </button>
        )}
      </label>

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter kategori materi">
        <button
          type="button"
          onClick={() => setSelectedCategoryId('all')}
          aria-pressed={selectedCategoryId === 'all'}
          className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${selectedCategoryId === 'all' ? 'border-primary-800 bg-primary-800 text-white' : 'border-border-strong bg-surface text-text-secondary hover:bg-surface-muted'}`}
        >
          Semua kategori
        </button>
        {learningCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategoryId(category.id)}
            aria-pressed={selectedCategoryId === category.id}
            className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${selectedCategoryId === category.id ? 'border-primary-800 bg-primary-800 text-white' : 'border-border-strong bg-surface text-text-secondary hover:bg-surface-muted'}`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {visibleCategories.length > 0 ? (
        <div className="space-y-10" aria-live="polite">
          {visibleCategories.map((category) => {
            const categoryMaterials = filteredMaterials.filter((material) => material.categoryId === category.id)
            const categorySubtopicCount = categoryMaterials.reduce((total, material) => total + material.sections.length, 0)

            return (
              <section key={category.id} aria-labelledby={`category-${category.id}`}>
                <header className="mb-4 border-b border-border pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 id={`category-${category.id}`} className="text-lg font-bold text-text-primary">{category.title}</h2>
                    <p className="text-xs font-medium text-text-muted">
                      {categoryMaterials.length} tema, {categorySubtopicCount} subtema
                    </p>
                  </div>
                  <p className="mt-1 max-w-3xl text-sm text-text-secondary">{category.description}</p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryMaterials.map((material) => {
                    const done = material.sections.filter((section) => lessonProgress[section.id]?.completed).length
                    const percent = Math.round((done / material.sections.length) * 100)
                    const allDone = done === material.sections.length

                    return (
                      <Link key={material.id} to={`/materials/${material.id}`} className="group">
                        <Card interactive className="h-full">
                          <CardBody className="flex h-full flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <Badge variant={material.accent === 'accent' ? 'accent' : 'primary'}>{material.level}</Badge>
                              {allDone && <CheckCircle size={22} className="shrink-0 text-green-600" weight="fill" aria-label="Tema selesai" />}
                            </div>
                            <h3 className="mt-3 font-semibold text-text-primary group-hover:text-primary-700">{material.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{material.description}</p>
                            <div className="mt-4 border-t border-border pt-3">
                              <p className="mb-2 text-xs font-semibold text-text-muted">Subtema</p>
                              <ol className="space-y-1.5">
                                {material.sections.map((section, index) => (
                                  <li key={section.id} className="flex gap-2 text-xs leading-relaxed text-text-secondary">
                                    <span className="shrink-0 font-semibold text-primary-700">{index + 1}.</span>
                                    <span>{section.title}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                            <div className="mt-auto pt-4">
                              <div className="flex items-center justify-between gap-3 text-xs text-text-muted">
                                <span className="flex items-center gap-1"><BookOpen size={14} /> {material.sections.length} subtema</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> {material.totalDuration} menit</span>
                              </div>
                              {percent > 0 && (
                                <div className="mt-3">
                                  <ProgressBar value={percent} size="sm" label={`${percent}% selesai`} />
                                  <p className="mt-1 text-[10px] text-text-muted">{done}/{material.sections.length} subtema selesai</p>
                                </div>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div data-scroll-reveal className="rounded-xl border border-dashed border-border-strong px-5 py-10 text-center" role="status">
          <p className="font-semibold text-text-primary">Tema tidak ditemukan</p>
          <p className="mt-1 text-sm text-text-secondary">Coba kata pencarian lain atau pilih kategori berbeda.</p>
          <div className="mt-3 flex justify-center gap-3">
            {search && (
              <button type="button" onClick={() => setSearch('')} className="min-h-11 px-3 text-sm font-semibold text-primary-700 underline underline-offset-4">
                Hapus pencarian
              </button>
            )}
            {selectedCategoryId !== 'all' && (
              <button type="button" onClick={() => setSelectedCategoryId('all')} className="min-h-11 px-3 text-sm font-semibold text-primary-700 underline underline-offset-4">
                Tampilkan semua kategori
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
