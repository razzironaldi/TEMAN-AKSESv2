import { Link } from 'react-router-dom'
import { useState } from 'react'
import { BookOpen, Clock, CheckCircle, MagnifyingGlass, X } from '@phosphor-icons/react'
import { Card, CardBody } from '../components/Card'
import { Badge } from '../components/Badge'
import { ProgressBar } from '../components/ProgressBar'
import { materials } from '../data/materials'
import { useStore } from '../store'

export function MaterialsListPage() {
  const [search, setSearch] = useState('')
  const { lessonProgress } = useStore()
  const query = search.trim().toLocaleLowerCase('id-ID')
  const filteredMaterials = materials.filter((material) =>
    `${material.title} ${material.description} ${material.category} ${material.level}`
      .toLocaleLowerCase('id-ID')
      .includes(query)
  )

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Semua Materi</h1>
      <p className="text-text-secondary mb-8">Pilih materi yang ingin kamu pelajari.</p>

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

      {filteredMaterials.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-live="polite">
        {filteredMaterials.map((m) => {
          const done = m.sections.filter((s) => lessonProgress[s.id]?.completed).length
          const pct = Math.round((done / m.sections.length) * 100)
          const allDone = done === m.sections.length
          return (
            <Link key={m.id} to={`/materials/${m.id}`} className="group" data-scroll-reveal>
              <Card interactive className="h-full">
                <CardBody className="flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <Badge variant={m.accent === 'accent' ? 'accent' : 'primary'}>{m.category}</Badge>
                    {allDone && <CheckCircle size={22} className="text-green-500" weight="fill" />}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                    {m.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-text-secondary leading-relaxed flex-1">
                    {m.description}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} /> {m.sections.length} bagian
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {m.totalDuration} menit
                    </span>
                    <Badge variant={m.level === 'Pemula' ? 'success' : 'neutral'} size="sm">
                      {m.level}
                    </Badge>
                  </div>
                  {pct > 0 && (
                    <div className="mt-3">
                      <ProgressBar value={pct} size="sm" label={`${pct}% selesai`} />
                      <p className="text-[10px] text-text-muted mt-1">{done}/{m.sections.length} selesai</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Link>
          )
        })}
        </div>
      ) : (
        <div data-scroll-reveal className="rounded-xl border border-dashed border-border-strong px-5 py-10 text-center" role="status">
          <p className="font-semibold text-text-primary">Materi tidak ditemukan</p>
          <p className="mt-1 text-sm text-text-secondary">Coba kata pencarian lain atau hapus pencarian.</p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-3 min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-primary-700 underline underline-offset-4"
          >
            Tampilkan semua materi
          </button>
        </div>
      )}
    </div>
  )
}
