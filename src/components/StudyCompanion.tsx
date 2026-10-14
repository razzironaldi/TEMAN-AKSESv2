import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ChatCircleDots, Eye, PaperPlaneTilt, X } from '@phosphor-icons/react'
import { useLocation } from 'react-router-dom'
import { learningCategories, materials, type Material } from '../data/materials'
import { useStore } from '../store'

/* VisualViewport hook untuk handle virtual keyboard di mobile */
function useVisualViewport() {
  const [viewport, setViewport] = useState({ height: 0, offsetTop: 0 })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const vp = window.visualViewport
    const update = () => setViewport({
      height: vp.height,
      offsetTop: vp.offsetTop,
    })
    update()
    vp.addEventListener('resize', update)
    vp.addEventListener('scroll', update)
    return () => {
      vp.removeEventListener('resize', update)
      vp.removeEventListener('scroll', update)
    }
  }, [])

  return viewport
}

interface Message {
  role: 'companion' | 'learner'
  text: string
}

const openingMessage: Message = {
  role: 'companion',
  text: 'Hai! Aku Aksa, teman belajarmu. Saat AI aktif, pertanyaan dan konteks materi dikirim ke Gemini untuk dijawab. Jangan kirim kata sandi atau informasi pribadi.',
}

const stopWords = new Set([
  'apa', 'apakah', 'aku', 'bagaimana', 'boleh', 'dan', 'dari', 'di', 'dong', 'itu',
  'jelaskan', 'kenapa', 'mana', 'materi', 'maksud', 'mengapa', 'yang', 'untuk', 'pada',
  'dengan', 'ini', 'tolong', 'tentang', 'cara', 'saya', 'ya', 'adalah', 'arti',
])

function normalize(text: string) {
  return text.toLocaleLowerCase('id-ID').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, ' ')
}

function getKeywords(text: string) {
  return normalize(text).split(/\s+/).filter((word) => word.length > 2 && !stopWords.has(word))
}

function findBestMatch<T extends { searchText: string }>(question: string, entries: T[]) {
  const keywords = getKeywords(question)
  if (keywords.length === 0) return undefined

  let bestEntry: T | undefined
  let bestScore = 0

  for (const entry of entries) {
    const searchableText = normalize(entry.searchText)
    const score = keywords.reduce((total, keyword) => total + (searchableText.includes(keyword) ? 1 : 0), 0)
    if (score > bestScore) {
      bestEntry = entry
      bestScore = score
    }
  }

  return bestScore > 0 ? bestEntry : undefined
}

function createCatalogContext(question: string) {
  const keywords = getKeywords(question)
  const matches = learningCategories.flatMap((category) =>
    materials
      .filter((material) => material.categoryId === category.id)
      .flatMap((material) => material.sections.map((section) => {
        const content = normalize([
          category.title,
          material.title,
          material.description,
          section.title,
          section.simpleSummary,
          ...section.paragraphs,
          ...section.keyPoints,
        ].join(' '))
        const score = keywords.filter((keyword) => content.includes(keyword)).length
        return { category: category.title, theme: material.title, section, score }
      }))
  ).filter((entry) => entry.score > 0).sort((left, right) => right.score - left.score).slice(0, 3)

  if (matches.length === 0) {
    return learningCategories.map((category) => {
      const themes = materials.filter((material) => material.categoryId === category.id)
      return `${category.title}: ${themes.map((theme) => theme.title).join(', ')}`
    }).join('\n')
  }

  return JSON.stringify(matches.map(({ category, theme, section }) => ({
    category,
    theme,
    subtopic: section.title,
    summary: section.simpleSummary,
    details: section.paragraphs,
    keyPoints: section.keyPoints,
  })))
}

