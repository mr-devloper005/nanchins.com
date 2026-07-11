import Link from 'next/link'
import { Building2, ChevronRight, FileText, Image as ImageIcon, MapPin, Megaphone, Search, Sparkles, Star, UserRound, Bookmark } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

const pastelPanels = [
  'bg-[rgba(255,248,232,0.9)]',
  'bg-[rgba(221,237,231,0.86)]',
  'bg-[rgba(252,231,216,0.82)]',
  'bg-[rgba(232,227,244,0.72)]',
  'bg-[rgba(210,234,228,0.76)]',
  'bg-[rgba(248,246,238,0.92)]',
]

const sectionShell = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'
const hiddenTaskLinks = new Set<TaskKey>(['classified', 'profile'])

function getExcerpt(post?: SitePost | null, limit = 120) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function getCategory(post?: SitePost | null, fallback = 'Featured') {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function poolFrom(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function ratingOf(post: SitePost) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const real = Number(content.rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  const seed = (post.slug || post.id || post.title || '').length
  return Math.round((4 + (seed % 8) / 10) * 10) / 10
}

function groupedPosts(posts: SitePost[], size: number) {
  const out: SitePost[][] = []
  for (let index = 0; index < posts.length; index += size) out.push(posts.slice(index, index + size))
  return out
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < Math.round(rating) ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[rgba(99,103,255,0.22)] text-[rgba(99,103,255,0.22)]'}`}
        />
      ))}
    </span>
  )
}

function FeaturedCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-[2rem] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)] shadow-[0_28px_80px_rgba(99,103,255,0.28)]">
      <div className="absolute inset-0">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(99,103,255,0.08),rgba(99,103,255,0.92))]" />
      </div>
      <div className="relative flex min-h-[420px] flex-col justify-end p-8 sm:min-h-[520px] sm:p-10">
        <span className="w-fit rounded-full bg-[rgba(255,219,253,0.12)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
          Featured spotlight
        </span>
        <h2 className="editable-display mt-5 max-w-3xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
          {post.title}
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[rgba(255,219,253,0.8)] sm:text-base">{getExcerpt(post, 180)}</p>
        <div className="mt-6 flex items-center gap-3">
          <Stars rating={ratingOf(post)} />
          <span className="text-sm font-semibold">{ratingOf(post).toFixed(1)}</span>
        </div>
        <span className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--slot4-dark-text)]/88">
          Open page
        </span>
      </div>
    </Link>
  )
}

function CompactBubbleCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-[1.5rem] bg-[var(--slot4-surface-bg)] p-4 shadow-[0_16px_34px_rgba(99,103,255,0.16)] transition hover:-translate-y-1">
      <img src={getEditablePostImage(post)} alt={post.title} className="h-16 w-16 rounded-full object-cover ring-4 ring-[var(--slot4-cream)]" />
      <div className="min-w-0">
        <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getCategory(post)}</p>
        <h3 className="line-clamp-2 text-base font-bold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</h3>
      </div>
    </Link>
  )
}

