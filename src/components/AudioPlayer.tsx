import { useState, useRef, useCallback, useEffect } from 'react'
import { SpeakerHigh, Pause, Play, Stop } from '@phosphor-icons/react'
import { cn } from '../lib/cn'

export interface AudioHighlightRange {
  start: number
  end: number
}

interface AudioPlayerProps {
  text: string
  onHighlightChange?: (range: AudioHighlightRange | null) => void
  className?: string
}

export function AudioPlayer({ text, onHighlightChange, className }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const speechSupported =
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined' &&
    typeof SpeechSynthesisUtterance !== 'undefined'
  const fallbackMessage = 'Audio tidak tersedia di browser ini. Kamu tetap bisa membaca materi.'

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel()
      }
    }
  }, [text])

  const speak = useCallback(() => {
    setError(null)
    if (!speechSupported) {
      setError(fallbackMessage)
      setPlaying(false)
      setPaused(false)
      return
    }

    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'id-ID'
    u.rate = rate
    utteranceRef.current = u
    u.onend = () => {
      if (utteranceRef.current !== u) return
      utteranceRef.current = null
      setPlaying(false)
      setPaused(false)
      setError(null)
      onHighlightChange?.(null)
    }
    u.onerror = (event) => {
      if (utteranceRef.current !== u) return
      utteranceRef.current = null
      setPlaying(false)
      setPaused(false)
      onHighlightChange?.(null)
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        setError('Audio gagal diputar. Coba lagi atau baca materinya.')
      }
    }
    u.onboundary = (event) => {
      if (utteranceRef.current !== u || event.name !== 'word') return

      const start = event.charIndex
      const word = text.slice(start).match(/^\S+/u)?.[0]
      const end = start + (event.charLength || word?.length || 1)
      onHighlightChange?.({ start, end })
    }

    try {
      window.speechSynthesis.speak(u)
      setPlaying(true)
      setPaused(false)
    } catch {
      setPlaying(false)
      setPaused(false)
      setError('Audio gagal diputar. Coba lagi atau baca materinya.')
    }
  }, [fallbackMessage, onHighlightChange, rate, speechSupported, text])

  const togglePause = useCallback(() => {
    try {
      if (paused) {
        window.speechSynthesis.resume()
        setPaused(false)
      } else {
        window.speechSynthesis.pause()
        setPaused(true)
      }
    } catch {
      setPlaying(false)
      setPaused(false)
      setError('Audio gagal diputar. Coba lagi atau baca materinya.')
    }
  }, [paused])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    utteranceRef.current = null
    setPlaying(false)
    setPaused(false)
    setError(null)
    onHighlightChange?.(null)
  }, [onHighlightChange])

  const changeRate = (value: number) => {
    setRate(value)
    if (utteranceRef.current) utteranceRef.current.rate = value
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-elevated p-3',
        className
      )}
      role="region"
      aria-label="Pemutar audio"
    >
      <SpeakerHigh size={20} className="text-primary-600 shrink-0" weight="bold" />
      <span className="min-w-0 flex-1 text-sm text-text-secondary" aria-live="polite">
        {error ?? (!speechSupported
          ? fallbackMessage
          : playing
          ? paused
            ? 'Dijeda'
            : 'Membacakan…'
          : 'Dengarkan materi ini')}
      </span>
      <div className="flex shrink-0 gap-1">
        {!playing ? (
          <button
            onClick={speak}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Putar audio"
            disabled={!speechSupported}
          >
            <Play size={14} weight="fill" />
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700 transition-colors hover:bg-primary-200"
              aria-label={paused ? 'Lanjutkan' : 'Jeda'}
            >
              {paused ? <Play size={14} weight="fill" /> : <Pause size={14} weight="fill" />}
            </button>
            <button
              onClick={stop}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-surface-muted text-text-secondary transition-colors hover:bg-surface-hover"
              aria-label="Berhenti"
            >
              <Stop size={14} weight="fill" />
            </button>
          </>
        )}
      </div>
      <label className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 sm:w-auto">
        <span className="shrink-0 text-xs font-medium text-text-secondary">Kecepatan</span>
        <input
          type="range"
          min="0.75"
          max="1.5"
          step="0.25"
          value={rate}
          onChange={(event) => changeRate(Number(event.target.value))}
          aria-label="Kecepatan audio"
          className="min-h-11 w-full min-w-20 cursor-pointer accent-primary-600 sm:w-24"
        />
        <output className="min-w-8 text-right text-xs font-semibold text-text-primary">{rate}×</output>
      </label>
    </div>
  )
}
