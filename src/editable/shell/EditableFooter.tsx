'use client'

import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'classified' && task.key !== 'profile')
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-[rgba(255,229,105,0.16)] bg-[rgba(219,0,91,0.18)] px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-12 w-12 object-contain" />
              <span className="editable-display text-[2rem] font-semibold tracking-[-0.04em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-[rgba(255,229,105,0.78)]">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(255,229,105,0.16)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(255,229,105,0.72)]">
              <MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> Discovery for service buyers
            </div>
          </div>

          <div>
            <div className="grid gap-2.5">
              {taskLinks.slice(0, 6).map((task) => (
                <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm text-[rgba(255,229,105,0.78)] transition hover:text-[var(--editable-footer-text)]">
                  {task.label} <ArrowUpRight className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Quick Links</h3>
            <div className="mt-5 grid gap-2.5">
              {[
                ['About', '/about'],
                ['Contact', '/contact'],
                ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
              ].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm text-[rgba(255,229,105,0.78)] transition hover:text-[var(--editable-footer-text)]">
                  {label}
                </Link>
              ))}
              {session ? (
                <button type="button" onClick={logout} className="text-left text-sm text-[rgba(255,229,105,0.78)] transition hover:text-[var(--editable-footer-text)]">
                  Logout
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Why People Use It</h3>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[rgba(255,229,105,0.78)]">
              <p>Browse providers, offers, and profiles through one polished marketplace-style experience.</p>
              <p>Move from discovery to shortlist to contact without losing context.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-[rgba(255,229,105,0.16)] pt-6 text-sm text-[rgba(255,229,105,0.58)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>{globalContent.footer?.bottomNote || 'Built for clean discovery and connected publishing.'}</p>
        </div>
      </div>
    </footer>
  )
}
