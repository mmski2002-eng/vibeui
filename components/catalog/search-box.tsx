"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Search, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import type { ItemKind } from "@/registry/categories"

/**
 * Поле поиска с подсказками по всему каталогу.
 *
 * Ищет сервер (`/api/search`): весь registry уже лежит у него в памяти,
 * поэтому браузеру не нужно возить индекс, а выдача одинакова и в подсказках,
 * и на странице результатов.
 *
 * Раздел, в котором человек стоит, поиск не сужает — он только уходит в
 * запрос параметром и поднимает своё в выдаче. Прежний поиск фильтровал
 * карточки открытой страницы, и «тарифы» на `/components` не находились
 * ничем: категория `pricing` живёт в блоках.
 */

export type Suggestion = {
  name: string
  kind: ItemKind
  category: string
  categoryLabel: string
  title: string
  description: string
}

type Outcome = {
  categories: { slug: string; kind: ItemKind; label: string; count: number }[]
  hits: Suggestion[]
  approximate: boolean
  total: number
}

/** Раздел каталога по типу item'а. Дублирует `catalogBasePath`, чтобы не
 *  тянуть в браузер весь registry ради трёх строк. */
function basePath(kind: ItemKind): string {
  return kind === "block"
    ? "/blocks"
    : kind === "animation"
      ? "/animations"
      : "/components"
}

/** Пауза перед запросом: человек печатает быстрее, чем читает подсказки. */
const DEBOUNCE = 160

export function SearchBox({
  locale,
  kind,
  initialQuery = "",
  autoFocus = false,
}: {
  locale: Locale
  /** Раздел, открытый сейчас: уходит в запрос как приоритет, не как фильтр. */
  kind?: ItemKind
  initialQuery?: string
  autoFocus?: boolean
}) {
  const t = getDictionary(locale)
  const router = useRouter()
  const listId = useId()

  const [query, setQuery] = useState(initialQuery)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const boxRef = useRef<HTMLDivElement>(null)

  const needle = query.trim()

  useEffect(() => {
    if (needle === "") {
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => {
      const parameters = new URLSearchParams({ q: needle, lang: locale })

      if (kind) {
        parameters.set("kind", kind)
      }

      fetch(`/api/search?${parameters}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: Outcome | null) => {
          setOutcome(data)
          setActive(-1)
        })
        .catch(() => {
          // Прерванный запрос — обычное дело при быстром вводе, и это не
          // повод показывать человеку ошибку.
        })
    }, DEBOUNCE)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [kind, locale, needle])

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!boxRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)

    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  const hits = outcome?.hits ?? []
  // Скринридер узнаёт активный вариант только по идентификатору: без
  // aria-activedescendant стрелки меняли подсветку молча.
  const activeId =
    active >= 0 && active < hits.length
      ? `${listId}-option-${active}`
      : undefined
  const categories = outcome?.categories ?? []
  const searchPath = `/search?q=${encodeURIComponent(needle)}`

  function submit(index: number) {
    const hit = hits[index]

    setOpen(false)

    if (hit) {
      router.push(localePath(locale, `${basePath(hit.kind)}/${hit.name}`))

      return
    }

    if (needle !== "") {
      router.push(localePath(locale, searchPath))
    }
  }

  return (
    <div ref={boxRef} className="relative min-w-0 flex-1">
      <div className="relative">
        <Search
          className="text-shell-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          /* Поле поиска не участвует в автозаполнении: рядом с демо-полем
             пароля браузер принимал его за логин и подставлял туда
             сохранённую пару. */
          autoComplete="off"
          name="vibeui-catalog-search"
          role="combobox"
          aria-expanded={open && needle !== ""}
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label={t.search.placeholder}
          placeholder={t.search.placeholder}
          autoFocus={autoFocus}
          onChange={(event) => {
            const next = event.target.value
            setQuery(next)
            setOpen(true)

            // Прошлая выдача убирается сразу, а не после ответа: пустому полю
            // подсказки не положены, и список не должен висеть от старого
            // запроса. При непустом вводе он, наоборот, остаётся до нового
            // ответа, иначе мигает на каждой букве.
            if (next.trim() === "") {
              setOutcome(null)
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              if (open) {
                setOpen(false)
              } else {
                setQuery("")
                setOutcome(null)
              }

              return
            }

            if (event.key === "Enter") {
              event.preventDefault()
              submit(active)

              return
            }

            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              setOpen(true)

              // -1 — «ничего не выбрано»: с него Enter уводит на страницу
              // результатов, а не на первую попавшуюся подсказку.
              const step = event.key === "ArrowDown" ? 1 : -1
              const next = active + step

              setActive(
                next < -1 ? hits.length - 1 : next >= hits.length ? -1 : next,
              )
            }
          }}
          className="text-shell-fg placeholder:text-shell-muted caret-shell-accent focus-visible:ring-shell-ring/35 h-9 w-full rounded-md bg-transparent pr-9 pl-9 text-sm outline-none focus-visible:ring-1"
        />

        {query !== "" ? (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setOutcome(null)
              setOpen(false)
            }}
            aria-label={t.card.close}
            className="text-shell-muted hover:text-shell-fg absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {open && needle !== "" && outcome ? (
        <div
          id={listId}
          role="listbox"
          className="border-shell-border bg-shell-elevated absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-lg border shadow-lg shadow-black/20"
        >
          {outcome.approximate && hits.length > 0 ? (
            <p className="text-shell-muted border-shell-border border-b px-3 py-2 text-xs">
              {t.search.near}
            </p>
          ) : null}

          {hits.length === 0 ? (
            <p className="text-shell-muted px-3 py-4 text-sm">
              {t.search.nothing}
            </p>
          ) : (
            <ul>
              {hits.map((hit, index) => (
                <li key={hit.name}>
                  <Link
                    href={localePath(
                      locale,
                      `${basePath(hit.kind)}/${hit.name}`,
                    )}
                    id={`${listId}-option-${index}`}
                    role="option"
                    aria-selected={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => setOpen(false)}
                    className={
                      "flex items-baseline gap-2 px-3 py-2 text-sm " +
                      (index === active
                        ? "bg-shell text-shell-fg"
                        : "text-shell-fg")
                    }
                  >
                    <span className="truncate font-medium">{hit.title}</span>
                    <span className="text-shell-muted ml-auto shrink-0 text-xs">
                      {hit.categoryLabel} · {t.search.inSection[hit.kind]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Разделы под списком: человеку часто нужен не один item, а место,
              где лежат все такие. Прежний поиск на пустой выдаче не предлагал
              ничего — и это читалось как «в каталоге такого нет». */}
          {categories.length > 0 ? (
            <div className="border-shell-border flex flex-wrap gap-1.5 border-t px-3 py-2">
              {categories.map((category) => (
                <Link
                  key={`${category.kind}/${category.slug}`}
                  href={localePath(
                    locale,
                    `${basePath(category.kind)}/${category.slug}`,
                  )}
                  onClick={() => setOpen(false)}
                  className="border-shell-border text-shell-muted hover:text-shell-fg hover:border-shell-border-strong inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors"
                >
                  {category.label}
                  <span className="tabular-nums opacity-70">
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
          ) : null}

          <Link
            href={localePath(locale, searchPath)}
            onClick={() => setOpen(false)}
            className="border-shell-border text-shell-muted hover:text-shell-fg flex items-center justify-between border-t px-3 py-2 text-xs"
          >
            {t.search.showAll}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}
