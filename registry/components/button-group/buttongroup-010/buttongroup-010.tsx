"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup010Period = {
  label: string
  caption: string
}

export type Buttongroup010Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  periods?: Buttongroup010Period[]
  defaultPeriod?: string
  label?: string
  onChange?: (period: string) => void
  /** Строка диапазона: {period} и {range} подставляются из выбранного периода. */
  captionText?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор периода отчёта, который сразу отвечает, какой
// диапазон получился. Подложка выбранного — один элемент, он переезжает
// по transform на индекс сегмента, а не появляется заново у каждой кнопки:
// так глаз видит перемещение, а не мигание. Колонки трека равной ширины,
// иначе смещение на «индекс × 100%» перестало бы попадать в сегмент.
// Строка диапазона объявляется через aria-live: смена вида без слов не
// сообщает незрячему, что данные под группой уже другие.
// Трек — toolbar с roving tabindex: период выбирают стрелками, а Tab
// проходит группу целиком, как один элемент управления.
const STYLES = `
:where([data-vibeui-block="buttongroup-010"]){
--vibeui-buttongroup-010-surface:transparent;
--vibeui-buttongroup-010-track:light-dark(oklch(0.965 0 265),oklch(0.29 0 265));
--vibeui-buttongroup-010-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-010-muted:color-mix(in oklab,var(--vibeui-buttongroup-010-fg) 68%,transparent);
--vibeui-buttongroup-010-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-010-accent:light-dark(oklch(0.282 0 0),oklch(0.881 0 0));
--vibeui-buttongroup-010-on-accent:oklch(from var(--vibeui-buttongroup-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-buttongroup-010-radius:0.5rem;
--vibeui-buttongroup-010-count:4;
--vibeui-buttongroup-010-index:0;
--vibeui-buttongroup-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-010"]{color-scheme:dark}
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
transition:transform .22s cubic-bezier(.2,.7,.3,1);color:oklch(from var(--vibeui-buttongroup-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Выбор периода с переезжающей подложкой и строкой диапазона.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup010({
  periods = DEFAULT_PERIODS,
  defaultPeriod = "Неделя",
  label = "Период отчёта",
  onChange,
  captionText = "Показаны данные за {period} — {range}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup010Props) {
  const [current, setCurrent] = useState(defaultPeriod)
  const track = useRef<HTMLDivElement>(null)
  const index = Math.max(
    0,
    periods.findIndex((period) => period.label === current),
  )

  const select = (label: string, position: number) => {
    setCurrent(label)
    onChange?.(label)
    track.current?.querySelectorAll("button")[position]?.focus()
  }

  const palette = {
    "--vibeui-buttongroup-010-count": periods.length,
    "--vibeui-buttongroup-010-index": index,
    ...(accent ? { "--vibeui-buttongroup-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-010"
        className={className}
        style={palette}
      >
        <div
          data-part="track"
          ref={track}
          role="toolbar"
          aria-label={label}
          onKeyDown={(event) => {
            const step =
              event.key === "ArrowRight" || event.key === "ArrowDown"
                ? 1
                : event.key === "ArrowLeft" || event.key === "ArrowUp"
                  ? -1
                  : 0

            if (step === 0) {
              return
            }

            event.preventDefault()
            const next = (index + step + periods.length) % periods.length
            select(periods[next].label, next)
          }}
        >
          <span data-part="thumb" aria-hidden="true" />
          {periods.map((period, position) => (
            <button
              key={period.label}
              type="button"
              aria-pressed={period.label === current}
              tabIndex={position === index ? 0 : -1}
              onClick={() => select(period.label, position)}
            >
              {period.label}
            </button>
          ))}
        </div>
        <p data-part="caption" aria-live="polite">
          {captionText.split(/(\{period\}|\{range\})/).map((part, position) => {
            if (part === "{period}") {
              return <b key={position}>{periods[index]?.label.toLowerCase()}</b>
            }

            return part === "{range}" ? periods[index]?.caption : part
          })}
        </p>
      </div>
    </>
  )
}
