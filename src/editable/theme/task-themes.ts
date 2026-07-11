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
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#F8F6EE',
  surface: 'rgba(255,253,247,0.96)',
  raised: 'rgba(221,237,231,0.72)',
  text: '#173D3A',
  muted: '#5F7D76',
  line: 'rgba(23,61,58,0.16)',
  accent: '#E76F51',
  accentSoft: 'rgba(231,111,81,0.13)',
  onAccent: '#FFFDF7',
  glow: 'rgba(42,140,130,0.16)',
  radius: '1.6rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

const lightBase = {
  ...darkBase,
  dark: false,
  bg: '#F2F8F4',
  surface: 'rgba(255,253,247,0.96)',
  raised: 'rgba(221,237,231,0.76)',
  text: '#173D3A',
  muted: '#5F7D76',
  line: 'rgba(23,61,58,0.16)',
  glow: 'rgba(42,140,130,0.14)',
  onAccent: '#FFFDF7',
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
    '--slot4-accent-fill': '#E76F51',
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
