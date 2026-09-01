"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Pagination015Props = {
  page?: number
  total?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: поле перехода не обязано жить отдельной строкой — сам номер
// страницы и есть поле. Клик или Enter на числе превращает его в инпут прямо
// на месте; Enter подтверждает и проверяет диапазон, Escape отменяет правку
// без следа. Ряд не растёт вторым этажом ради одной цифры.
const STYLES = `
:where([data-vibeui-block="pagination-015"]){
--vibeui-pagination-015-bg:oklch(1 0 0);
--vibeui-pagination-015-fg:oklch(0.24 0.014 265);
--vibeui-pagination-015-muted:oklch(0.55 0.014 265);
--vibeui-pagination-015-border:oklch(0.91 0.006 265);
--vibeui-pagination-015-field:oklch(0.97 0.003 265);
--vibeui-pagination-015-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-015-bad:oklch(0.58 0.19 26);
--vibeui-pagination-015-accent:oklch(0.55 0.2 262);
--vibeui-pagination-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
 * Пагинация с номером страницы, который сам становится полем ввода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination015({
  page: initialPage = 12,
  total = 48,
  accent,
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
        data-vibeui-block="pagination-015"
        aria-label="Страницы"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <button
            type="button"
            data-part="step"
            disabled={page === 1}
            aria-label="Предыдущая страница"
            onClick={() => setPage(Math.max(page - 1, 1))}
          >
            ← Назад
          </button>
          <p data-part="readout">
            Страница
            {editing ? (
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                min={1}
                max={total}
                value={draft}
                aria-label={`Номер страницы, от 1 до ${total}`}
                aria-invalid={bad || undefined}
                aria-describedby={bad ? "vibeui-pagination-015-error" : undefined}
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
                aria-label={`Текущая страница ${page} из ${total}, изменить номер`}
                onClick={startEdit}
              >
                {page}
              </button>
            )}
            из {total}
          </p>
          <button
            type="button"
            data-part="step"
            disabled={page === total}
            aria-label="Следующая страница"
            onClick={() => setPage(Math.min(page + 1, total))}
          >
            Вперёд →
          </button>
        </div>
        {bad ? (
          <p id="vibeui-pagination-015-error" data-part="error" role="alert">
            Введите номер от 1 до {total}
          </p>
        ) : null}
      </nav>
    </>
  )
}