function createAnswer(question: string, activeMaterial: Material | undefined, activeSectionId: string | null) {
  const normalizedQuestion = normalize(question)
  const section = activeMaterial?.sections.find((item) => item.id === activeSectionId)
  const allGlossary = materials.flatMap((material) => material.glossary.map((term) => ({ ...term, materialTitle: material.title })))

  if (/ringkas|jelaskan materi ini|materi yang sedang/.test(normalizedQuestion)) {
    const targetSection = section ?? activeMaterial?.sections[0]
    if (targetSection) return `${targetSection.title}: ${targetSection.simpleSummary}`
    return 'Buka salah satu materi terlebih dahulu, lalu tanyakan “Ringkas materi ini”. Aku akan mengambil ringkasannya dari halaman tersebut.'
  }

  if (/cara pakai|cara menggunakan|fitur temanakses|gunakan temanakses/.test(normalizedQuestion)) {
    return 'Kamu bisa mengatur tampilan di Pengaturan, mendengarkan materi dengan Audio Reader, menyimpan bagian lewat Bookmark, lalu mencoba Mini Quiz. Aku bisa membantu menjelaskan isi materi yang tersedia di aplikasi.'
  }

  const exactTerm = allGlossary.find((term) => normalizedQuestion.includes(normalize(term.term)))
  const glossaryMatch = exactTerm ?? findBestMatch(question, allGlossary.map((term) => ({ ...term, searchText: `${term.term} ${term.definition} ${term.example}` })))
  if (glossaryMatch && (exactTerm || getKeywords(question).length > 0)) {
    return `${glossaryMatch.term} berarti ${glossaryMatch.definition} Contohnya: ${glossaryMatch.example}${activeMaterial?.title !== glossaryMatch.materialTitle ? ` Istilah ini ada di materi ${glossaryMatch.materialTitle}.` : ''}`
  }

  const quizMatch = findBestMatch(question, materials.flatMap((material) => material.quiz.map((item) => ({ ...item, materialTitle: material.title, searchText: `${item.question} ${item.options.join(' ')} ${item.explanation}` }))))
  if (quizMatch && /kuis|quiz|soal|jawab|mengapa|kenapa|benar|salah/.test(normalizedQuestion)) {
    return `${quizMatch.explanation} Petunjuknya: ${quizMatch.hint}`
  }

  const sections = materials.flatMap((material) => material.sections.map((item) => ({ ...item, materialTitle: material.title, searchText: `${item.title} ${item.simpleSummary} ${item.keyPoints.join(' ')} ${item.paragraphs.join(' ')}` })))
  const sectionMatch = findBestMatch(question, sections)
  if (sectionMatch) {
    return `${sectionMatch.title}: ${sectionMatch.simpleSummary} Materi ini ada di ${sectionMatch.materialTitle}.`
  }

  const categorySuggestions = learningCategories.map((category) => category.title).join(', ')
  return `Aku belum menemukan jawabannya di materi TemanAkses. Coba tanyakan tentang ${categorySuggestions}.`
}

function getAiSetupMessage() {
  return import.meta.env.DEV
    ? 'Untuk mengaktifkan AI, isi GEMINI_API_KEY di .env.local lalu jalankan server API.'
    : 'AI belum diaktifkan di server deployment ini. Pengelola perlu mengatur GEMINI_API_KEY pada environment server.'
}

function CompanionAvatar({ listening = false }: { listening?: boolean }) {
  return (
    <span className={`companion-avatar${listening ? ' is-listening' : ''}`} aria-hidden="true">
      <span className="companion-eye" />
      <span className="companion-eye" />
      <span className="companion-mouth" />
    </span>
  )
}

