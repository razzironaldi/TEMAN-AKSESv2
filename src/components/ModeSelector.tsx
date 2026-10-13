import {
  Palette,
  Target,
  SpeakerHigh,
  ListChecks,
  CircleHalf,
  Check,
} from '@phosphor-icons/react'
import { useStore } from '../store'
import { learningModes } from '../data/modes'
import { cn } from '../lib/cn'

const iconMap: Record<string, React.ComponentType<{ size?: number; weight?: 'light' | 'regular' | 'bold' }>> = {
  Palette,
  Target,
  SpeakerHigh,
  ListChecks,
  CircleHalf,
}

interface ModeSelectorProps {
  compact?: boolean
  stacked?: boolean
}

export function ModeSelector({ compact, stacked }: ModeSelectorProps) {
  const { learningModes: selectedModes, toggleLearningMode, clearLearningModes } = useStore()

  return (
    <div
      className={cn(
        'grid gap-3',
        stacked
          ? 'grid-cols-1'
          : compact
          ? 'grid-cols-2 sm:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      )}
      role="group"
      aria-label="Preferensi belajar, bisa memilih lebih dari satu"
    >
      {learningModes.map((mode) => {
        const active = mode.id === 'visual' ? selectedModes.length === 0 : selectedModes.includes(mode.id)
        const Icon = iconMap[mode.icon]
        return (
          <button
            key={mode.id}
            aria-pressed={active}
            onClick={() => mode.id === 'visual' ? clearLearningModes() : toggleLearningMode(mode.id)}
            className={cn(
              'relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer',
              active
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'border-border bg-surface hover:border-primary-300 hover:bg-surface-elevated'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                active ? 'bg-primary-600 text-white' : 'bg-surface-muted text-text-secondary'
              )}
            >
              {Icon && <Icon size={20} weight={active ? 'bold' : 'regular'} />}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-text-primary">{mode.name}</p>
              {!compact && (
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {mode.description}
                </p>
              )}
              {compact && (
                <p className="text-xs text-text-muted">{mode.short}</p>
              )}
            </div>
            {active && (
              <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white">
                <Check size={12} weight="bold" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
