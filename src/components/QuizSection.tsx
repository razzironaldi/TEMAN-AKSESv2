import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Clock, FlagCheckered, Heart, Lightbulb, X } from '@phosphor-icons/react'
import type { QuizQuestion } from '../data/materials'
import { cn } from '../lib/cn'
import { useStore, type QuizMode } from '../store'
import { QuizMascot } from './QuizMascot'

interface QuizSectionProps {
  questions: QuizQuestion[]
  reviewQuestionId?: string
}

type AnswerState = 'idle' | 'correct' | 'incorrect' | 'timeout'

const hardModeSeconds = 20

export function QuizSection({ questions, reviewQuestionId }: QuizSectionProps) {
  const activeQuestions = reviewQuestionId
    ? questions.filter((question) => question.id === reviewQuestionId)
    : questions
  const {
    isQuizActive,
    quizMode,
    currentQuestionIndex,
    score,
    mascotState,
    setQuizMode,
    startQuizSession,
    setCurrentQuestionIndex,
    addQuizPoint,
    setMascotState,
    finishQuizSession,
    resetQuizSession,
    recordQuizAnswer,
  } = useStore()
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [isComplete, setIsComplete] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(hardModeSeconds)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const questionRef = useRef<HTMLLegendElement>(null)
  const question = activeQuestions[Math.min(currentQuestionIndex, activeQuestions.length - 1)]
  const scorePercent = activeQuestions.length > 0
    ? Math.round((score / activeQuestions.length) * 100)
    : 0

  useEffect(() => {
    if (!isQuizActive || quizMode !== 'hard' || !question || answerState === 'correct' || answerState === 'timeout') return

    const timer = window.setTimeout(() => {
      if (remainingSeconds <= 1) {
        if (answerState !== 'incorrect') recordQuizAnswer(question.id, false)
        setAnswerState('timeout')
        setMascotState('encouragement')
        return
      }
      setRemainingSeconds((seconds) => seconds - 1)
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [answerState, isQuizActive, question, quizMode, recordQuizAnswer, remainingSeconds, setMascotState])

  useEffect(() => () => resetQuizSession(), [resetQuizSession])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isQuizActive && !dialog.open) dialog.showModal()
    if (!isQuizActive && dialog.open) dialog.close()
  }, [isQuizActive])

  useEffect(() => {
    if (isQuizActive) questionRef.current?.focus()
  }, [currentQuestionIndex, isQuizActive])

  // Dialog polyfill for iOS < 15.4 (inline minimal polyfill) - must be unconditional
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || typeof HTMLDialogElement.prototype.showModal === 'function') return

    // Minimal polyfill: add showModal/close methods if missing
    if (!dialog.showModal) {
      dialog.showModal = function() {
        this.setAttribute('open', '')
        this.style.display = 'flex'
        document.body.style.overflow = 'hidden'
      }
    }
    if (!dialog.close) {
      dialog.close = function() {
        this.removeAttribute('open')
        this.style.display = 'none'
        document.body.style.overflow = ''
      }
    }
    // Polyfill ::backdrop via pseudo-element simulation
    const style = document.createElement('style')
    style.textContent = `
      dialog[open]::backdrop {
        background: rgb(15 23 42 / 48%);
        backdrop-filter: blur(2px);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  function chooseMode(mode: QuizMode) {
    setQuizMode(mode)
  }

  function begin() {
    setSelectedAnswer(null)
    setAnswerState('idle')
    setIsComplete(false)
    setRemainingSeconds(hardModeSeconds)
    startQuizSession()
  }

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!question || !selectedAnswer || answerState === 'correct' || answerState === 'timeout') return

    const correct = selectedAnswer === question.answer
    recordQuizAnswer(question.id, correct)
    setAnswerState(correct ? 'correct' : 'incorrect')
    setMascotState(correct ? 'correct' : 'incorrect')
    if (correct) addQuizPoint()
  }

  function advance() {
    if (currentQuestionIndex >= activeQuestions.length - 1) {
      setIsComplete(true)
      finishQuizSession()
      setMascotState(scorePercent === 100 ? 'perfect' : 'encouragement')
      return
    }

    setSelectedAnswer(null)
    setAnswerState('idle')
    setRemainingSeconds(hardModeSeconds)
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  function leaveQuiz() {
    finishQuizSession()
    setIsComplete(false)
    setSelectedAnswer(null)
    setAnswerState('idle')
  }

  function retryQuiz() {
    setIsComplete(false)
    begin()
  }

  if (activeQuestions.length === 0) return null

  if (!isQuizActive && !isComplete) {
    return (
      <section aria-labelledby="quiz-section-title" className="mt-8 border-t border-border pt-7">
        <p className="text-xs font-semibold text-text-muted">Latihan pemahaman</p>
        <h2 id="quiz-section-title" className="mt-1 text-lg font-bold text-text-primary">Cek pemahamanmu</h2>
        <p className="mt-1 text-sm text-text-secondary">Pilih cara bermain yang paling nyaman untukmu.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group" aria-label="Pilih mode kuis">
          <button
            type="button"
            onClick={() => chooseMode('santai')}
            aria-pressed={quizMode === 'santai'}
            className={cn(
              'min-h-24 rounded-xl border p-4 text-left transition-colors focus-visible:outline-offset-4',
              quizMode === 'santai' ? 'border-primary-700 bg-primary-50 ring-2 ring-primary-600' : 'border-border bg-surface hover:bg-surface-muted'
            )}
          >
            <span className="flex items-center gap-2 font-semibold text-text-primary"><Heart size={18} weight="fill" className="text-primary-700" />Santai</span>
            <span className="mt-1 block text-sm leading-relaxed text-text-secondary">Tanpa timer. Pikirkan jawabanmu dan coba lagi jika perlu.</span>
          </button>
          <button
            type="button"
            onClick={() => chooseMode('hard')}
            aria-pressed={quizMode === 'hard'}
            className={cn(
              'min-h-24 rounded-xl border p-4 text-left transition-colors focus-visible:outline-offset-4',
              quizMode === 'hard' ? 'border-primary-700 bg-primary-50 ring-2 ring-primary-600' : 'border-border bg-surface hover:bg-surface-muted'
            )}
          >
            <span className="flex items-center gap-2 font-semibold text-text-primary"><Clock size={18} weight="bold" className="text-primary-700" />Hard · 20 detik</span>
            <span className="mt-1 block text-sm leading-relaxed text-text-secondary">Satu timer untuk setiap soal. Kamu tetap bisa melihat petunjuk.</span>
          </button>
        </div>

        <QuizMascot state="idle" />
        <button
          type="button"
          onClick={begin}
          className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-700 px-5 py-3 text-sm font-bold text-white hover:bg-primary-800 active:scale-[0.98] focus-visible:outline-offset-4"
        >
          Mulai kuis <ArrowRight size={18} weight="bold" />
        </button>
      </section>
    )
  }

  if (isComplete) {
    const finalState = scorePercent === 100 ? 'perfect' : scorePercent < 50 ? 'encouragement' : 'completed'

    return (
      <section aria-labelledby="quiz-result-title" className="mt-8 border-t border-border pt-7">
        <h2 id="quiz-result-title" className="text-lg font-bold text-text-primary">Kuis selesai</h2>
        <div className="mt-4 rounded-xl border border-border bg-surface-elevated p-5">
          <p className="text-3xl font-extrabold text-primary-800">{scorePercent}%</p>
          <p className="mt-1 text-sm text-text-secondary">{score} dari {activeQuestions.length} jawaban benar</p>
          <QuizMascot state={finalState} scorePercent={scorePercent} />
        </div>
        <button
          type="button"
          onClick={retryQuiz}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-strong px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface-muted focus-visible:outline-offset-4"
        >
          <ArrowLeft size={17} /> Coba lagi
        </button>
      </section>
    )
  }

  if (!question) return null

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-[100vh] h-[100dvh] max-h-none w-screen max-w-none overflow-y-auto border-0 bg-surface p-0 text-text-primary backdrop:bg-surface safe-area-inset-bottom"
      aria-labelledby="active-quiz-title"
      onKeyDownCapture={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          leaveQuiz()
        }
      }}
      /* onCancel dihapus: biarkan gesture native (swipe down/back) menutup dialog tanpa preventDefault */
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-4 pb-8 sm:px-6 sm:py-7">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold text-text-muted">{quizMode === 'hard' ? 'Mode Hard' : 'Mode Santai'}</p>
            <h2 id="active-quiz-title" className="mt-1 text-lg font-bold text-text-primary">Pertanyaan {currentQuestionIndex + 1} dari {activeQuestions.length}</h2>
          </div>
          <button
            type="button"
            onClick={leaveQuiz}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-strong px-3 py-2 text-sm font-semibold text-text-primary hover:bg-surface-muted focus-visible:outline-offset-4"
          >
            <X size={18} /> Keluar dari kuis
          </button>
        </header>

        <div className="mt-5 flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted"
            role="progressbar"
            aria-label="Progres kuis"
            aria-valuemin={0}
            aria-valuemax={activeQuestions.length}
            aria-valuenow={currentQuestionIndex + (answerState === 'correct' ? 1 : 0)}
          >
            <div className="h-full rounded-full bg-primary-700 transition-[width]" style={{ width: `${((currentQuestionIndex + (answerState === 'correct' ? 1 : 0)) / activeQuestions.length) * 100}%` }} />
          </div>
          <p className="shrink-0 text-sm font-bold text-primary-800">Skor {score}</p>
        </div>

        {quizMode === 'hard' && (
          <div className="mt-5 flex items-center gap-3" role="timer" aria-label={`Sisa waktu ${remainingSeconds} detik`}>
            <Clock size={19} className={remainingSeconds <= 5 ? 'text-red-700' : 'text-primary-700'} />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <div
                className={cn('h-full rounded-full transition-[width]', remainingSeconds <= 5 ? 'bg-red-700' : 'bg-primary-700')}
                style={{ width: `${(remainingSeconds / hardModeSeconds) * 100}%` }}
              />
            </div>
            <span className={cn('min-w-16 text-right text-sm font-bold', remainingSeconds <= 5 ? 'text-red-800' : 'text-text-primary')}>
              {remainingSeconds} detik
            </span>
          </div>
        )}

        <form onSubmit={submitAnswer} className="mt-7 flex flex-1 flex-col">
          <fieldset>
            <legend ref={questionRef} tabIndex={-1} className="text-xl font-bold leading-relaxed text-text-primary focus-visible:outline-offset-4 sm:text-2xl">{question.question}</legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {question.options.map((option, index) => {
                const selected = selectedAnswer === option
                const answerLocked = answerState === 'correct' || answerState === 'timeout' || (quizMode === 'hard' && answerState === 'incorrect')

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={answerLocked}
                    aria-pressed={selected}
                    onClick={() => {
                      setSelectedAnswer(option)
                      if (answerState === 'incorrect') {
                        setAnswerState('idle')
                        setMascotState('idle')
                      }
                    }}
                    className={cn(
                      'min-h-16 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold leading-relaxed transition-colors focus-visible:outline-offset-4 sm:text-base',
                      selected ? 'border-primary-700 bg-primary-50 text-primary-950' : 'border-border-strong bg-surface text-text-primary hover:border-primary-600 hover:bg-primary-50',
                      answerState === 'correct' && selected && 'border-green-800 bg-green-50 text-green-950',
                      answerLocked && !selected && 'cursor-not-allowed opacity-60'
                    )}
                  >
                    <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-text-primary" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-5">
            {(answerState === 'incorrect' || answerState === 'timeout') && (
              <QuizMascot
                state={answerState === 'timeout' ? 'encouragement' : 'incorrect'}
                hint={question.hint}
                explanation={question.explanation}
              />
            )}
            {answerState === 'correct' && <QuizMascot state="correct" explanation={question.explanation} />}
            {answerState === 'idle' && <QuizMascot state={mascotState} />}
          </div>

          <div className="sticky bottom-0 z-10 mt-6 -mx-4 border-t border-border bg-surface/95 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-4 backdrop-blur-sm sm:-mx-6 sm:px-6">
            <div className="flex flex-wrap justify-end gap-3">
              {answerState === 'correct' && (
                <button type="button" onClick={advance} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary-700 px-5 py-3 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline-offset-4">
                  {currentQuestionIndex === activeQuestions.length - 1 ? 'Lihat hasil' : 'Soal berikutnya'} <ArrowRight size={18} weight="bold" />
                </button>
              )}
              {(answerState === 'incorrect' && quizMode === 'hard' || answerState === 'timeout') && (
                <button type="button" onClick={advance} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary-700 px-5 py-3 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline-offset-4">
                  {currentQuestionIndex === activeQuestions.length - 1 ? 'Lihat hasil' : 'Lanjut soal'} <ArrowRight size={18} weight="bold" />
                </button>
              )}
              {answerState === 'incorrect' && quizMode === 'santai' && selectedAnswer && (
                <button type="button" onClick={() => setSelectedAnswer(null)} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-border-strong px-4 py-3 text-sm font-semibold text-text-primary hover:bg-surface-muted focus-visible:outline-offset-4">
                  <Lightbulb size={18} /> Pilih jawaban lain
                </button>
              )}
              {answerState !== 'correct' && answerState !== 'timeout' && !(quizMode === 'hard' && answerState === 'incorrect') && (
                <button type="submit" disabled={!selectedAnswer} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary-700 px-5 py-3 text-sm font-bold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-text-muted focus-visible:outline-offset-4">
                  Periksa jawaban <CheckCircle size={18} weight="bold" />
                </button>
              )}
              {isComplete && <FlagCheckered size={18} aria-hidden="true" />}
            </div>
          </div>
        </form>
      </div>
    </dialog>
  )
}