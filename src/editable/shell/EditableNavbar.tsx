'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'classified' && task.key !== 'profile').slice(0, 6).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,219,253,0.16)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,219,253,0.96)] shadow-[0_8px_18px_rgba(99,103,255,0.28)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-12 w-12 object-contain" />
          </span>
          <span className="editable-display text-[2rem] font-semibold leading-none tracking-[-0.04em] text-[var(--editable-nav-text)]">{SITE_CONFIG.name}</span>
        </Link>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}

                
                className={`text-sm font-semibold transition ${
                  active ? 'text-[var(--editable-nav-text)] underline underline-offset-4' : 'text-[rgba(255,219,253,0.76)] hover:text-[var(--editable-nav-text)] hover:underline'
                }`}





              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <form action="/search" className="hidden xl:block">
            <label className="flex h-11 min-w-[240px] items-center gap-2 rounded-full border border-[rgba(255,219,253,0.18)] bg-[rgba(255,219,253,0.08)] px-4 text-sm text-[rgba(255,219,253,0.82)]">
              <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
              <input
                name="q"
                type="search"
                placeholder="Search services, profiles, posts"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[rgba(255,219,253,0.48)]"
              />
            </label>
          </form>

          {session ? (
            <>
              <Link href="/create" className="hidden text-sm font-bold uppercase tracking-[0.16em] text-[var(--editable-nav-text)] transition hover:underline sm:inline-flex">
                List Your Business
              </Link>
              <button type="button" onClick={logout} className="hidden text-sm font-semibold text-[rgba(255,219,253,0.76)] transition hover:text-[var(--editable-nav-text)] sm:inline-flex sm:items-center">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" className="hidden text-sm font-bold uppercase tracking-[0.16em] text-[var(--editable-nav-text)] transition hover:underline sm:inline-flex">
                List Your Business
              </Link>
              <Link href="/login" className="hidden text-sm font-semibold text-[rgba(255,219,253,0.76)] transition hover:text-[var(--editable-nav-text)] hover:underline sm:inline-flex">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
