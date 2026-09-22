"use client"

import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

type Waitlist002Unit = {
  value: string
  label: string
}

export type Waitlist002Props = {
  eyebrow?: string
  title?: string
  summary?: string
  units?: Waitlist002Unit[]
  placeholder?: string
  ctaLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Экран «скоро запуск» с отсчётом до даты. Цифры отсчёта — статичные пропсы
// (дни/часы/минуты в плитках), без JS-тикания: реальное тиканье подключает
// приложение. Ниже — поле почты для листа ожидания. Формат первого экрана
// продукта до релиза с датой на плитках.
const STYLES = `[data-vibeui-block="waitlist-002"] [data-part="heading"]{margin-bottom:0.75rem}

:where([data-vibeui-block="waitlist-002"]){
--vibeui-waitlist-002-bg:transparent;
--vibeui-waitlist-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-waitlist-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-waitlist-002-border:light-dark(oklch(0.86 0 0),oklch(0.36 0 0));
--vibeui-waitlist-002-tile:light-dark(oklch(0.97 0 0),oklch(0.2 0 0));
--vibeui-waitlist-002-field:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-waitlist-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-waitlist-002-on-accent:oklch(from var(--vibeui-waitlist-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-waitlist-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-waitlist-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
--vibeui-waitlist-002-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="waitlist-002"]{color-scheme:dark}
[data-vibeui-block="waitlist-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-waitlist-002-bg);color:var(--vibeui-waitlist-002-ink);
font-family:var(--vibeui-waitlist-002-font);
}
[data-vibeui-block="waitlist-002"] [data-part="shell"]{max-width:38rem;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="waitlist-002"] [data-part="clock"]{display:flex;justify-content:center;gap:0.625rem;margin-bottom:2rem;list-style:none;padding:0}
[data-vibeui-block="waitlist-002"] [data-part="unit"]{
display:flex;flex-direction:column;gap:0.25rem;align-items:center;
min-width:4.25rem;padding:0.875rem 0.5rem;
border:1px solid var(--vibeui-waitlist-002-border);border-radius:0.875rem;
background:var(--vibeui-waitlist-002-tile);
}
[data-vibeui-block="waitlist-002"] [data-part="num"]{font-family:var(--vibeui-waitlist-002-mono);font-size:clamp(1.5rem,5cqi,2rem);font-weight:700;line-height:1;font-variant-numeric:tabular-nums;color:var(--vibeui-waitlist-002-accent)}
[data-vibeui-block="waitlist-002"] [data-part="unit-label"]{font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-waitlist-002-muted)}
[data-vibeui-block="waitlist-002"] [data-part="form"]{display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center}
/* Поле input-001 растягивается на остаток строки, кнопка — button-001. */
[data-vibeui-block="waitlist-002"] [data-part="form"] > [data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="waitlist-002"] [data-part="form"] > [data-vibeui-block="button-001"]{align-self:center}
@container (min-width: 36rem){[data-vibeui-block="waitlist-002"] [data-part="shell"]{padding:4.5rem 2rem}[data-vibeui-block="waitlist-002"] [data-part="form"]{flex-wrap:nowrap}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="waitlist-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_UNITS: Waitlist002Unit[] = [
  { value: "12", label: "дней" },
  { value: "08", label: "часов" },
  { value: "45", label: "минут" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Экран «скоро запуск» со статичным отсчётом на плитках и формой почты. */
export function Waitlist002({
  eyebrow = "Скоро запуск",
  title = "Мы почти готовы",
  summary = "Открываем доступ через пару недель. Оставьте почту — позовём в первой волне.",
  units = DEFAULT_UNITS,
  placeholder = "you@example.com",
  ctaLabel = "Записаться",
  background = "",
  accent,
  className,
  style,
}: Waitlist002Props) {
  const palette = {
    ...(accent ? { "--vibeui-waitlist-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-waitlist-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-waitlist-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="waitlist-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            align="center"
            accent={accent}
            lede={summary}
          />
          <ul data-part="clock">
            {units.map((unit) => (
              <li key={unit.label} data-part="unit">
                <span data-part="num">{unit.value}</span>
                <span data-part="unit-label">{unit.label}</span>
              </li>
            ))}
          </ul>
          <form data-part="form" onSubmit={(event) => event.preventDefault()}>
            <Input001
              type="email"
              name="email"
              required
              label={placeholder}
              autoComplete="email"
              accent={accent}
            />
            <Button001 type="submit" size="lg" accent={accent}>
              {ctaLabel}
            </Button001>
          </form>
        </div>
      </section>
    </>
  )
}
