import Link from "next/link"
import { Search } from "lucide-react"

import { CopyItemLink, RemoveFavorite } from "@/components/account/item-actions"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { EmptyState } from "@/components/account/ui/empty-state"
import { PAGER_LABELS, Pager } from "@/components/account/ui/pager"
import { localePath, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export type FavoriteRow = {
  name: string
  title: string
  kindLabel: string
  kind: string
  href: string
  docUrl: string | null
  addedAt: string
}

export const FAVORITES_PER_PAGE = 20

/**
 * Избранное списком: строка на компонент — название, код, тип, дата и
 * действия. Без превью: превью есть на странице компонента, а здесь важно
 * пробежать глазами по десяткам строк и найти нужную.
 *
 * Поиск, фильтр по типу и страница живут в адресе: список растёт, и сервер
 * отдаёт только текущую страницу. Форма поиска — обычный GET, без клиентского
 * состояния.
 */
export function FavoritesList({
  locale,
  rows,
  kinds,
  total,
  page,
  query,
  kind,
}: {
  locale: Locale
  rows: FavoriteRow[]
  kinds: [string, string][]
  /** Строк после фильтра, всех страниц. */
  total: number
  page: number
  query: string
  kind: string
}) {
  const t = ACCOUNT_TEXTS[locale].favorites
  const base = localePath(locale, "/account/favorites")

  const href = (next: { page?: number; kind?: string; q?: string }) => {
    const params = new URLSearchParams()
    const q = next.q ?? query
    const k = next.kind ?? kind
    const p = next.page ?? 1

    if (q) params.set("q", q)
    if (k !== "all") params.set("kind", k)
    if (p > 1) params.set("page", String(p))

    const search = params.toString()

    return search ? `${base}?${search}` : base
  }

  return (
    <>
      <form
        action={base}
        method="get"
        className="acc-reveal flex flex-wrap items-center gap-3"
        style={{ ["--i" as string]: 1 }}
      >
        {kind !== "all" ? (
          <input type="hidden" name="kind" value={kind} />
        ) : null}
        <label className="relative min-w-0 flex-1 sm:max-w-xs">
          <span className="sr-only">{t.search}</span>
          <Search
            aria-hidden="true"
            className="text-shell-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={t.searchPlaceholder}
            className="border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 w-full rounded-lg border pr-3 pl-9 text-sm transition-colors outline-none focus-visible:ring-2"
          />
        </label>

        {kinds.length > 1 ? (
          <div className="border-shell-border bg-shell-panel flex items-center gap-0.5 rounded-lg border p-0.5">
            <Chip
              active={kind === "all"}
              href={href({ kind: "all" })}
              label={t.filterAll}
            />
            {kinds.map(([value, label]) => (
              <Chip
                key={value}
                active={kind === value}
                href={href({ kind: value })}
                label={label}
              />
            ))}
          </div>
        ) : null}
      </form>

      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState compact icon={<Search />} title={t.nothingFound} />
        </div>
      ) : (
        <>
          <ul
            className="border-shell-border bg-shell-panel acc-shadow acc-reveal divide-shell-divider mt-5 divide-y rounded-2xl border"
            style={{ ["--i" as string]: 2 }}
          >
            {rows.map((row) => (
              <li
                key={row.name}
                className="hover:bg-shell-elevated/60 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={localePath(locale, row.href)}
                    className="text-shell-fg hover:text-shell-accent-text block truncate text-sm font-medium transition-colors"
                  >
                    {row.title}
                  </Link>
                  <p className="text-shell-muted truncate font-mono text-xs">
                    {row.name}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <span className="text-shell-muted hidden text-xs sm:inline">
                    {row.kindLabel}
                  </span>
                  <span className="text-shell-muted text-xs tabular-nums">
                    {row.addedAt}
                  </span>
                  <CopyItemLink url={row.docUrl} locale={locale} />
                  <RemoveFavorite itemName={row.name} locale={locale} />
                </div>
              </li>
            ))}
          </ul>

          <Pager
            page={page}
            hasNext={page * FAVORITES_PER_PAGE < total}
            total={total}
            perPage={FAVORITES_PER_PAGE}
            href={(next) => href({ page: next })}
            labels={PAGER_LABELS[locale]}
          />
        </>
      )}
    </>
  )
}

function Chip({
  active,
  label,
  href,
}: {
  active: boolean
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "acc-press inline-flex h-8 items-center rounded-md px-2.5 text-sm",
        active
          ? "bg-shell-elevated text-shell-fg font-medium"
          : "text-shell-muted hover:text-shell-fg",
      )}
    >
      {label}
    </Link>
  )
}
