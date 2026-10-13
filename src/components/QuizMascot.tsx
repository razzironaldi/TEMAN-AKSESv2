import { CheckCircle, HandsClapping, Heart, Lightbulb, Sparkle, Trophy } from '@phosphor-icons/react'
import type { MascotState } from '../store'

interface QuizMascotProps {
  state: MascotState
  hint?: string
  explanation?: string
  scorePercent?: number
}

const messages: Record<MascotState, string> = {
  idle: 'Ayo, kita coba satu soal dalam satu waktu. Kamu boleh berpikir dengan tenang.',
  correct: 'Benar! Jawabanmu tepat. Lanjutkan, ya!',
  incorrect: 'Belum tepat, tidak apa-apa. Coba gunakan petunjuk ini untuk mencoba lagi.',
  completed: 'Bagus, kamu sudah menyelesaikan kuis. Tinjau lagi subtema yang masih ingin kamu pahami.',
  perfect: 'Keren banget! Kamu paham banget materi ini!',
  encouragement: 'Gapapa, yuk baca lagi materinya bareng-bareng!',
}

export function QuizMascot({ state, hint, explanation, scorePercent }: QuizMascotProps) {
  const Icon = state === 'perfect'
    ? Trophy
    : state === 'correct'
    ? HandsClapping
    : state === 'incorrect'
    ? Lightbulb
    : state === 'completed'
    ? CheckCircle
    : state === 'encouragement'
    ? Heart
    : Sparkle
  const characterMotion = state === 'perfect'
    ? 'quiz-character-perfect'
    : state === 'correct'
    ? 'quiz-character-clapping'
    : state === 'incorrect'
    ? 'quiz-character-supportive'
    : 'quiz-character-idle'

  return (
    <div className={`quiz-mascot quiz-mascot-${state}`} role="status" aria-live="polite">
      {state === 'perfect' && (
        <div className="quiz-confetti" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
      <div className={`quiz-mascot-character ${characterMotion}`} aria-hidden="true">
        <span className="quiz-mascot-shadow" />
        <span className="quiz-mascot-arm quiz-mascot-arm-left"><span /></span>
        <span className="quiz-mascot-arm quiz-mascot-arm-right"><span /></span>
        <span className="quiz-mascot-leg quiz-mascot-leg-left"><span /></span>
        <span className="quiz-mascot-leg quiz-mascot-leg-right"><span /></span>
        <span className="quiz-mascot-body">
          <span className="quiz-mascot-eye quiz-mascot-eye-left" />
          <span className="quiz-mascot-eye quiz-mascot-eye-right" />
          <span className={`quiz-mascot-mouth quiz-mascot-mouth-${state === 'incorrect' ? 'soft' : 'smile'}`} />
          <span className="quiz-mascot-cheek quiz-mascot-cheek-left" />
          <span className="quiz-mascot-cheek quiz-mascot-cheek-right" />
        </span>
        <Icon className="quiz-mascot-gesture" size={24} weight="fill" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-text-primary">Aksa</p>
        <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">
          {scorePercent !== undefined && state === 'perfect'
            ? messages.perfect
            : scorePercent !== undefined && state === 'encouragement'
            ? messages.encouragement
            : messages[state]}
        </p>
        {(hint || explanation) && state === 'incorrect' && (
          <div className="mt-2 space-y-1 text-sm leading-relaxed text-text-secondary">
            {hint && <p><strong className="text-text-primary">Petunjuk:</strong> {hint}</p>}
            {explanation && <p>{explanation}</p>}
          </div>
        )}
        {scorePercent !== undefined && (
          <p className="mt-2 text-sm font-bold text-primary-800">Skor akhir: {scorePercent}%</p>
        )}
      </div>
    </div>
  )
}