"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"

import { useFavorites } from "@/components/catalog/favorites-provider"
import { LikeButton } from "@/components/catalog/like-button"
import { LiveCover } from "@/components/catalog/live-cover"
import { useSession } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { ScenarioGroup } from "@/registry/scenarios"

export type ScenarioCard = {
  slug: string
  label: string
  summary: string
  href: string
  demo: string
  poster: string
  group: ScenarioGroup
  tone: "light" | "dark"
  blocks: number
  blocksLabel: string
  isNew: boolean
}

export type ScenarioGridText = {
  all: string
  groups: Record<ScenarioGroup, string>
  tones: { light: string; dark: string }
  openDemo: string
  favourite: string
}

/** Ключ сценария в таблице избранного: та же таблица, что у items каталога. */
export function scenarioFavoriteName(slug: string) {
  return `scenario:${slug}`
}

const GROUP_ORDER: ScenarioGroup[] = ["local", "product", "content", "events"]

/**
 * Сетка сценариев с фильтрами по сфере и теме. Фильтры — чистое клиентское
 * состояние: 27 карточек уже на странице, серверный раунд был бы дороже,
 * чем спрятать лишние. Сфера — табы на общей линии (главный фильтр), тема —
 * нейтральный segmented control справа: два разных языка, чтобы группы не
 * сливались в один ряд одинаковых чипов, а оранжевый остался бейджам NEW.
 * Карточка целиком ведёт на рецепт, демо — иконкой в углу постера.
 *
 * Порядок — по числу добавлений в избранное всеми пользователями, при
 * равенстве новые выше. Считается по снимку на момент загрузки: иначе
 * карточка уезжала бы из-под курсора в момент нажатия на сердце.
 */
export function ScenariosGrid({
  cards,
  text,
  locale,
}: {
  cards: ScenarioCard[]
  text: ScenarioGridText
  locale: Locale
}) {
  const [group, setGroup] = useState<ScenarioGroup | "all">("all")
  const [tone, setTone] = useState<"light" | "dark" | "all">("all")
  const { items: favorites, counts, pinnedCounts: order, toggle } = useFavorites()
  const signedIn = Boolean(useSession().data)
  const router = useRouter()

  const visible = useMemo(() => {
    const filtered = cards.filter(
      (card) => (group === "all" || card.group === group) && (tone === "all" || card.tone === tone),
    )
    if (!order) return filtered
    const likes = (card: ScenarioCard) => order[scenarioFavoriteName(card.slug)] ?? 0
    return [...filtered].sort((a, b) => likes(b) - likes(a))
  }, [cards, group, tone, order])

  function onFavourite(slug: string) {
    if (!signedIn) {
      router.push(localePath(locale, "/signup"))
      return
    }
    toggle(scenarioFavoriteName(slug))
  }

  const groupCounts = useMemo(() => {
    const totals = { all: cards.length } as Record<ScenarioGroup | "all", number>
    for (const key of GROUP_ORDER) totals[key] = cards.filter((card) => card.group === key).length
    return totals
  }, [cards])

  return (
    <>
      <div className="border-shell-border mb-6 flex items-end justify-between gap-4 border-b">
        <div
          className="-mb-px flex min-w-0 flex-1 gap-x-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Сфера"
        >
          <Tab active={group === "all"} onClick={() => setGroup("all")}>
            {text.all} <Count>{groupCounts.all}</Count>
          </Tab>
          {GROUP_ORDER.map((key) => (
            <Tab key={key} active={group === key} onClick={() => setGroup(key)}>
              {text.groups[key]} <Count>{groupCounts[key]}</Count>
            </Tab>
          ))}
        </div>
        <div
          className="border-shell-border bg-shell-panel mb-2 inline-flex h-8 shrink-0 items-center rounded-lg border p-0.5"
          role="group"
          aria-label="Тема"
        >
          <Segment active={tone === "all"} onClick={() => setTone("all")} label={text.all}>
            <i
              className="border-shell-border-strong size-2.5 rounded-full border bg-[linear-gradient(90deg,#fff_50%,#171717_50%)]"
              aria-hidden="true"
            />
          </Segment>
          <Segment active={tone === "light"} onClick={() => setTone("light")} label={text.tones.light}>
            <i className="border-shell-border-strong size-2.5 rounded-full border bg-white" aria-hidden="true" />
          </Segment>
          <Segment active={tone === "dark"} onClick={() => setTone("dark")} label={text.tones.dark}>
            <i className="size-2.5 rounded-full bg-neutral-900" aria-hidden="true" />
          </Segment>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((card) => {
          const favName = scenarioFavoriteName(card.slug)
          const favourite = favorites?.has(favName) ?? false
          const likes = counts[favName] ?? 0
          return (
          <li key={card.slug}>
            <article className="border-shell-border bg-shell-panel acc-lift group relative flex h-full flex-col overflow-hidden rounded-xl border">
              <div className="relative">
                <LiveCover src={card.demo} title={card.label} poster={card.poster} />
                <LikeButton
                  active={favourite}
                  count={likes}
                  label={text.favourite}
                  onClick={() => onFavourite(card.slug)}
                  className="absolute top-2 right-2 z-20"
                />
                <Link
                  href={card.demo}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${text.openDemo}: ${card.label}`}
                  className="bg-shell-panel/90 text-shell-fg hover:bg-shell-accent hover:text-shell-accent-fg absolute top-2 right-12 z-20 inline-flex size-8 items-center justify-center rounded-full opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                {card.isNew ? (
                  <span className="bg-shell-accent text-shell-accent-fg absolute top-2 left-2 z-20 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                    new
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 items-start justify-between gap-2 p-3">
                <h2 className="text-shell-fg text-sm leading-snug font-medium">
                  <Link href={card.href} className="after:absolute after:inset-0 after:z-10">
                    {card.label}
                  </Link>
                </h2>
                <span className="text-shell-muted flex shrink-0 items-center gap-1.5 text-xs tabular-nums">
                  <i
                    className={cn("size-2 rounded-full", card.tone === "dark" ? "bg-neutral-900" : "border-shell-border-strong border bg-white")}
                    aria-hidden="true"
                  />
                  {card.blocksLabel}
                </span>
              </div>
            </article>
          </li>
          )
        })}
      </ul>
    </>
  )
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      onClick={onClick}
      aria-selected={active}
      className={cn(
        "focus-visible:ring-shell-ring inline-flex h-10 items-center gap-1.5 border-b-2 px-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none",
        active ? "border-shell-accent text-shell-fg" : "text-shell-muted hover:text-shell-fg border-transparent",
      )}
    >
      {children}
    </button>
  )
}

function Segment({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "focus-visible:ring-shell-ring inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
        active ? "bg-shell-fg text-shell" : "text-shell-muted hover:text-shell-fg",
      )}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function Count({ children }: { children: React.ReactNode }) {
  return <span className="opacity-60 tabular-nums">{children}</span>
}
