"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"

import { LiveCover } from "@/components/catalog/live-cover"
import { cn } from "@/lib/utils"
import type { ScenarioGroup } from "@/registry/scenarios"

export type ScenarioCard = {
  slug: string
  label: string
  summary: string
  href: string
  demo: string
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
  shown: string
  openDemo: string
}

const GROUP_ORDER: ScenarioGroup[] = ["local", "product", "content", "events"]

/**
 * Сетка сценариев с фильтрами по сфере и теме. Фильтры — чистое клиентское
 * состояние: 27 карточек уже на странице, серверный раунд был бы дороже,
 * чем спрятать лишние. Карточка целиком ведёт на рецепт, демо — иконкой
 * в углу постера, чтобы не плодить по две кнопки на карточку.
 */
export function ScenariosGrid({ cards, text }: { cards: ScenarioCard[]; text: ScenarioGridText }) {
  const [group, setGroup] = useState<ScenarioGroup | "all">("all")
  const [tone, setTone] = useState<"light" | "dark" | "all">("all")

  const visible = useMemo(
    () => cards.filter((card) => (group === "all" || card.group === group) && (tone === "all" || card.tone === tone)),
    [cards, group, tone],
  )

  const groupCounts = useMemo(() => {
    const counts = { all: cards.length } as Record<ScenarioGroup | "all", number>
    for (const key of GROUP_ORDER) counts[key] = cards.filter((card) => card.group === key).length
    return counts
  }, [cards])

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Сфера">
          <Chip active={group === "all"} onClick={() => setGroup("all")}>
            {text.all} <Count>{groupCounts.all}</Count>
          </Chip>
          {GROUP_ORDER.map((key) => (
            <Chip key={key} active={group === key} onClick={() => setGroup(key)}>
              {text.groups[key]} <Count>{groupCounts[key]}</Count>
            </Chip>
          ))}
        </div>
        <div className="flex gap-1.5" role="group" aria-label="Тема">
          <Chip active={tone === "all"} onClick={() => setTone("all")}>
            {text.all}
          </Chip>
          <Chip active={tone === "light"} onClick={() => setTone("light")}>
            <i className="border-shell-border-strong size-2.5 rounded-full border bg-white" aria-hidden="true" />
            {text.tones.light}
          </Chip>
          <Chip active={tone === "dark"} onClick={() => setTone("dark")}>
            <i className="size-2.5 rounded-full bg-neutral-900" aria-hidden="true" />
            {text.tones.dark}
          </Chip>
        </div>
        <span className="text-shell-muted ml-auto text-xs tabular-nums" aria-live="polite">
          {text.shown} {visible.length} / {cards.length}
        </span>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((card) => (
          <li key={card.slug}>
            <article className="border-shell-border bg-shell-panel acc-lift group relative flex h-full flex-col overflow-hidden rounded-xl border">
              <div className="relative">
                <LiveCover src={card.demo} title={card.label} poster={`/demo/scenarios/${card.slug}.webp`} />
                <Link
                  href={card.demo}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${text.openDemo}: ${card.label}`}
                  className="bg-shell-panel/90 text-shell-fg hover:bg-shell-accent hover:text-shell-accent-fg absolute top-2 right-2 z-20 inline-flex size-8 items-center justify-center rounded-full opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
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
        ))}
      </ul>
    </>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "acc-press inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
        active
          ? "border-shell-accent bg-shell-accent text-shell-accent-fg"
          : "border-shell-border text-shell-fg hover:border-shell-border-strong",
      )}
    >
      {children}
    </button>
  )
}

function Count({ children }: { children: React.ReactNode }) {
  return <span className="opacity-60 tabular-nums">{children}</span>
}
