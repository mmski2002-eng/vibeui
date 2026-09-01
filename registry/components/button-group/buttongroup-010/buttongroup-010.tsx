"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup010Period = {
  label: string
  caption: string
}

export type Buttongroup010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  periods?: Buttongroup010Period[]
  defaultPeriod?: string
  label?: string
  onChange?: (period: string) => void
  accent?: string
}

// Идея компонента: выбор периода отчёта, который сразу отвечает, какой
// диапазон получился. Подложка выбранного — один элемент, он переезжает
// по transform на индекс сегмента, а не появляется заново у каждой кнопки:
// так глаз видит перемещение, а не мигание. Колонки трека равной ширины,
// иначе смещение на «индекс × 100%» перестало бы попадать в сегмент.
// Строка диапазона объявляется через aria-live: смена вида без слов не
// сообщает незрячему, что данные под группой уже другие.
const STYLES = `
:where([data-vibeui-block="buttongroup-010"]){
--vibeui-buttongroup-010-surface:oklch(1 0 0);
--vibeui-buttongroup-010-track:oklch(0.965 0.004 265);
--vibeui-buttongroup-010-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-010-muted:oklch(0.55 0.014 265);
--vibeui-buttongroup-010-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-010-accent:oklch(0.53 0.17 265);
--vibeui-buttongroup-010-on-accent:oklch(0.99 0.005 265);
--vibeui-buttongroup-010-radius:0.5rem;
--vibeui-buttongroup-010-count:4;
--vibeui-buttongroup-010-index:0;
--vibeui-buttongroup-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-010"]{
box-sizing:border-box;display:inline-flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;padding:0.625rem;
border:1px solid var(--vibeui-buttongroup-010-border);
border-radius:0.875rem;
background:var(--vibeui-buttongroup-010-surface);
font-family:var(--vibeui-buttongroup-010-font);
}
[data-vibeui-block="buttongroup-010"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-010"] [data-part="track"]{
position:relative;display:grid;
grid-template-columns:repeat(var(--vibeui-buttongroup-010-count),1fr);
gap:0;padding:0.1875rem;
border-radius:calc(var(--vibeui-buttongroup-010-radius) + 0.1875rem);
background:var(--vibeui-buttongroup-010-track);
}
/* Одна подложка на всю группу: она переезжает, а не перерисовывается. */
[data-vibeui-block="buttongroup-010"] [data-part="thumb"]{
position:absolute;top:0.1875rem;bottom:0.1875rem;left:0.1875rem;
width:calc((100% - 0.375rem) / var(--vibeui-buttongroup-010-count));
border-radius:var(--vibeui-buttongroup-010-radius);
background:var(--vibeui-buttongroup-010-accent);
transform:translateX(calc(var(--vibeui-buttongroup-010-index) * 100%));
transition:transform .22s cubic-bezier(.2,.7,.3,1);
}
[data-vibeui-block="buttongroup-010"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:1;
display:inline-flex;align-items:center;justify-content:center;
height:1.875rem;padding:0 0.25rem;
border:0;border-radius:var(--vibeui-buttongroup-010-radius);background:transparent;
color:var(--vibeui-buttongroup-010-muted);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:color .18s ease;
}
[data-vibeui-block="buttongroup-010"] button:hover{color:var(--vibeui-buttongroup-010-fg)}
[data-vibeui-block="buttongroup-010"] button[aria-pressed="true"]{color:var(--vibeui-buttongroup-010-on-accent)}
[data-vibeui-block="buttongroup-010"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-010-accent);outline-offset:2px;
}
[data-vibeui-block="buttongroup-010"] [data-part="caption"]{
margin:0;padding:0 0.1875rem;
color:var(--vibeui-buttongroup-010-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-010"] [data-part="caption"] b{
color:var(--vibeui-buttongroup-010-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PERIODS: Buttongroup010Period[] = [
  { label: "День", caption: "сегодня, с 00:00" },
  { label: "Неделя", caption: "последние 7 дней" },
  { label: "Месяц", caption: "последние 30 дней" },
  { label: "Год", caption: "последние 12 месяцев" },
]

/**
 * Выбор периода с переезжающей подложкой и строкой диапазона.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup010({
  periods = DEFAULT_PERIODS,
  defaultPeriod = "Неделя",
  label = "Период отчёта",
  onChange,
  accent,
  className,
  style,
  ...props
}: Buttongroup010Props) {
  const [current, setCurrent] = useState(defaultPeriod)
  const index = Math.max(
    0,
    periods.findIndex((period) => period.label === current),
  )

  const palette = {
    "--vibeui-buttongroup-010-count": periods.length,
    "--vibeui-buttongroup-010-index": index,
    ...(accent ? { "--vibeui-buttongroup-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-010"
        className={className}
        style={palette}
      >
        <div data-part="track" role="group" aria-label={label}>
          <span data-part="thumb" aria-hidden="true" />
          {periods.map((period) => (
            <button
              key={period.label}
              type="button"
              aria-pressed={period.label === current}
              onClick={() => {
                setCurrent(period.label)
                onChange?.(period.label)
              }}
            >
              {period.label}
            </button>
          ))}
        </div>
        <p data-part="caption" aria-live="polite">
          Показаны данные за <b>{periods[index]?.label.toLowerCase()}</b> —{" "}
          {periods[index]?.caption}
        </p>
      </div>
    </>
  )
}
