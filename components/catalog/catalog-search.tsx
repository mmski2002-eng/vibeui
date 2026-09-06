"use client"

import { Search, X } from "lucide-react"

import { getDictionary, type Locale } from "@/lib/i18n"

/**
 * Поле поиска по витрине. Ничего не решает само: значение живёт в обвязке,
 * которая прячет неподошедшие карточки и переносит запрос в адрес страницы.
 */
export function CatalogSearch({
  locale,
  value,
  onChange,
}: {
  locale: Locale
  value: string
  onChange: (next: string) => void
}) {
  const t = getDictionary(locale)

  return (
    <div className="relative min-w-0 flex-1">
      <Search
        className="text-shell-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        /* Поле поиска не участвует в автозаполнении: рядом с демо-полем
           пароля браузер принимал его за логин и подставлял туда сохранённую
           пару. */
        autoComplete="off"
        name="vibeui-catalog-search"
        aria-label={t.catalog.search}
        placeholder={t.catalog.search}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onChange("")
          }
        }}
        className="text-shell-fg placeholder:text-shell-muted h-9 w-full rounded-md bg-transparent pr-9 pl-9 text-sm outline-none"
      />

      {value !== "" ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t.card.close}
          className="text-shell-muted hover:text-shell-fg absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
