import { useState } from 'react'
import { ArrowRight, CheckCircle, Lightbulb, ArrowCounterClockwise } from '@phosphor-icons/react'
import type { QuizQuestion } from '../data/materials'
import { cn } from '../lib/cn'
import { useStore } from '../store'

interface MiniQuizProps {
  questions: QuizQuestion[]
  reviewQuestionId?: string
}

export function MiniQuiz({ questions, reviewQuestionId }: MiniQuizProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'hint' | 'correct' | null>(null)
  const [complete, setComplete] = useState(false)
  const recordQuizAnswer = useStore((state) => state.recordQuizAnswer)
  const activeQuestions = reviewQuestionId
    ? questions.filter((item) => item.id === reviewQuestionId)
    : questions
  const question = activeQuestions[questionIndex]

  const chooseAnswer = (answer: string) => {
    if (feedback === 'correct') return
    recordQuizAnswer(question.id, answer === question.answer)
    setSelectedAnswer(answer)
    setFeedback(answer === question.answer ? 'correct' : 'hint')
  }

  const nextQuestion = () => {
    if (questionIndex === activeQuestions.length - 1) {
      setComplete(true)
      return
    }

    setQuestionIndex((index) => index + 1)
    setSelectedAnswer(null)
    setFeedback(null)
  }

  const restart = () => {
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setFeedback(null)
    setComplete(false)
  }

  if (activeQuestions.length === 0) return null

  return (
    <section data-scroll-reveal aria-labelledby="mini-quiz-heading" className="mt-8 border-t border-border pt-7">
      <p className="text-xs font-semibold uppercase text-text-muted">Latihan pemahaman</p>
      <h2 id="mini-quiz-heading" className="mt-1 text-lg font-bold text-text-primary">Cek pemahamanmu</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Tidak ada batas waktu. Kamu boleh mencoba lagi kapan saja.
      </p>

      {complete ? (
        <div className="mt-5">
          <p className="text-sm font-medium text-text-primary" role="status">
            Latihan selesai. Terima kasih sudah mencoba.
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-muted"
          >
            <ArrowCounterClockwise size={17} />
            Ulangi latihan
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-text-muted">
            <span>Pertanyaan {questionIndex + 1} dari {activeQuestions.length}</span>
            <div
              className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-muted"
              role="progressbar"
              aria-label="Progres latihan"
              aria-valuemin={0}
              aria-valuemax={activeQuestions.length}
              aria-valuenow={questionIndex + (feedback === 'correct' ? 1 : 0)}
            >
              <div
                className="h-full rounded-full bg-primary-500 transition-[width]"
                style={{ width: `${((questionIndex + (feedback === 'correct' ? 1 : 0)) / activeQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-base font-semibold leading-relaxed text-text-primary">
              {question.question}
            </legend>
            <div className="mt-3 grid gap-2" role="group" aria-label="Pilihan jawaban">
              {question.options.map((option) => {
                const selected = selectedAnswer === option
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    disabled={feedback === 'correct'}
                    onClick={() => chooseAnswer(option)}
                    className={cn(
                      'min-h-11 w-full rounded-lg border px-4 py-2.5 text-left text-sm text-text-primary transition-colors',
                      selected
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                        : 'border-border hover:border-primary-300 hover:bg-surface-muted',
                      feedback === 'correct' && selected && 'border-green-600 bg-green-50 ring-green-600'
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {feedback === 'hint' && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent-50 p-3 text-sm text-text-primary" role="status" aria-live="polite">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-accent-700" />
              <p><strong>Petunjuk:</strong> {question.hint} Kamu bisa memilih jawaban lain.</p>
            </div>
          )}

          {feedback === 'correct' && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-900" role="status" aria-live="polite">
              <CheckCircle size={18} className="mt-0.5 shrink-0 text-green-700" weight="fill" />
              <p>{question.explanation}</p>
            </div>
          )}

          {feedback === 'correct' && (
            <button
              type="button"
              onClick={nextQuestion}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              {questionIndex === activeQuestions.length - 1 ? 'Selesaikan latihan' : 'Pertanyaan berikutnya'}
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      )}
    </section>
  )
}