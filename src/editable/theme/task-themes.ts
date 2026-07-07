import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Newsreader', Georgia, serif"
const BODY = "'Manrope', system-ui, sans-serif"

const darkBase = {
  dark: true,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#B70404',
  surface: 'rgba(219,0,91,0.22)',
  raised: 'rgba(247,147,39,0.24)',
  text: '#FFE569',
  muted: 'rgba(255,229,105,0.72)',
  line: 'rgba(255,229,105,0.18)',
  accent: '#f79327',
  accentSoft: 'rgba(247,147,39,0.12)',
  onAccent: '#B70404',
  glow: 'rgba(255,229,105,0.18)',
  radius: '1.6rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

const lightBase = {
  ...darkBase,
  dark: false,
  bg: '#FFE569',
  surface: 'rgba(255,229,105,0.96)',
  raised: 'rgba(247,147,39,0.22)',
  text: '#B70404',
  muted: '#DB005B',
  line: 'rgba(183,4,4,0.2)',
  glow: 'rgba(219,0,91,0.18)',
  onAccent: '#FFE569',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...darkBase, kicker: 'Editorial', note: 'Large reading cards, polished comparisons, and confident discovery.' },
  listing: { ...darkBase, kicker: 'Local Services', note: 'Directory-style browsing designed for quick scanning and trust signals.' },
  classified: { ...darkBase, kicker: 'Fresh Offers', note: 'Offer-first cards with strong actions and clear details.' },
  image: { ...darkBase, kicker: 'Visual Picks', note: 'Image-led discovery with a richer gallery presentation.' },
  sbm: { ...lightBase, kicker: 'Useful Links', note: 'Curated resources shown in a cleaner, softer workspace.' },
  pdf: { ...lightBase, kicker: 'Documents', note: 'Reference material arranged for easier reading and retrieval.' },
  profile: { ...lightBase, kicker: 'Profiles', note: 'People and businesses presented with a more premium identity.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': '#db005b',
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
