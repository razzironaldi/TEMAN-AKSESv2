import { useEffect, useRef, useState } from 'react'
import { Play, Stop, X } from '@phosphor-icons/react'
import type { GlossaryTerm } from '../data/materials'

interface GlossaryPopoverProps {
  term: GlossaryTerm | null
  onClose: () => void
}

export function GlossaryPopover({ term, onClose }: GlossaryPopoverProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [speaking, setSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const speechSupported =
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined' &&
    typeof SpeechSynthesisUtterance !== 'undefined'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (term && !dialog.open) {
      if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel()
      }
      dialog.showModal()
    }
    if (!term && dialog.open) dialog.close()
  }, [term])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const closeDialog = () => {
    if (dialogRef.current?.open) dialogRef.current.close()
    else onClose()
  }

  const stopPronunciation = () => {
    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
    setError(null)
  }

  const handleDialogClose = () => {
    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
    setError(null)
    onClose()
  }

  const speakTerm = () => {
    if (!term || !speechSupported) {
      setError('Pengucapan audio tidak tersedia di browser ini.')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(term.term)
    utterance.lang = 'id-ID'
    utterance.onend = () => {
      setSpeaking(false)
      setError(null)
    }
    utterance.onerror = (event) => {
      setSpeaking(false)
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        setError('Istilah tidak dapat dibacakan. Coba lagi atau baca definisinya.')
      }
    }

    try {
      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
      setError(null)
    } catch {
      setSpeaking(false)
      setError('Istilah tidak dapat dibacakan. Coba lagi atau baca definisinya.')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="glossary-dialog fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-auto rounded-xl border border-border bg-surface p-0 text-text-primary shadow-elevated"
      aria-labelledby="glossary-term-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          closeDialog()
        }
      }}
      onClose={handleDialogClose}
      onCancel={(event) => {
        event.preventDefault()
        closeDialog()
      }}
    >
      {term && (
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-text-muted">Kamus istilah</p>
              <h2 id="glossary-term-title" className="mt-1 text-xl font-bold text-text-primary">
                {term.term}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-muted"
              aria-label="Tutup definisi"
            >
              <X size={20} />
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-text-primary">{term.definition}</p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            <strong className="text-text-primary">Contoh:</strong> {term.example}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={speaking ? stopPronunciation : speakTerm}
              disabled={!speechSupported && !error}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {speaking ? <Stop size={18} weight="fill" /> : <Play size={18} weight="fill" />}
              {speaking ? 'Berhenti' : 'Dengarkan pengucapan'}
            </button>
            <span className="text-sm text-text-secondary" aria-live="polite">
              {error ?? (speaking ? 'Membacakan istilah…' : !speechSupported ? 'Audio tidak tersedia di browser ini.' : '')}
            </span>
          </div>
        </div>
      )}
    </dialog>
  )
}