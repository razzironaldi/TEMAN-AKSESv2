import { CheckCircle, BookmarkSimple, Clock, Trophy, TrendUp } from '@phosphor-icons/react'
import { Card, CardBody } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { Badge } from '../components/Badge'
import { useStore } from '../store'
import { materials, totalLessons } from '../data/materials'

export function ProgressPage() {
  const { lessonProgress } = useStore()

  const completedCount = Object.values(lessonProgress).filter((l) => l.completed).length
  const bookmarkedCount = Object.values(lessonProgress).filter((l) => l.bookmarked).length
  const overallPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const accessedCount = Object.values(lessonProgress).filter((l) => l.lastAccessed).length

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Progres Belajar</h1>
      <p className="text-text-secondary mb-8">Pantau perkembangan belajarmu.</p>

      <div data-scroll-reveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: TrendUp, label: 'Progres', value: `${overallPct}%`, color: 'text-primary-600', bg: 'bg-primary-100' },
          { icon: CheckCircle, label: 'Selesai', value: `${completedCount}/${totalLessons}`, color: 'text-green-600', bg: 'bg-green-100' },
          { icon: BookmarkSimple, label: 'Ditandai', value: String(bookmarkedCount), color: 'text-accent-600', bg: 'bg-accent-100' },
          { icon: Clock, label: 'Diakses', value: String(accessedCount), color: 'text-blue-600', bg: 'bg-blue-100' },
        ].map((s) => (
          <Card key={s.label} scrollReveal>
            <CardBody className="flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                <s.icon size={22} weight="bold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card scrollReveal className="mb-8">
        <CardBody>
          <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Trophy size={18} className="text-accent-500" weight="bold" />
            Progres Keseluruhan
          </h2>
          <ProgressBar value={overallPct} label={`${overallPct}% selesai`} />
          <p className="text-sm text-text-secondary mt-2">
            Kamu sudah menyelesaikan {completedCount} dari {totalLessons} pelajaran.
            {overallPct === 100
              ? ' Luar biasa, semua materi telah kamu kuasai!'
              : overallPct > 50
              ? ' Lebih dari setengah jalan, terus semangat!'
              : ' Terus belajar, kamu pasti bisa!'}
          </p>
        </CardBody>
      </Card>

      <h2 className="text-lg font-bold text-text-primary mb-4">Detail per Materi</h2>
      <div className="space-y-4" data-scroll-reveal>
        {materials.map((m) => {
          const done = m.sections.filter((s) => lessonProgress[s.id]?.completed).length
          const pct = Math.round((done / m.sections.length) * 100)
          return (
            <Card key={m.id} scrollReveal>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary">{m.title}</h3>
                      {pct === 100 && <Badge variant="success">Selesai</Badge>}
                    </div>
                    <p className="text-xs text-text-muted">{done}/{m.sections.length} bagian selesai</p>
                    <ProgressBar value={pct} size="sm" className="mt-2" label={`${pct}% selesai`} />
                  </div>
                  <span className="text-xl font-bold text-primary-600 shrink-0">{pct}%</span>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {m.sections.map((s) => {
                    const sd = lessonProgress[s.id]
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                          sd?.completed
                            ? 'bg-green-50 text-green-700'
                            : 'bg-surface-muted text-text-muted'
                        }`}
                      >
                        <CheckCircle
                          size={14}
                          weight={sd?.completed ? 'fill' : 'regular'}
                          className={sd?.completed ? 'text-green-500' : ''}
                        />
                        <span className="truncate">{s.title}</span>
                      </div>
                    )
                  })}
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