export function StudyCompanion() {
  const { pathname, search } = useLocation()
  const isQuizActive = useStore((state) => state.isQuizActive)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([openingMessage])
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null)
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageListRef = useRef<HTMLDivElement>(null)

  /* VisualViewport untuk handle virtual keyboard di mobile */
  const visualViewport = useVisualViewport()

  const activeMaterial = useMemo(() => {
    const materialId = pathname.match(/^\/materials\/([^/]+)/)?.[1]
    return materials.find((material) => material.id === materialId)
  }, [pathname])
  const activeSectionId = new URLSearchParams(search).get('section')

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const controller = new AbortController()
    fetch('/api/companion/status', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((status: { configured?: boolean }) => setAiConfigured(Boolean(status.configured)))
      .catch(() => {
        if (!controller.signal.aborted) setAiConfigured(false)
      })
    return () => controller.abort()
  }, [isOpen])

  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isOpen])

  function appendCompanionMessage(text: string) {
    setMessages((current) => {
      const nextMessages: Message[] = [...current, { role: 'companion', text }]
      return nextMessages.slice(-13)
    })
  }

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const question = draft.trim()
    if (!question || isSending) return

    const contextSection = activeMaterial?.sections.find((item) => item.id === activeSectionId)
    const context = activeMaterial
      ? JSON.stringify({
          category: activeMaterial.category,
          material: activeMaterial.title,
          activeSection: contextSection?.title ?? null,
          sections: activeMaterial.sections.map((section) => ({
            title: section.title,
            summary: section.simpleSummary,
            keyPoints: section.keyPoints,
            details: section.paragraphs,
          })),
          glossary: activeMaterial.glossary,
        })
      : createCatalogContext(question)
    const history = messages.slice(1).slice(-8).map((message) => ({
      role: message.role === 'learner' ? 'user' : 'assistant',
      content: message.text,
    }))
    setMessages((current) => {
      const nextMessages: Message[] = [
        ...current,
        { role: 'learner', text: question },
      ]
      return nextMessages.slice(-13)
    })
    setDraft('')

    if (aiConfigured === false) {
      appendCompanionMessage(`Mode lokal: ${createAnswer(question, activeMaterial, activeSectionId)} ${getAiSetupMessage()}`)
      return
    }

    setIsSending(true)

    try {
      const response = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, context, history }),
      })
      const result = await response.json() as { answer?: string; code?: string; error?: string }

      if (response.ok && result.answer) {
        setAiConfigured(true)
        appendCompanionMessage(result.answer)
      } else if (result.code === 'AI_NOT_CONFIGURED') {
        setAiConfigured(false)
        appendCompanionMessage(`Mode lokal: ${createAnswer(question, activeMaterial, activeSectionId)} ${getAiSetupMessage()}`)
      } else {
        appendCompanionMessage(`${result.error ?? 'Aksa belum dapat menjawab sekarang.'} ${createAnswer(question, activeMaterial, activeSectionId)}`)
      }
    } catch {
      setAiConfigured(false)
      appendCompanionMessage(`Server AI belum tersambung. Mode lokal: ${createAnswer(question, activeMaterial, activeSectionId)}`)
    } finally {
      setIsSending(false)
    }
  }

  if (isQuizActive) return null

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-3 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-700 bg-white px-3 text-sm font-semibold text-primary-900 shadow-elevated hover:bg-primary-50 focus-visible:outline-offset-4 md:bottom-5 md:right-5"
      >
        <Eye size={17} aria-hidden="true" />
        Tampilkan Aksa
      </button>
    )
  }

  /* Gunakan visualViewport untuk positioning yang benar saat keyboard buka di mobile */
  const bottomPosition = visualViewport.height > 0
    ? visualViewport.offsetTop + visualViewport.height - 100
    : 84 /* 5.25rem = 84px */

  return (
    <div className="fixed right-3 z-50 flex flex-col items-end gap-3 md:bottom-5 md:right-5"
         style={{ bottom: `${bottomPosition}px` }}>
      {isOpen && (
        <section
          id="study-companion-panel"
          aria-label="Teman belajar Aksa"
          className="flex max-h-[min(34rem,calc(100dvh-8rem))] w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated md:max-h-[min(36rem,calc(100dvh-2.5rem))]"
        >
          <header className="flex items-center gap-3 border-b border-border bg-primary-50 px-4 py-3">
            <CompanionAvatar />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-text-primary">Aksa</h2>
              <p className="text-xs text-text-secondary">
                {aiConfigured === null ? 'Memeriksa koneksi AI...' : aiConfigured ? 'AI Gemini aktif' : 'Mode lokal'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary hover:bg-white focus-visible:outline-offset-2"
              aria-label="Sembunyikan Aksa"
              title="Sembunyikan Aksa"
            >
              <Eye size={18} />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary hover:bg-white focus-visible:outline-offset-2"
              aria-label="Tutup percakapan"
              title="Tutup percakapan"
            >
              <X size={19} />
            </button>
          </header>

          <div ref={messageListRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4" role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'learner' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-sm leading-relaxed ${message.role === 'learner' ? 'bg-primary-700 text-white' : 'border border-border bg-surface-elevated text-text-primary'}`}>
                  {message.text}
                </p>
              </div>
            ))}
            {isSending && (
              <p className="max-w-[88%] rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm text-text-secondary" role="status">
                Aksa sedang menyusun jawaban...
              </p>
            )}
          </div>

          <form onSubmit={submitQuestion} className="flex items-center gap-2 border-t border-border bg-surface px-3 py-3">
            <label htmlFor="companion-question" className="sr-only">Tulis pertanyaan untuk Aksa</label>
            <input
              ref={inputRef}
              id="companion-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Tanyakan tentang materi..."
              className="h-11 min-w-0 flex-1 rounded-lg border border-border-strong bg-white px-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-primary-600"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={!draft.trim() || isSending}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-white transition-colors hover:bg-primary-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-text-muted"
              aria-label="Kirim pertanyaan"
            >
              <PaperPlaneTilt size={19} weight="fill" />
            </button>
          </form>
        </section>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="companion-launcher flex min-h-14 items-center gap-2 rounded-full border-2 border-primary-800 bg-white py-1.5 pl-2 pr-4 text-sm font-bold text-primary-950 shadow-elevated hover:bg-primary-50 focus-visible:outline-offset-4"
          aria-expanded={false}
          aria-label="Tanya Aksa, teman belajar"
        >
          <CompanionAvatar listening={draft.length > 0} />
          <span>Tanya Aksa</span>
          <ChatCircleDots size={18} weight="bold" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}