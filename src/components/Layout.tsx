import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useStore } from '../store'
import { cn } from '../lib/cn'
import { StudyCompanion } from './StudyCompanion'

export function Layout() {
  const { learningModes, pageTheme, toggleLearningMode, characterAnimationsEnabled } = useStore()
  const isQuizActive = useStore((state) => state.isQuizActive)

  return (
    <div
      className={cn(
        pageTheme === 'high-contrast' && 'high-contrast',
        pageTheme === 'soft' && 'reading-theme-soft',
        learningModes.includes('focus') && 'focus-mode',
        !characterAnimationsEnabled && 'no-character-animations'
      )}
    >
      <Navbar />
      {learningModes.includes('focus') && (
        <div
          className="flex items-center justify-center gap-3 border-b border-primary-200 bg-primary-50 px-4 py-2 text-xs text-primary-900"
          role="status"
        >
          <span>Mode Fokus aktif</span>
          <button
            type="button"
            onClick={() => toggleLearningMode('focus')}
            className="font-semibold underline underline-offset-2 hover:text-primary-700"
          >
            Matikan Fokus
          </button>
        </div>
      )}
      <main className="min-h-[calc(100dvh-4rem)] pb-20 md:pb-0">
        <Outlet />
      </main>
      <StudyCompanion key={isQuizActive ? 'quiz-active' : 'quiz-inactive'} />
    </div>
  )
}
