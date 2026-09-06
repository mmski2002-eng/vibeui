"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Pagination015Props = {
  page?: number
  total?: number
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  navLabel?: string
  prevText?: string
  nextText?: string
  prevLabel?: string
  nextLabel?: string
  /** Слово перед номером страницы. */
  readoutLabel?: string
  /** Хвост счётчика, {total} — общее число страниц. */
  totalLabel?: string
  /** Подпись поля ввода, {total} — общее число страниц. */
  inputLabel?: string
  /** Подпись номера-кнопки: {page} и {total}. */
  editLabel?: string
  /** Сообщение о неверном номере, {total} — общее число страниц. */
  errorText?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: поле перехода не обязано жить отдельной строкой — сам номер
// страницы и есть поле. Клик или Enter на числе превращает его в инпут прямо
// на месте; Enter подтверждает и проверяет диапазон, Escape отменяет правку
// без следа. Ряд не растёт вторым этажом ради одной цифры.
const STYLES = `
:where([data-vibeui-block="pagination-015"]){
--vibeui-pagination-015-bg:transparent;
--vibeui-pagination-015-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-pagination-015-muted:color-mix(in oklab,var(--vibeui-pagination-015-fg) 68%,transparent);
--vibeui-pagination-015-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-pagination-015-field:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-pagination-015-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.86 0 265 / 14%));
--vibeui-pagination-015-bad:light-dark(oklch(0.58 0.19 26),oklch(0.74 0.16 26));
--vibeui-pagination-015-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-pagination-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-015"]{color-scheme:dark}
[data-vibeui-block="pagination-015"]{
box-sizing:border-box;width:100%;max-width:24rem;padding:0.5rem;
display:flex;flex-direction:column;align-items:center;gap:0.375rem;
background:var(--vibeui-pagination-015-bg);color:var(--vibeui-pagination-015-fg);
border:1px solid var(--vibeui-pagination-015-border);border-radius:0.75rem;
font-family:var(--vibeui-pagination-015-font);
}
[data-vibeui-block="pagination-015"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
}
[data-vibeui-block="pagination-015"] [data-part="step"]{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-pagination-015-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="pagination-015"] [data-part="step"]:hover:not(:disabled){background:var(--vibeui-pagination-015-hover)}
[data-vibeui-block="pagination-015"] [data-part="step"]:focus-visible{outline:2px solid var(--vibeui-pagination-015-accent);outline-offset:1px}
[data-vibeui-block="pagination-015"] [data-part="step"]:disabled{color:var(--vibeui-pagination-015-muted);cursor:default;opacity:.5}
[data-vibeui-block="pagination-015"] [data-part="readout"]{
font-size:0.875rem;color:var(--vibeui-pagination-015-fg);font-variant-numeric:tabular-nums;
display:inline-flex;align-items:center;gap:0.3125rem;
}
[data-vibeui-block="pagination-015"] [data-part="edit"]{
appearance:none;cursor:pointer;height:1.875rem;min-width:2.25rem;padding:0 0.5rem;
box-sizing:border-box;border:1px dashed var(--vibeui-pagination-015-border);border-radius:0.4375rem;
background:none;color:inherit;font:inherit;font-size:0.875rem;font-weight:650;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-015"] [data-part="edit"]:hover{background:var(--vibeui-pagination-015-hover)}
[data-vibeui-block="pagination-015"] [data-part="edit"]:focus-visible{outline:2px solid var(--vibeui-pagination-015-accent);outline-offset:1px}
[data-vibeui-block="pagination-015"] input{
width:3.25rem;height:1.875rem;padding:0 0.375rem;box-sizing:border-box;
border:1px solid var(--vibeui-pagination-015-border);border-radius:0.4375rem;
background:var(--vibeui-pagination-015-field);color:inherit;font:inherit;font-size:0.875rem;
font-variant-numeric:tabular-nums;text-align:center;
}
[data-vibeui-block="pagination-015"] input:focus-visible{outline:2px solid var(--vibeui-pagination-015-accent);outline-offset:-1px;border-color:transparent}
[data-vibeui-block="pagination-015"] input[aria-invalid="true"]{border-color:var(--vibeui-pagination-015-bad)}
[data-vibeui-block="pagination-015"] [data-part="error"]{
margin:0;font-size:0.75rem;color:var(--vibeui-pagination-015-bad);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-015"] *{animation:none!important;transition:none!important}}
`

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
 * Пагинация с номером страницы, который сам становится полем ввода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination015({
  page: initialPage = 12,
  total = 48,
  accent,
  background = "",
  navLabel = "Страницы",
  prevText = "← Назад",
  nextText = "Вперёд →",
  prevLabel = "Предыдущая страница",
  nextLabel = "Следующая страница",
  readoutLabel = "Страница",
  totalLabel = "из {total}",
  inputLabel = "Номер страницы, от 1 до {total}",
  editLabel = "Текущая страница {page} из {total}, изменить номер",
  errorText = "Введите номер от 1 до {total}",
  className,
  style,
}: Pagination015Props) {
  const [page, setPage] = useState(Math.min(Math.max(initialPage, 1), total))
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(page))
  const [bad, setBad] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-pagination-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function startEdit() {
    setDraft(String(page))
    setBad(false)
    setEditing(true)
  }

  function finishEdit(shouldCommit: boolean) {
    if (shouldCommit) {
      const value = Number(draft)

      if (Number.isInteger(value) && value >= 1 && value <= total) {
        setPage(value)
        setEditing(false)
        setBad(false)
        return
      }

      setBad(true)
      return
    }

    setEditing(false)
    setBad(false)
  }

  function onKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      finishEdit(true)
    }

    if (event.key === "Escape") {
      finishEdit(false)
    }
  }

  return (
    <>
      <style href="vibeui-pagination-015" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="pagination"
        data-vibeui-block="pagination-015"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <div data-part="row">
          <button
            type="button"
            data-part="step"
            disabled={page === 1}
            aria-label={prevLabel}
            onClick={() => setPage(Math.max(page - 1, 1))}
          >
            {prevText}
          </button>
          <p data-part="readout">
            {readoutLabel}
            {editing ? (
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                min={1}
                max={total}
                value={draft}
                aria-label={inputLabel.replace("{total}", String(total))}
                aria-invalid={bad || undefined}
                aria-describedby={
                  bad ? "vibeui-pagination-015-error" : undefined
                }
                onChange={(event) => {
                  setDraft(event.target.value)
                  setBad(false)
                }}
                onKeyDown={onKey}
                onBlur={() => finishEdit(false)}
              />
            ) : (
              <button
                type="button"
                data-part="edit"
                aria-current="page"
                aria-label={editLabel
                  .replace("{page}", String(page))
                  .replace("{total}", String(total))}
                onClick={startEdit}
              >
                {page}
              </button>
            )}
            {totalLabel.replace("{total}", String(total))}
          </p>
          <button
            type="button"
            data-part="step"
            disabled={page === total}
            aria-label={nextLabel}
            onClick={() => setPage(Math.min(page + 1, total))}
          >
            {nextText}
          </button>
        </div>
        {bad ? (
          <p id="vibeui-pagination-015-error" data-part="error" role="alert">
            {errorText.replace("{total}", String(total))}
          </p>
        ) : null}
      </nav>
    </>
  )
}
