import type { GlossaryTerm } from '../data/materials'

interface GlossaryTextProps {
  text: string
  terms: GlossaryTerm[]
  onSelect: (term: GlossaryTerm) => void
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function GlossaryText({ text, terms, onSelect }: GlossaryTextProps) {
  if (terms.length === 0) return <>{text}</>

  const termByName = new Map(terms.map((term) => [term.term.toLocaleLowerCase(), term]))
  const pattern = new RegExp(`\\b(${terms.map((term) => escapeRegExp(term.term)).sort((a, b) => b.length - a.length).join('|')})\\b`, 'gi')
  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, index) => {
        const term = termByName.get(part.toLocaleLowerCase())
        if (!term) return part

        return (
          <button
            key={`${term.term}-${index}`}
            type="button"
            onClick={() => onSelect(term)}
            className="cursor-help rounded-sm border-b border-dotted border-primary-600 bg-primary-50/60 px-0.5 text-inherit underline decoration-dotted underline-offset-2 hover:bg-primary-100"
            aria-label={`Lihat arti ${term.term}`}
          >
            {part}
          </button>
        )
      })}
    </>
  )
}