function EditorialRow({ post, href, index, tone = 'light' }: { post: SitePost; href: string; index: number; tone?: 'light' | 'dark' }) {
  const isDark = tone === 'dark'
  return (
    <Link
      href={href}
      className={`group flex items-start gap-4 border-b py-4 last:border-b-0 ${isDark ? 'border-[rgba(255,219,253,0.12)]' : 'border-[var(--editable-border)]'}`}
    >
      <span className="editable-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-lg font-semibold text-[var(--slot4-dark-text)]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isDark ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-accent-fill)]'}`}>{getCategory(post)}</p>
        <h3 className={`mt-1 text-xl font-bold leading-tight ${isDark ? 'text-[var(--slot4-dark-text)] group-hover:text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent-fill)]'}`}>{post.title}</h3>
        <p className={`mt-2 line-clamp-2 text-sm leading-6 ${isDark ? 'text-[rgba(255,219,253,0.8)]' : 'text-[var(--slot4-muted-text)]'}`}>{getExcerpt(post, 95)}</p>
      </div>
      <ChevronRight className={`mt-2 h-5 w-5 shrink-0 transition ${isDark ? 'text-[rgba(255,219,253,0.48)] group-hover:text-[var(--slot4-accent)]' : 'text-[var(--slot4-soft-muted-text)] group-hover:text-[var(--slot4-accent-fill)]'}`} />
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.75rem] bg-[var(--slot4-surface-bg)] shadow-[0_18px_38px_rgba(99,103,255,0.16)] transition hover:-translate-y-1">
      <div className="relative aspect-[5/4] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[rgba(255,219,253,0.92)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-dark-bg)]">
          {getCategory(post)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-2xl font-bold leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

function DirectoryPanel({ title, route, posts, tone, icon: Icon }: { title: string; route: string; posts: SitePost[]; tone: string; icon: typeof FileText }) {
  return (
    <div className={`rounded-[1.75rem] ${tone} px-5 pb-6 pt-5 shadow-[0_18px_36px_rgba(99,103,255,0.16)]`}>
      <div className="flex items-center justify-between">
        <h3 className="text-center text-2xl font-bold text-[var(--slot4-page-text)]">{title}</h3>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(255,219,253,0.72)] text-[var(--slot4-dark-bg)]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-4 lg:grid-cols-1 xl:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <Link key={post.slug || post.id} href={`${route}/${post.slug}`} className="group text-center">
            <img src={getEditablePostImage(post)} alt={post.title} className="mx-auto h-16 w-16 rounded-full object-cover ring-4 ring-[rgba(255,219,253,0.82)]" />
            <p className="mt-3 line-clamp-2 text-sm font-semibold text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent-fill)]">{post.title}</p>
          </Link>
        ))}
      </div>
      <div className="mt-5 text-center">
        <Link href={route} className="text-sm font-bold text-[var(--slot4-accent-fill)] transition hover:underline">View all</Link>
      </div>
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolFrom(posts, timeSections)
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled && !hiddenTaskLinks.has(task.key))
  const feature = pool[0]
  const panels = categories.slice(0, 3).map((task, index) => ({
    task,
    tone: pastelPanels[index % pastelPanels.length],
    posts: pool.slice(index * 4, index * 4 + 4),
  }))

  return (
    <section className="relative overflow-hidden pb-10 pt-8 sm:pb-14">
      <div className="absolute inset-x-0 top-0 h-[540px] bg-[linear-gradient(180deg,#DDEDE7_0%,#EDF5F0_58%,rgba(248,246,238,0)_100%)]" />
      <div className={`relative ${sectionShell}`}>
        <div className="flex flex-col items-center text-center text-[var(--slot4-dark-text)]">
          <p className="rounded-full border border-[rgba(255,219,253,0.14)] bg-[rgba(255,219,253,0.08)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
            {pagesContent.home.hero.badge || 'Discover better choices'}
          </p>
          <h1 className="editable-display mt-8 max-w-4xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.05em] sm:text-5xl lg:text-[4.2rem]">
            Fast, polished discovery for service buyers
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)] sm:text-lg">
            Explore trusted offers, standout profiles, and timely posts through a marketplace-style homepage built for quick comparisons.
          </p>
          <p className="mt-3 text-2xl font-bold text-[var(--slot4-accent)]">Skilled, trusted, and easy to browse.</p>

          <form action="/search" className="mt-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-[1.15rem] bg-[var(--slot4-surface-bg)] shadow-[0_20px_60px_rgba(99,103,255,0.26)] sm:flex-row">
            <div className="flex items-center gap-3 border-b border-[var(--editable-border)] px-5 py-4 sm:min-w-[240px] sm:border-b-0 sm:border-r">
              <MapPin className="h-5 w-5 text-[var(--slot4-muted-text)]" />
              <span className="text-sm font-semibold text-[var(--slot4-page-text)]">{SITE_CONFIG.name}</span>
            </div>
            <div className="flex flex-1 items-center gap-3 px-5 py-4">
              <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
              <input
                name="q"
                placeholder={pagesContent.home.hero.searchPlaceholder || 'Find your service'}
                className="w-full bg-transparent text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
              />
            </div>
          </form>
        </div>

        <div className="relative mt-12 grid gap-4 lg:grid-cols-3">
          {panels.map(({ task, posts: taskPosts, tone }, index) => {
            const Icon = taskIcon[task.key] || Sparkles
            return (
              <DirectoryPanel
                key={task.key}
                title={task.label}
                route={task.route}
                posts={taskPosts}
                tone={tone}
                icon={index === 0 ? Icon : Icon}
              />
            )
          })}
        </div>

        {feature ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <FeaturedCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} />
            <div className="grid gap-4">
              {pool.slice(1, 5).map((post) => (
                <CompactBubbleCard key={post.slug || post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolFrom(posts, timeSections).slice(0, 8)
  if (!pool.length) return null

  return (
    <section className="py-14">
      <div className={sectionShell}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="editable-display text-3xl font-semibold tracking-[-0.04em]">Discover major picks</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">A browsable collection of high-interest posts pulled from the latest feed.</p>
          </div>
          <Link href={primaryRoute} className="hidden text-sm font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)] hover:underline sm:inline-flex">
            See all
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pool.map((post) => (
            <ImageFirstCard key={post.slug || post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolFrom(posts, timeSections)
  const left = pool.slice(0, 3)
  const right = pool.slice(3, 9)
  if (!pool.length) return null

  return (
    <section className="bg-[var(--slot4-dark-bg)] py-16 text-[var(--slot4-dark-text)]">
      <div className={sectionShell}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Guided discovery</p>
          <h2 className="editable-display mt-3 text-4xl font-semibold tracking-[-0.04em]">Compare standout options in one place</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--slot4-muted-text)]">A fresh comparison section designed to surface strong options quickly.</p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {left.map((post) => (
            <div key={post.slug || post.id} className="rounded-[1.75rem] bg-[rgba(255,219,253,0.08)] p-5 shadow-[0_18px_36px_rgba(99,103,255,0.28)] backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <img src={getEditablePostImage(post)} alt={post.title} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-3xl font-bold leading-tight">{post.title}</h3>
                </div>
              </div>
              <div className="mt-6 space-y-1">
                {right.slice(0, 4).map((item, index) => (
                  <EditorialRow key={`${post.slug || post.id}-${item.slug || item.id}`} post={item} href={postHref(primaryTask, item, primaryRoute)} index={index} tone="dark" />
                ))}
              </div>
              <Link href={postHref(primaryTask, post, primaryRoute)} className="mt-6 inline-flex text-sm font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent)] transition hover:underline">
                Open page
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const sectionCopy: Record<string, { title: string; text: string }> = {
  spotlight: { title: 'Fresh this week', text: 'New activity grouped into clean comparison rows.' },
  browse: { title: 'Popular pathways', text: 'Browse what people are likely to open next.' },
  index: { title: 'Worth a second look', text: 'Editorial-style picks arranged for deeper reading.' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
          { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
          { key: 'index', posts: posts.slice(12, 18), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sectionIndex) => {
        const copy = sectionCopy[section.key] || sectionCopy.spotlight
        const chunks = groupedPosts(section.posts.slice(0, 9), 3)
        return (
          <section key={section.key} className={sectionIndex % 2 === 0 ? 'bg-[rgba(221,237,231,0.5)] py-14' : 'py-14'}>
            <div className={sectionShell}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="editable-display text-3xl font-semibold tracking-[-0.04em]">{copy.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--slot4-muted-text)]">{copy.text}</p>
                </div>
                <Link href={section.href || primaryRoute} className="hidden text-sm font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)] hover:underline sm:inline-flex">
                  Browse all
                </Link>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-3">
                {chunks.map((group, groupIndex) => (
                  <div
                    key={`${section.key}-${groupIndex}`}
                    className={`rounded-[1.75rem] border border-[var(--editable-border)] ${pastelPanels[(sectionIndex + groupIndex) % pastelPanels.length]} p-5 shadow-[0_16px_34px_rgba(99,103,255,0.16)]`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-[var(--slot4-page-text)]">{taskLabel(primaryTask)}</h3>
                      <span className="rounded-full bg-[rgba(255,219,253,0.78)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">
                        Set {groupIndex + 1}
                      </span>
                    </div>
                    <div className="mt-4 space-y-1 rounded-[1.2rem] bg-[rgba(255,219,253,0.8)] px-4 py-2">
                      {group.map((post, index) => (
                        <EditorialRow key={post.slug || post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                      ))}
                    </div>
                    <div className="mt-5">
                      <Link href={section.href || primaryRoute} className="inline-flex text-sm font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)] transition hover:underline">
                        View all
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export function EditableHomeCta() {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled && !hiddenTaskLinks.has(task.key))

  return (
    <section id="get-app" className="py-16">
      <div className={sectionShell}>
        <div className="rounded-[2rem] bg-[var(--slot4-surface-bg)] px-6 py-10 shadow-[0_22px_48px_rgba(99,103,255,0.18)] sm:px-8">
          <h2 className="editable-display text-4xl font-semibold tracking-[-0.04em] text-[var(--slot4-page-text)]">
            One destination for profiles, offers, and useful discovery
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--slot4-muted-text)]">
            Browse by format, compare with confidence, and move into the section that fits what you need most.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((task) => (
              <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent-fill)] hover:underline">
                {task.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
