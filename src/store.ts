import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LearningMode = 'focus' | 'audio' | 'simple'
export type ReadingTheme = 'light' | 'soft' | 'high-contrast'
export type QuizMode = 'santai' | 'hard'
export type MascotState = 'idle' | 'correct' | 'incorrect' | 'completed' | 'perfect' | 'encouragement'

export interface LessonProgress {
  completed: boolean
  bookmarked: boolean
  lastAccessed?: number
}

export interface QuizReviewProgress {
  attempts: number
  incorrectAttempts: number
  consecutiveCorrect: number
  intervalDays: number
  lastAnsweredAt: number
  nextReviewAt: number
}

interface AppState {
  learningModes: LearningMode[]
  fontSize: number
  lineHeight: number
  letterSpacing: number
  pageTheme: ReadingTheme
  userName: string
  onboardingComplete: boolean
  lessonProgress: Record<string, LessonProgress>
  quizReview: Record<string, QuizReviewProgress>
  isQuizActive: boolean
  quizMode: QuizMode
  currentQuestionIndex: number
  score: number
  mascotState: MascotState

  toggleLearningMode: (mode: LearningMode) => void
  clearLearningModes: () => void
  setFontSize: (size: number) => void
  setLineHeight: (height: number) => void
  setLetterSpacing: (spacing: number) => void
  setPageTheme: (theme: ReadingTheme) => void
  setUserName: (name: string) => void
  setOnboardingComplete: (v: boolean) => void
  toggleLessonComplete: (id: string) => void
  toggleBookmark: (id: string) => void
  accessLesson: (id: string) => void
  recordQuizAnswer: (questionId: string, correct: boolean) => void
  setQuizMode: (mode: QuizMode) => void
  startQuizSession: () => void
  setCurrentQuestionIndex: (index: number) => void
  addQuizPoint: () => void
  setMascotState: (state: MascotState) => void
  finishQuizSession: () => void
  resetQuizSession: () => void
  resetPreferences: () => void
}

const defaultState = {
  learningModes: [] as LearningMode[],
  fontSize: 16,
  lineHeight: 1.65,
  letterSpacing: 0,
  pageTheme: 'light' as ReadingTheme,
  userName: '',
  onboardingComplete: false,
  lessonProgress: {} as Record<string, LessonProgress>,
  quizReview: {} as Record<string, QuizReviewProgress>,
  isQuizActive: false,
  quizMode: 'santai' as QuizMode,
  currentQuestionIndex: 0,
  score: 0,
  mascotState: 'idle' as MascotState,
}

type LegacyTextSize = 'normal' | 'large' | 'extra-large'

interface PersistedAppState extends Partial<AppState> {
  learningMode?: LearningMode | 'visual' | 'high-contrast'
  textSize?: LegacyTextSize
  spacingRelaxed?: boolean
  audioEnabled?: boolean
}

const isLearningMode = (value: unknown): value is LearningMode =>
  value === 'focus' || value === 'audio' || value === 'simple'

const legacyFontSizes: Record<LegacyTextSize, number> = {
  normal: 16,
  large: 19,
  'extra-large': 22,
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaultState,

      toggleLearningMode: (mode) =>
        set((s) => ({
          learningModes: s.learningModes.includes(mode)
            ? s.learningModes.filter((current) => current !== mode)
            : [...s.learningModes, mode],
        })),
      clearLearningModes: () => set({ learningModes: [] }),
      setFontSize: (fontSize) => set({ fontSize }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
      setPageTheme: (pageTheme) => set({ pageTheme }),
      setUserName: (name) => set({ userName: name }),
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),

      toggleLessonComplete: (id) =>
        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [id]: {
              ...s.lessonProgress[id],
              completed: !s.lessonProgress[id]?.completed,
              lastAccessed: Date.now(),
            },
          },
        })),

      toggleBookmark: (id) =>
        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [id]: {
              ...s.lessonProgress[id],
              bookmarked: !s.lessonProgress[id]?.bookmarked,
            },
          },
        })),

      accessLesson: (id) =>
        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [id]: {
              ...s.lessonProgress[id],
              completed: s.lessonProgress[id]?.completed ?? false,
              bookmarked: s.lessonProgress[id]?.bookmarked ?? false,
              lastAccessed: Date.now(),
            },
          },
        })),

      recordQuizAnswer: (questionId, correct) =>
        set((s) => {
          const previous = s.quizReview[questionId]
          const consecutiveCorrect = correct ? (previous?.consecutiveCorrect ?? 0) + 1 : 0
          const intervalDays = !correct
            ? 1
            : !previous
            ? 3
            : previous.consecutiveCorrect === 0
            ? 2
            : Math.min(previous.intervalDays * 2, 14)
          const now = Date.now()

          return {
            quizReview: {
              ...s.quizReview,
              [questionId]: {
                attempts: (previous?.attempts ?? 0) + 1,
                incorrectAttempts: (previous?.incorrectAttempts ?? 0) + (correct ? 0 : 1),
                consecutiveCorrect,
                intervalDays,
                lastAnsweredAt: now,
                nextReviewAt: now + intervalDays * 24 * 60 * 60 * 1000,
              },
            },
          }
        }),

      setQuizMode: (quizMode) => set({ quizMode }),
      startQuizSession: () => set({ isQuizActive: true, currentQuestionIndex: 0, score: 0, mascotState: 'idle' }),
      setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex, mascotState: 'idle' }),
      addQuizPoint: () => set((s) => ({ score: s.score + 1 })),
      setMascotState: (mascotState) => set({ mascotState }),
      finishQuizSession: () => set({ isQuizActive: false }),
      resetQuizSession: () => set({ isQuizActive: false, currentQuestionIndex: 0, score: 0, mascotState: 'idle' }),

      resetPreferences: () =>
        set((s) => ({
          ...defaultState,
          userName: s.userName,
          onboardingComplete: s.onboardingComplete,
          lessonProgress: s.lessonProgress,
          quizReview: s.quizReview,
        })),
    }),
    {
      name: 'temanakses-storage',
      version: 3,
      partialize: ({
        isQuizActive: _isQuizActive,
        quizMode: _quizMode,
        currentQuestionIndex: _currentQuestionIndex,
        score: _score,
        mascotState: _mascotState,
        ...persisted
      }) => persisted,
      migrate: (persistedState, version) => {
        const saved = (persistedState ?? {}) as PersistedAppState
        if (version >= 2) return { ...defaultState, ...saved } as AppState

        const {
          learningMode: legacyMode,
          textSize: legacyTextSize = 'normal',
          spacingRelaxed: legacySpacingRelaxed = false,
          audioEnabled: legacyAudioEnabled = false,
          ...current
        } = saved
        const learningModes = new Set(
          (Array.isArray(current.learningModes) ? current.learningModes : []).filter(isLearningMode)
        )

        if (isLearningMode(legacyMode)) learningModes.add(legacyMode)
        if (legacyAudioEnabled) learningModes.add('audio')

        return {
          ...defaultState,
          ...current,
          learningModes: [...learningModes],
          fontSize: current.fontSize ?? legacyFontSizes[legacyTextSize],
          lineHeight: current.lineHeight ?? 1.65,
          letterSpacing: current.letterSpacing ?? (legacySpacingRelaxed ? 0.04 : 0),
          pageTheme: current.pageTheme ?? (legacyMode === 'high-contrast' ? 'high-contrast' : 'light'),
        } as AppState
      },
    }
  )
)
