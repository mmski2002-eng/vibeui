"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { CopyItemLink } from "@/components/account/item-actions"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { localePath, type Locale } from "@/lib/i18n"

export type HistoryRow = {
  name: string
  title: string
  href: string
  docUrl: string | null
  /** Ключ месяца, YYYY-MM: по нему работает выбор периода. */
  period: string
  periodTitle: string
  takenAt: string
}

const PAGE = 30

/**
 * История: компактные строки, поиск и месяц.
 *
 * Раньше страница отдавала до четырёхсот строк одним куском, без поиска и
 * без продолжения. Пагинация здесь клиентская: данные уже пришли, а
 * прокрутка длинного списка на телефоне дороже лишней кнопки.
 */
export function HistoryList({
  locale,
  rows,
}: {
  locale: Locale
  rows: HistoryRow[]
}) {
  const t = ACCOUNT_TEXTS[locale].history
  const [needle, setNeedle] = useState("")
  const [period, setPeriod] = useState("all")
  const [shown, setShown] = useState(PAGE)

  const periods = useMemo(() => {
    const seen = new Map<string, string>()

    for (const row of rows) seen.set(row.period, row.periodTitle)

    return [...seen.entries()]
  }, [rows])

  const visible = useMemo(() => {
    const query = needle.trim().toLowerCase()

    return rows.filter((row) => {
      if (period !== "all" && row.period !== period) return false
      if (!query) return true

      return (
        row.title.toLowerCase().includes(query) ||
        row.name.toLowerCase().includes(query)
      )
    })
  }, [needle, period, rows])

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
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

        {periods.length > 1 ? (
          <label className="text-shell-muted flex items-center gap-2 text-sm">
            <span className="sr-only sm:not-sr-only">{t.allMonths}</span>
            <select
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value)
                setShown(PAGE)
              }}
              className="border-shell-border bg-shell-elevated text-shell-fg focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"
            >
              <option value="all">{t.allMonths}</option>
              {periods.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="text-shell-muted mt-8 text-sm">{t.nothingFound}</p>
      ) : (
        <>
          <ul className="border-shell-border mt-6 divide-y divide-[var(--shell-divider)] rounded-2xl border">
            {visible.slice(0, shown).map((row) => (
              <li
                key={`${row.period}-${row.name}`}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={localePath(locale, row.href)}
                    className="text-shell-fg hover:text-shell-accent-text block truncate text-sm transition-colors"
                  >
                    {row.title}
                  </Link>
                  <p className="text-shell-muted truncate font-mono text-xs">
                    {row.name}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-shell-muted text-xs tabular-nums">
                    {row.takenAt}
                  </span>
                  <CopyItemLink url={row.docUrl} locale={locale} />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {visible.length > shown ? (
              <button
                type="button"
                onClick={() => setShown((was) => was + PAGE)}
                className="border-shell-border text-shell-fg hover:border-shell-accent inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
              >
                {t.more}
              </button>
            ) : null}
            <p className="text-shell-muted text-xs tabular-nums">
              {t.shown(Math.min(shown, visible.length), visible.length)}
            </p>
          </div>
        </>
      )}
    </>
  )
}
