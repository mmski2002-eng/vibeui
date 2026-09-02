"use client"

import { useState } from "react"
import type { CSSProperties, FormEvent } from "react"

export type Pagination008Props = {
  total?: number
  defaultPage?: number
  label?: string
  /** Строка указателя. {page} и {total} подставляются. */
  nowText?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: пагинация для длинного списка, где номера бесполезны, а
// прыжок нужен. Поле перехода живёт в настоящей <form>: Enter отправляет её, и
// не нужен отдельный обработчик клавиши. Неверный номер не молчит — форма
// показывает подсказку рядом с полем и связывает её через aria-describedby.
const STYLES = `
:where([data-vibeui-block="pagination-008"]){
--vibeui-pagination-008-bg:transparent;
--vibeui-pagination-008-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-pagination-008-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.012 265));
--vibeui-pagination-008-border:light-dark(oklch(0.91 0.006 265),oklch(0.38 0.012 265));
--vibeui-pagination-008-field:light-dark(oklch(0.97 0.003 265),oklch(0.29 0.009 265));
--vibeui-pagination-008-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.82 0.02 265 / 14%));
--vibeui-pagination-008-bad:light-dark(oklch(0.58 0.19 26),oklch(0.72 0.16 26));
--vibeui-pagination-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-pagination-008-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0.03 262));
--vibeui-pagination-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-008"]{
box-sizing:border-box;width:100%;max-width:30rem;padding:0.625rem;
background:var(--vibeui-pagination-008-bg);color:var(--vibeui-pagination-008-fg);
border:1px solid var(--vibeui-pagination-008-border);border-radius:0.75rem;
font-family:var(--vibeui-pagination-008-font);
}
[data-vibeui-block="pagination-008"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;flex-wrap:wrap;
}
[data-vibeui-block="pagination-008"] [data-part="step"]{
appearance:none;cursor:pointer;
height:2rem;padding:0 0.75rem;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.375rem;
border:1px solid var(--vibeui-pagination-008-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="pagination-008"] [data-part="step"]:hover:not(:disabled){background:var(--vibeui-pagination-008-hover)}
[data-vibeui-block="pagination-008"] [data-part="step"]:focus-visible{outline:2px solid var(--vibeui-pagination-008-accent);outline-offset:1px}
[data-vibeui-block="pagination-008"] [data-part="step"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="pagination-008"] [data-part="now"]{
margin:0 auto;font-size:0.8125rem;color:var(--vibeui-pagination-008-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-008"] [data-part="now"] b{color:var(--vibeui-pagination-008-fg);font-weight:650}
[data-vibeui-block="pagination-008"] [data-part="form"]{
display:flex;align-items:center;gap:0.375rem;margin-top:0.5rem;
padding-top:0.5rem;border-top:1px solid var(--vibeui-pagination-008-border);
}
[data-vibeui-block="pagination-008"] [data-part="label"]{font-size:0.8125rem;color:var(--vibeui-pagination-008-muted)}
[data-vibeui-block="pagination-008"] input{
width:4.5rem;height:2rem;padding:0 0.5rem;box-sizing:border-box;
border:1px solid var(--vibeui-pagination-008-border);border-radius:0.5rem;
background:var(--vibeui-pagination-008-field);color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-008"] input:focus-visible{outline:2px solid var(--vibeui-pagination-008-accent);outline-offset:-1px;border-color:transparent}
[data-vibeui-block="pagination-008"] input[aria-invalid="true"]{border-color:var(--vibeui-pagination-008-bad)}
[data-vibeui-block="pagination-008"] [data-part="go"]{
appearance:none;cursor:pointer;height:2rem;padding:0 0.875rem;box-sizing:border-box;
border:0;border-radius:0.5rem;
background:var(--vibeui-pagination-008-accent);color:var(--vibeui-pagination-008-accent-fg);
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="pagination-008"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-pagination-008-accent);outline-offset:2px}
[data-vibeui-block="pagination-008"] [data-part="error"]{
margin:0;font-size:0.75rem;color:var(--vibeui-pagination-008-bad);
}
[data-vibeui-block="pagination-008"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-pagination-008-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-008"] *{animation:none!important;transition:none!important}}
`

const LABEL: Record<string, string> = {
  nav: "Навигация по страницам",
  prev: "← Назад",
  next: "Вперёд →",
  go: "Перейти",
  error: "Введите номер от 1 до {total}",
  hint: "Всего страниц: {total}",
}

const NOW_TEXT = "Страница {page} из {total}"

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Пагинация с полем перехода к произвольному номеру страницы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination008({
  total = 148,
  defaultPage = 37,
  label = "Перейти к странице",
  nowText = NOW_TEXT,
  labelText = LABEL,
  background = "",
  accent,
  className,
  style,
}: Pagination008Props) {
  const [page, setPage] = useState(Math.min(Math.max(defaultPage, 1), total))
  const [draft, setDraft] = useState("")
  const [bad, setBad] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-pagination-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const value = Number(draft)

    if (!Number.isInteger(value) || value < 1 || value > total) {
      setBad(true)
      return
    }

    setBad(false)
    setPage(value)
    setDraft("")
  }

  return (
    <>
      <style href="vibeui-pagination-008" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="pagination-008"
        aria-label={labelText.nav ?? LABEL.nav}
        className={className}
        style={palette}
      >
        <div data-part="row">
          <button
            type="button"
            data-part="step"
            disabled={page === 1}
            onClick={() => setPage(Math.max(page - 1, 1))}
          >
            {labelText.prev ?? LABEL.prev}
          </button>
          <p data-part="now" aria-current="page">
            {nowText
              .split(/({page}|{total})/)
              .map((part, index) =>
                part === "{page}" ? (
                  <b key={index}>{page}</b>
                ) : part === "{total}" ? (
                  String(total)
                ) : (
                  part
                ),
              )}
          </p>
          <button
            type="button"
            data-part="step"
            disabled={page === total}
            onClick={() => setPage(Math.min(page + 1, total))}
          >
            {labelText.next ?? LABEL.next}
          </button>
        </div>
        <form data-part="form" onSubmit={onSubmit}>
          <label data-part="label" htmlFor="vibeui-pagination-008-field">
            {label}
          </label>
          <input
            id="vibeui-pagination-008-field"
            type="number"
            inputMode="numeric"
            min={1}
            max={total}
            value={draft}
            placeholder={String(page)}
            aria-invalid={bad || undefined}
            aria-describedby="vibeui-pagination-008-note"
            onChange={(event) => {
              setDraft(event.target.value)
              setBad(false)
            }}
          />
          <button type="submit" data-part="go">
            {labelText.go ?? LABEL.go}
          </button>
        </form>
        <p
          id="vibeui-pagination-008-note"
          data-part={bad ? "error" : "hint"}
          role={bad ? "alert" : undefined}
        >
          {(bad
            ? (labelText.error ?? LABEL.error)
            : (labelText.hint ?? LABEL.hint)
          ).replace("{total}", String(total))}
        </p>
      </nav>
    </>
  )
}
