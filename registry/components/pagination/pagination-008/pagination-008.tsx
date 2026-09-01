"use client"

import { useState } from "react"
import type { CSSProperties, FormEvent } from "react"

export type Pagination008Props = {
  total?: number
  defaultPage?: number
  label?: string
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
--vibeui-pagination-008-bg:oklch(1 0 0);
--vibeui-pagination-008-fg:oklch(0.24 0.014 265);
--vibeui-pagination-008-muted:oklch(0.55 0.014 265);
--vibeui-pagination-008-border:oklch(0.91 0.006 265);
--vibeui-pagination-008-field:oklch(0.97 0.003 265);
--vibeui-pagination-008-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-008-bad:oklch(0.58 0.19 26);
--vibeui-pagination-008-accent:oklch(0.55 0.2 262);
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
background:var(--vibeui-pagination-008-accent);color:oklch(1 0 0);
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

/**
 * Пагинация с полем перехода к произвольному номеру страницы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination008({
  total = 148,
  defaultPage = 37,
  label = "Перейти к странице",
  accent,
  className,
  style,
}: Pagination008Props) {
  const [page, setPage] = useState(Math.min(Math.max(defaultPage, 1), total))
  const [draft, setDraft] = useState("")
  const [bad, setBad] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-pagination-008-accent": accent } : null),
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
        aria-label="Навигация по страницам"
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
            ← Назад
          </button>
          <p data-part="now" aria-current="page">
            Страница <b>{page}</b> из {total}
          </p>
          <button
            type="button"
            data-part="step"
            disabled={page === total}
            onClick={() => setPage(Math.min(page + 1, total))}
          >
            Вперёд →
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
            Перейти
          </button>
        </form>
        <p
          id="vibeui-pagination-008-note"
          data-part={bad ? "error" : "hint"}
          role={bad ? "alert" : undefined}
        >
          {bad ? `Введите номер от 1 до ${total}` : `Всего страниц: ${total}`}
        </p>
      </nav>
    </>
  )
}
