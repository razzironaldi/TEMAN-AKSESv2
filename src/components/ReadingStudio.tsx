import { useStore } from '../store'
import type { ReadingTheme } from '../store'
import { cn } from '../lib/cn'

interface ReadingStudioProps {
  compact?: boolean
}

const themes: { id: ReadingTheme; label: string; swatch: string }[] = [
  { id: 'light', label: 'Terang', swatch: 'bg-white' },
  { id: 'soft', label: 'Lembut', swatch: 'bg-amber-50' },
  { id: 'high-contrast', label: 'Kontras tinggi', swatch: 'bg-black' },
]

export function ReadingStudio({ compact = false }: ReadingStudioProps) {
  const {
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    pageTheme,
    setPageTheme,
  } = useStore()

  return (
    <section aria-label="Kontrol Ruang Baca Adaptif" className="space-y-5">
      {!compact && (
        <div className="mb-5">
          <h2 className="font-semibold text-text-primary">Ruang Baca Adaptif</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Sesuaikan tampilan bacaan dengan kebutuhanmu.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="reader-font-size" className="flex items-center justify-between gap-2 text-sm font-medium text-text-primary">
            Ukuran teks
            <output htmlFor="reader-font-size" className="font-normal text-text-secondary">{fontSize} px</output>
          </label>
          <input
            id="reader-font-size"
            type="range"
            min="16"
            max="28"
            step="1"
            value={fontSize}
            onChange={(event) => setFontSize(Number(event.target.value))}
            className="mt-2 min-h-11 w-full cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-text-muted" aria-hidden="true">
            <span>16 px</span>
            <span>28 px</span>
          </div>
        </div>

        <div>
          <label htmlFor="reader-line-height" className="flex items-center justify-between gap-2 text-sm font-medium text-text-primary">
            Jarak baris
            <output htmlFor="reader-line-height" className="font-normal text-text-secondary">{lineHeight.toFixed(2)}×</output>
          </label>
          <input
            id="reader-line-height"
            type="range"
            min="1.3"
            max="2.1"
            step="0.05"
            value={lineHeight}
            onChange={(event) => setLineHeight(Number(event.target.value))}
            className="mt-2 min-h-11 w-full cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-text-muted" aria-hidden="true">
            <span>Rapat</span>
            <span>Renggang</span>
          </div>
        </div>

        <div>
          <label htmlFor="reader-letter-spacing" className="flex items-center justify-between gap-2 text-sm font-medium text-text-primary">
            Jarak huruf
            <output htmlFor="reader-letter-spacing" className="font-normal text-text-secondary">
              {letterSpacing === 0 ? 'Normal' : `${Math.round(letterSpacing * 100)}%`}
            </output>
          </label>
          <input
            id="reader-letter-spacing"
            type="range"
            min="0"
            max="0.12"
            step="0.01"
            value={letterSpacing}
            onChange={(event) => setLetterSpacing(Number(event.target.value))}
            className="mt-2 min-h-11 w-full cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-text-muted" aria-hidden="true">
            <span>Normal</span>
            <span>Lebar</span>
          </div>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-text-primary">Tema halaman</legend>
        <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Pilih tema halaman">
          {themes.map((theme) => {
            const active = pageTheme === theme.id
            return (
              <button
                key={theme.id}
                type="button"
                aria-pressed={active}
                onClick={() => setPageTheme(theme.id)}
                className={cn(
                  'flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'border-primary-600 bg-primary-50 text-primary-800 ring-1 ring-primary-600'
                    : 'border-border bg-surface text-text-secondary hover:border-primary-400'
                )}
              >
                <span className={cn('h-4 w-4 rounded-full border border-border-strong', theme.swatch)} aria-hidden="true" />
                {theme.label}
              </button>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}