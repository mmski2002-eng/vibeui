"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { Search } from "lucide-react"

import { CopyItemLink, RemoveFavorite } from "@/components/account/item-actions"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Button } from "@/components/account/ui/button"
import { EmptyState } from "@/components/account/ui/empty-state"
import { localePath, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export type FavoriteCard = {
  name: string
  title: string
  kindLabel: string
  kind: string
  href: string
  docUrl: string | null
  preview: ReactNode
}

const PAGE = 12

/**
 * Избранное как рабочая панель, а не список ссылок: поиск, фильтр по типу,
 * живое превью и действия прямо на карточке.
 *
 * Фильтрация клиентская намеренно: список избранного — это десятки строк, а
 * не тысячи, и лишний круг до сервера ради подстроки заметен рукам.
 */
export function FavoritesGrid({
  locale,
  cards,
}: {
  locale: Locale
  cards: FavoriteCard[]
}) {
  const t = ACCOUNT_TEXTS[locale].favorites
  const [needle, setNeedle] = useState("")
  const [kind, setKind] = useState("all")
  const [shown, setShown] = useState(PAGE)
  const [gone, setGone] = useState<Record<string, boolean>>({})

  const kinds = useMemo(() => {
    const seen = new Map<string, string>()

    for (const card of cards) seen.set(card.kind, card.kindLabel)

    return [...seen.entries()]
  }, [cards])

  const visible = useMemo(() => {
    const query = needle.trim().toLowerCase()

    return cards.filter((card) => {
      if (kind !== "all" && card.kind !== kind) return false
      if (!query) return true

      return (
        card.title.toLowerCase().includes(query) ||
        card.name.toLowerCase().includes(query)
      )
    })
  }, [cards, kind, needle])

  return (
    <>
      <div className="acc-reveal flex flex-wrap items-center gap-3" style={{ ["--i" as string]: 1 }}>
        <label className="relative min-w-0 flex-1 sm:max-w-xs">
          <span className="sr-only">{t.search}</span>
          <Search
            aria-hidden="true"
            className="text-shell-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            value={needle}
            onChange={(event) => {
              setNeedle(event.target.value)
              setShown(PAGE)
            }}
            placeholder={t.searchPlaceholder}
            className="border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 w-full rounded-lg border pr-3 pl-9 text-sm outline-none transition-colors focus-visible:ring-2"
          />
        </label>

        {kinds.length > 1 ? (
          <div className="border-shell-border bg-shell-panel flex items-center gap-0.5 rounded-lg border p-0.5">
            <Chip
              active={kind === "all"}
              onClick={() => setKind("all")}
              label={t.filterAll}
            />
            {kinds.map(([value, label]) => (
              <Chip
                key={value}
                active={kind === value}
                onClick={() => setKind(value)}
                label={label}
              />
            ))}
          </div>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState compact icon={<Search />} title={t.nothingFound} />
        </div>
      ) : (
        <>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.slice(0, shown).map((card, position) => (
              <li
                key={card.name}
                style={{ ["--i" as string]: position + 2 }}
                className={cn(
                  "border-shell-border bg-shell-panel acc-shadow acc-lift acc-reveal overflow-hidden rounded-2xl border",
                  gone[card.name] && "opacity-60",
                )}
              >
                <div className="bg-preview-surface flex h-44 items-center justify-center overflow-hidden">
                  {card.preview}
                </div>
                <div className="border-shell-divider border-t px-4 py-3">
                  <Link
                    href={localePath(locale, card.href)}
                    className="text-shell-fg hover:text-shell-accent-text block truncate text-sm font-medium transition-colors"
                  >
                    {card.title}
                  </Link>
                  <p className="text-shell-muted mt-0.5 truncate font-mono text-xs">
                    {card.name}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <CopyItemLink url={card.docUrl} locale={locale} />
                    <RemoveFavorite
                      itemName={card.name}
                      locale={locale}
                      onRemoved={(removed) =>
                        setGone((was) => ({ ...was, [card.name]: removed }))
                      }
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {visible.length > shown ? (
            <Button
              className="mt-6"
              onClick={() => setShown((was) => was + PAGE)}
            >
              {t.more}
            </Button>
          ) : null}
        </>
      )}
    </>
  )
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "acc-press h-8 rounded-md px-2.5 text-sm",
        active
          ? "bg-shell-elevated text-shell-fg font-medium"
          : "text-shell-muted hover:text-shell-fg",
      )}
    >
      {label}
    </button>
  )
}
